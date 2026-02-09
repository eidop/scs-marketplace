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

---

**Last updated:** 2026-02-09
