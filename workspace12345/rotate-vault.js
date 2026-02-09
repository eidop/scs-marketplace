#!/usr/bin/env node

/**
 * Vault Rotation Script
 * Rotates API keys safely
 */

const fs = require('fs');
const path = require('path');

const vaultPath = path.join(__dirname, 'secrets.json');
const templatePath = path.join(__dirname, 'vault-template.json');

if (!fs.existsSync(vaultPath)) {
  console.log('Vault not found. Run: copy vault-template.json secrets.json');
  process.exit(1);
}

const vault = JSON.parse(fs.readFileSync(vaultPath, 'utf-8'));

function rotateKey(keyName, newKey) {
  if (!vault[keyName]) {
    console.log(`Key ${keyName} not found. Skipping.`);
    return;
  }

  vault[keyName] = newKey;
  console.log(`✓ Rotated ${keyName}`);
}

function listKeys() {
  console.log('Current keys:');
  for (const key in vault) {
    if (key !== 'version' && key !== 'description' && key !== 'notes') {
      const maskedKey = vault[key].substring(0, 8) + '...';
      console.log(`  ${key}: ${maskedKey}`);
    }
  }
}

const args = process.argv.slice(2);

if (args[0] === 'list') {
  listKeys();
} else if (args[0] === 'rotate' && args[1] && args[2]) {
  rotateKey(args[1], args[2]);
  fs.writeFileSync(vaultPath, JSON.stringify(vault, null, 2));
  console.log('Vault updated.');
} else {
  console.log('Usage:');
  console.log('  node rotate-vault.js list');
  console.log('  node rotate-vault.js rotate <key> <newKey>');
}
