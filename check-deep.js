const fs = require('fs');

const templatesDir = 'C:/Users/Dennn/.openclaw/workspace/apps/template-marketplace/templates';
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.html'));

console.log('=== ALL GUMROAD LINKS CHECK ===\n');

files.forEach(file => {
    const filePath = templatesDir + '/' + file;
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find all Gumroad links
    const matches = content.match(/https:\/\/simplyx\.gumroad\.com\/l\/[^\s"']+/g);
    
    if (matches) {
        const uniqueLinks = [...new Set(matches)];
        console.log(file + ':');
        uniqueLinks.forEach(link => console.log('  → ' + link));
    }
});

console.log('\n=== ALL TEMPLATES ===\n');
const gumroadLinks = [
    'https://simplyx.gumroad.com/l/Recruitment',
    'https://simplyx.gumroad.com/l/grrof',
    'https://simplyx.gumroad.com/l/cold-outreach-engine',
    'https://simplyx.gumroad.com/l/lead-generation-engine'
];
gumroadLinks.forEach(link => console.log(link));
