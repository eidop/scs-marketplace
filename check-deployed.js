const fs = require('fs');

const dir = 'C:/Users/Dennn/.openclaw/workspace/apps/template-marketplace/dist/templates';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

console.log('=== CHECKING DEPLOYED FILES ===\n');

files.forEach(file => {
    const filePath = dir + '/' + file;
    const content = fs.readFileSync(filePath, 'utf8');
    
    const titleMatch = content.match(/<title>([^<]+)<\/title>/);
    const gumroadMatch = content.match(/gumroad\.com\/l\/([^\s"']+)/);
    
    console.log(file + ':');
    console.log('  Title: ' + (titleMatch ? titleMatch[1] : 'N/A'));
    console.log('  Link: https://simplyx.gumroad.com/l/' + (gumroadMatch ? gumroadMatch[1] : 'MISSING'));
});
