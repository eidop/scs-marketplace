/**
 * Eido Relationship Dashboard Tracker
 * Pushes real-time metrics to dashboard-state.json
 */
const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, 'dashboard-state.json');

const defaultState = {
  api: {
    tokens: 0,
    cost: 0,
    calls: 0,
    providers: {}
  },
  relationship: {
    messages: 0,
    startTime: Date.now(),
    lastContact: Date.now(),
    topics: [],
    projects: []
  },
  cooldowns: {
    'web_search': { lastRun: 0, duration: 30000 },
    'file_write': { lastRun: 0, duration: 5000 },
    'agent_spawn': { lastRun: 0, duration: 60000 }
  }
};

function getTracker() {
  if (!fs.existsSync(STATE_FILE)) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(defaultState, null, 2));
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
}

function updateTracker(fn) {
  const state = getTracker();
  fn(state);
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// Example usage: increment api calls
// updateTracker(s => { s.api.calls += 1; });

module.exports = { getTracker, updateTracker };
