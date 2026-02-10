#!/usr/bin/env node
/**
 * SCS Marketplace - Automated Setup Installer
 * Installs cron jobs and startup tasks for full automode.
 *
 * Usage: node scripts/install-automode.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_DIR = __dirname;
const CRON_CONTENT = `# SCS Marketplace Automation
# Runs every 10 minutes
*/10 * * * * cd '${REPO_DIR}' && node scripts/monitoring/monitor.js --fix >> .autodeploy/monitor.log 2>&1
`;

function log(msg) {
  console.log(`[Setup] ${msg}`);
}

function run(cmd) {
  log(`Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: REPO_DIR });
}

async function main() {
  console.log('\n🚀 SCS Marketplace Automode Setup');
  console.log('='.repeat(40));

  // 1. Create monitoring directory
  const monitorDir = path.join(REPO_DIR, 'scripts', 'monitoring');
  if (!fs.existsSync(monitorDir)) {
    fs.mkdirSync(monitorDir, { recursive: true });
    log('Created monitoring directory');
  }

  // 2. Ensure autodeploy log directory exists
  const logDir = path.join(REPO_DIR, '.autodeploy');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
    log('Created .autodeploy directory');
  }

  // 3. Test monitoring script
  log('Testing monitoring script...');
  try {
    run('node scripts/monitoring/monitor.js');
    log('Monitoring script works ✅');
  } catch (err) {
    log(`Monitoring test: ${err.message}`);
  }

  // 4. Schedule cron job (commented out for user to review)
  const cronFile = path.join(REPO_DIR, '.autodeploy', 'crontab.txt');
  fs.writeFileSync(cronFile, CRON_CONTENT);
  log(`Cron config saved to: ${cronFile}`);
  log('To install cron job, run: crontab .autodeploy/crontab.txt');

  // 5. Create startup script for Windows
  const startupPs1 = path.join(REPO_DIR, 'start-automode.ps1');
  const startupContent = `# SCS Marketplace - Start Automode
# Run this script to start all automation services

Write-Host "🚀 Starting SCS Marketplace Automode..." -ForegroundColor Green

# Start the auto-deploy watcher
Write-Host "📡 Starting auto-deploy watcher..." -ForegroundColor Cyan
Start-Process -WindowStyle Hidden powershell.exe -ArgumentList "-File", "${path.join(REPO_DIR, 'auto-deploy-watcher.ps1')}"

# Run initial health check
Write-Host "🏥 Running initial health check..." -ForegroundColor Cyan
node scripts/monitoring/monitor.js

Write-Host "✅ Automode started successfully!" -ForegroundColor Green
Write-Host "   - Auto-deploy watcher is running in background"
Write-Host "   - Monitoring will check site health periodically"
`;

  fs.writeFileSync(startupPs1, startupContent);
  log(`Windows startup script: ${startupPs1}`);

  console.log('\n✅ Setup Complete!');
  console.log('\nNext steps:');
  console.log('1. Review .autodeploy/crontab.txt');
  console.log('2. Install cron: crontab .autodeploy/crontab.txt');
  console.log('3. Or run Windows version: .\\start-automode.ps1');
}

main().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
