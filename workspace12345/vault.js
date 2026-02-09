#!/usr/bin/env node

/**
 * Categorized Vault System
 *
 * Categories:
 * - models: Local models (Ollama)
 * - apis: External APIs (OpenRouter, etc.)
 * - apps: Applications (Discord, Slack, etc.)
 * - services: Cloud services (Cloudflare, n8n, etc.)
 * - secrets: Misc secrets
 */

const fs = require('fs');
const path = require('path');

const vaultPath = path.join(__dirname, 'secrets.json');
const templatePath = path.join(__dirname, 'vault-template.json');

// Load vault
let vault = {};
if (fs.existsSync(vaultPath)) {
  vault = JSON.parse(fs.readFileSync(vaultPath, 'utf-8'));
} else {
  // Initialize if not exists
  fs.copyFileSync(templatePath, vaultPath);
  vault = JSON.parse(fs.readFileSync(vaultPath, 'utf-8'));
}

// Categorized keys
const categorized = {
  models: {
    ollama: vault.OLLAMA_HOST || 'http://localhost:11434',
    ollama_models: vault.OLLAMA_MODELS || [],
  },
  apis: {
    openrouter: vault.OPENROUTER_API_KEY || '',
    other: {},
  },
  apps: {
    discord: vault.DISCORD_TOKEN || '',
    slack: vault.SLACK_TOKEN || '',
  },
  services: {
    cloudflare: vault.CLOUDFLARE_API_KEY || '',
    n8n: vault.N8N_WEBHOOK_URL || '',
    github: vault.GITHUB_TOKEN || '',
  },
  secrets: {},
};

// Load remaining keys into secrets
for (const key in vault) {
  if (
    !categorized.models[key] &&
    !categorized.apis[key] &&
    !categorized.apps[key] &&
    !categorized.services[key] &&
    key !== 'version' &&
    key !== 'description' &&
    key !== 'notes'
  ) {
    categorized.secrets[key] = vault[key];
  }
}

// Save categorized keys back to vault
for (const category in categorized) {
  for (const key in categorized[category]) {
    if (categorized[category][key]) {
      vault[key] = categorized[category][key];
    } else {
      delete vault[key];
    }
  }
}

fs.writeFileSync(vaultPath, JSON.stringify(vault, null, 2));

module.exports = categorized;
