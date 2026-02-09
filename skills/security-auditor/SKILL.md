---
name: security-auditor
description: Audits OpenClaw Gateway's security posture. Use to identify vulnerabilities, assess token strength, review channel allowlists, and suggest best practices for securing the Gateway, its connections, and overall system integrity.
---

# Security Auditor Skill

This skill provides comprehensive capabilities for assessing and improving the security of your OpenClaw Gateway.

## Core Functionality

- **Configuration Vulnerability Scan:** Analyze `~/.openclaw/openclaw.json` for security misconfigurations (e.g., overly broad `allowFrom` rules, weak Gateway tokens).
- **Token Strength Assessment:** Evaluate the strength and rotation status of critical API and Gateway tokens.
- **Channel Access Review:** Audit `allowFrom` and group mention rules for all configured channels to prevent unauthorized access.
- **Session Integrity Check:** Monitor active sessions for unusual patterns or unauthorized device connections.
- **Security Best Practice Recommendations:** Provide actionable advice for hardening your OpenClaw deployment.

## Usage Examples

- "Perform a full security audit of my OpenClaw Gateway."
- "Check if my WhatsApp channel's `allowFrom` list is configured securely."
- "Assess the strength of my `OPENCLAW_GATEWAY_TOKEN`."
- "Suggest steps to harden my remote access to the Gateway."

## Resources

- `scripts/`: Placeholder for scripts to perform configuration analysis, token checks, and session monitoring.
- `references/`: Placeholder for OpenClaw security documentation, common vulnerability checklists, and hardening guides.
