const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CF_EMAIL = 'dennnwood@gmail.com';
const CF_API_KEY = '7851f7563ccf7fc8e954e480e5f5f3f146a99';
const ACCOUNT_ID = 'e576148798d3edb601a8858facd86324';
const PROJECT_NAME = 'scs-market-place';

const distDir = 'C:/Users/Dennn/.openclaw/workspace/apps/template-marketplace/dist';

// Read all files and create manifest
const files = {};
const manifest = {};
const walkDir = (dir, prefix = '') => {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, prefix + item + '/');
    } else {
      const content = fs.readFileSync(fullPath);
      files[prefix + item] = content;
      const size = content.length;
      manifest[prefix + item] = {
        sizeInBytes: size,
        fileType: getContentType(prefix + item),
        hash: crypto.createHash('sha256').update(content).digest('base64')
      };
    }
  });
};

function getContentType(filename) {
  if (filename.endsWith('.html')) return 'text/html';
  if (filename.endsWith('.css')) return 'text/css';
  if (filename.endsWith('.js')) return 'application/javascript';
  if (filename.endsWith('.json')) return 'application/json';
  if (filename.endsWith('.png')) return 'image/png';
  if (filename.endsWith('.jpg')) return 'image/jpeg';
  if (filename.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}

walkDir(distDir);

console.log('🚀 Deploying to Cloudflare Pages...');
console.log('Project:', PROJECT_NAME);
console.log('Files to upload:', Object.keys(files).length);

// Step 1: Create upload session
const createData = JSON.stringify({
  name: PROJECT_NAME,
  manifest: manifest
});

const createOptions = {
  hostname: 'api.cloudflare.com',
  port: 443,
  path: `/client/v4/accounts/${ACCOUNT_ID}/pages/deployments`,
  method: 'POST',
  headers: {
    'X-Auth-Email': CF_EMAIL,
    'X-Auth-Key': CF_API_KEY,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(createData)
  }
};

console.log('\n📦 Creating deployment session...');

const req = https.request(createOptions, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const result = JSON.parse(data);
    console.log('Response:', JSON.stringify(result, null, 2));
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(createData);
req.end();
