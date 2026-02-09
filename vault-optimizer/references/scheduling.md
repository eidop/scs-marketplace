# Scheduling Vault Maintenance

OpenClaw cron jobs can automate vault clean‑ups. Use the following JSON template and adjust the schedule as needed:

```json
{
  "name": "vault‑cleanup",
  "schedule": { "kind": "cron", "expr": "0 */6 * * *", "tz": "Europe/Oslo" },
  "payload": { "kind": "systemEvent", "text": "run‑vault‑cleanup" },
  "sessionTarget": "main",
  "enabled": true
}
```

1. Save the JSON as `cron/vault-cleanup.json`.
2. Register the job:
   ```bash
   openclaw cron add --job-file cron/vault-cleanup.json
   ```
3. Ensure a lightweight background agent handles the `run‑vault‑cleanup` system event, e.g.:
   ```bash
   node vault-optimizer/scripts/vault-optimizer.js
   ```

You can change the `expr` field to any cron expression that fits your maintenance cadence.
