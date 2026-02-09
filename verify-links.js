const fs = require('fs');

const templates = [
    { file: 'template-recruitment.html', expected: 'Recruitment' },
    { file: 'template-support-ticket.html', expected: 'grrof' },
    { file: 'template-cold-outreach.html', expected: 'cold-outreach-engine' },
    { file: 'template-lead-generation.html', expected: 'lead-generation-engine' }
];

const dir = 'C:/Users/Dennn/.openclaw/workspace/apps/template-marketplace/templates';

templates.forEach(t => {
    const filePath = dir + '/' + t.file;
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check title and Gumroad link
    const titleMatch = content.match(/<title>([^<]+)<\/title>/);
    const gumroadMatch = content.match(/gumroad\.com\/l\/([^\s"']+)/);
    
    console.log('\n=== ' + t.file + ' ===');
    console.log('Title: ' + (titleMatch ? titleMatch[1] : 'N/A'));
    console.log('Gumroad: gumroad.com/l/' + (gumroadMatch ? gumroadMatch[1] : 'N/A'));
    console.log('Expected: gumroad.com/l/' + t.expected);
    console.log('Match: ' + (gumroadMatch && gumroadMatch[1] === t.expected ? '✅' : '❌'));
});
