# Daily Checklist – Vault Maintenance (Automated)

## Automated Heartbeat Check
Run: `node skills/heartbeat-diagnostic/scripts/heartbeat-cmd-center.js`

This script will perform the following checks and report any issues:
- Token Usage (monitored by cron)
- Vault Maintenance (status, HistoVault activity, secrets.json integrity, .gitignore exclusion)
- Ollama & Models (installed models status)
- Deployment (git status, uncommitted changes, remote sync)

If no issues are detected, it will reply with `HEARTBEAT_OK`.
If issues are found, a concise alert will be provided.

## Known Issues (Resolved)

### Cloudflare Deploy Fail
- **Issue:** GitHub Actions fails to deploy to Cloudflare Pages
- **Cause:** Missing secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`)
- **Fix:** Add secrets at https://github.com/eidop/scs-marketplace/settings/secrets/actions
- **Status:** Fixed knowledge, not yet deployed

### Heartbeat Diagnostic False Positive
- **Issue:** Gateway status checked incorrectly
- **Fix:** Updated `skills/heartbeat-diagnostic/scripts/heartbeat-cmd-center.js`
- **Status:** Fixed

---

**Last updated:** 2026-02-10
