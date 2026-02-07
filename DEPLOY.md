# Deploy Script for SCS Marketplace

## Prerequisites

1. **Cloudflare Account** - You need a Cloudflare account
2. **API Token** - Get one at: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/

## Quick Deploy

### Option 1: Using Wrangler (Recommended)

```bash
# Set your API token
$env:CLOUDFLARE_API_TOKEN = "your-api-token-here"

# Deploy to Cloudflare Pages
cd C:\Users\Dennn\.openclaw\workspace\apps\template-marketplace
npm run deploy
```

### Option 2: Manual Upload via Dashboard

1. Go to: https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
   - Or: **Upload directly** → Drag the `dist` folder
3. Project name: `scs-marketplace`
4. Build output directory: `dist`
5. Click **Deploy**

## After Deployment

Your site will be available at:
- **Production:** https://scs-marketplace.pages.dev
- **Custom Domain:** Configure in Cloudflare Dashboard

## Files Included

| File | Purpose |
|------|---------|
| `index.html` | Main website |
| `assets/images/` | Hero & card backgrounds |
| `_headers` | Cloudflare caching & security headers |
| `wrangler.toml` | Cloudflare Pages configuration |

## Update Existing Deployment

```bash
# Make changes to index.html
# Rebuild dist folder:
xcopy /E /I "assets" "dist\assets"
copy index.html "dist\"

# Deploy again:
npm run deploy
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on pages | Check `_headers` file exists in `dist` |
| Images missing | Verify `assets` folder copied to `dist` |
| API error | Ensure CLOUDFLARE_API_TOKEN is set |
| Build fails | Run `npm install` first |

---

**Website Status:** ✅ Ready to Deploy
**Location:** `C:\Users\Dennn\.openclaw\workspace\apps\template-marketplace\`
**Build Output:** `dist\` folder ready
