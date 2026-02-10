$config = Get-Content 'C:\Users\Dennn\.openclaw\openclaw.json' | ConvertFrom-Json
$config.agents.defaults.model.primary = 'ollama/glm47-heretic-neo-q5'
$config | ConvertTo-Json -Depth 20 | Set-Content 'C:\Users\Dennn\.openclaw\openclaw.json'
Write-Output "Primary model updated to glm-heretic"
