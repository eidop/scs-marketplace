/**
 * Token Management Orchestration System
 * Combines token cooldown and agent switching for optimal performance
 */

const TokenCooldownSystem = require('./token-cooldown-system.js');
const AgentSwitchingSystem = require('./agent-switching-system.js');
const { execSync } = require('child_process');

class TokenManagementOrchestrator {
  constructor() {
    this.cooldownSystem = new TokenCooldownSystem(80, 90, 10); // 80-90% -> 10% target
    this.switchingSystem = new AgentSwitchingSystem();
    this.checkInterval = 300000; // 5 minutes
    this.isRunning = false;
  }

  async initialize() {
    console.log('[Orchestrator] Initializing token management systems...');
    
    // Initialize both subsystems
    await this.switchingSystem.initialize();
    
    console.log('[Orchestrator] Systems initialized successfully');
  }

  async performFullCheck() {
    console.log('[Orchestrator] Performing comprehensive token management check...');
    
    // First, get current status
    const status = this.cooldownSystem.getSessionStatus();
    if (!status) {
      console.error('[Orchestrator] Could not get session status');
      return false;
    }
    
    console.log(`[Orchestrator] Current usage: ${status.percent}%`);
    
    let actionTaken = false;
    
    // If usage is very high (>90%), prioritize cooldown
    if (status.percent >= 90) {
      console.log('[Orchestrator] Critical usage detected, performing cooldown...');
      const cooldownSuccess = await this.cooldownSystem.performCooldown();
      if (cooldownSuccess) {
        actionTaken = true;
      }
    } 
    // If usage is high (80-90%), consider both cooldown and switching
    else if (status.percent >= 80) {
      console.log('[Orchestrator] High usage detected, evaluating options...');
      
      // First try to find a better agent
      const shouldSwitch = await this.evaluateAgentSwitch();
      if (shouldSwitch) {
        console.log('[Orchestrator] Switching to better agent...');
        const switchSuccess = await this.switchingSystem.distributeLoad();
        if (switchSuccess) {
          actionTaken = true;
        }
      }
      
      // If no suitable agent found or switch failed, try cooldown
      if (!actionTaken) {
        console.log('[Orchestrator] No better agent available, attempting cooldown...');
        const cooldownSuccess = await this.cooldownSystem.performCooldown();
        if (cooldownSuccess) {
          actionTaken = true;
        }
      }
    }
    // If usage is moderate (approaching 80%), prepare for action
    else if (status.percent >= 70) {
      console.log('[Orchestrator] Moderate usage, preparing for potential action...');
      
      // Check if agents are available for switching
      const shouldSwitch = await this.evaluateAgentSwitch();
      if (shouldSwitch) {
        console.log('[Orchestrator] Preparing for agent switch...');
        const switchSuccess = await this.switchingSystem.distributeLoad();
        if (switchSuccess) {
          actionTaken = true;
        }
      }
    }
    
    // Update status after any actions
    const finalStatus = this.cooldownSystem.getSessionStatus();
    if (finalStatus) {
      console.log(`[Orchestrator] Final usage after actions: ${finalStatus.percent}%`);
    }
    
    return actionTaken;
  }

  async evaluateAgentSwitch() {
    try {
      // Get all agent statuses
      const allStatuses = await this.switchingSystem.getAllAgentStatus();
      
      // Find if there's an agent with significantly lower usage
      const currentAgentStatus = allStatuses.find(s => s.id === this.switchingSystem.currentAgent);
      const bestAlternative = allStatuses
        .filter(s => s.id !== this.switchingSystem.currentAgent && s.status !== 'error')
        .sort((a, b) => a.tokenUsage - b.tokenUsage)[0];
      
      if (currentAgentStatus && bestAlternative) {
        const usageDifference = currentAgentStatus.tokenUsage - bestAlternative.tokenUsage;
        
        // Switch if there's at least 15% difference or if current agent is above threshold
        if (usageDifference >= 15 || currentAgentStatus.tokenUsage >= 80) {
          console.log(`[Orchestrator] Recommended switch: ${currentAgentStatus.tokenUsage}% -> ${bestAlternative.tokenUsage}% (${usageDifference}% improvement)`);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('[Orchestrator] Error evaluating agent switch:', error);
      return false;
    }
  }

  async startMonitoring() {
    if (this.isRunning) {
      console.log('[Orchestrator] Monitoring already running');
      return;
    }
    
    console.log(`[Orchestrator] Starting monitoring (checking every ${this.checkInterval / 60000} minutes)...`);
    this.isRunning = true;
    
    // Perform initial check
    await this.performFullCheck();
    
    // Set up periodic checks
    this.monitorInterval = setInterval(async () => {
      try {
        await this.performFullCheck();
      } catch (error) {
        console.error('[Orchestrator] Error in monitoring cycle:', error);
      }
    }, this.checkInterval);
  }

  stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.isRunning = false;
      console.log('[Orchestrator] Monitoring stopped');
    }
  }

  async getStatus() {
    const status = this.cooldownSystem.getSessionStatus();
    const agentStatus = await this.switchingSystem.getStatusReport();
    
    return {
      tokenUsage: status,
      agentManagement: agentStatus,
      configuration: {
        cooldownThresholds: [80, 90],
        cooldownTarget: 10,
        checkInterval: this.checkInterval
      },
      timestamp: new Date().toISOString()
    };
  }

  // Emergency reset function to manually trigger both systems
  async emergencyReset() {
    console.log('[Orchestrator] Executing emergency reset...');
    
    // First try to switch to a better agent
    const switchSuccess = await this.switchingSystem.distributeLoad();
    
    // Then perform cooldown
    const cooldownSuccess = await this.cooldownSystem.performCooldown();
    
    // Get final status
    const finalStatus = await this.getStatus();
    
    return {
      switchAttempt: switchSuccess,
      cooldownAttempt: cooldownSuccess,
      finalStatus
    };
  }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];
const orchestrator = new TokenManagementOrchestrator();

async function runCommand() {
  if (command === 'init') {
    await orchestrator.initialize();
    console.log('Orchestrator initialized successfully');
  } else if (command === 'check') {
    const actionTaken = await orchestrator.performFullCheck();
    console.log(`Check complete, action taken: ${actionTaken}`);
  } else if (command === 'status') {
    const status = await orchestrator.getStatus();
    console.log(JSON.stringify(status, null, 2));
  } else if (command === 'start') {
    await orchestrator.initialize();
    await orchestrator.startMonitoring();
    console.log('Monitoring started. Press Ctrl+C to stop.');
    
    // Keep the process alive
    process.on('SIGINT', () => {
      console.log('\n[Orchestrator] Shutting down gracefully...');
      orchestrator.stopMonitoring();
      process.exit(0);
    });
  } else if (command === 'reset') {
    const result = await orchestrator.emergencyReset();
    console.log(JSON.stringify(result, null, 2));
  } else if (command === 'switch') {
    const shouldSwitch = await orchestrator.evaluateAgentSwitch();
    if (shouldSwitch) {
      const success = await orchestrator.switchingSystem.distributeLoad();
      console.log(`Agent switch ${success ? 'successful' : 'failed'}`);
    } else {
      console.log('No beneficial switch detected');
    }
  } else {
    console.log('Token Management Orchestrator');
    console.log('');
    console.log('Commands:');
    console.log('  node token-orchestrator.js init    - Initialize the system');
    console.log('  node token-orchestrator.js check   - Perform a single check and action');
    console.log('  node token-orchestrator.js status  - Get current system status');
    console.log('  node token-orchestrator.js start   - Start continuous monitoring');
    console.log('  node token-orchestrator.js reset   - Emergency reset (switch + cooldown)');
    console.log('  node token-orchestrator.js switch  - Evaluate and perform agent switch');
    console.log('');
    console.log('Configuration: Cooldown from 80-90% → 10% target, checks every 5 minutes');
  }
}

runCommand().catch(console.error);

module.exports = TokenManagementOrchestrator;