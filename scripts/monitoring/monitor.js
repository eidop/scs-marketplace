#!/usr/bin/env node
/**
 * SCS Marketplace - Health Monitor & Auto-Repair
 * Runs periodically to check site health and fix common issues.
 *
 * Usage: node scripts/monitoring/monitor.js [--fix]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SITE_URL = 'https://scs-marketplace.pages.dev';
const REPO_DIR = __dirname;

// Simple HTTP GET helper
function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function checkSiteHealth() {
  console.log('\n🏥 SCS Marketplace Health Check');
  console.log('='.repeat(40));

  const checks = [];

  // 1. Check site is online
  try {
    const res = await fetch(SITE_URL);
    checks.push({ name: 'Site Online', status: res.statusCode === 200 ? '✅' : '⚠️', val: res.statusCode });
  } catch (err) {
    checks.push({ name: 'Site Online', status: '❌', val: err.message });
  }

  // 2. Check products folder exists
  const productsDir = path.join(REPO_DIR, 'products');
  if (fs.existsSync(productsDir)) {
    const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.json'));
    checks.push({ name: 'Products', status: files.length > 0 ? '✅' : '⚠️', val: `${files.length} templates` });
  } else {
    checks.push({ name: 'Products', status: '❌', val: 'Missing' });
  }

  // 3. Check scripts exist
  const deployScript = path.join(REPO_DIR, 'scripts', 'deploy.js');
  checks.push({ name: 'Deploy Script', status: fs.existsSync(deployScript) ? '✅' : '❌' });

  // 4. Check Git status
  try {
    const { execSync } = require('child_process');
    const status = execSync('git status --porcelain', { encoding: 'utf8', cwd: REPO_DIR }).trim();
    const isClean = status === '';
    checks.push({ name: 'Git Clean', status: isClean ? '✅' : '📁', val: isClean ? 'Clean' : 'Uncommitted changes' });
  } catch (err) {
    checks.push({ name: 'Git', status: '⚠️', val: 'Unknown' });
  }

  // Print results
  checks.forEach(c => {
    console.log(`${c.status} ${c.name}: ${c.val || ''}`);
  });

  const issues = checks.filter(c => c.status.startsWith('❌') || c.status.startsWith('⚠️')).length;
  console.log(`\n${issues === 0 ? '✅ All checks passed' : `⚠️ ${issues} issues detected`}`);

  return { healthy: issues === 0, checks };
}

async function autoFix() {
  console.log('\n🔧 Running Auto-Fix...');

  // Check if deployment is needed
  try {
    const { execSync } = require('child_process');
    const status = execSync('git status --porcelain', { encoding: 'utf8', cwd: REPO_DIR }).trim();

    if (status) {
      console.log('📁 Uncommitted changes detected');
      console.log('Run: node scripts/deploy.js --message "Auto-fix $(date)"');
    }
  } catch (err) {
    console.log('Git check skipped');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const doFix = args.includes('--fix');

  const health = await checkSiteHealth();

  if (doFix && !health.healthy) {
    await autoFix();
  }

  // Exit with appropriate code
  process.exit(health.healthy ? 0 : 1);
}

main().catch(err => {
  console.error('Monitor error:', err.message);
  process.exit(1);
});
