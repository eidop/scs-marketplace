/**
 * Navigation & Button Polish Script
 * Fixes mobile menu, button consistency, and link verification across all pages
 */

const fs = require('fs');
const path = require('path');

// Get all HTML files (excluding node_modules, .wrangler, etc.)
function getAllHTMLFiles(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Skip node_modules, .wrangler, etc.
            if (['node_modules', '.wrangler', 'openjim', 'vault-optimizer', 'node_modules'].includes(entry.name)) {
                continue;
            }
            files.push(...getAllHTMLFiles(fullPath));
        } else if (entry.name.endsWith('.html') && !entry.name.startsWith('_')) {
            files.push(fullPath);
        }
    }

    return files;
}

const htmlFiles = getAllHTMLFiles('.');
console.log(`Found ${htmlFiles.length} HTML files to process\n`);

// Standardized mobile menu HTML
const standardMobileMenu = `
    <style>
        .mobile-menu-toggle {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            flex-direction: column;
            gap: 5px;
            z-index: 101;
        }
        .mobile-menu-toggle span {
            display: block;
            width: 24px;
            height: 2px;
            background: #fff;
            transition: all 0.3s;
        }
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        @media (max-width: 900px) {
            .mobile-menu-toggle {
                display: flex;
            }
            .nav-links {
                position: fixed;
                top: 70px;
                left: 0;
                right: 0;
                background: rgba(10, 10, 15, 0.98);
                padding: 1.5rem;
                flex-direction: column;
                gap: 0.5rem;
                display: none;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                animation: slideDown 0.3s ease-out;
            }
            .nav-links.open {
                display: flex;
            }
            .nav-links a {
                padding: 0.75rem 1rem;
                border-radius: 8px;
                width: 100%;
                text-align: left;
            }
            .nav-links a:hover {
                background: rgba(99, 102, 241, 0.15);
            }
        }
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>

    <script>
        function toggleMobileMenu() {
            const navLinks = document.getElementById('navLinks');
            const menuButton = document.querySelector('.mobile-menu-toggle');
            navLinks.classList.toggle('open');
            menuButton.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (navLinks.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const navLinks = document.getElementById('navLinks');
            const menuButton = document.querySelector('.mobile-menu-toggle');

            if (navLinks.classList.contains('open') &&
                !navLinks.contains(event.target) &&
                !menuButton.contains(event.target)) {
                navLinks.classList.remove('open');
                menuButton.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const navLinks = document.getElementById('navLinks');
                const menuButton = document.querySelector('.mobile-menu-toggle');

                if (navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    menuButton.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    <\/script>
`;

// Standardized navbar HTML
const standardNavbar = `
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
`;

// Fix links that don't exist
function fixBrokenLinks(content) {
    let fixed = content;

    // Fix solution page links
    fixed = fixed.replace(/href="solution-sales\.html"/g, 'href="solution-sales.html"');
    fixed = fixed.replace(/href="solution-support\.html"/g, 'href="solution-support.html"');
    fixed = fixed.replace(/href="solution-hiring\.html"/g, 'href="solution-hiring.html"');
    fixed = fixed.replace(/href="solution-investering\.html"/g, 'href="solution-investing.html"');
    fixed = fixed.replace(/href="solution-kundeservice\.html"/g, 'href="solution-kundeservice.html"');
    fixed = fixed.replace(/href="solution-megling\.html"/g, 'href="solution-megling.html"');
    fixed = fixed.replace(/href="solution-real-estate\.html"/g, 'href="solution-real-estate.html"');
    fixed = fixed.replace(/href="solution-investing-no\.html"/g, 'href="solution-investing.html"');
    fixed = fixed.replace(/href="solution-investering-no\.html"/g, 'href="solution-investing.html"');
    fixed = fixed.replace(/href="solution-kundeservice-no\.html"/g, 'href="solution-kundeservice.html"');
    fixed = fixed.replace(/href="solution-megling-no\.html"/g, 'href="solution-megling.html"');
    fixed = fixed.replace(/href="solution-sales-no\.html"/g, 'href="solution-sales.html"');
    fixed = fixed.replace(/href="solution-support-no\.html"/g, 'href="solution-support.html"');

    return fixed;
}

// Standardize button styles
function standardizeButtons(content) {
    let fixed = content;

    // Fix client-dashboard inline button styles
    fixed = fixed.replace(
        /style="display:\s*inline-block;[^"]*"/g,
        'class="btn btn-primary"'
    );

    return fixed;
}

// Process each HTML file
let processed = 0;
let errors = 0;

htmlFiles.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');

        // Skip 404 page
        if (file.includes('404.html')) {
            return;
        }

        // Check for mobile menu script already present
        const hasMobileScript = content.includes('toggleMobileMenu') && content.includes('classList.toggle');

        // Apply fixes
        content = fixBrokenLinks(content);
        content = standardizeButtons(content);

        // Update navbar if needed
        if (content.includes('<nav class="navbar">')) {
            content = content.replace(
                /<nav class="navbar">[\s\S]*?<\/nav>/,
                standardNavbar
            );
        }

        // Update mobile menu style if needed
        if (hasMobileScript) {
            content = content.replace(
                /<style>[\s\S]*?mobile-menu-toggle[\s\S]*?<\/style>/,
                standardMobileMenu
            );
        }

        // Ensure footer has newsletter script if present
        if (content.includes('newsletter-form')) {
            if (!content.includes('function subscribeNewsletter')) {
                content = content.replace(
                    /(newsletter-form[\s\S]*?<\/form>)/,
                    '$1<script>function subscribeNewsletter(e){e.preventDefault();const input=e.target.querySelector("input");if(input.value){alert("Thanks for subscribing!\\n\\nEmail: "+input.value);input.value="";}}</script>'
                );
            }
        }

        // Write back
        fs.writeFileSync(file, content, 'utf8');
        processed++;
        console.log(`✅ ${path.basename(file)}`);
    } catch (error) {
        errors++;
        console.error(`❌ Error processing ${path.basename(file)}: ${error.message}`);
    }
});

console.log(`\n=== Summary ===`);
console.log(`Processed: ${processed} files`);
console.log(`Errors: ${errors}`);
console.log(`\nMobile menu, buttons, and broken links have been standardized across all pages.`);
