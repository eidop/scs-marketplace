#!/usr/bin/env node

/**
 * Model Rotation Script
 *
 * Usage:
 *   node rotate-model.js <reason>
 *
 * Reasons:
 *   - high_token_usage    (rotate to cheaper model when usage is high)
 *   - image_generation     (rotate to multimodal model for images)
 *   - code_tasks          (rotate to coder model for code)
 *   - heavy_reasoning      (rotate to strong reasoning model)
 *   - quick_tasks         (rotate to fast model for simple queries)
 *   - status              (show current rotation status)
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

function getRotationModel(reason) {
  if (!rotationRules.rotation_rules[reason]) {
    console.log(`⚠️  No rotation rule for reason: ${reason}`);
    console.log('Available reasons: high_token_usage, image_generation, code_tasks, heavy_reasoning, quick_tasks');
    return null;
  }

  const rule = rotationRules.rotation_rules[reason];
  console.log(`\n✓ Reason: ${reason}`);
  console.log(`  Model: ${rule.model}`);
  console.log(`  Fallback: ${rule.fallback}`);
  console.log(`  Reason text: ${rule.reason}`);

  return rule.model;
}

function getStatus() {
  console.log('\n📋 Current Rotation Status:');
  console.log('=========================\n');

  for (const reason in rotationRules.rotation_rules) {
    const rule = rotationRules.rotation_rules[reason];
    console.log(`${reason}:`);
    console.log(`  → Model: ${rule.model}`);
    console.log(`  → Fallback: ${rule.fallback}`);
    console.log(`  → Reason: ${rule.reason}`);
    console.log('');
  }

  console.log('\n📚 Available Models:');
  console.log('===================\n');

  if (vault.models && vault.models.ollama_models) {
    console.log('Local models installed:');
    vault.models.ollama_models.forEach((model) => {
      console.log(`  - ${model}`);
    });
  }

  if (vault.apis && vault.apis.openrouter) {
    console.log('\nOpenRouter API key found.');
  }
}

const args = process.argv.slice(2);

if (args[0] === 'status') {
  getStatus();
} else if (args[0] && rotationRules.rotation_rules[args[0]]) {
  const model = getRotationModel(args[0]);

  if (model) {
    console.log('\n✓ Model rotation recommended:');
    console.log(`  Current model: ${model}`);
    console.log(`  Fallback: ${rotationRules.rotation_rules[args[0]].fallback}`);
    console.log('\n💡 To apply, update your session configuration with the new model.');
  }
} else if (args[0]) {
  console.log('⚠️  Invalid reason. Use:');
  console.log('  node rotate-model.js status');
  console.log('  node rotate-model.js <reason>');
  console.log('\nAvailable reasons: high_token_usage, image_generation, code_tasks, heavy_reasoning, quick_tasks');
} else {
  console.log('Usage:');
  console.log('  node rotate-model.js status');
  console.log('  node rotate-model.js <reason>');
  console.log('\nAvailable reasons:');
  console.log('  - high_token_usage    (rotate to cheaper model)');
  console.log('  - image_generation     (rotate to multimodal model)');
  console.log('  - code_tasks          (rotate to coder model)');
  console.log('  - heavy_reasoning      (rotate to strong reasoning model)');
  console.log('  - quick_tasks         (rotate to fast model)');
}
