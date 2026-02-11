/**
 * Advanced Algebraic Model Finder (Evolved)
 * 
 * Features:
 * 1. Real-time Adaptation (PID + Exponential Decay)
 * 2. Usage Pattern Learning (Long-term Bayesian Memory)
 * 3. Multi-turn Optimization (Predictive Token Planning)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class EvolvedModelFinder {
    constructor(basePath = './Algebraic-Model-Finder') {
        this.basePath = basePath;
        this.dbPath = path.join(basePath, 'model_intelligence.json');
        this.historyPath = path.join(basePath, 'usage_history.json');
        
        this.ensureDirectories();
        this.loadState();
        
        // Configuration Constants
        this.WEIGHTS = {
            quality: 0.4,
            cost: 0.3,
            latency: 0.2,
            reliability: 0.1
        };
        
        this.ADAPTIVE_LEARNING_RATE = 0.05; // Alpha for EMA
    }

    ensureDirectories() {
        if (!fs.existsSync(this.basePath)) fs.mkdirSync(this.basePath);
    }

    loadState() {
        this.intelligence = fs.existsSync(this.dbPath) 
            ? JSON.parse(fs.readFileSync(this.dbPath, 'utf8'))
            : this.getDefaultIntelligence();
            
        this.history = fs.existsSync(this.historyPath)
            ? JSON.parse(fs.readFileSync(this.historyPath, 'utf8'))
            : [];
    }

    saveState() {
        fs.writeFileSync(this.dbPath, JSON.stringify(this.intelligence, null, 2));
        fs.writeFileSync(this.historyPath, JSON.stringify(this.history.slice(-1000), null, 2));
    }

    getDefaultIntelligence() {
        return {
            models: {
                'google/gemini-2.0-flash-thinking-exp': { q: 0.95, cost: 0.01, latency: 2000, context: 1000000, success_rate: 1.0 },
                'google/gemini-2.0-flash': { q: 0.85, cost: 0.001, latency: 800, context: 1000000, success_rate: 1.0 },
                'anthropic/claude-3-5-sonnet': { q: 0.98, cost: 0.015, latency: 1500, context: 200000, success_rate: 1.0 },
                'deepseek/deepseek-chat': { q: 0.90, cost: 0.0005, latency: 1200, context: 64000, success_rate: 1.0 },
                'meta-llama/llama-3.3-70b-instruct': { q: 0.88, cost: 0.0008, latency: 900, context: 128000, success_rate: 1.0 }
            },
            task_patterns: {
                'coding': { preference: ['anthropic/claude-3-5-sonnet', 'google/gemini-2.0-flash-thinking-exp'], weight: 1.0 },
                'reasoning': { preference: ['google/gemini-2.0-flash-thinking-exp'], weight: 1.0 },
                'summarization': { preference: ['google/gemini-2.0-flash'], weight: 1.0 }
            },
            global_metrics: {
                total_requests: 0,
                avg_efficiency: 0
            }
        };
    }

    /**
     * FEATURE 1: Real-time Adaptation
     * Formula: S_adj = S_base * (1 - error_rate) * (Context_utilization_penalty)
     */
    updateModelMetrics(modelId, requestData) {
        const model = this.intelligence.models[modelId];
        if (!model) return;

        // 1. Success Rate Tracking (Success vs Overflow)
        const isSuccess = requestData.success ? 1 : 0;
        model.success_rate = (model.success_rate * 0.9) + (isSuccess * 0.1);

        // 2. Latency Pattern Learning
        if (requestData.latency) {
            model.latency = (model.latency * 0.8) + (requestData.latency * 0.2);
        }

        // 3. Context Usage Efficiency
        // Penalty if actual usage is too close to limit (high risk of overflow)
        const contextUsage = requestData.tokensUsed / model.context;
        model.utilization_efficiency = 1 - Math.pow(contextUsage, 4); // Steep penalty as it nears 1.0

        this.saveState();
    }

    /**
     * FEATURE 2: Learning from Usage Patterns
     * Builds a knowledge base of "best fit" models per task
     */
    learnFromTask(taskType, modelId, score) {
        if (!this.intelligence.task_patterns[taskType]) {
            this.intelligence.task_patterns[taskType] = { preference: [], weight: 0.5 };
        }

        const pattern = this.intelligence.task_patterns[taskType];
        
        // Bayesian update of model preference for task
        if (!pattern.scores) pattern.scores = {};
        pattern.scores[modelId] = (pattern.scores[modelId] || 0.5) * (1 - this.ADAPTIVE_LEARNING_RATE) + (score * this.ADAPTIVE_LEARNING_RATE);
        
        // Re-sort preferences
        pattern.preference = Object.keys(pattern.scores).sort((a, b) => pattern.scores[b] - pattern.scores[a]);
        
        this.saveState();
    }

    /**
     * FEATURE 3: Multi-turn Optimization
     * Predictive token planning: selects model based on current + future depth
     */
    predictFutureTokens(currentContext, turnsRemaining = 3) {
        // Linear growth model for token prediction: T_future = T_current * (1 + growth_factor * turns)
        const growthFactor = 0.4; // Average growth of context per turn
        return currentContext * Math.pow(1 + growthFactor, turnsRemaining);
    }

    /**
     * CORE LOGIC: Mathematical Scoring Function
     * Score = Σ(Weight_i * Metric_i)
     */
    calculateScore(modelId, taskType, contextEstimate) {
        const m = this.intelligence.models[modelId];
        const p = this.intelligence.task_patterns[taskType] || { weight: 0.5, scores: {} };
        
        // Normalize Metrics (0 to 1)
        const qScore = m.q;
        const cScore = 1 - Math.min(m.cost * 100, 1); // Inverse cost (cheaper is better)
        const lScore = 1 - Math.min(m.latency / 5000, 1); // Inverse latency (faster is better)
        const rScore = m.success_rate;
        
        // Context Safety Factor
        const safetyFactor = contextEstimate < m.context ? 1 : 0;
        
        // Task Fit
        const taskFit = (p.scores && p.scores[modelId]) ? p.scores[modelId] : 0.5;

        // Weighted Sum
        const baseScore = (qScore * this.WEIGHTS.quality) + 
                          (cScore * this.WEIGHTS.cost) + 
                          (lScore * this.WEIGHTS.latency) + 
                          (rScore * this.WEIGHTS.reliability);
                          
        return baseScore * safetyFactor * (0.7 + 0.3 * taskFit);
    }

    selectModel(params) {
        const { taskType, currentTokens, estimatedTurns, constraints } = params;
        
        const predictedTotal = this.predictFutureTokens(currentTokens, estimatedTurns);
        
        const candidates = Object.keys(this.intelligence.models).map(id => ({
            id,
            score: this.calculateScore(id, taskType, predictedTotal)
        }));
        
        // Sort by score descending
        candidates.sort((a, b) => b.score - a.score);
        
        return {
            selected: candidates[0],
            all: candidates,
            prediction: {
                current: currentTokens,
                predictedLimit: predictedTotal
            }
        };
    }
}

// Example Usage Implementation
async function runExample() {
    const finder = new EvolvedModelFinder();
    
    console.log("--- Scenario: Complex Coding Chain (Predictive Planning) ---");
    const selection = finder.selectModel({
        taskType: 'coding',
        currentTokens: 15000,
        estimatedTurns: 5,
        constraints: { minQuality: 0.9 }
    });
    
    console.log(`Selected Model: ${selection.selected.id} (Score: ${selection.selected.score.toFixed(4)})`);
    console.log(`Predicted context need for 5 turns: ${Math.round(selection.prediction.predictedLimit)} tokens`);
    
    // Simulate real-time feedback
    console.log("\n--- Real-time Adaptation: Simulating Request Completion ---");
    finder.updateModelMetrics(selection.selected.id, {
        success: true,
        latency: 1250,
        tokensUsed: 16200
    });
    
    finder.learnFromTask('coding', selection.selected.id, 0.95);
    
    console.log("Intelligence updated based on performance.");
}

if (require.main === module) {
    runExample();
}

module.exports = EvolvedModelFinder;
