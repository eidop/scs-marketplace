const fs = require('fs');

const filePath = 'C:\\Users\\Dennn\\.openclaw\\workspace\\apps\\template-marketplace\\dist\\index.html';
let content = fs.readFileSync(filePath, 'utf8');

// Replace $ with EUR
content = content.replace(/\$([0-9,]+)/g, '€$1');

// Remove NOK equivalents
content = content.replace(/\(~NOK [0-9,]+\)/g, '(~EUR equivalent)');
content = content.replace(/NOK [0-9,]+/g, 'EUR equivalent');

fs.writeFileSync(filePath, content);

console.log('Currency updated to EUR!');
console.log('');
console.log('Replaced $ with €');
console.log('Removed NOK conversions');
