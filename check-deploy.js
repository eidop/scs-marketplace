const https = require('https');
const { exec } = require('child_process');

const repo = 'eidop/scs-marketplace';
const workflowId = 'deploy.yml';

console.log('═══════════════════════════════════════════════════════════');
console.log('🚀 CHECKING GITHUB SECRETS & TRIGGERING DEPLOY');
console.log('═══════════════════════════════════════════════════════════');
console.log('');
console.log('Repository: ' + repo);
console.log('');
console.log('If you haven\'t added the secrets yet, go to:');
console.log('https://github.com/' + repo + '/settings/secrets/actions');
console.log('');
console.log('Required secrets:');
console.log('  CLOUDFLARE_API_TOKEN');
console.log('  CLOUDFLARE_ACCOUNT_ID');
console.log('');
console.log('After adding secrets, the workflow will auto-run on next push.');
console.log('Or manually trigger at:');
console.log('https://github.com/' + repo + '/actions/workflows/' + workflowId);
console.log('');
console.log('═══════════════════════════════════════════════════════════');
