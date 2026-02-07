# Deploy-SCSMarketplace.ps1
# Deploy SCS Marketplace to Cloudflare Pages

Write-Host "🚀 SCS Marketplace Deployment Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Check for API token
$token = $env:CLOUDFLARE_API_TOKEN
if (-not $token) {
    Write-Host "`n❌ CLOUDFLARE_API_TOKEN not found!" -ForegroundColor Red
    Write-Host "`nTo deploy, you need a Cloudflare API token:"
    Write-Host "1. Go to: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/"
    Write-Host "2. Create a token with 'Pages:Edit' and 'Pages:Read' permissions"
    Write-Host "3. Set it with: `$env:CLOUDFLARE_API_TOKEN = 'your-token'"
    Write-Host "`nOr deploy manually via Dashboard:"
    Write-Host "1. Go to: https://dash.cloudflare.com → Workers & Pages → Create → Pages"
    Write-Host "2. Upload the 'dist' folder"
    Write-Host "3. Project name: scs-marketplace"
    exit 1
}

Write-Host "`n✅ Cloudflare API token found" -ForegroundColor Green

# Change to project directory
$projectDir = "C:\Users\Dennn\.openclaw\workspace\apps\template-marketplace"
Set-Location $projectDir

# Build dist folder
Write-Host "`n📦 Building dist folder..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path "dist"

# Copy files
Write-Host "📁 Copying files..." -ForegroundColor Yellow
Copy-Item "index.html" "dist\"
Copy-Item "_headers" "dist\"
Copy-Item -Recurse "assets" "dist\"

Write-Host "✅ Build complete" -ForegroundColor Green

# Deploy
Write-Host "`n🚀 Deploying to Cloudflare Pages..." -ForegroundColor Yellow
$env:CLOUDFLARE_API_TOKEN = $token
npx wrangler pages deploy "dist" --project-name=scs-marketplace

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    Write-Host "`nYour site will be live at: https://scs-marketplace.pages.dev" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Deployment failed" -ForegroundColor Red
    Write-Host "Check the error above or try manual deployment via Dashboard"
}
