# Simply Complex Solutions Marketplace

B2B automation templates marketplace.

🌐 **Live Site:** https://scs-marketplace.pages.dev/

---

## Quick Deploy

```powershell
node scripts/deploy.js --message "Your update message"
```

The watcher will commit, push, and GitHub Actions will deploy to Cloudflare Pages.

---

## Auto-Mode Setup

### GitHub Actions Required Secrets:

| Secret | Value |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages write access |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |

### Windows Auto-Deploy Watcher

```powershell
Start-Process -WindowStyle Hidden powershell.exe -ArgumentList "-File", "C:\Path\To\auto-deploy-watcher.ps1"
```

### Google Drive Uploader

```powershell
# 1. Create credentials.json at Google Cloud Console
# 2. Enable Google Drive API
# 3. Run:
node drive-upload.js
```

---

## Troubleshooting

### GitHub Actions failing?
- Verify `CLOUDFLARE_API_TOKEN` has Pages permissions
- Check Actions tab for error logs

---

## Security

- **Never commit** `credentials.json` or `drive-token.json`
