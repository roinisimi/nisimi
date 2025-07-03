---
title: "Kubernetes CRD Abstraction Risks in kro"
date: 2025-05-13T00:00:00Z
author: "Roi Nisimi"
summary: "A deep dive into confused deputy vulnerabilities in Kubernetes CRD controllers, discovered in the experimental kro project."
tags: ["kubernetes", "security", "research", "crd", "controllers"]
cve_reference: "CVE-2025-48710"
---

## Executive Summary

During a recent security audit of kro (Kube Resource Orchestrator), we discovered a significant vulnerability that could allow attackers to introduce malicious CustomResourceDefinitions (CRDs). This vulnerability, now tracked as CVE-2025-48710, demonstrates how seemingly innocuous permissions can lead to severe security implications in Kubernetes environments.

## What is kro?

Kube Resource Orchestrator (kro, pronounced "crow") is an alpha experimental open-source project maintained by AWS, Google Cloud, and Azure. It introduces an innovative way to manage Kubernetes resources through dynamic construction of Custom Resources. The project aims to provide a native alternative to tools like Helm for managing application stacks.

At its core, kro uses a resource called ResourceGraphDefinition (RGD) which serves as an abstraction layer for other Kubernetes APIs. As the documentation states: "ResourceGraphDefinitions are the fundamental building blocks in kro. They provide a way to define, organize, and manage sets of related Kubernetes resources as a single, reusable unit."

## Understanding the Vulnerability

The vulnerability stems from two key issues in kro's architecture:

1. **Insufficient CRD Validation**: kro doesn't actively monitor CRD modifications, with reconciliation only happening every 10 hours by default.
2. **Controller Lifecycle Issues**: A bug in the dynamic informer system causes watch error crash loops when RGDs are deleted.

Let's look at a practical example. Consider this legitimate RGD that defines a simple nginx deployment:

```yaml
apiVersion: kro.run/v1alpha1
kind: ResourceGraphDefinition
metadata:
  name: my-nginx-app-rgd
spec:
  schema:
    apiVersion: v1alpha1
    kind: MyNginxApp
    spec:
      name: string | default="my-nginx-app"
      image: string | default="nginx"

  resources:
    - id: deployment
      template:
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: ${schema.spec.name}
        spec:
          replicas: 3
          selector:
            matchLabels:
              app: ${schema.spec.name}
          template:
            metadata:
              labels:
                app: ${schema.spec.name}
            spec:
              containers:
                - name: ${schema.spec.name}
                  image: ${schema.spec.image}
```

An attacker with CRD permissions could modify this definition or introduce new ones, effectively confusing kro's controller into deploying malicious workloads.

## The Confused Deputy Scenario

This vulnerability is a classic example of a "confused deputy" scenario - where an entity with higher privileges (kro's controller) can be tricked into performing actions on behalf of a less privileged attacker.

The attack flow typically looks like this:

1. Attacker gains permissions to modify CRDs (a seemingly low-risk permission)
2. They modify existing CRDs or introduce new ones
3. kro's controller, running with elevated privileges, processes these modifications
4. The controller deploys the attacker's malicious resources

In our proof of concept, we demonstrated how this could be used to deploy a container with a reverse shell, achieving remote code execution within the cluster.

## Broader Security Implications

This vulnerability highlights several important lessons for Kubernetes security:

1. **Permission Granularity**: Cluster-wide permissions, even for seemingly innocuous resources like CRDs, can have significant security implications.
2. **Controller Design**: Dynamic controllers need robust lifecycle management and error handling.
3. **Resource Validation**: Continuous validation of critical resources is essential, especially in dynamic environments.

## Mitigation and Best Practices

For organizations using kro or similar tools, we recommend:

1. **Strict RBAC Policies**: Carefully restrict who can modify CRDs and other cluster-wide resources
2. **Regular Auditing**: Monitor for unexpected changes to CRDs and controller behaviors
3. **Defense in Depth**: Implement multiple layers of validation and monitoring

Example of a restrictive RBAC policy:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: restricted-kro-access
rules:
- apiGroups: ["apiextensions.k8s.io"]
  resources: ["customresourcedefinitions"]
  verbs: ["get", "list", "watch"]
  resourceNames: ["resourcegraphdefinitions.kro.run"]
```

## Responsible Disclosure

We worked closely with kro's maintainers to address these issues. The vulnerability has been patched in the latest release, which includes:

- Active monitoring of CRD modifications
- Fixed informer crash loop issues
- Improved controller lifecycle management

## Conclusion

While kro is an experimental project not intended for production use, this vulnerability serves as a valuable lesson for the broader Kubernetes ecosystem. It reminds us that security must be considered at all levels of abstraction, and that seemingly simple permissions can have far-reaching security implications.

For a detailed technical analysis of this vulnerability, you can refer to the [CVE-2025-48710](/cves/cve-2025-48710) entry. 