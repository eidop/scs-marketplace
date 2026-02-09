#!/usr/bin/env node

/**
 * Auto-load vault on session start
 */

const vault = require('./vault.js');

console.log('✓ Vault loaded');
console.log('Categories:', Object.keys(vault).join(', '));

// Display keys per category
for (const category in vault) {
  const keys = Object.keys(vault[category]).filter((k) => k !== 'ollama' && k !== 'ollama_models');
  if (keys.length > 0) {
    console.log(`  ${category}:`, keys.join(', '));
  }
}
