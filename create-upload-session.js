const https = require('https');

const CF_EMAIL = 'dennnwood@gmail.com';
const CF_API_KEY = '7851f7563ccf7fc8e954e480e5f5f3f146a99';
const ACCOUNT_ID = 'e576148798d3edb601a8858facd86324';

const distDir = 'C:/Users/Dennn/.openclaw/workspace/apps/template-marketplace/dist';

// Step 1: Create an upload session
const createData = JSON.stringify({
  name: 'scs-market-place'
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
    'Content-Length': Buffer.byteLength(createData)
  }
};

console.log('🚀 Creating direct upload session...');

const req = https.request(options, (res) => {
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
