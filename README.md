# Security Research Blog

A minimalist, high-performance blog built with Hugo for showcasing security research, vulnerability discoveries, and thought leadership.

## Features

- **Minimalist Design**: Clean, text-focused layout with professional appearance
- **Blog Posts**: Reverse-chronological listing with reading time and tags
- **CVE Pages**: Dedicated pages for vulnerability disclosures with NVD embeds
- **Talks & Publications**: Showcase presentations and media features
- **Syntax Highlighting**: Code blocks with copy-to-clipboard functionality
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Performance Optimized**: Static site with excellent loading speeds

## Project Structure

```
blog/
├── content/
│   ├── posts/              # Blog posts
│   ├── cves/               # CVE pages
│   ├── talks/              # Conference talks
│   ├── publications/       # Media publications
│   └── talks-publications.md
├── themes/minimal-security/
│   ├── layouts/            # Hugo templates
│   ├── static/
│   │   ├── css/style.css   # Main stylesheet
│   │   └── js/main.js      # JavaScript functionality
│   └── ...
├── hugo.toml               # Site configuration
└── README.md
```

## Getting Started

### Prerequisites

- [Hugo](https://gohugo.io/installation/) (Extended version recommended)
- Git

### Local Development

1. Clone and navigate to the project:
   ```bash
   cd /path/to/blog
   ```

2. Start the development server:
   ```bash
   hugo server --buildDrafts
   ```

3. Open your browser to `http://localhost:1313`

### Configuration

Edit `hugo.toml` to customize:

```toml
baseURL = 'https://yourdomain.com'
title = 'Your Security Research Blog'

[params]
  author = "Your Name"
  description = "Your description"
  linkedin = "https://linkedin.com/in/yourprofile"
  twitter = "https://twitter.com/yourhandle"
```

## Content Management

### Creating Blog Posts

```bash
hugo new posts/your-post-title.md
```

Front matter example:
```yaml
---
title: "Your Post Title"
date: 2024-01-20T10:00:00Z
summary: "Brief description of the post"
tags: ["security", "vulnerability"]
categories: ["Cloud Security"]
---
```

### Creating CVE Pages

```bash
hugo new cves/cve-2024-xxxx.md
```

Front matter example:
```yaml
---
title: "Vulnerability Title"
date: 2024-01-20T10:00:00Z
cve_id: "CVE-2024-XXXX"
severity: "Critical"
summary: "Brief vulnerability description"
nvd_embed_url: "https://nvd.nist.gov/vuln/detail/CVE-2024-XXXX"
tags: ["kubernetes", "authentication"]
---
```

### Creating Talks

```bash
hugo new talks/talk-title.md
```

Front matter example:
```yaml
---
title: "Talk Title"
date: 2024-01-20T10:00:00Z
type: "talk"
youtube_id: "YOUR_YOUTUBE_ID"
venue: "Conference Name"
---
```

### Creating Publications

```bash
hugo new publications/publication-title.md
```

Front matter example:
```yaml
---
title: "Publication Title"
date: 2024-01-20T10:00:00Z
type: "publication"
external_url: "https://example.com/article"
summary: "Quote or description"
---
```

## Features and Functionality

### Code Syntax Highlighting

The blog supports syntax highlighting for multiple languages with copy-to-clipboard functionality:

```python
def example_function():
    return "This code block has syntax highlighting"
```

### Responsive Design

The layout automatically adapts to different screen sizes:
- Desktop: Full layout with sidebar navigation
- Tablet: Condensed navigation, readable content
- Mobile: Stacked layout, touch-friendly navigation

### Performance Optimizations

- Static site generation for fast loading
- Optimized CSS and JavaScript
- Lazy loading for images
- CDN-ready structure

## Deployment

### Build for Production

```bash
hugo --minify
```

This generates static files in the `public/` directory.

### Deployment Options

- **Netlify**: Connect your Git repository for automatic deployments
- **Vercel**: Deploy with zero configuration
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3 + CloudFront**: Traditional static hosting
- **Any web server**: Upload `public/` directory contents

### Example GitHub Actions Deployment

```yaml
name: Deploy Hugo Site

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
      with:
        submodules: true
        fetch-depth: 0
    
    - name: Setup Hugo
      uses: peaceiris/actions-hugo@v2
      with:
        hugo-version: 'latest'
        extended: true
    
    - name: Build
      run: hugo --minify
    
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./public
```

## Customization

### Styling

Edit `themes/minimal-security/static/css/style.css` to customize:
- Colors and typography
- Layout and spacing
- Component styling

### Layout

Modify templates in `themes/minimal-security/layouts/` to change:
- Page structure
- Content organization
- Navigation elements

### JavaScript

Extend functionality in `themes/minimal-security/static/js/main.js`:
- Interactive features
- Analytics integration
- Custom behaviors

## Security Features

- No external dependencies for core functionality
- CSP-friendly design
- Minimal attack surface
- Safe HTML rendering

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `hugo server`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues:
- Check the [Hugo documentation](https://gohugo.io/documentation/)
- Review the theme layouts and configuration
- Open an issue in the repository

---

Built with ❤️ using [Hugo](https://gohugo.io/) and custom security-focused design. 