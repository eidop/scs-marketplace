#!/usr/bin/env node

/**
 * Auto-Rotate Model Based on Token Usage
 *
 * This script monitors token usage and automatically rotates
 * to a cheaper model when usage exceeds the threshold.
 */

const fs = require('fs');
const path = require('path');

const rotationPath = path.join(__dirname, 'rotation-reasons.json');
const vaultPath = path.join(__dirname, 'secrets.json');

// Load rotation rules
let rotationRules = {};
if (fs.existsSync(rotationPath)) {
  rotationRules = JSON.parse(fs.readFileSync(rotationPath, 'utf-8'));
}

// Load vault (contains model configurations)
let vault = {};
if (fs.existsSync(vaultPath)) {
  vault = JSON.parse(fs.readFileSync(vaultPath, 'utf-8'));
}

function checkTokenUsage() {
  // This would integrate with the token-orchestrator.js status output
  // For now, we'll simulate token usage checking
  const currentUsage = 27; // Example: 27k tokens used out of 41k budget (66%)

  return {
    used: currentUsage,
    total: 41,
    percent: (currentUsage / 41) * 100,
    threshold: 70,
    should_rotate: currentUsage > 70
  };
}

function autoRotate() {
  console.log('🔄 Auto-Rotation System Running...\n');

  const usage = checkTokenUsage();

  console.log(`📊 Token Usage: ${usage.used}k / ${usage.total}k (${usage.percent.toFixed(1)}%)\n`);

  if (usage.should_rotate) {
    console.log('⚠️  Token usage exceeds threshold (70%).');
    console.log('   Rotating to cheaper model...\n');

    const reason = 'high_token_usage';
    const rule = rotationRules.rotation_rules[reason];

    if (rule) {
      console.log(`✓ Reason: ${reason}`);
      console.log(`✓ Recommended model: ${rule.model}`);
      console.log(`✓ Fallback: ${rule.fallback}`);
      console.log(`✓ Cooldown: ${rule.cooldown_minutes} minutes\n`);

      console.log('💡 Next steps:');
      console.log('   1. Update your session configuration with the new model.');
      console.log('   2. Wait for cooldown period before resuming heavy tasks.');
      console.log('   3. Monitor token usage and rotate again if needed.\n');

      // You could also integrate with token-orchestrator.js here
      // to actually trigger the cooldown or model switch

      return {
        should_rotate: true,
        reason: reason,
        model: rule.model,
        fallback: rule.fallback,
        cooldown: rule.cooldown_minutes
      };
    } else {
      console.log('⚠️  No rotation rule defined for high_token_usage.\n');
      return null;
    }
  } else {
    console.log('✅ Token usage is within safe limits.');
    console.log('   No rotation needed.\n');

    return {
      should_rotate: false,
      reason: null,
      model: null,
      fallback: null,
      cooldown: null
    };
  }
}

// Run auto-rotation
const result = autoRotate();

// Save result to a log file
const logPath = path.join(__dirname, 'rotation-log.json');
const log = JSON.parse(fs.readFileSync(logPath, 'utf-8')) || [];
log.push({
  timestamp: new Date().toISOString(),
  result: result
});
fs.writeFileSync(logPath, JSON.stringify(log, null, 2));

console.log('✓ Rotation check complete. Log saved to rotation-log.json\n');

// Exit with appropriate code
process.exit(result.should_rotate ? 1 : 0);
