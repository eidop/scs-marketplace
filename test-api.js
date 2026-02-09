const https = require('https');
const crypto = require('crypto');

const CF_EMAIL = 'dennnwood@gmail.com';
const CF_API_KEY = '7851f7563ccf7fc8e954e480e5f5f3f146a99';
const ACCOUNT_ID = 'e576148798d3edb601a8858facd86324';

// Simple test with just the manifest format
const manifest = {
  'index.html': {
    sizeInBytes: 463,
    fileType: 'text/html',
    digest: crypto.createHash('sha256').update('<html>test</html>').digest('base64')
  }
};

const body = JSON.stringify({
  name: 'scs-dashboard',
  manifest: manifest
});

console.log('Request body:');
console.log(body);
console.log('\nContent-Length:', Buffer.byteLength(body));

const options = {
  hostname: 'api.cloudflare.com',
  port: 443,
  path: `/client/v4/accounts/${ACCOUNT_ID}/pages/projects/scs-dashboard/deployments`,
  method: 'POST',
  headers: {
    'X-Auth-Email': CF_EMAIL,
    'X-Auth-Key': CF_API_KEY,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
};

console.log('\nSending request...');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(body);
req.end();
