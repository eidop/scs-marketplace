#!/usr/bin/env node
/**
 * Git Push & Deploy Script
 * Pushes to GitHub which triggers Cloudflare auto-deploy
 */

const { execSync } = require('child_process');

async function deploy() {
    console.log('🚀 Pushing to GitHub (triggers auto-deploy)...');
    
    try {
        execSync('git add -A', { cwd: 'C:/Users/Dennn/.openclaw/workspace/apps/template-marketplace' });
        execSync('git commit -m "Auto-deploy update"', { cwd: 'C:/Users/Dennn/.openclaw/workspace/apps/template-marketplace' });
        execSync('git push origin master', { cwd: 'C:/Users/Dennn/.openclaw/workspace/apps/template-marketplace' });
        console.log('✅ Pushed to GitHub!');
        console.log('🌐 Cloudflare will auto-deploy shortly...');
    } catch (err) {
        console.log('Error:', err.message);
    }
}

deploy();
