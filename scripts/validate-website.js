// Comprehensive Website Validation Script
const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\Dennn\\.openclaw\\workspace12345';
const pages = fs.readdirSync(baseDir).filter(f => f.endsWith('.html') && !f.includes('-no.html'));

console.log('=== SCS Marketplace Validation Report ===\n');

let issues = [];
let passed = 0;

// 1. Check all HTML files for form validation
console.log('=== Form Validation Check ===');
pages.forEach(page => {
    const content = fs.readFileSync(path.join(baseDir, page), 'utf8');
    
    // Check for forms
    const forms = content.match(/<form[^>]*>/g) || [];
    forms.forEach(form => {
        // Check for required attribute
        if (!form.includes('required')) {
            issues.push(`${page}: Form missing required fields validation`);
        }
        // Check for input types
        const emailInputs = content.match(/<input[^>]*type="email"[^>]*>/g) || [];
        if (forms.length > 0 && emailInputs.length === 0) {
            // Check if there's any email validation
            if (!content.includes('type="email"') && !content.includes('email')) {
                // Not a strict error, just noting
            }
        }
    });
});
console.log(`Forms checked: ${pages.length}`);

// 2. Check for console.error or debug statements
console.log('\n=== Console Error Check ===');
pages.forEach(page => {
    const content = fs.readFileSync(path.join(baseDir, page), 'utf8');
    if (content.includes('console.error(') || content.includes('console.debug(')) {
        issues.push(`${page}: Contains console.error or debug statements`);
    }
});
console.log(`Pages checked: ${pages.length}`);

// 3. Check for broken internal links
console.log('\n=== Internal Link Check ===');
const allHtmlPages = fs.readdirSync(baseDir).filter(f => f.endsWith('.html')).map(f => f.toLowerCase());

pages.forEach(page => {
    const content = fs.readFileSync(path.join(baseDir, page), 'utf8');
    const links = content.match(/href="([^"]+\.html)"/g) || [];
    
    links.forEach(link => {
        const match = link.match(/href="([^"]+)"/);
        if (match) {
            const href = match[1];
            // Skip external links
            if (href.startsWith('http')) return;
            
            const targetFile = href.split('#')[0].toLowerCase();
            if (!allHtmlPages.includes(targetFile) && !targetFile.startsWith('services/')) {
                issues.push(`${page}: Broken link to ${href}`);
            }
        }
    });
});
console.log(`Link check complete`);

// 4. Check for missing alt tags on images
console.log('\n=== Accessibility Check ===');
let totalImages = 0;
let imagesWithAlt = 0;

pages.forEach(page => {
    const content = fs.readFileSync(path.join(baseDir, page), 'utf8');
    const images = content.match(/<img[^>]*>/g) || [];
    totalImages += images.length;
    
    images.forEach(img => {
        if (img.includes('alt="') || img.includes("alt='")) {
            imagesWithAlt++;
        } else if (!img.includes('alt=""') && !img.includes("alt=''")) {
            // Whitelist common decorative images
            if (!img.includes('scs-logo') && !img.includes('og-')) {
                issues.push(`${page}: Image missing alt attribute`);
            }
        }
    });
});
console.log(`Images: ${totalImages}, With alt: ${imagesWithAlt}`);

// 5. Check JavaScript syntax (basic)
console.log('\n=== JavaScript Check ===');
const jsFiles = fs.readdirSync(baseDir).filter(f => f.endsWith('.js'));
jsFiles.forEach(jsFile => {
    const content = fs.readFileSync(path.join(baseDir, jsFile), 'utf8');
    // Basic syntax check - count braces
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
        issues.push(`${jsFile}: Mismatched braces (${openBraces} open, ${closeBraces} close)`);
    }
});
console.log(`JS files checked: ${jsFiles.length}`);

// 6. Check CSS file existence
console.log('\n=== CSS Check ===');
const cssDir = path.join(baseDir, 'css');
if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
    const htmlWithCss = new Set();
    
    pages.forEach(page => {
        const content = fs.readFileSync(path.join(baseDir, page), 'utf8');
        cssFiles.forEach(css => {
            if (content.includes(css)) {
                htmlWithCss.add(css);
            }
        });
    });
    
    console.log(`CSS files: ${cssFiles.length}`);
    cssFiles.forEach(css => {
        if (!htmlWithCss.has(css)) {
            console.log(`  ⚠️ ${css} - not referenced in HTML`);
        }
    });
} else {
    issues.push('CSS directory not found');
}

// SUMMARY
console.log('\n=== SUMMARY ===');
console.log(`Total issues: ${issues.length}`);
if (issues.length > 0) {
    console.log('\n=== ISSUES ===');
    issues.forEach((issue, i) => console.log(`${i + 1}. ${issue}`));
} else {
    console.log('✅ All checks passed!');
}

// Write report
const report = {
    date: new Date().toISOString(),
    pagesChecked: pages.length,
    issues: issues,
    summary: {
        total: issues.length,
        formsValidated: true,
        linksChecked: true,
        accessibilityChecked: true,
        jsChecked: true
    }
};

fs.writeFileSync(path.join(baseDir, 'validation-report.json'), JSON.stringify(report, null, 2));
console.log('\nReport saved to validation-report.json');
