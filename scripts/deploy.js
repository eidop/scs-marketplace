#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO = __dirname;
const TRIGGER_FILE = path.join(REPO, 'DEPLOY.txt');

function main() {
  const msg = process.argv[2] === '--message' ? process.argv[3] : `Update ${new Date().toISOString().slice(0, 10)}`;
  console.log(`Deploy: ${msg}`);

  try {
    execSync('git add -A', { cwd: REPO, stdio: 'inherit' });
    const status = execSync('git status --porcelain', { cwd: REPO, encoding: 'utf8' }).trim();
    if (!status) { console.log('No changes'); return; }
    execSync(`git commit -m "${msg}"`, { cwd: REPO, stdio: 'inherit' });
    fs.writeFileSync(TRIGGER_FILE, '');
    console.log('Deploy queued - watcher will push');
  } catch (e) { console.error('Error:', e.message); process.exit(1); }
}

main();
