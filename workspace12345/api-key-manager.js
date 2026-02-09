#!/usr/bin/env node

/**
 * API Key Manager
 *
 * Loads and manages API keys from the vault.
 *
 * Usage:
 *   node api-key-manager.js list           # List all keys
 *   node api-key-manager.js get <key>      # Get a specific key
 *   node api-key-manager.js add <key> <value>  # Add a new key
 *   node api-key-manager.js rotate <key> <newValue>  # Rotate a key
 */

const fs = require('fs');
const path = require('path');

const vaultPath = path.join(__dirname, 'secrets.json');

// Load vault
let vault = {};
if (fs.existsSync(vaultPath)) {
  vault = JSON.parse(fs.readFileSync(vaultPath, 'utf-8'));
} else {
  console.log('⚠️  Vault not found. Run: node init-vault.js');
  process.exit(1);
}

function listKeys() {
  console.log('\n📋 Available API Keys:\n');

  const keys = [];
  for (const category in vault) {
    if (category !== 'version' && category !== 'description' && category !== 'notes') {
      keys.push(...Object.keys(vault[category]));
    }
  }

  if (keys.length === 0) {
    console.log('  No keys found.\n');
    return;
  }

  keys.forEach((key) => {
    const maskedKey = vault[key].substring(0, 8) + '...';
    console.log(`  ${key}: ${maskedKey}`);
  });

  console.log('');
}

function getKey(keyName) {
  if (!vault[keyName]) {
    console.log(`\n⚠️  Key "${keyName}" not found.\n`);
    console.log('Available keys:');
    listKeys();
    return null;
  }

  const key = vault[keyName];
  console.log(`\n✓ Key: ${keyName}`);
  console.log(`  Value: ${key}\n`);

  return key;
}

function addKey(keyName, keyValue) {
  if (!keyValue) {
    console.log('\n⚠️  No value provided.\n');
    console.log('Usage: node api-key-manager.js add <key> <value>\n');
    return;
  }

  vault[keyName] = keyValue;
  fs.writeFileSync(vaultPath, JSON.stringify(vault, null, 2));
  console.log(`\n✓ Key "${keyName}" added successfully.\n`);
}

function rotateKey(keyName, newKeyValue) {
  if (!vault[keyName]) {
    console.log(`\n⚠️  Key "${keyName}" not found.\n`);
    return;
  }

  if (!newKeyValue) {
    console.log('\n⚠️  No new value provided.\n');
    console.log('Usage: node api-key-manager.js rotate <key> <newValue>\n');
    return;
  }

  const oldKey = vault[keyName];
  vault[keyName] = newKeyValue;
  fs.writeFileSync(vaultPath, JSON.stringify(vault, null, 2));
  console.log(`\n✓ Key "${keyName}" rotated.\n`);
  console.log(`  Old: ${oldKey.substring(0, 8)}...`);
  console.log(`  New: ${newKeyValue.substring(0, 8)}...\n`);
}

const args = process.argv.slice(2);

if (args[0] === 'list') {
  listKeys();
} else if (args[0] === 'get' && args[1]) {
  getKey(args[1]);
} else if (args[0] === 'add' && args[1] && args[2]) {
  addKey(args[1], args[2]);
} else if (args[0] === 'rotate' && args[1] && args[2]) {
  rotateKey(args[1], args[2]);
} else {
  console.log('Usage:');
  console.log('  node api-key-manager.js list');
  console.log('  node api-key-manager.js get <key>');
  console.log('  node api-key-manager.js add <key> <value>');
  console.log('  node api-key-manager.js rotate <key> <newValue>\n');
}
