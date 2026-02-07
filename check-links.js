const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\Dennn\\.openclaw\\workspace\\apps\\template-marketplace\\dist\\index.html', 'utf8');
const matches = content.match(/simplyx\.gumroad\.com\/l\/[^'"]+/g);
console.log('Updated Gumroad Links:');
const unique = [...new Set(matches)];
unique.forEach(m => console.log(m));
