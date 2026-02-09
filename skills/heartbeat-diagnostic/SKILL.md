---
name: heartbeat-diagnostic
description: Performs automated system diagnostics including vault, HistoVault, secrets.json, .gitignore, Ollama models, and Git deployment status. Use to proactively monitor system health and detect issues.
---

# Heartbeat Diagnostic Skill

This skill provides automated diagnostics for your OpenClaw environment.

## Usage

To run a manual heartbeat check, execute the bundled script:

```bash
node scripts/heartbeat-cmd-center.js
```

This script will perform the following checks and report any issues:
- Token Usage (monitored by cron)
- Vault Maintenance (status, HistoVault activity, secrets.json integrity, .gitignore exclusion)
- Ollama & Models (installed models status)
- Deployment (git status, uncommitted changes, remote sync)

If no issues are detected, it will output `HEARTBEAT_OK`.
If issues are found, a concise alert will be provided.

## Automation

This skill is designed to be run via a cron job for continuous, automated monitoring. Refer to your cron job configuration for scheduled execution.
