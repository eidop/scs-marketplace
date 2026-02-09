const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const FormData = require('form-data');

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

// Create manifest
const manifest = {};
Object.keys(files).forEach(filename => {
  const content = files[filename];
  manifest[filename] = {
    sizeInBytes: content.length,
    fileType: getContentType(filename),
    digest: crypto.createHash('sha256').update(content).digest('base64')
  };
});

function getContentType(filename) {
  if (filename.endsWith('.html')) return 'text/html';
  if (filename.endsWith('.css')) return 'text/css';
  if (filename.endsWith('.js')) return 'application/javascript';
  if (filename.endsWith('.json')) return 'application/json';
  return 'application/octet-stream';
}

// Create multipart form data
const boundary = '----CloudflarePagesUpload' + Date.now();
let body = '';

Object.entries(files).forEach(([filename, content]) => {
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`;
  body += `Content-Type: application/octet-stream\r\n\r\n`;
  body += content.toString('binary');
  body += '\r\n';
});

body += `--${boundary}--\r\n`;

// Create metadata
const metadata = JSON.stringify({
  name: PROJECT_NAME,
  description: 'SCS Dashboard',
  mappings: manifest
});

const metadataHeader = Buffer.from(metadata);

// Combine metadata and files
const finalBody = Buffer.concat([
  Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="metadata"; filename="metadata.json"\r\nContent-Type: application/json\r\n\r\n`),
  metadataHeader,
  Buffer.from(`\r\n--${boundary}\r\n`),
  Buffer.from(body.replace(`--${boundary}--\r\n`, ''))
]);

const options = {
  hostname: 'api.cloudflare.com',
  port: 443,
  path: `/client/v4/accounts/${ACCOUNT_ID}/pages/deployments`,
  method: 'POST',
  headers: {
    'X-Auth-Email': CF_EMAIL,
    'X-Auth-Key': CF_API_KEY,
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': finalBody.length
  }
};

console.log('Uploading to Cloudflare Pages...');
console.log('Project:', PROJECT_NAME);

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const result = JSON.parse(data);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (result.success && result.result) {
      console.log('\n✅ Deployment created!');
      console.log('URL:', result.result.url);
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(finalBody);
req.end();
