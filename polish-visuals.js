/**
 * Visual Polish Script
 * Standardizes buttons, badges, and visual elements across all pages
 */

const fs = require('fs');
const path = require('path');

// Get all HTML files
function getAllHTMLFiles(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
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
console.log(`Found ${htmlFiles.length} HTML files to polish\n`);

// Standardized button styles CSS
const buttonStyles = `
    /* ========================================
       Standardized Button Styles
       ======================================== */

    .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        font-size: 0.95rem;
        font-weight: 600;
        text-align: center;
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.3s ease;
        cursor: pointer;
        border: none;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .btn:active {
        transform: scale(0.98);
    }

    /* Primary Button (Gradient) */
    .btn-primary {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: #fff;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    }

    .btn-primary:hover {
        background: linear-gradient(135deg, #5558e6 0%, #7c3aed 100%);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        transform: translateY(-2px);
    }

    /* Secondary/Outline Button */
    .btn-outline {
        background: transparent;
        color: #6366f1;
        border: 2px solid #6366f1;
    }

    .btn-outline:hover {
        background: rgba(99, 102, 241, 0.1);
        border-color: #7c3aed;
        color: #7c3aed;
    }

    /* Ghost Button */
    .btn-ghost {
        background: transparent;
        color: #94a3b8;
    }

    .btn-ghost:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #fff;
    }

    /* Badge Styles */
    .badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .badge-primary {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff;
    }

    .badge-success {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
    }

    .badge-warning {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
    }

    .badge-danger {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
    }

    .badge-outline {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #94a3b8;
    }

    .badge-outline:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #fff;
        border-color: #6366f1;
    }

    /* Pricing Card Buttons */
    .btn-card {
        display: block;
        width: 100%;
        margin-top: 1rem;
        padding: 0.875rem;
    }

    .btn-card.outline {
        background: transparent;
        border: 2px solid #6366f1;
        color: #6366f1;
    }

    .btn-card.outline:hover {
        background: rgba(99, 102, 241, 0.1);
    }

    /* Hero Button */
    .btn-hero {
        padding: 1rem 2rem;
        font-size: 1.1rem;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
    }

    .btn-hero:hover {
        box-shadow: 0 12px 40px rgba(99, 102, 241, 0.5);
        transform: translateY(-3px);
    }

    /* Footer Button */
    .btn-footer {
        width: 100%;
        padding: 0.75rem;
    }

    /* Responsive Button Sizes */
    @media (max-width: 768px) {
        .btn {
            padding: 0.625rem 1.25rem;
            font-size: 0.875rem;
        }

        .btn-hero {
            padding: 0.875rem 1.5rem;
            font-size: 1rem;
        }
    }
`;

// Fix inline button styles to use classes
function standardizeInlineButtons(content) {
    let fixed = content;

    // Fix common inline styles to use classes
    const buttonFixes = [
        // Inline styles for primary buttons
        {
            pattern: /style="display:\s*inline-block;\s*background:\s*linear-gradient\(135deg,\s*#6366f1\s+0%,\s+#8b5cf6\s+100%\);[^"]*"/g,
            replacement: 'class="btn btn-primary btn-hero"'
        },
        {
            pattern: /style="display:\s*inline-block;\s*background:\s*linear-gradient\(135deg,\s*#06b6d4\s+0%,\s+#0891b2\s+100%\);[^"]*"/g,
            replacement: 'class="btn btn-primary"'
        },
        // Outline buttons
        {
            pattern: /style="display:\s*inline-block;\s*background:\s*transparent;\s*border:\s*2px solid\s+#6366f1[^"]*"/g,
            replacement: 'class="btn btn-outline"'
        },
        {
            pattern: /style="display:\s*inline-block;\s*border:\s*2px solid\s+#6366f1[^"]*"/g,
            replacement: 'class="btn btn-outline"'
        },
        // Simple inline buttons
        {
            pattern: /style="display:\s*inline-block;\s*padding:\s*0\.75rem\s+1\.5rem[^"]*"/g,
            replacement: 'class="btn"'
        },
    ];

    buttonFixes.forEach(({ pattern, replacement }) => {
        fixed = fixed.replace(pattern, replacement);
    });

    return fixed;
}

// Fix badge styles
function standardizeBadges(content) {
    let fixed = content;

    // Fix inline badge styles
    const badgeFixes = [
        {
            pattern: /style="background:\s*linear-gradient\(135deg,\s*#f59e0b\s+0%,\s+#d97706\s+100%\);[^"]*"/g,
            replacement: 'class="badge badge-warning"'
        },
        {
            pattern: /style="background:\s*linear-gradient\(135deg,\s*#6366f1\s+0%,\s+#8b5cf6\s+100%\);[^"]*"/g,
            replacement: 'class="badge badge-primary"'
        },
        {
            pattern: /style="background:\s*rgba\(16,\s*185,\s*129,\s*0\.2\);[^"]*"/g,
            replacement: 'class="badge badge-success"'
        },
        {
            pattern: /style="background:\s*rgba\(239,\s*68,\s*68,\s*0\.2\);[^"]*"/g,
            replacement: 'class="badge badge-danger"'
        },
    ];

    badgeFixes.forEach(({ pattern, replacement }) => {
        fixed = fixed.replace(pattern, replacement);
    });

    return fixed;
}

// Fix pricing card structure
function fixPricingCards(content) {
    let fixed = content;

    // Ensure pricing cards have proper class structure
    fixed = fixed.replace(
        /<a href="contact\.html"[^>]*class="btn[^"]*"/g,
        '<a href="contact.html" class="btn btn-primary btn-card"'
    );

    return fixed;
}

// Process each file
let processed = 0;
let errors = 0;

htmlFiles.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');

        // Skip 404 page
        if (file.includes('404.html')) {
            return;
        }

        // Apply standardizations
        content = standardizeInlineButtons(content);
        content = standardizeBadges(content);
        content = fixPricingCards(content);

        // Ensure button styles are included in <head> if not present
        if (!content.includes('.btn-primary')) {
            // Find the first style tag or create one
            const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
            if (styleMatch) {
                content = content.replace(
                    `<style>${styleMatch[1]}</style>`,
                    `<style>\n${buttonStyles}\n</style>`
                );
            } else {
                content = content.replace(
                    /(<head>)/,
                    `$1<style>\n${buttonStyles}\n</style>`
                );
            }
        }

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
console.log(`\nButtons, badges, and visual elements have been standardized across all pages.`);
