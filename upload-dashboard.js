const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CF_EMAIL = 'dennnwood@gmail.com';
const CF_API_KEY = '7851f7563ccf7fc8e954e480e5f5f3f146a99';
const ACCOUNT_ID = 'e576148798d3edb601a8858facd86324';
const PROJECT_NAME = 'scs-dashboard';

const distDir = 'C:/Users/Dennn/.openclaw/workspace/apps/scs-dashboard/dist';

// Read all files
const files = {};
const walkDir = (dir, prefix = '') => {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, prefix + item + '/');
    } else {
      files[prefix + item] = fs.readFileSync(fullPath);
    }
  });
};

walkDir(distDir);

console.log('Found', Object.keys(files).length, 'files');
console.log('Files:', Object.keys(files));

// Step 1: Create upload session
const postData = JSON.stringify({
  name: PROJECT_NAME
});

const options = {
  hostname: 'api.cloudflare.com',
  port: 443,
  path: `/client/v4/accounts/${ACCOUNT_ID}/pages/direct-upload`,
  method: 'POST',
  headers: {
    'X-Auth-Email': CF_EMAIL,
    'X-Auth-Key': CF_API_KEY,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('\nCreating upload session...');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const result = JSON.parse(data);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (result.success && result.result) {
      console.log('\n✅ Upload session created!');
      console.log('Upload URL:', result.result.upload_url);
      console.log('JWT:', result.result.jwt);
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(postData);
req.end();
