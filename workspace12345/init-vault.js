#!/usr/bin/env node

/**
 * Initialize vault safely
 */

const fs = require('fs');
const path = require('path');

const vaultPath = path.join(__dirname, 'secrets.json');
const templatePath = path.join(__dirname, 'vault-template.json');

if (fs.existsSync(vaultPath)) {
  console.log('⚠️  Vault already exists at:', vaultPath);
  console.log('To update it, edit the file manually or use the rotation script.');
  process.exit(0);
}

// Copy template to secrets.json
fs.copyFileSync(templatePath, vaultPath);
console.log('✓ Vault initialized at:', vaultPath);
console.log('\nNext steps:');
console.log('1. Edit secrets.json to add your keys.');
console.log('2. Make sure secrets.json is in .gitignore (already done).');
console.log('3. Use rotate-vault.js to manage keys.');
