# Secure Vault

**Purpose:** Store API keys and credentials safely.

**Location:** `secrets.json` (in workspace)

**IMPORTANT:** Never commit `secrets.json` to Git.

---

## Setup

1. Copy template:
   ```bash
   copy vault-template.json secrets.json
   ```

2. Add your keys:
   - Edit `secrets.json` manually.

3. Keep it out of Git:
   - Already in `.gitignore`.

---

## Usage

**Read keys from script:**

```javascript
const fs = require('fs');
const vault = JSON.parse(fs.readFileSync('secrets.json', 'utf-8'));
const apiKey = vault.OPENROUTER_API_KEY;
```

---

## Rotation

**To rotate a key:**
1. Update the value in `secrets.json`.
2. Restart any services using that key.
3. Delete old key from vault.

---

**Created:** 2026-02-09
