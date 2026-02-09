# Automated Vault System

## Setup

1. Initialize vault:
   ```bash
   node init-vault.js
   ```

2. Add your keys to `secrets.json`:
   ```json
   {
     "version": "1.0",
     "description": "Secure vault for API keys and credentials",
     "notes": "Do not commit this file to public repositories. Keep it private."
   }
   ```

3. Categories:
   - `models`: Local models (Ollama)
   - `apis`: External APIs (OpenRouter, etc.)
   - `apps`: Applications (Discord, Slack, etc.)
   - `services`: Cloud services (Cloudflare, n8n, GitHub)
   - `secrets`: Misc secrets

## Usage

### List all keys
```bash
node auto-rotate.js list
```

### Rotate a key
```bash
node auto-rotate.js rotate <category>/<key> <newKey>
```

Example:
```bash
node auto-rotate.js rotate apis/openrouter "new_key_value"
```

### Auto-rotate (scheduled)
```bash
node auto-rotate.js auto
```

## Automation

- **Session start:** `load-vault.js` auto-loads categorized keys
- **Daily rotation:** Add to your daily checklist (see `HEARTBEAT.md`)

## Security

- Never commit `secrets.json` to Git (already in `.gitignore`).
- Rotate keys regularly.

---

**Created:** 2026-02-09
