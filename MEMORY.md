
## User Aliases
- "opt" = "optimize"

## Deployment Issues
- **Cloudflare Pages deploy fail** (2026-02-10):
  - Missing secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
  - Fix: Add secrets at https://github.com/eidop/scs-marketplace/settings/secrets/actions
  - Docs: `DEPLOY-TROUBLESHOOTING.md`

- **Heartbeat diagnostic false positive** (2026-02-10):
  - Fixed: Updated `skills/heartbeat-diagnostic/scripts/heartbeat-cmd-center.js`
  - Changed check from `status: ok` to `Listening:` + `RPC probe: ok`
