# Cloudflare Deploy Issues

## Problem
GitHub Actions workflow "Deploy to Cloudflare Pages" fails with deployment error.

## Root Cause
Missing secrets in GitHub repository:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Fix Steps
1. Go to GitHub repo: https://github.com/eidop/scs-marketplace/settings/secrets/actions
2. Add secrets:
   - `CLOUDFLARE_API_TOKEN`: Create in Cloudflare Dashboard → My Profile → Tokens
   - `CLOUDFLARE_ACCOUNT_ID`: Found in Cloudflare Dashboard → Account Settings

## Manual Deploy Alternative
Use Cloudflare Dashboard directly:
- Pages → scs-marketplace → Deploy manually

## Date
2026-02-10
