/**
 * Navigation Updater Script
 * Adds consistent navigation to all HTML pages
 */

const fs = require('fs');
const path = require('path');

// Define the enhanced navigation HTML
const enhancedNav = `
    <nav class="navbar">
        <div class="nav-container">
            <a href="index.html" class="logo">
                <div class="logo-icon">◈</div>
                <span class="logo-text">Simply Complex Solutions</span>
            </a>
            <button class="mobile-menu-toggle" onclick="toggleMobileMenu()" aria-label="Toggle menu">
                <span></span><span></span><span></span>
            </button>
            <div class="nav-links" id="navLinks">
                <a href="index.html">Home</a>
                <a href="solutions.html">Solutions</a>
                <a href="pricing.html">Pricing</a>
                <a href="n8n-store.html">Templates</a>
                <a href="integrations.html">Integrations</a>
                <a href="client-dashboard.html">Analytics</a>
                <a href="roi-calculator.html">ROI Calculator</a>
                <a href="resources.html">Resources</a>
                <a href="status.html">Status</a>
                <a href="compare.html">Compare</a>
                <a href="contact.html" class="nav-btn">Contact</a>
            </div>
        </div>
    </nav>

    <style>
        .mobile-menu-toggle { display: none; background: none; border: none; cursor: pointer; padding: 0.5rem; flex-direction: column; gap: 5px; }
        .mobile-menu-toggle span { display: block; width: 24px; height: 2px; background: #fff; transition: all 0.3s; }
        @media (max-width: 900px) {
            .mobile-menu-toggle { display: flex; }
            .nav-links { position: fixed; top: 60px; left: 0; right: 0; background: rgba(10,10,15,0.98); padding: 1rem; flex-direction: column; gap: 0.5rem; display: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
            .nav-links.open { display: flex; }
            .nav-links a { padding: 0.75rem 1rem; border-radius: 8px; }
            .nav-links a:hover { background: rgba(255,255,255,0.05); }
        }
    </style>

    <script>
        function toggleMobileMenu() {
            document.getElementById('navLinks').classList.toggle('open');
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const navLinks = document.getElementById('navLinks');
            const menuButton = document.querySelector('.mobile-menu-toggle');
            
            if (navLinks.classList.contains('open') && 
                !navLinks.contains(event.target) && 
                !menuButton.contains(event.target)) {
                navLinks.classList.remove('open');
            }
        });
    <\/script>
`;

// Define the footer with enhanced navigation
const enhancedFooter = `
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="index.html" class="logo">
                        <div class="logo-icon">◈</div>
                        <span class="logo-text">Simply Complex Solutions</span>
                    </a>
                    <p>Enterprise AI automation bundles that actually work.</p>
                    <div class="social-links">
                        <a href="https://twitter.com/simplycomplex" target="_blank" rel="noopener" title="Twitter">𝕏</a>
                        <a href="https://linkedin.com/company/simplycomplex" target="_blank" rel="noopener" title="LinkedIn">in</a>
                        <a href="https://github.com/simplycomplex" target="_blank" rel="noopener" title="GitHub">⌘</a>
                    </div>
                </div>
                <div class="footer-links">
                    <h4>Solutions</h4>
                    <a href="solution-sales.html">Sales Excellence</a>
                    <a href="solution-support.html">Support Automation</a>
                    <a href="solution-hiring.html">Hiring System</a>
                    <a href="n8n-store.html">All Templates</a>
                </div>
                <div class="footer-links">
                    <h4>Tools</h4>
                    <a href="roi-calculator.html">ROI Calculator</a>
                    <a href="client-dashboard.html">Analytics Dashboard</a>
                    <a href="status.html">System Status</a>
                    <a href="compare.html">Feature Comparison</a>
                </div>
                <div class="footer-links">
                    <h4>Resources</h4>
                    <a href="resources.html">Free Downloads</a>
                    <a href="getting-started.html">Getting Started</a>
                    <a href="changelog.html">Changelog</a>
                    <a href="blog.html">Blog</a>
                </div>
                <div class="footer-links">
                    <h4>Company</h4>
                    <a href="about.html">About</a>
                    <a href="contact.html">Contact</a>
                    <a href="careers.html">Careers</a>
                    <a href="pricing.html">Pricing</a>
                </div>
            </div>
            
            <!-- Newsletter Signup -->
            <div class="footer-newsletter">
                <h4>Stay Updated</h4>
                <p>Get automation tips and product updates.</p>
                <form class="newsletter-form" id="newsletter-form">
                    <input type="email" placeholder="Enter your email" required>
                    <button type="submit" class="btn btn-primary">Subscribe</button>
                </form>
            </div>
            
            <div class="footer-bottom">
                <p>© 2026 Simply Complex Solutions. All rights reserved.</p>
                <div class="footer-legal">
                    <a href="privacy.html">Privacy</a>
                    <a href="terms.html">Terms</a>
                    <a href="cookies.html">Cookies</a>
                </div>
            </div>
        </div>
    </footer>
`;

// Function to update a single HTML file
function updateHTMLFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Skip if it's a 404 page (keep it minimal)
        if (filePath.includes('404.html')) {
            return false;
        }
        
        // Replace the existing navbar section
        const navbarRegex = /<nav class="navbar">[\s\S]*?<\/nav>/;
        if (navbarRegex.test(content)) {
            content = content.replace(navbarRegex, enhancedNav);
        } else {
            // If no navbar found, insert after body tag
            content = content.replace(/<body[^>]*>/, '$&' + enhancedNav);
        }

        // Remove duplicate mobile-menu toggle styles/scripts (keep only the first occurrence)
        const mobileToggleStyleRegex = /<style>[\s\S]*?\.mobile-menu-toggle[\s\S]*?<\/style>/g;
        const mobileToggleScriptRegex = /<script>[\s\S]*?function toggleMobileMenu\(\)[\s\S]*?<\/script>/g;

        const styleMatches = content.match(mobileToggleStyleRegex) || [];
        if (styleMatches.length > 1) {
            styleMatches.slice(1).forEach(m => { content = content.replace(m, ''); });
        }

        const scriptMatches = content.match(mobileToggleScriptRegex) || [];
        if (scriptMatches.length > 1) {
            scriptMatches.slice(1).forEach(m => { content = content.replace(m, ''); });
        }
        
        // Replace the footer section
        const footerRegex = /<footer class="footer">[\s\S]*?<\/footer>/;
        if (footerRegex.test(content)) {
            content = content.replace(footerRegex, enhancedFooter);
        } else {
            // If no footer found, insert before closing body tag
            content = content.replace('</body>', enhancedFooter + '</body>');
        }
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Updated: ${path.basename(filePath)}`);
        return true;
    } catch (error) {
        console.error(`✗ Error updating ${filePath}:`, error.message);
        return false;
    }
}

// Get all HTML files in the directory
const htmlFiles = fs.readdirSync('.')
    .filter(file => file.endsWith('.html'))
    .map(file => path.join('.', file));

console.log(`Found ${htmlFiles.length} HTML files to update...\n`);

let updatedCount = 0;
for (const file of htmlFiles) {
    if (updateHTMLFile(file)) {
        updatedCount++;
    }
}

console.log(`\n✅ Successfully updated ${updatedCount} out of ${htmlFiles.length} files.`);
console.log('Navigation consistency has been improved across all pages!');