$content = Get-Content 'C:\Users\Dennn\.openclaw\workspace\apps\template-marketplace\dist\index.html'

# Remove NOK references, show EUR only
$content = $content -replace '\(~NOK [0-9,]+\)', '(~EUR equivalent)'
$content = $content -replace 'NOK [0-9,]+', 'EUR equivalent'

# Replace $ with EUR
$content = $content -replace '\$([0-9,]+)', '€$1'

Set-Content -Path 'C:\Users\Dennn\.openclaw\workspace\apps\template-marketplace\dist\index.html' -Value $content
Write-Host "Currency updated to EUR!"
