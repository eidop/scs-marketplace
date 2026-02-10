# SCS Marketplace Auto Deploy Watcher v2
# Trigger: create DEPLOY.txt to start deployment.

$ErrorActionPreference = 'Stop'

$Repo = 'C:\Users\Dennn\scs-marketplace-repo'
$TriggerFile = Join-Path $Repo 'DEPLOY.txt'
$LogDir = Join-Path $Repo '.autodeploy'
$LogFile = Join-Path $LogDir 'autodeploy.log'

if (!(Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }

function Log($msg) {
  $ts = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
  Add-Content -Path $LogFile -Value "[$ts] $msg"
}

function RunGit($args) {
  $p = New-Object System.Diagnostics.ProcessStartInfo
  $p.FileName = 'git'
  $p.WorkingDirectory = $Repo
  $p.Arguments = ($args -join ' ')
  $p.RedirectStandardOutput = $true
  $p.RedirectStandardError = $true
  $p.UseShellExecute = $false
  $p.CreateNoWindow = $true

  $proc = New-Object System.Diagnostics.Process
  $proc.StartInfo = $p
  [void]$proc.Start()
  $proc.WaitForExit()
}

Log('Watcher v2 started')

while ($true) {
  try {
    if (Test-Path $TriggerFile) {
      Log('Deploy trigger detected')
      RunGit @('add', '-A')
      RunGit @('commit', '-m', "Auto deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')")
      RunGit @('push', 'origin', 'master')
      Log('Pushed to GitHub - Actions will deploy')
      Remove-Item -Force $TriggerFile
      Log('Trigger cleared')
    }
  }
  catch { Log("Error: $($_.Exception.Message)"); Start-Sleep -Seconds 5 }
  Start-Sleep -Seconds 2
}
