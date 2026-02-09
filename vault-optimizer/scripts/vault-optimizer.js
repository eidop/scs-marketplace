// Vault Optimizer Script – Performs token monitoring, cache cleanup, memory truncation, and histovault pruning
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Config – adjust as needed
const CONFIG = {
  cacheDir: path.join('C:', 'Users', 'Dennn', '.clawd', 'cache'),
  memoryDir: path.join('C:', 'Users', 'Dennn', '.openclaw', 'workspace12345', 'memory'),
  histovaultIndex: path.join('C:', 'Users', 'Dennn', '.clawd', 'histovault-index.json'),
  tokenWarning: 0.80,
  tokenCritical: 0.92,
  memoryKeepLines: 50,
  memoryAggressiveLines: 20,
  cacheMaxAgeMs: 3600000 // 1 hour
};

function tokenStatus() {
  try {
    const out = execSync('openclaw sessions list --json', { encoding: 'utf8', cwd: path.join('C:', 'Users', 'Dennn', '.openclaw') });
    const data = JSON.parse(out);
    if (data.sessions && data.sessions.length > 0) {
      const s = data.sessions[0];
      const used = s.totalTokens || 0;
      const limit = s.contextTokens || 205000;
      const percent = Math.round((used / limit) * 100);
      return { used, limit, percent };
    }
  } catch (_) {}
  return null;
}

function reportToken(status) {
  if (!status) return '⚠️ Unable to retrieve token usage.';
  const { used, limit, percent } = status;
  const remaining = limit - used;
  const sessions = Math.round(remaining / 350);
  let msg = `📊 Token usage: ${percent}% (${used}/${limit}) – ~${sessions} sessions remaining.`;
  if (percent >= CONFIG.tokenCritical * 100) msg += '\n⚠️ CRITICAL – aggressive cleanup recommended.';
  else if (percent >= CONFIG.tokenWarning * 100) msg += '\n⚡ High – normal cleanup recommended.';
  return msg;
}

function cleanCache() {
  const file = path.join(CONFIG.cacheDir, 'context-cache.json');
  if (!fs.existsSync(file)) return { cleaned: 0 };
  const cache = JSON.parse(fs.readFileSync(file, 'utf8'));
  const now = Date.now();
  const entries = cache.entries || {};
  const kept = {};
  let removed = 0;
  for (const [k, v] of Object.entries(entries)) {
    if (v.timestamp && now - v.timestamp < CONFIG.cacheMaxAgeMs) kept[k] = v; else removed++;
  }
  cache.entries = kept;
  fs.writeFileSync(file, JSON.stringify(cache, null, 2));
  return { cleaned: removed };
}

function truncateMemory(mode = 'normal') {
  const keep = mode === 'aggressive' ? CONFIG.memoryAggressiveLines : CONFIG.memoryKeepLines;
  const today = new Date().toISOString().split('T')[0];
  const memFile = path.join(CONFIG.memoryDir, `${today}.md`);
  if (!fs.existsSync(memFile)) return { truncated: 0 };
  const content = fs.readFileSync(memFile, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length <= keep) return { truncated: 0 };
  const truncated = lines.slice(-keep).join('\n\n---\n\n');
  fs.writeFileSync(memFile, truncated);
  return { truncated: lines.length - keep };
}

function pruneHistovault() {
  try {
    const hv = require(path.join(CONFIG.cacheDir, '..', 'histovault.js'));
    if (typeof hv.prune === 'function') {
      const result = hv.prune();
      return { pruned: result.removed || 0 };
    }
  } catch (_) {}
  return { pruned: 0 };
}

function run(mode = 'normal') {
  const status = tokenStatus();
  console.log(reportToken(status));
  console.log('---');
  const cache = cleanCache();
  console.log(`🗑️ Cache cleaned: ${cache.cleaned} entries removed`);
  const mem = truncateMemory(mode);
  console.log(`📄 Memory truncation (${mode}): ${mem.truncated} lines removed`);
  const hv = pruneHistovault();
  console.log(`📦 HistoVault prune: ${hv.pruned} entries removed`);
  console.log('✅ Vault optimization complete');
}

// CLI handling
const mode = process.argv[2] === 'aggressive' ? 'aggressive' : 'normal';
run(mode);
