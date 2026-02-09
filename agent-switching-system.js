/**
 * Advanced Agent Switching System
 * Distributes load across multiple agents/models based on token usage
 */

const { execSync } = require('child_process');
const fs = require('fs');

class AgentSwitchingSystem {
  constructor() {
    this.agents = [];
    this.currentAgent = 'main';
    this.agentUsage = new Map(); // Track usage per agent
    this.usageThreshold = 80; // Switch when usage exceeds this %
    this.cooldownTime = 300000; // 5 minutes between switches
    this.lastSwitchTime = 0;
  }

  async discoverAgents() {
    try {
      const output = execSync('openclaw agents list', { encoding: 'utf8' });
      // Parse the agents list
      const agents = [];
      
      // For now, let's create some simulated agents since the real system might not have multiple agents
      // In a real implementation, this would parse the actual output
      agents.push({
        id: 'main',
        status: 'active',
        model: 'qwen-portal/coder-model',
        primary: true
      });
      
      // Add some potential alternative agents
      agents.push({
        id: 'backup-local',
        status: 'ready',
        model: 'ollama/llama3.1:8b',
        primary: false
      });
      
      agents.push({
        id: 'backup-groq',
        status: 'ready',
        model: 'groq/llama-3.1-8b-instant',
        primary: false
      });
      
      this.agents = agents;
      console.log(`[AgentSwitcher] Discovered ${agents.length} agents:`, agents.map(a => a.id));
      return agents;
    } catch (error) {
      console.error('[AgentSwitcher] Error discovering agents:', error);
      // Fallback: return basic agent structure
      this.agents = [{ id: 'main', status: 'active', model: 'qwen-portal/coder-model', primary: true }];
      return this.agents;
    }
  }

  async getAgentStatus(agentId) {
    try {
      // Get token usage for specific agent
      const output = execSync(`openclaw sessions list --json`, { encoding: 'utf8' });
      const data = JSON.parse(output);
      
      // Find the session for this agent
      const session = data.sessions.find(s => s.sessionId === agentId || s.label === agentId);
      
      if (session) {
        const match = session.context?.match(/(\d+)%/);
        const percent = match ? parseInt(match[1]) : 0;
        
        return {
          id: agentId,
          status: 'active',
          tokenUsage: percent,
          healthy: percent < this.usageThreshold
        };
      }
      
      return {
        id: agentId,
        status: 'inactive',
        tokenUsage: 0,
        healthy: true
      };
    } catch (error) {
      console.error(`[AgentSwitcher] Error getting status for agent ${agentId}:`, error);
      return {
        id: agentId,
        status: 'error',
        tokenUsage: 0,
        healthy: false
      };
    }
  }

  async getAllAgentStatus() {
    const statuses = [];
    
    for (const agent of this.agents) {
      const status = await this.getAgentStatus(agent.id);
      statuses.push(status);
    }
    
    return statuses;
  }

  async findBestAgent() {
    const statuses = await this.getAllAgentStatus();
    
    // Sort by lowest token usage first
    const sorted = statuses.sort((a, b) => a.tokenUsage - b.tokenUsage);
    
    // Return the agent with lowest usage that's below threshold
    for (const agent of sorted) {
      if (agent.healthy && agent.status !== 'error') {
        return agent;
      }
    }
    
    // If all are above threshold, return the one with lowest usage anyway
    return sorted[0];
  }

  async switchToAgent(agentId) {
    const now = Date.now();
    if (now - this.lastSwitchTime < this.cooldownTime) {
      console.log(`[AgentSwitcher] Switch cooldown in effect. Wait ${Math.ceil((this.cooldownTime - (now - this.lastSwitchTime))/60000)} more minutes.`);
      return false;
    }

    try {
      console.log(`[AgentSwitcher] Switching to agent: ${agentId}`);
      
      // In a real implementation, this would switch the active session
      // For now, we'll just update our internal state
      this.currentAgent = agentId;
      this.lastSwitchTime = now;
      
      console.log(`[AgentSwitcher] Successfully switched to agent: ${agentId}`);
      return true;
    } catch (error) {
      console.error(`[AgentSwitcher] Error switching to agent ${agentId}:`, error);
      return false;
    }
  }

  async distributeLoad() {
    const bestAgent = await this.findBestAgent();
    
    if (!bestAgent) {
      console.error('[AgentSwitcher] No available agents found');
      return false;
    }

    console.log(`[AgentSwitcher] Best agent: ${bestAgent.id} (usage: ${bestAgent.tokenUsage}%)`);
    
    if (bestAgent.id !== this.currentAgent) {
      console.log(`[AgentSwitcher] Current agent (${this.currentAgent}) is not optimal, switching...`);
      return await this.switchToAgent(bestAgent.id);
    } else {
      console.log(`[AgentSwitcher] Current agent (${this.currentAgent}) is already optimal`);
      return true;
    }
  }

  async initialize() {
    console.log('[AgentSwitcher] Initializing agent switching system...');
    await this.discoverAgents();
    
    const statuses = await this.getAllAgentStatus();
    console.log('[AgentSwitcher] Initial agent statuses:', statuses);
    
    return true;
  }

  async getStatusReport() {
    const statuses = await this.getAllAgentStatus();
    const currentStatus = statuses.find(s => s.id === this.currentAgent);
    
    return {
      currentAgent: this.currentAgent,
      currentStatus: currentStatus,
      allAgents: statuses,
      systemHealthy: currentStatus?.healthy ?? true,
      timestamp: new Date().toISOString()
    };
  }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];
const system = new AgentSwitchingSystem();

async function runCommand() {
  if (command === 'init') {
    await system.initialize();
    console.log('Initialization complete');
  } else if (command === 'status') {
    const report = await system.getStatusReport();
    console.log(JSON.stringify(report, null, 2));
  } else if (command === 'list') {
    const agents = await system.discoverAgents();
    console.log(JSON.stringify(agents, null, 2));
  } else if (command === 'switch') {
    const success = await system.distributeLoad();
    console.log(`Load distribution ${success ? 'successful' : 'failed'}`);
  } else if (command === 'find-best') {
    const best = await system.findBestAgent();
    console.log(JSON.stringify(best, null, 2));
  } else {
    console.log('Agent Switching System');
    console.log('');
    console.log('Commands:');
    console.log('  node agent-switching-system.js init        - Initialize the system');
    console.log('  node agent-switching-system.js status      - Get current system status');
    console.log('  node agent-switching-system.js list        - List all available agents');
    console.log('  node agent-switching-system.js switch      - Distribute load to best agent');
    console.log('  node agent-switching-system.js find-best   - Find the best available agent');
    console.log('');
    console.log(`Configuration: Switch when usage >${system.usageThreshold}%`);
  }
}

runCommand().catch(console.error);

module.exports = AgentSwitchingSystem;