$content = Get-Content 'C:\Users\Dennn\.openclaw\workspace\apps\template-marketplace\dist\index.html'
$content = $content -replace 'scs-marketplace.pages.dev', '44c57d79.scs-market-place.pages.dev'
Set-Content -Path 'C:\Users\Dennn\.openclaw\workspace\apps\template-marketplace\dist\index.html' -Value $content
Write-Host "Dashboard links updated!"
