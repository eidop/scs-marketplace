#!/usr/bin/env node

/**
 * Key Loader for API Usage
 *
 * Loads API keys from the vault and provides them
 * to scripts that need them.
 *
 * Example usage in other scripts:
 *   const apiKeys = require('./api-key-loader.js');
 *   const openaiKey = apiKeys.get('OPENAI_API_KEY');
 */

const fs = require('fs');
const path = require('path');

const vaultPath = path.join(__dirname, 'secrets.json');

let vault = {};
if (fs.existsSync(vaultPath)) {
  vault = JSON.parse(fs.readFileSync(vaultPath, 'utf-8'));
}

// Categories
const apiKeys = {
  openai: vault.apis.openai || null,
  claude: vault.apis.claude || null,
  groq: vault.apis.groq || null,
  openrouter: vault.apis.openrouter || null,
  anthropic: vault.apis.anthropic || null,
  google: vault.apis.google || null,
  others: {}
};

// Load remaining keys into 'others'
for (const key in vault) {
  if (
    !apiKeys.openai &&
    key.toLowerCase() === 'openai_api_key'
  ) {
    apiKeys.openai = vault[key];
  }
  if (
    !apiKeys.claude &&
    key.toLowerCase().includes('claude')
  ) {
    apiKeys.claude = vault[key];
  }
  if (
    !apiKeys.groq &&
    key.toLowerCase().includes('groq')
  ) {
    apiKeys.groq = vault[key];
  }
  if (
    !apiKeys.anthropic &&
    key.toLowerCase().includes('anthropic')
  ) {
    apiKeys.anthropic = vault[key];
  }
  if (
    !apiKeys.google &&
    key.toLowerCase().includes('google')
  ) {
    apiKeys.google = vault[key];
  }
  if (
    !apiKeys.openrouter &&
    key.toLowerCase().includes('openrouter')
  ) {
    apiKeys.openrouter = vault[key];
  }
  if (
    !apiKeys.others[key] &&
    !apiKeys.openai &&
    !apiKeys.claude &&
    !apiKeys.groq &&
    !apiKeys.anthropic &&
    !apiKeys.google &&
    !apiKeys.openrouter
  ) {
    apiKeys.others[key] = vault[key];
  }
}

module.exports = {
  get: (keyName) => {
    if (keyName.toLowerCase() === 'openai') return apiKeys.openai;
    if (keyName.toLowerCase() === 'claude') return apiKeys.claude;
    if (keyName.toLowerCase() === 'groq') return apiKeys.groq;
    if (keyName.toLowerCase() === 'anthropic') return apiKeys.anthropic;
    if (keyName.toLowerCase() === 'google') return apiKeys.google;
    if (keyName.toLowerCase() === 'openrouter') return apiKeys.openrouter;
    return apiKeys.others[keyName] || null;
  },
  keys: apiKeys,
  vault: vault
};
