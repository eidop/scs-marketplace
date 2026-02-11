const EvolvedModelFinder = require('./evolved-model-finder');

class AdaptiveOrchestrator {
    constructor() {
        this.finder = new EvolvedModelFinder();
    }

    /**
     * Decision Logic for Multi-turn Optimization
     */
    planConversation(inputTokens, complexity) {
        console.log(`[Orchestrator] Planning for ${inputTokens} tokens, complexity: ${complexity}`);
        
        // Strategy Selection
        let taskType = 'reasoning';
        if (complexity > 0.8) taskType = 'coding';
        else if (complexity < 0.3) taskType = 'summarization';

        // Predictive planning for a 10-turn conversation
        const plan = this.finder.selectModel({
            taskType: taskType,
            currentTokens: inputTokens,
            estimatedTurns: 10
        });

        return plan;
    }

    /**
     * Error Recovery Mechanism
     * If a model fails or context overflows, adapt weights and retry
     */
    handleError(modelId, errorType) {
        console.log(`[Orchestrator] Recovery mode: ${modelId} failed with ${errorType}`);
        
        this.finder.updateModelMetrics(modelId, {
            success: false,
            latency: null,
            tokensUsed: 0
        });

        // Trigger weight adjustment for immediate recovery
        return this.finder.selectModel({
            taskType: 'reasoning',
            currentTokens: 5000,
            estimatedTurns: 1
        });
    }
}

// Priority Matrix with Adaptive Weights
const PriorityMatrix = {
    URGENT: { quality: 0.6, latency: 0.3, cost: 0.1 },
    CHEAP: { quality: 0.2, latency: 0.2, cost: 0.6 },
    BALANCED: { quality: 0.4, latency: 0.3, cost: 0.3 }
};

async function demo() {
    const orch = new AdaptiveOrchestrator();
    
    // 1. Initial Plan
    const initialPlan = orch.planConversation(2000, 0.9);
    console.log(`Initial Selection: ${initialPlan.selected.id}`);
    
    // 2. Simulate Mid-conversation shift
    console.log("\n[Orchestrator] Context growing rapidly... checking for model switch...");
    const midPlan = orch.finder.selectModel({
        taskType: 'coding',
        currentTokens: 120000,
        estimatedTurns: 5
    });
    
    if (midPlan.selected.id !== initialPlan.selected.id) {
        console.log(`Switching model to ${midPlan.selected.id} to handle extended context.`);
    }

    // 3. Error Recovery
    console.log("\n[Orchestrator] Simulating context overflow error...");
    const recoveryPlan = orch.handleError(midPlan.selected.id, 'CONTEXT_OVERFLOW');
    console.log(`Recovered using: ${recoveryPlan.selected.id}`);
}

demo();
