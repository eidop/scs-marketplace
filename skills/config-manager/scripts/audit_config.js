
const fs = require('fs');
const path = require('path');

async function auditConfig() {
    const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'openclaw.json');
    let report = [];
    let issuesFound = false;

    if (!fs.existsSync(configPath)) {
        report.push("Issue: OpenClaw configuration file (`openclaw.json`) not found at `" + configPath + "`.");
        report.push("Recommendation: Run `openclaw onboard` to create a default configuration.");
        issuesFound = true;
        return { report: report.join('\n'), issuesFound };
    }

    const configContent = fs.readFileSync(configPath, 'utf8');
    let config;
    try {
        config = JSON.parse(configContent); // Using JSON.parse for simplicity, consider json5 if comments are expected
    } catch (e) {
        report.push("Issue: OpenClaw configuration file (`openclaw.json`) is malformed JSON.");
        report.push("Recommendation: Validate `" + configPath + "` for syntax errors. Error: " + e.message);
        issuesFound = true;
        return { report: report.join('\n'), issuesFound };
    }

    // --- Security Checks ---

    // 1. Gateway Token Strength
    // Note: OPENCLAW_GATEWAY_TOKEN is usually an environment variable or CLI arg, not in openclaw.json
    // For this audit, we'll check if a placeholder is set, or if an external token check is needed.
    // A proper audit would involve external validation.
    const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN || (config.gateway && config.gateway.auth && config.gateway.auth.token);
    const minTokenLength = 32; // Standard minimum length for strong tokens
    const commonWeakTokens = ['YOUR_TOKEN_HERE', 'secret', 'password', '123456', 'token', 'default']; // Common placeholders

    if (!gatewayToken) {
        report.push("Security Concern: OPENCLAW_GATEWAY_TOKEN is not explicitly set (neither via environment nor config).");
        report.push("Recommendation: Set a strong, unique `OPENCLAW_GATEWAY_TOKEN` via environment variable or in `openclaw.json` for all non-local connections.");
        issuesFound = true;
    } else {
        if (gatewayToken.length < minTokenLength) {
            report.push(`Security Concern: OPENCLAW_GATEWAY_TOKEN is too short (${gatewayToken.length} characters).`);
            report.push(`Recommendation: Use a token of at least ${minTokenLength} characters for robust security.`);
            issuesFound = true;
        }
        if (commonWeakTokens.includes(gatewayToken.toLowerCase())) {
            report.push("Security Alert: OPENCLAW_GATEWAY_TOKEN appears to be a common or weak placeholder.");
            report.push("Recommendation: Generate a strong, random token to prevent unauthorized access.");
            issuesFound = true;
        }
    }

    // 2. Channel AllowFrom rules
    if (config.channels) {
        for (const channelName in config.channels) {
            const channelConfig = config.channels[channelName];
            if (channelConfig.allowFrom && channelConfig.allowFrom.includes("*")) {
                report.push(`Security Alert: Channel '${channelName}' has an overly permissive 'allowFrom: ["*"]' rule.`);
                report.push(`Recommendation: Restrict 'allowFrom' to specific user IDs for enhanced security.`);
                issuesFound = true;
            }
        }
    }

    // 3. Group Chat Mention Patterns
    if (config.messages && config.messages.groupChat && (!config.messages.groupChat.mentionPatterns || config.messages.groupChat.mentionPatterns.length === 0)) {
        report.push("Security Concern: `messages.groupChat.mentionPatterns` is not defined or empty.");
        report.push("Recommendation: Define specific mention patterns (e.g., '@openclaw') for group chats to prevent unintended agent responses.");
        issuesFound = true;
    }

    // --- Performance/Functionality Checks (Examples) ---

    // 4. Web Control UI Access (if exposed remotely)
    if (config.gateway && config.gateway.web && config.gateway.web.controlUi && config.gateway.web.controlUi.enabled) {
        // This is a complex check, as 'remote' depends on network config.
        // A simple heuristic: if token is weak/missing and UI is enabled, it's a risk.
        if (!process.env.OPENCLAW_GATEWAY_TOKEN && (!config.gateway || !config.gateway.token)) {
             report.push("Security Concern: Web Control UI is enabled, but no strong Gateway Token is set.");
             report.push("Recommendation: Ensure `OPENCLAW_GATEWAY_TOKEN` is strong if Web Control UI is exposed, especially for remote access.");
             issuesFound = true;
        }
    }

    // --- Final Report ---
    if (issuesFound) {
        console.log("Configuration Audit Report: Issues Detected!");
        console.log(report.join('\n'));
    } else {
        console.log("Configuration Audit Report: No critical issues detected. System appears optimized.");
    }
}

auditConfig();
