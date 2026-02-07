$content = Get-Content 'C:\Users\Dennn\.openclaw\workspace\apps\template-marketplace\dist\index.html'
$content = $content -replace 'simplyx.gumroad.com/l/cold-outreach', 'simplyx.gumroad.com/l/cold-outreach-engine'
$content = $content -replace 'simplyx.gumroad.com/l/lead-generation-engine', 'simplyx.gumroad.com/l/lead-generation-engine'
Set-Content -Path 'C:\Users\Dennn\.openclaw\workspace\apps\template-marketplace\dist\index.html' -Value $content
Write-Host "Links updated!"
