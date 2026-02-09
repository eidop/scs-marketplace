/**
 * Algebraic Token Optimizer
 * Math-based token consumption control system
 * 
 * Formulas:
 * - Burn Rate: BR(t) = (U(t) - U(t-Δt)) / Δt
 * - Exponential Decay: U(t+Δt) = U(t) * e^(-λ·Δt)
 * - PID Controller: Output = Kp·e + Ki·∫e·dt + Kd·de/dt
 * - Target Allocation: T_i = Total · (W_i / ΣW)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class AlgebraicTokenOptimizer {
    constructor(config = {}) {
        // Algebraic constants
        this.decayLambda = config.decayLambda || 0.15;       // λ - decay rate coefficient
        this.pidKp = config.pidKp || 0.8;                   // Kp - proportional gain
        this.pidKi = config.pidKi || 0.05;                  // Ki - integral gain  
        this.pidKd = config.pidKd || 0.15;                  // Kd - derivative gain
        
        // Thresholds (algebraic progression)
        this.criticalThreshold = config.criticalThreshold || 85;  // CRITICAL: PID activates
        this.warningThreshold = config.warningThreshold || 65;    // WARNING: tracking begins
        this.targetUsage = config.targetUsage || 25;               // TARGET: aim for 25%
        
        // Session weights (normalized to sum = 1)
        this.sessionWeights = {
            'agent:main:main': 0.35,
            'agent:main:discord:channel:1470...': 0.25,
            'agent:main:cron:90c6f85e-edd7-4...': 0.15,
            'default': 0.25
        };
        
        // State tracking
        this.history = [];          // Usage history for derivatives
        this.maxHistory = 20;       // Keep last 20 data points
        this.integralError = 0;      // ∫e·dt for PID
        this.lastError = 0;         // Previous error for derivative
        this.lastCheckTime = Date.now();
        
        // Burn rate tracking
        this.burnRateHistory = [];
        this.maxBurnHistory = 10;
    }

    /**
     * Calculate current error: E(t) = Current - Target
     */
    calculateError(currentPercent) {
        return currentPercent - this.targetUsage;
    }

    /**
     * PID Controller: Output = Kp·e + Ki·∫e·dt + Kd·de/dt
     */
    calculatePIDCorrection(currentPercent) {
        const error = this.calculateError(currentPercent);
        const now = Date.now();
        const dt = (now - this.lastCheckTime) / 1000; // seconds
        
        // Integral term: ∫e·dt (accumulated error)
        this.integralError += error * dt;
        
        // Derivative term: de/dt (rate of change)
        const derivativeError = (error - this.lastError) / dt;
        
        // PID output
        const pidOutput = (this.pidKp * error) + 
                          (this.pidKi * this.integralError) + 
                          (this.pidKd * derivativeError);
        
        this.lastError = error;
        this.lastCheckTime = now;
        
        return {
            error,
            integral: this.integralError,
            derivative: derivativeError,
            correction: pidOutput
        };
    }

    /**
     * Exponential Decay Model: U(t+Δt) = U(t) × e^(-λ·action)
     * 
     * @param {number} currentPercent - Current usage percentage
     * @param {number} actionIntensity - How aggressive the action is (0-1)
     * @returns {number} - Projected percentage after decay
     */
    calculateExponentialDecay(currentPercent, actionIntensity = 1.0) {
        // Higher intensity = more decay = lower result
        const decayFactor = Math.exp(-this.decayLambda * actionIntensity);
        return currentPercent * decayFactor;
    }

    /**
     * Calculate Token Burn Rate: BR(t) = ΔU / Δt
     * Returns tokens per minute
     */
    calculateBurnRate(currentStatus, previousStatus) {
        if (!previousStatus) return null;
        
        const dt = (currentStatus.timestamp - previousStatus.timestamp) / 60000; // minutes
        if (dt <= 0) return null;
        
        const du = currentStatus.percent - previousStatus.percent;
        const burnRate = du / dt; // percentage points per minute
        
        return {
            rate: burnRate,
            dt: dt,
            projectedMinutesToFull: burnRate > 0 ? (100 - currentStatus.percent) / burnRate : Infinity
        };
    }

    /**
     * Calculate optimal throttle factor using algebraic allocation
     * 
     * Formula: throttle_i = min(1, (CRITICAL - U_i) / (CRITICAL × W_i))
     */
    calculateSessionThrottles(sessionStatuses) {
        const throttles = {};
        
        for (const session of sessionStatuses) {
            const weight = this.sessionWeights[session.id] || this.sessionWeights['default'];
            const usage = session.percent;
            
            // Algebraic throttle formula
            const numerator = this.criticalThreshold - usage;
            const denominator = this.criticalThreshold * weight;
            const throttle = Math.min(1, Math.max(0, numerator / denominator));
            
            throttles[session.id] = {
                throttle,
                weight,
                usage,
                priority: weight / (usage + 1) // Higher priority for high-weight, low-usage
            };
        }
        
        return throttles;
    }

    /**
     * Execute optimization sequence
     */
    async optimize() {
        const currentStatus = await this.getAllSessionStatuses();
        if (!currentStatus || currentStatus.length === 0) {
            return { success: false, reason: 'No sessions found' };
        }

        const results = {
            sessions: currentStatus,
            actions: [],
            timestamp: new Date().toISOString()
        };

        // Calculate total weighted usage
        let totalWeightedUsage = 0;
        let totalWeight = 0;
        
        for (const session of currentStatus) {
            const weight = this.sessionWeights[session.id] || this.sessionWeights['default'];
            totalWeightedUsage += session.percent * weight;
            totalWeight += weight;
        }

        const normalizedUsage = (totalWeightedUsage / totalWeight);
        results.normalizedUsage = normalizedUsage;

        // PID correction
        const pidResult = this.calculatePIDCorrection(normalizedUsage);
        results.pid = pidResult;

        // Check if action needed
        if (normalizedUsage >= this.criticalThreshold) {
            console.log(`[AlgebraicOptimizer] ⚠️ Critical: ${normalizedUsage.toFixed(1)}% (target: ${this.targetUsage}%)`);
            
            // Calculate decay action
            const actionIntensity = Math.min(1, pidResult.correction / 100);
            const projectedDecay = this.calculateExponentialDecay(normalizedUsage, actionIntensity);
            
            console.log(`[AlgebraicOptimizer] PID correction: ${pidResult.correction.toFixed(2)}`);
            console.log(`[AlgebraicOptimizer] Projected decay: ${normalizedUsage.toFixed(1)}% → ${projectedDecay.toFixed(1)}%`);
            
            // Execute optimization actions
            const actions = await this.executeOptimizationActions(currentStatus, pidResult.correction);
            results.actions = actions;
            results.success = true;
        } else if (normalizedUsage >= this.warningThreshold) {
            console.log(`[AlgebraicOptimizer] ⚠️ Warning: ${normalizedUsage.toFixed(1)}% (tracking)`);
            results.success = true;
            results.actions = [{ type: 'tracked', message: 'Usage above warning threshold, monitoring' }];
        } else {
            console.log(`[AlgebraicOptimizer] ✅ Healthy: ${normalizedUsage.toFixed(1)}%`);
            results.success = true;
            results.actions = [{ type: 'none', message: 'Within healthy range' }];
        }

        return results;
    }

    /**
     * Execute optimization actions based on calculated corrections
     */
    async executeOptimizationActions(sessions, pidCorrection) {
        const actions = [];
        const intensity = Math.min(1, Math.abs(pidCorrection) / 50); // Normalize to 0-1

        // Sort sessions by priority (high weight + high usage = priority)
        const sortedSessions = sessions
            .map(s => ({
                ...s,
                weight: this.sessionWeights[s.id] || this.sessionWeights['default'],
                priority: (this.sessionWeights[s.id] || 0.25) * s.percent
            }))
            .sort((a, b) => b.priority - a.priority);

        // Action 1: Clear context cache if intensity > 0.3
        if (intensity > 0.3) {
            try {
                const cacheCleared = await this.clearContextCache();
                actions.push({ type: 'cache_clear', intensity, success: cacheCleared });
                console.log(`[AlgebraicOptimizer] Context cache cleared (intensity: ${intensity.toFixed(2)})`);
            } catch (e) {
                actions.push({ type: 'cache_clear', success: false, error: e.message });
            }
        }

        // Action 2: Truncate memory if intensity > 0.5
        if (intensity > 0.5) {
            try {
                const linesRemoved = await this.truncateMemory(Math.round(30 * intensity));
                actions.push({ type: 'memory_truncate', linesRemoved, intensity });
                console.log(`[AlgebraicOptimizer] Memory truncated, removed ~${linesRemoved} lines`);
            } catch (e) {
                actions.push({ type: 'memory_truncate', success: false, error: e.message });
            }
        }

        // Action 3: Compact sessions if intensity > 0.7
        if (intensity > 0.7) {
            try {
                for (const session of sortedSessions.slice(0, 2)) { // Top 2 priorities
                    await this.compactSession(session.id);
                    actions.push({ type: 'session_compact', sessionId: session.id });
                }
                console.log(`[AlgebraicOptimizer] Sessions compacted`);
            } catch (e) {
                actions.push({ type: 'session_compact', success: false, error: e.message });
            }
        }

        // Action 4: Model switch recommendation if intensity > 0.8
        if (intensity > 0.8) {
            const recommendations = this.generateModelRecommendations(sortedSessions);
            actions.push({ type: 'model_switch_recommendation', recommendations });
            console.log(`[AlgebraicOptimizer] Model switch recommended for ${recommendations.length} sessions`);
        }

        return actions;
    }

    async getAllSessionStatuses() {
        try {
            const output = execSync('openclaw sessions list', { encoding: 'utf8' });
            const sessions = [];
            
            // Parse session list
            // Format: "direct agent:main:main            2m ago    MiniMax-M2.1   31k/205k (15%)"
            const lines = output.split('\n').filter(l => l.trim() && !l.includes('Sessions listed') && !l.includes('Kind'));
            
            for (const line of lines) {
                // Use flexible parsing since spacing varies
                const trimmed = line.trim();
                if (!trimmed) continue;
                
                // Extract tokens pattern: "31k/205k (15%)"
                const tokenMatch = trimmed.match(/(\d+k?)\/(\d+k?)\s*\((\d+)%\)/);
                if (!tokenMatch) continue;
                
                const [, used, total, percent] = tokenMatch;
                const usedVal = this.parseTokenValue(used);
                const totalVal = this.parseTokenValue(total);
                
                // Extract model (before token pattern)
                const beforeTokens = trimmed.split(tokenMatch[0])[0];
                const parts = beforeTokens.trim().split(/\s+/);
                
                // Determine kind and id
                const kind = parts[0];
                const id = parts.slice(1).join(' ').trim();
                
                // Find lastActive (look for time pattern in remaining parts)
                const remainingAfterId = beforeTokens.replace(id, '').trim();
                const timeMatch = remainingAfterId.match(/(\d+[smhd])\s+ago/);
                const lastActive = timeMatch ? timeMatch[0] : 'unknown';
                
                // Model is the word before the tokens
                const modelMatch = trimmed.match(/(\S+)\s+\d+k?\/\d+k?\s*\(/);
                const model = modelMatch ? modelMatch[1] : 'unknown';
                
                sessions.push({
                    id: id || 'unknown',
                    kind,
                    lastActive,
                    model,
                    used: usedVal,
                    total: totalVal,
                    percent: parseInt(percent),
                    timestamp: Date.now()
                });
            }
            
            return sessions;
        } catch (error) {
            console.error('[AlgebraicOptimizer] Error fetching sessions:', error.message);
            return [];
        }
    }

    parseTokenValue(value) {
        if (typeof value === 'number') return value;
        if (value.endsWith('k')) {
            return parseInt(value.slice(0, -1)) * 1000;
        }
        return parseInt(value);
    }

    async clearContextCache() {
        try {
            const cacheDir = path.join(process.env.USERPROFILE || process.env.HOME, '.clawd', 'cache');
            const cacheFile = path.join(cacheDir, 'context-cache.json');
            
            if (fs.existsSync(cacheFile)) {
                fs.writeFileSync(cacheFile, JSON.stringify({ entries: {}, stats: { hits: 0, misses: 0 }, timestamp: Date.now() }));
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    async truncateMemory(maxLines = 20) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const memoryDir = path.join(process.env.USERPROFILE || process.env.HOME, '.openclaw', 'workspace12345', 'memory');
            const memoryFile = path.join(memoryDir, `${today}.md`);
            
            if (fs.existsSync(memoryFile)) {
                const content = fs.readFileSync(memoryFile, 'utf8');
                const lines = content.split('\n').filter(l => l.trim() && !l.includes('--- TRUNCATED ---'));
                const removed = Math.max(0, lines.length - maxLines);
                
                if (removed > 0) {
                    const truncated = lines.slice(-maxLines).join('\n') + '\n\n--- TRUNCATED ---\n';
                    fs.writeFileSync(memoryFile, truncated);
                    return removed;
                }
            }
            return 0;
        } catch (e) {
            return 0;
        }
    }

    async compactSession(sessionId) {
        try {
            execSync(`openclaw session compact --session ${sessionId}`, { stdio: 'pipe' });
            return true;
        } catch (e) {
            return false;
        }
    }

    generateModelRecommendations(sessions) {
        const recommendations = [];
        
        for (const session of sessions) {
            if (session.percent > 50 && session.type !== 'direct') {
                // Recommend switching to cheaper model
                const currentModel = session.model;
                const cheaperModels = this.getCheaperAlternatives(currentModel);
                
                recommendations.push({
                    sessionId: session.id,
                    currentModel,
                    currentUsage: session.percent,
                    alternatives: cheaperModels
                });
            }
        }
        
        return recommendations;
    }

    getCheaperAlternatives(currentModel) {
        // Cost hierarchy (cheapest first)
        const modelHierarchy = [
            'deepseek',
            'groq-llama8b', 
            'MiniMax-M2.1-lightning',
            'MiniMax-M2.1',
            'claude-haiku',
            'glm-4.7-flash',
            'gpt-5.2'
        ];
        
        const currentIndex = modelHierarchy.indexOf(currentModel.toLowerCase());
        if (currentIndex === -1 || currentIndex === 0) {
            return []; // Already cheapest or unknown
        }
        
        return modelHierarchy.slice(0, currentIndex);
    }

    /**
     * Get optimizer status and formulas
     */
    getStatus() {
        return {
            configuration: {
                decayLambda: this.decayLambda,
                pidKp: this.pidKp,
                pidKi: this.pidKi,
                pidKd: this.pidKd,
                criticalThreshold: this.criticalThreshold,
                warningThreshold: this.warningThreshold,
                targetUsage: this.targetUsage
            },
            formulas: {
                pid: 'Output = Kp·e + Ki·∫e·dt + Kd·de/dt',
                decay: 'U(t+Δt) = U(t) × e^(-λ·action)',
                burnRate: 'BR(t) = ΔU / Δt',
                throttle: 'throttle_i = min(1, (CRITICAL - U_i) / (CRITICAL × W_i))'
            },
            state: {
                integralError: this.integralError,
                lastError: this.lastError,
                historyCount: this.history.length
            }
        };
    }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];
const optimizer = new AlgebraicTokenOptimizer();

async function run() {
    if (command === 'status') {
        console.log(JSON.stringify(optimizer.getStatus(), null, 2));
    } else if (command === 'optimize' || command === 'check') {
        const result = await optimizer.optimize();
        console.log(JSON.stringify(result, null, 2));
    } else if (command === 'throttles') {
        const sessions = await optimizer.getAllSessionStatuses();
        const throttles = optimizer.calculateSessionThrottles(sessions);
        console.log(JSON.stringify(throttles, null, 2));
    } else {
        console.log('╔══════════════════════════════════════════════════════════╗');
        console.log('║     Algebraic Token Optimizer v1.0                        ║');
        console.log('╠══════════════════════════════════════════════════════════╣');
        console.log('║ Formulas:                                                  ║');
        console.log('║   PID:     Output = Kp·e + Ki·∫e·dt + Kd·de/dt             ║');
        console.log('║   Decay:   U(t+Δt) = U(t) × e^(-λ·action)                  ║');
        console.log('║   Throttle: throttle = (CRITICAL - U) / (CRITICAL × W)  ║');
        console.log('╠══════════════════════════════════════════════════════════╣');
        console.log('║ Commands:                                                  ║');
        console.log('║   node token-algebra.js status      - Show config        ║');
        console.log('║   node token-algebra.js optimize     - Run optimization   ║');
        console.log('║   node token-algebra.js throttles    - Calc session weights║');
        console.log('╠══════════════════════════════════════════════════════════╣');
        console.log(`║ Target: ${optimizer.targetUsage}%  │ Warning: ${optimizer.warningThreshold}%  │ Critical: ${optimizer.criticalThreshold}%    ║`);
        console.log('╚══════════════════════════════════════════════════════════╝');
    }
}

run().catch(console.error);

module.exports = AlgebraicTokenOptimizer;
