// Main JavaScript for the security blog

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Prism.js configuration
    if (typeof Prism !== 'undefined') {
        // Configure Prism.js plugins
        Prism.plugins.toolbar.registerButton('copy-to-clipboard', {
            text: 'Copy',
            onClick: function(env) {
                // This is handled by the copy-to-clipboard plugin
            }
        });
        
        // Add line numbers to all code blocks
        Prism.plugins.lineNumbers.selector = 'pre[class*="language-"]';
        
        // Re-highlight code blocks on page load
        Prism.highlightAll();
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading state for embedded content
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        iframe.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        iframe.addEventListener('error', function() {
            const fallback = this.parentNode.querySelector('.nvd-fallback, .video-fallback');
            if (fallback) {
                fallback.style.display = 'block';
            }
        });
    });
    
    // Add reading progress indicator for long posts
    const post = document.querySelector('.post-content');
    if (post) {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background-color: #2563eb;
            z-index: 1000;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const progress = (scrolled / maxScroll) * 100;
            progressBar.style.width = Math.min(progress, 100) + '%';
        });
    }
    
    // Add copy functionality for code blocks without Prism
    document.querySelectorAll('pre code').forEach(codeBlock => {
        if (!codeBlock.closest('.language-')) {
            const button = document.createElement('button');
            button.className = 'copy-button';
            button.textContent = 'Copy';
            button.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                padding: 4px 8px;
                background: #374151;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s ease;
            `;
            
            const pre = codeBlock.parentNode;
            pre.style.position = 'relative';
            pre.appendChild(button);
            
            button.addEventListener('click', function() {
                navigator.clipboard.writeText(codeBlock.textContent).then(function() {
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = 'Copy';
                    }, 2000);
                });
            });
            
            button.addEventListener('mouseenter', function() {
                this.style.opacity = '1';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.opacity = '0.7';
            });
        }
    });
    
    // Add search functionality (simple client-side search)
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const posts = document.querySelectorAll('.post-item, .cve-item');
            
            posts.forEach(post => {
                const title = post.querySelector('h2, h3').textContent.toLowerCase();
                const summary = post.querySelector('.post-summary, .cve-summary');
                const summaryText = summary ? summary.textContent.toLowerCase() : '';
                
                if (title.includes(query) || summaryText.includes(query)) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    }
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Add theme toggle functionality (if needed in the future)
    const themeToggle = document.querySelector('#theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
});

// Error handling for embedded content
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IFRAME') {
        const fallback = e.target.parentNode.querySelector('.nvd-fallback, .video-fallback');
        if (fallback) {
            fallback.style.display = 'block';
            e.target.style.display = 'none';
        }
    }
});

// Performance optimization: Preload important resources
document.addEventListener('DOMContentLoaded', function() {
    // Preload critical CSS
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap'
    ];
    
    criticalResources.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}); 