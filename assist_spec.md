# Security Research Blog Specification

## Overview
This document outlines the structure and components of the security research blog built using Hugo. It serves as a guide for future developers to understand where and how to make changes.

## Core Components

### 1. JavaScript Functionality (themes/minimal-security/static/js/main.js)
- Code block copy buttons
- Smooth scrolling implementation
- Loading states for embedded content
- Hover effects for post items
- Reading progress indicator
- Search functionality
- Image lazy loading
- Theme toggle capability

### 2. Content Structure
```
content/
├── cves/               # Security vulnerability write-ups
├── posts/              # Main blog posts
├── publications/       # External publications
├── talks/             # Conference presentations
└── talks-publications.md  # Combined view
```

### 3. Theme Structure (themes/minimal-security/)
```
themes/minimal-security/
├── layouts/
│   ├── _default/      # Base templates
│   ├── _partials/     # Reusable components
│   ├── cves/          # CVE-specific layouts
│   ├── posts/         # Blog post layouts
│   └── talks-publications/  # Talks & publications layouts
├── static/
│   ├── css/           # Stylesheets
│   └── js/            # JavaScript files
└── assets/            # Source files for processing
```

### 4. Layout Components

#### Base Templates (layouts/_default/)
- `baseof.html`: Main template wrapper
- `single.html`: Individual post template
- `list.html`: List/archive pages

#### Partial Components (layouts/_partials/)
- `header.html`: Navigation and site header
- `footer.html`: Site footer
- `head/`: Meta tags and resource loading
  - `css.html`: Stylesheet includes
  - `js.html`: JavaScript includes

## Recent Changes

### CSS Updates (themes/minimal-security/static/css/style.css)
- Adjusted heading sizes for better hierarchy:
  - h1: 1.8rem (was 2.5rem)
  - h2: 1.5rem (was 2rem)
  - h3: 1.25rem (was 1.5rem)

- Added content section styling:
  - `.content-sections`: Main container with max-width 800px
  - `.content-section`: Individual section styling
  - `.post-item`: Flex layout for post listings
  - `.post-date`: Monospace date styling
  - `.post-link`: Link styling with hover effects
  - `.more-link`: "More" link styling

### Layout Structure
- Content is centered using container classes
- Main content sections use consistent spacing
- Responsive design considerations maintained

## Making Changes

### Adding New Content
1. Place new content in appropriate directory under `content/`
2. Follow existing front matter structure
3. Use appropriate layout templates

### Modifying Layouts
1. Edit templates in `themes/minimal-security/layouts/`
2. Partial templates can be found in `_partials/`
3. Base templates are in `_default/`

### Styling Changes
1. Main styles are in `themes/minimal-security/static/css/style.css`
2. Component-specific styles are grouped by section
3. Follow existing CSS naming conventions

### JavaScript Modifications
1. Core functionality in `themes/minimal-security/static/js/main.js`
2. Add new functions following existing patterns
3. Maintain modular structure

## Development Guidelines
1. Maintain consistent spacing and container structure
2. Follow established naming conventions
3. Keep responsive design in mind
4. Test across different screen sizes
5. Ensure accessibility standards are met

## Future Considerations
1. Potential for dark mode implementation
2. Enhanced search functionality
3. Additional content type support
4. Performance optimizations
5. RSS feed implementation 