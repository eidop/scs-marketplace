# API Key Management

## Overview

Secure, categorized management of API keys in your vault.

## Files

- `api-key-manager.js` – CLI tool to manage keys
- `api-key-loader.js` – Module to load keys for scripts

## Usage

### List all keys
```bash
node api-key-manager.js list
```

### Get a specific key
```bash
node api-key-manager.js get OPENAI_API_KEY
```

### Add a new key
```bash
node api-key-manager.js add OPENAI_API_KEY "sk-..."
```

### Rotate a key
```bash
node api-key-manager.js rotate OPENAI_API_KEY "sk-new..."
```

## Script Integration

```javascript
const apiKeys = require('./api-key-loader.js');

// Get specific key
const openaiKey = apiKeys.get('openai');
const claudeKey = apiKeys.get('claude');

// Get all keys
console.log('OpenAI:', apiKeys.keys.openai);
console.log('Claude:', apiKeys.keys.claude);
console.log('Groq:', apiKeys.keys.groq);
console.log('Others:', apiKeys.keys.others);
```

## Security

- Keys are stored in `secrets.json` (in your workspace)
- Keys are never logged or printed in full
- Rotate keys regularly
- Never commit `secrets.json` to Git

---

**Created:** 2026-02-09
