---
name: vault-optimizer
description: Improve the vault system and reduce token usage by automating cleanup, cache management, token monitoring, and providing schedule options. Trigger when the user requests vault improvements, token usage reduction, or wants automated cleanup.
---

# Vault Optimizer Skill

## Overview
This skill provides a lightweight, token‑efficient system to monitor OpenClaw token usage, prune caches, truncate daily memory files, and optionally schedule periodic clean‑ups. It includes a ready‑to‑run script (`scripts/vault-optimizer.js`) and reference documentation for thresholds and scheduling.

## When to Use
- User asks to **improve the vault system** or **reduce token usage**.
- Need to **perform a one‑off cleanup** (cache, memory, histovault).
- Want to **schedule automatic maintenance** via OpenClaw cron jobs.

## How It Works
1. **Token Monitor** – Uses `openclaw sessions list --json` to calculate current token percentage.
2. **Cache Cleanup** – Clears expired entries in `context‑cache.json`.
3. **Memory Truncation** – Keeps only the most recent N lines of today’s memory file (configurable).
4. **HistoVault Prune** – Calls the built‑in histovault prune routine (if present).
5. **Reporting** – Outputs a concise status report and recommendations.

## Running the Optimizer
```bash
# One‑off run (default normal mode)
node scripts/vault-optimizer.js health

# Aggressive cleanup (forces more aggressive memory truncation)
node scripts/vault-optimizer.js health aggressive
```

## Scheduling Automatic Clean‑ups
Create a cron job that runs the optimizer every 6 hours (example):
```json
{
  "name": "vault‑cleanup",
  "schedule": { "kind": "cron", "expr": "0 */6 * * *", "tz": "Europe/Oslo" },
  "payload": { "kind": "systemEvent", "text": "run-vault-cleanup" },
  "sessionTarget": "main",
  "enabled": true
}
```
Then add the job via:
```bash
openclaw cron add --job-file path/to/job.json
```
The `run-vault-cleanup` system event can be handled by a lightweight background agent that simply runs:
```bash
node scripts/vault-optimizer.js health
```

## Customisation
- **Thresholds** – Edit `references/token‑thresholds.md` to adjust warning/critical percentages.
- **Memory Retention** – Change `memoryKeepLines` and `memoryAggressiveLines` in the script if you want to keep more or fewer lines.
- **Cache Limits** – Modify `cacheMaxEntries` and `cacheMaxAgeMs` for stricter cache pruning.

## References
- `references/token-thresholds.md` – Details on token usage thresholds and recommendations.
- `references/scheduling.md` – Guidance on creating OpenClaw cron jobs for periodic vault maintenance.

## Quick Checklist
- [ ] Verify `openclaw` CLI is in PATH.
- [ ] Run a test: `node scripts/vault-optimizer.js health`.
- [ ] (Optional) Add a cron job for automated cleanup.
- [ ] Review the output and adjust thresholds if needed.

---
