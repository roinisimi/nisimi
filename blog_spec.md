# Personal Blog Specification

## 1. Overview

This document outlines the requirements for a personal blog for a security researcher. The blog will serve as a professional platform to showcase research, discoveries, and thought leadership. The primary goal is to create a minimalist, text-focused, and highly performant website that reflects senior expertise and authority in the security field.

**Core Principles:**
- **Minimalism:** The design should be clean and uncluttered, putting the content first.
- **Authority:** The blog must look professional and credible.
- **Performance:** As a static site, it should be extremely fast and secure.

---

## 2. Core Technology

- **Static Site Generator:** [**Hugo**](https://gohugo.io/)
- **Hosting:** Any static site hosting provider (e.g., Netlify, Vercel, GitHub Pages).

---

## 3. Design & Layout

- **Overall Aesthetic:** Minimalist and text-focused. Generous white space, elegant typography, and a simple, professional color palette (e.g., black, white, and a single accent color).
- **Header:** A simple, persistent header will be present on all pages. It must contain:
    - Navigation links: "Home", "Talks & Publications", "CVEs".
    - Social media icons linking to the user's LinkedIn and Twitter profiles.
- **Footer:** A clean, minimal footer with a copyright notice (e.g., "© 2024 [Your Name]").
- **Typography:** Choose a clean, highly readable font combination. One for headings and one for body text.
- **Responsiveness:** The layout must be fully responsive and optimized for desktop, tablet, and mobile devices.

---

## 4. Functional Requirements

### 4.1. Homepage
- **URL:** `/`
- **Content:** A reverse-chronological list of all blog posts.
- **Post Display:** Each item in the list must display:
    - Article Title (as a clickable link)
    - Publication Date
    - A one-sentence summary/description of the article.

### 4.2. Blog Post Pages
- **URL:** `/posts/{post-slug}/`
- **Content:**
    - At the top of the article, display:
        - Title
        - Publication Date
        - Estimated Reading Time
        - A list of categories/tags associated with the post.
    - The main body of the article, rendered from Markdown.
    - **Code Blocks:** All code snippets must have:
        - Syntax highlighting.
        - A "Copy" button to easily copy the code to the clipboard.
- **No comment section.**

### 4.3. Talks & Publications Page
- **URL:** `/talks-publications/`
- **Content:** A curated list of talks and media features.
    - **Talks:**
        - Title of the talk.
        - Embedded YouTube video player directly on the page.
    - **Publications:**
        - Title of the publication/article.
        - A brief, compelling quote or summary.
        - A clear, clickable link to the original article on the external media site.

### 4.4. CVEs Page
- **URL:** `/cves/`
- **Content:** A list of all CVEs the user has discovered.
- **Display:** Each item in the list should clearly display the CVE identifier (e.g., "CVE-2024-12345") and its title, acting as a link to the dedicated CVE page.

### 4.5. Individual CVE Page
- **URL:** `/cves/{cve-id}/`
- **Content:** This page provides comprehensive details about a specific vulnerability.
    - **NVD Content:** The page must begin with embedded content from an official source like the NVD (e.g., `nvd.nist.gov`) that displays the formal CVE details.
    - **Blog Post:** Following the embedded NVD data, the user's own in-depth blog post and analysis of the CVE will be displayed. This content will be rendered from Markdown and support all standard features of a blog post (code blocks, etc.).

### 4.6. Excluded Features
- No site-wide search functionality.
- No "About Me" page.
- No user comments.

---

## 5. Content Management (Data Handling)

All content will be managed through Markdown files within the Hugo project structure.

- **Blog Posts:** Located in `content/posts/`.
  - **Front Matter:** `title`, `date`, `summary`, `tags`, `categories`.
- **Talks & Publications:** Located in `content/talks-publications/`.
  - **Front Matter:** `title`, `type` (e.g., "talk" or "publication"), `youtube_id` (for talks), `summary` (for publications), `external_url` (for publications).
- **CVEs:** Located in `content/cves/`.
  - **Front Matter:** `title`, `cve_id`, `nvd_embed_url`.
  - The main content of the Markdown file will be the personal blog post about the CVE.

---

## 6. Error Handling

- **404 Page:** A custom `404 Not Found` page should be created that matches the minimalist design of the site. It should guide users back to the homepage.
- **Broken Embeds:** The site should fail gracefully. If a YouTube or NVD embed fails to load, it should not break the entire page layout. A simple placeholder or message could be shown.
- **Build Errors:** The build process should fail if Markdown or front matter is malformed, preventing a broken site from being deployed.

---

## 7. Testing Plan

### 7.1. Manual Testing
- **Content Verification:**
    - Review rendered HTML for all content types to ensure Markdown is parsed correctly.
    - Check that all front matter fields (date, title, tags) are displayed properly.
- **Layout & Responsiveness Testing:**
    - Verify the site displays correctly on major browsers (Chrome, Firefox, Safari).
    - Test the layout on various screen sizes: desktop (HD and standard), tablet (portrait and landscape), and mobile.
- **Functionality Testing:**
    - Click every navigation and social media link to ensure it points to the correct destination.
    - Test the "Copy" button on code blocks.
    - Verify all YouTube and NVD embeds load and function as expected.
    - Check all external links in the "Publications" section.

### 7.2. Automated Testing
- **Performance Audit:** Run a Google Lighthouse report to ensure high scores for Performance, Accessibility, and SEO. The target performance score should be 95+.
- **Link Checking:** Use a link-checking tool during the build process to identify any broken internal or external links. 