/**
 * Token Management Service Configuration
 * Ensures token management systems start automatically with OpenClaw
 */

const fs = require('fs');
const path = require('path');

// Configuration for token management systems
const tokenConfig = {
  // Token cooldown settings
  cooldown: {
    thresholdLow: 80,      // Start considering action at this %
    thresholdHigh: 90,     // Force action at this %
    cooldownTarget: 10,    // Target % to cool down to
    checkInterval: 300000, // 5 minutes
    actionCooldown: 300000 // 5 minutes between actions
  },
  
  // Agent switching settings
  switching: {
    usageThreshold: 80,    // Switch when usage exceeds this %
    cooldownTime: 300000,  // 5 minutes between switches
    checkInterval: 300000  // 5 minutes
  },
  
  // Monitoring settings
  monitoring: {
    enabled: true,
    logFile: path.join(process.env.USERPROFILE, '.clawd', 'token-management.log'),
    verbose: false
  }
};

// Write configuration to file
const configPath = path.join(process.env.USERPROFILE, '.clawd', 'token-management-config.json');
fs.writeFileSync(configPath, JSON.stringify(tokenConfig, null, 2));

console.log('Token management configuration created at:', configPath);
console.log('Configuration:', JSON.stringify(tokenConfig, null, 2));

// Also create a startup script
const startupScript = `#!/bin/bash
# Token Management Service Startup Script

echo "Starting Token Management Service..."
cd ${process.env.USERPROFILE}/.openclaw/workspace12345

# Start the token orchestrator in the background
nohup node token-orchestrator.js start > token-orchestrator.log 2>&1 &

echo "Token Management Service started in background"
`;

const startupPath = path.join(process.env.USERPROFILE, '.clawd', 'start-token-service.sh');
try {
  fs.writeFileSync(startupPath, startupScript);
  console.log('Startup script created at:', startupPath);
} catch (e) {
  console.log('Note: Could not create startup script (may be Windows system)');
}

console.log('\nSetup complete!');
console.log('To manually start monitoring: node token-orchestrator.js start');
console.log('To check status: node token-orchestrator.js status');
console.log('To perform a check: node token-orchestrator.js check');

module.exports = tokenConfig;