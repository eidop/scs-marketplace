# Daily Checklist – Vault Maintenance

## Token Usage Monitor
- ADVANCED SYSTEM ACTIVE: Checks every 5 minutes via cron
- THRESHOLD: 70-80% → Cooldown to 10%
- ACTION: Automatic cooldown and agent switching when needed

## Manual Check
Run: `node C:/Users/Dennn/.clawd/auto-compact.js status`

## Vault Maintenance
- [ ] Check vault: `node C:/Users/Dennn/.clawd/vault-optimizer.js list`
- [ ] Check HistoVault: `node C:/Users/Dennn/.clawd/histovault.js list`
- [ ] Prune HistoVault: `node C:/Users/Dennn/.clawd/histovault.js prune`
- [ ] Review `secrets.json` for any missing keys
- [ ] Ensure `.gitignore` excludes `secrets.json`

## Ollama & Models
- [ ] Check installed models: `ollama list`
- [ ] Update models if needed: `ollama pull <model-name>`
- [ ] Fine-tune models (scheduled): `ollama fine-tune ...`

## Client Websites
- [ ] Review Discord `#client-websites` threads
- [ ] Approve builds before sending to clients
- [ ] Update templates if needed

## Deployment
- [ ] Check `git status`
- [ ] Commit changes: `git add . && git commit -m "message"`
- [ ] Push changes: `git push`

---

**Last updated:** 2026-02-09
