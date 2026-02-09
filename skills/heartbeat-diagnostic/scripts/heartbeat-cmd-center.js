
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runCommand(cmd, cwd = process.cwd()) {
    return new Promise((resolve) => {
        exec(cmd, { cwd }, (error, stdout, stderr) => {
            resolve({ error, stdout, stderr });
        });
    });
}

async function checkHeartbeat() {
    let summary = [];
    let issuesFound = false;
    const workspaceDir = process.cwd();

    // --- Gateway Health Check & Auto-Restart ---
    try {
        const gatewayStatus = await runCommand('openclaw gateway status');
        if (gatewayStatus.error || !gatewayStatus.stdout.includes('status: ok')) {
            summary.push(`Gateway: Down or Unresponsive. Initiating restart...`);
            issuesFound = true;
            // Attempt to restart the gateway directly
            const restartResult = await runCommand('openclaw gateway restart');
            if (restartResult.error) {
                summary.push(`  Restart Failed: ${restartResult.stderr.trim()}`);
            } else {
                summary.push(`  Restart Initiated: ${restartResult.stdout.trim()}`);
            }
        } else {
            // console.log("Gateway: OK"); // Don't clutter if OK
        }
    } catch (e) {
        summary.push(`Error checking OpenClaw Gateway status: ${e.message}`);
        issuesFound = true;
    }

    // Vault Maintenance
    const vaultOptimizerStatus = await runCommand('node C:/Users/Dennn/.clawd/vault-optimizer.js status');
    if (vaultOptimizerStatus.error) {
        summary.push(`Vault Optimizer Error: ${vaultOptimizerStatus.stderr.trim()}`);
        issuesFound = true;
    } else if (!vaultOptimizerStatus.stdout.includes('Healthy')) { // Assuming status output contains "Healthy"
        summary.push(`Vault Optimizer: ${vaultOptimizerStatus.stdout.trim().split('\n')[0]} - Review recommended.`);
        issuesFound = true;
    }

    const histovaultRecent = await runCommand('node C:/Users/Dennn/.clawd/histovault.js recent 1');
    if (histovaultRecent.error) {
        summary.push(`HistoVault Recent Error: ${histovaultRecent.stderr.trim()}`);
        issuesFound = true;
    } else if (histovaultRecent.stdout.includes('removed":0')) { 
        // No issue if 0 removed
    } else {
        summary.push('HistoVault: Entries pruned. Review recent entries if needed.');
    }

    const secretsJsonPath = path.join(workspaceDir, 'secrets.json');
    if (!fs.existsSync(secretsJsonPath)) {
        summary.push('Security: secrets.json is missing or inaccessible!');
        issuesFound = true;
    } else {
        const secretsContent = fs.readFileSync(secretsJsonPath, 'utf8');
        try {
            const secrets = JSON.parse(secretsContent);
            if (Object.keys(secrets).length === 0) {
                summary.push('Security: secrets.json is empty.');
                issuesFound = true;
            }
        } catch (e) {
            summary.push('Security: secrets.json is malformed JSON!');
            issuesFound = true;
        }
    }

    const gitignorePath = path.join(workspaceDir, '.gitignore');
    if (!fs.existsSync(gitignorePath) || !fs.readFileSync(gitignorePath, 'utf8').includes('secrets.json')) {
        summary.push('Security: .gitignore does NOT exclude secrets.json or is missing!');
        issuesFound = true;
    }

    // Ollama & Models
    const ollamaList = await runCommand('ollama list');
    if (ollamaList.error) {
        summary.push(`Ollama List Error: ${ollamaList.stderr.trim()}`);
        issuesFound = true;
    } else if (!ollamaList.stdout.includes('NAME')) { 
        summary.push('Ollama: No models listed or Ollama not running.');
        issuesFound = true;
    }

    // Deployment
    const gitStatusPorcelain = await runCommand('git status --porcelain');
    if (gitStatusPorcelain.error) {
        summary.push(`Git Status Error (Porcelain): ${gitStatusPorcelain.stderr.trim()}`);
        issuesFound = true;
    } else if (gitStatusPorcelain.stdout.trim() !== '') {
        summary.push('Deployment: Uncommitted changes detected! Staging or committing recommended.');
        issuesFound = true;
    } else {
         const gitRemoteStatus = await runCommand('git status -uno');
         if (gitRemoteStatus.error) {
             summary.push(`Git Remote Status Error: ${gitRemoteStatus.stderr.trim()}`);
             issuesFound = true;
         } else if (gitRemoteStatus.stdout.includes('Your branch is ahead of')) {
             summary.push('Deployment: Local branch is ahead of remote. Push required!');
             issuesFound = true;
         }
    }

    if (issuesFound) {
        console.log('Heartbeat Alert: Issues Detected!');
        console.log(summary.join('\n'));
    } else {
        console.log('HEARTBEAT_OK');
    }
}

checkHeartbeat();
