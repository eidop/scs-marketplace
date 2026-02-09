const https = require('https');

const CF_EMAIL = 'dennnwood@gmail.com';
const CF_API_KEY = '7851f7563ccf7fc8e954e480e5f5f3f146a99';
const ACCOUNT_ID = 'e576148798d3edb601a8858facd86324';
const PROJECT_NAME = 'scs-dashboard';

const options = {
  hostname: 'api.cloudflare.com',
  port: 443,
  path: `/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`,
  method: 'GET',
  headers: {
    'X-Auth-Email': CF_EMAIL,
    'X-Auth-Key': CF_API_KEY
  }
};

console.log('Checking project:', PROJECT_NAME);

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
req.end();
