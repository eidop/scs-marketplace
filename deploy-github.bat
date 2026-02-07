@echo off
REM Quick Deploy Script for SCS Marketplace
REM Just run this to deploy the current site

echo.
echo 🚀 SCS Marketplace Quick Deploy
echo ================================
echo.

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
echo 🌐 To deploy:
echo    1. Go to: https://dash.cloudflare.com → Workers & Pages
echo    2. Click: Create → Pages → Connect to Git
echo    3. Select: eidop/scs-marketplace
echo    4. Set build output: dist
echo    5. Click: Save and Deploy
echo.
echo 📍 Or use GitHub Actions (auto-deploy on push)
echo    1. Add secrets: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
echo    2. Push to master to trigger auto-deploy
echo.
echo ✅ Ready to deploy!
echo.
pause
