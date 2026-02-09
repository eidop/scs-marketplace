const fs = require('fs');
const content = fs.readFileSync('C:/Users/Dennn/.openclaw/workspace/apps/template-marketplace/dist/templates.html', 'utf8');
const links = content.match(/href="templates\/[^"]+"/g);
console.log('=== LEARN MORE LINKS ===');
if (links) {
    links.forEach(l => console.log(l));
}
