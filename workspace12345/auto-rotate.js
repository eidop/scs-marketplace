#!/usr/bin/env node

/**
 * Automated Key Rotation Script
 *
 * Usage:
 *   node auto-rotate.js list          # List all keys
 *   node auto-rotate.js rotate <key> <newKey>
 *   node auto-rotate.js auto          # Auto-rotate based on config
 */

const fs = require('fs');
const path = require('path');

const vaultPath = path.join(__dirname, 'secrets.json');
const vault = JSON.parse(fs.readFileSync(vaultPath, 'utf-8'));

function rotateKey(category, keyName, newKey) {
  if (!vault[keyName]) {
    console.log(`⚠️  Key ${keyName} not found in ${category}. Skipping.`);
    return false;
  }

  vault[keyName] = newKey;
  console.log(`✓ Rotated ${category}/${keyName}`);
  return true;
}

function listKeys() {
  for (const category in vault) {
    const keys = Object.keys(vault[category]).filter((k) => k !== 'ollama' && k !== 'ollama_models');
    if (keys.length > 0) {
      console.log(`  ${category}: ${keys.join(', ')}`);
    }
  }
}

function autoRotate() {
  console.log('🔄 Auto-rotation starting...');
  let rotated = 0;

  // Example: Rotate OpenRouter API key if it exists
  if (vault.apis.openrouter) {
    console.log('  Checking OpenRouter API key...');
    rotated++;
  }

  // Add more automated rotations here
  if (rotated === 0) {
    console.log('  No keys found to rotate.');
  } else {
    console.log(`  ✓ ${rotated} key(s) checked.`);
  }
}

const args = process.argv.slice(2);

if (args[0] === 'list') {
  listKeys();
} else if (args[0] === 'rotate' && args[1] && args[2]) {
  const [category, keyName, newKey] = args[1].split('/');
  rotateKey(category, keyName, newKey);
  fs.writeFileSync(vaultPath, JSON.stringify(vault, null, 2));
  console.log('✓ Vault updated. Run rotate-vault.js to apply changes.');
} else if (args[0] === 'auto') {
  autoRotate();
  fs.writeFileSync(vaultPath, JSON.stringify(vault, null, 2));
} else {
  console.log('Usage:');
  console.log('  node auto-rotate.js list');
  console.log('  node auto-rotate.js rotate <category>/<key> <newKey>');
  console.log('  node auto-rotate.js auto');
}
