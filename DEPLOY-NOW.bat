@echo off
REM Quick Deploy Script for SCS Marketplace
REM Run this to deploy to Cloudflare Pages

echo.
echo 🚀 SCS Marketplace Deployment
echo ===============================
echo.

setlocal

REM Set your Cloudflare token
set CF_TOKEN=BamxamRplH_nRB_hGmOpH-Nr5UZdPdwEriYkgJys
set ACCOUNT_ID=e576148798d3edb601a8858facd86324

REM Check if dist exists
if not exist "dist" (
  echo 📦 Building dist folder...
  mkdir dist 2>nul
  copy index.html dist\ 2>nul
  copy _headers dist\ 2>nul
  xcopy /E /I assets dist\assets 2>nul
  echo ✅ Build complete!
)

echo.
echo 🌐 Deploying to Cloudflare Pages...
echo.

REM Check if wrangler is installed
where wrangler >nul 2>&1
if errorlevel 1 (
  echo ⚠️ Wrangler not installed. Installing...
  npm install -g wrangler
)

echo 📤 Uploading files...
npx wrangler pages deploy "dist" --project-name=scs-marketplace --token=%CF_TOKEN%

echo.
if errorlevel 0 (
  echo ✅ Deployment successful!
  echo 🌐 Your site: https://scs-marketplace.pages.dev
) else (
  echo ❌ Deployment failed
  echo.
  echo Alternative: Go to https://dash.cloudflare.com ^> Workers ^& Pages
  echo 1. Click "Create" ^> "Pages" ^> "Upload directly"
  echo 2. Drag the "dist" folder here
  echo 3. Project name: scs-marketplace
)

endlocal
pause
