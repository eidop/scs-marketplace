
const fs = require('fs');
const path = require('path');

async function auditGatewaySecurity() {
    const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'openclaw.json');
    let report = [];
    let securityIssuesFound = false;

    if (!fs.existsSync(configPath)) {
        report.push("Critical: OpenClaw configuration file (`openclaw.json`) not found at `" + configPath + "`.");
        report.push("Recommendation: This prevents a security audit. Ensure configuration exists.");
        securityIssuesFound = true;
        return { report: report.join('\n'), securityIssuesFound };
    }

    const configContent = fs.readFileSync(configPath, 'utf8');
    let config;
    try {
        config = JSON.parse(configContent); // Using JSON.parse
    } catch (e) {
        report.push("Critical: OpenClaw configuration file (`openclaw.json`) is malformed JSON.");
        report.push("Recommendation: Correct syntax errors in `" + configPath + "`. Error: " + e.message);
        securityIssuesFound = true;
        return { report: report.join('\n'), securityIssuesFound };
    }

    report.push("--- OpenClaw Gateway Security Audit Report ---");

    // 1. Gateway Token Presence/Strength (Environment variable check is primary)
    const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN || (config.gateway && config.gateway.auth && config.gateway.auth.token);
    const minTokenLength = 32;
    const commonWeakTokens = ['YOUR_TOKEN_HERE', 'secret', 'password', '123456', 'token', 'default'];

    if (!gatewayToken) {
        report.push("  [HIGH] Missing Gateway Token: `OPENCLAW_GATEWAY_TOKEN` not set via environment or `openclaw.json`.");
        report.push("  Recommendation: Configure a strong, unique token. This is crucial for securing all Gateway interactions.");
        securityIssuesFound = true;
    } else {
        if (gatewayToken.length < minTokenLength) {
            report.push(`  [MEDIUM] Weak Gateway Token: Configured token appears too short (length: ${gatewayToken.length} characters).`);
            report.push(`  Recommendation: Use a token of at least ${minTokenLength} characters, combining letters, numbers, and symbols.`);
            securityIssuesFound = true;
        }
        if (commonWeakTokens.includes(gatewayToken.toLowerCase())) {
            report.push("  [HIGH] Compromised Token: Configured Gateway Token appears to be a common or weak placeholder.");
            report.push("  Recommendation: Immediately generate and use a strong, random token to prevent unauthorized access.");
            securityIssuesFound = true;
        }
    }

    // 2. Channel allowFrom Review
    if (config.channels) {
        for (const channelName in config.channels) {
            const channelConfig = config.channels[channelName];
            if (channelConfig.allowFrom && (channelConfig.allowFrom.includes("*") || channelConfig.allowFrom.length === 0)) {
                report.push(`  [HIGH] Permissive Channel Access: Channel '${channelName}' has 'allowFrom: ["*"]' or is empty, allowing all users.`);
                report.push(`  Recommendation: Restrict 'allowFrom' to an explicit list of authorized user IDs.`);
                securityIssuesFound = true;
            }
        }
    }

    // 3. Group Chat requireMention
    if (config.messages && config.messages.groupChat) {
        if (!config.messages.groupChat.requireMention) {
            report.push("  [MEDIUM] Group Chat Security: `messages.groupChat.requireMention` is not set to `true`.");
            report.push("  Recommendation: Set `requireMention: true` for group chats to prevent unintended public responses from the agent.");
            securityIssuesFound = true;
        }
    }

    // 4. Remote UI Exposure (if enabled, check for token protection)
    if (config.gateway && config.gateway.web && config.gateway.web.controlUi && config.gateway.web.controlUi.enabled) {
        if (!gatewayToken) { // Rely on previous token check
            report.push("  [HIGH] Exposed Control UI: Web Control UI is enabled without a Gateway Token. High risk for unauthorized access.");
            report.push("  Recommendation: Crucially, protect the Web Control UI with a strong `OPENCLAW_GATEWAY_TOKEN`.");
            securityIssuesFound = true;
        }
    }

    // --- Final Report ---
    if (securityIssuesFound) {
        console.log("Security Audit Report: Issues Detected!");
        console.log(report.join('\n'));
    } else {
        console.log("Security Audit Report: No critical vulnerabilities detected. System appears well-secured.");
    }
}

auditGatewaySecurity();
