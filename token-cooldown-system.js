/**
 * Advanced Token Cooldown System
 * Cools down token usage to 10% when reaching 80-90% threshold
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class TokenCooldownSystem {
  constructor(thresholdLow = 80, thresholdHigh = 90, cooldownTarget = 10) {
    this.thresholdLow = thresholdLow;  // Start warning at this %
    this.thresholdHigh = thresholdHigh;  // Force action at this %
    this.cooldownTarget = cooldownTarget;  // Target % to cool down to
    this.lastActionTime = 0;
    this.actionCooldownMs = 300000; // 5 minutes between actions
  }

  getSessionStatus() {
    try {
      const output = execSync('openclaw sessions list', { encoding: 'utf8' });
      const lines = output.split('\n');
      
      // Look for the session line that contains token information
      for (const line of lines) {
        // Match pattern like: "22k/200k (11%)"
        const tokenMatch = line.match(/(\d+k?)\/(\d+k?)\s*\((\d+)%\)/);
        if (tokenMatch) {
          const used = this.parseTokenValue(tokenMatch[1]);
          const total = this.parseTokenValue(tokenMatch[2]);
          const percent = parseInt(tokenMatch[3]);
          
          return {
            used,
            total,
            percent,
            rawOutput: output
          };
        }
      }
      
      // Fallback: try to find percentage anywhere in output
      const percentMatch = output.match(/(\d+)%/);
      if (percentMatch) {
        return {
          used: null,
          total: null,
          percent: parseInt(percentMatch[1]),
          rawOutput: output
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting session status:', error);
      return null;
    }
  }

  parseTokenValue(value) {
    if (typeof value === 'number') return value;
    if (value.endsWith('k')) {
      return parseInt(value.slice(0, -1)) * 1000;
    }
    return parseInt(value);
  }

  async performCooldown() {
    console.log(`[TokenCooldown] Initiating cooldown to target ${this.cooldownTarget}%...`);

    // Check if enough time has passed since last action
    const now = Date.now();
    if (now - this.lastActionTime < this.actionCooldownMs) {
      console.log('[TokenCooldown] Action cooldown in effect, skipping...');
      return false;
    }

    try {
      // Method 1: Try to compact the session first (most efficient)
      console.log('[TokenCooldown] Attempting session compaction...');
      execSync('openclaw session compact', { stdio: 'pipe' });
      
      // Wait a moment for compaction to take effect
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check status after compaction
      const statusAfter = this.getSessionStatus();
      if (statusAfter && statusAfter.percent <= this.cooldownTarget) {
        console.log(`[TokenCooldown] Success! Cooldown achieved: ${statusAfter.percent}%`);
        this.lastActionTime = Date.now();
        return true;
      }

      // Method 2: Clear context cache if still above target
      console.log('[TokenCooldown] Clearing context cache...');
      const cacheDir = path.join(process.env.USERPROFILE, '.clawd', 'cache');
      const cacheFile = path.join(cacheDir, 'context-cache.json');
      
      if (fs.existsSync(cacheFile)) {
        fs.writeFileSync(cacheFile, JSON.stringify({ entries: {}, stats: { hits: 0, misses: 0 } }));
        console.log('[TokenCooldown] Context cache cleared');
        
        // Wait and check again
        await new Promise(resolve => setTimeout(resolve, 2000));
        const statusAfterCache = this.getSessionStatus();
        if (statusAfterCache && statusAfterCache.percent <= this.cooldownTarget) {
          console.log(`[TokenCooldown] Success after cache clear: ${statusAfterCache.percent}%`);
          this.lastActionTime = Date.now();
          return true;
        }
      }

      // Method 3: Truncate memory files if still above target
      console.log('[TokenCooldown] Truncating memory files...');
      const today = new Date().toISOString().split('T')[0];
      const memoryFile = path.join(process.env.USERPROFILE, '.openclaw', 'workspace12345', 'memory', `${today}.md`);
      
      if (fs.existsSync(memoryFile)) {
        const content = fs.readFileSync(memoryFile, 'utf8');
        const lines = content.split('\n').filter(l => l.trim());
        // Keep only the last 20 lines to reduce token usage
        const keepLines = 20;
        if (lines.length > keepLines) {
          const truncated = lines.slice(-keepLines).join('\n') + '\n\n--- TRUNCATED ---\n';
          fs.writeFileSync(memoryFile, truncated);
          console.log(`[TokenCooldown] Memory file truncated from ${lines.length} to ${keepLines} lines`);
        }
      }

      // Final check
      await new Promise(resolve => setTimeout(resolve, 3000));
      const finalStatus = this.getSessionStatus();
      if (finalStatus) {
        console.log(`[TokenCooldown] Final status: ${finalStatus.percent}%`);
        if (finalStatus.percent <= this.thresholdLow) {
          console.log('[TokenCooldown] Success! Target achieved.');
          this.lastActionTime = Date.now();
          return true;
        } else {
          console.log(`[TokenCooldown] Still above target: ${finalStatus.percent}%`);
        }
      }

      this.lastActionTime = Date.now();
      return false;
    } catch (error) {
      console.error('[TokenCooldown] Error during cooldown process:', error);
      this.lastActionTime = Date.now();
      return false;
    }
  }

  async checkAndAct() {
    const status = this.getSessionStatus();
    
    if (!status) {
      console.error('[TokenCooldown] Could not get session status');
      return false;
    }

    console.log(`[TokenCooldown] Current token usage: ${status.percent}%`);

    if (status.percent >= this.thresholdHigh) {
      console.log(`[TokenCooldown] ⚠️ High usage detected: ${status.percent}% (>${this.thresholdHigh}%)`);
      return await this.performCooldown();
    } else if (status.percent >= this.thresholdLow) {
      console.log(`[TokenCooldown] ⚠️ Approaching high usage: ${status.percent}% (>${this.thresholdLow}%)`);
      // Don't perform cooldown yet, but log the warning
      return false;
    } else {
      console.log(`[TokenCooldown] ✅ Healthy usage: ${status.percent}% (<${this.thresholdLow}%)`);
      return false;
    }
  }

  // Method to simulate agent switching by using different models with lower usage
  async switchAgentIfNeeded() {
    console.log('[TokenCooldown] Checking for available alternative agents...');
    
    // In a real implementation, this would check for other available models/endpoints
    // For now, we'll just log what would happen
    
    const status = this.getSessionStatus();
    if (!status) return false;
    
    if (status.percent >= this.thresholdHigh) {
      console.log('[TokenCooldown] Would switch to lower-cost model if available...');
      // This would integrate with the Jim-ModelRouter to switch to cheaper models
      return true;
    }
    
    return false;
  }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];
const system = new TokenCooldownSystem();

if (command === 'status') {
  const status = system.getSessionStatus();
  if (status) {
    console.log(JSON.stringify(status, null, 2));
  } else {
    console.log('Could not retrieve session status');
  }
} else if (command === 'cooldown') {
  system.performCooldown()
    .then(success => console.log(`Cooldown ${success ? 'successful' : 'failed'}`))
    .catch(err => console.error('Cooldown error:', err));
} else if (command === 'check') {
  system.checkAndAct()
    .then(needsAction => console.log(`Check complete, action needed: ${needsAction}`))
    .catch(err => console.error('Check error:', err));
} else if (command === 'switch') {
  system.switchAgentIfNeeded()
    .then(switched => console.log(`Switch attempt: ${switched}`))
    .catch(err => console.error('Switch error:', err));
} else {
  console.log('Token Cooldown System');
  console.log('');
  console.log('Commands:');
  console.log('  node token-cooldown-system.js status   - Get current token status');
  console.log('  node token-cooldown-system.js check    - Check and perform cooldown if needed');
  console.log('  node token-cooldown-system.js cooldown - Force cooldown action');
  console.log('  node token-cooldown-system.js switch   - Attempt agent/model switch');
  console.log('');
  console.log(`Configuration: ${system.thresholdLow}%-${system.thresholdHigh}% -> ${system.cooldownTarget}% target`);
}

module.exports = TokenCooldownSystem;