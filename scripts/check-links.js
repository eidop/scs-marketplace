// Simple Link Validator for SCS Marketplace
const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\Dennn\\.openclaw\\workspace12345';
const pages = fs.readdirSync(baseDir).filter(f => f.endsWith('.html'));

// Known internal links that should exist
const expectedLinks = [
    'index.html', 'pricing.html', 'features.html', 'contact.html',
    'about.html', 'blog.html', 'case-studies.html', 'n8n-store.html',
    'integrations.html', 'getting-started.html', 'resources.html',
    'changelog.html', 'compare.html', 'careers.html', 'status.html',
    'client-dashboard.html', 'roi-calculator.html', 'setup.html',
    'dashboard.html', 'lead.html', 'solution-sales.html',
    'solution-support.html', 'solution-hiring.html', 'privacy.html',
    'terms.html', 'cookies.html', '404.html', 'website-services.html',
    'solution-megling.html', 'solution-investering.html',
    'solution-kundeservice.html', 'solution-sales-no.html',
    'solution-support-no.html', 'solution-hiring-no.html',
    'solution-megling-no.html', 'solution-investering-no.html',
    'solution-kundeservice-no.html', 'index-no.html', 'pricing-no.html'
];

console.log('=== SCS Marketplace Link Validation ===\n');

let errors = [];
let validLinks = 0;

// Check all HTML files have expected links
console.log('Checking page links...');
expectedLinks.forEach(link => {
    if (pages.includes(link)) {
        validLinks++;
    } else {
        errors.push(`Missing: ${link}`);
    }
});

console.log(`Expected links: ${expectedLinks.length}`);
console.log(`Valid links found: ${validLinks}`);
console.log(`Errors: ${errors.length}`);

if (errors.length > 0) {
    console.log('\n=== Missing Pages ===');
    errors.forEach(e => console.log(`  ❌ ${e}`));
}

// Check nav consistency
console.log('\n=== Navigation Check ===');
const indexContent = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf8');
const navLinks = indexContent.match(/href="([^"]+\.html)"/g) || [];
console.log(`Links in index.html nav: ${navLinks.length}`);
navLinks.forEach(link => console.log(`  ${link}`));

// Check meta tags
console.log('\n=== Meta Tag Check ===');
pages.forEach(page => {
    const content = fs.readFileSync(path.join(baseDir, page), 'utf8');
    const title = content.match(/<title>([^<]+)<\/title>/);
    const desc = content.match(/name="description" content="([^"]+)"/);
    console.log(`${page}: ${title ? '✓' : '❌'} title, ${desc ? '✓' : '❌'} description`);
});

console.log('\n=== Done ===');
