# Algebraic-Model-Finder Implementation Details

## 1. Mathematical Scoring Functions
The system uses a weighted sum normalization for model selection:
**Score = (Q * W_q) + (C_inv * W_c) + (L_inv * W_l) + (R * W_r)**
Where:
- `Q`: Quality (0-1)
- `C_inv`: Normalized inverse cost
- `L_inv`: Normalized inverse latency
- `R`: Reliability (Success Rate)

## 2. Real-time Adaptation (EMA)
Weights are adjusted after every request using Exponential Moving Averages:
- `Metric_new = (Metric_old * 0.9) + (Actual_measurement * 0.1)`
- **Context Penalty:** `1 - utilization^4` (Applied to selection score to prevent overflows)

## 3. Multi-turn Optimization (Predictive Planning)
Predicts future token usage to ensure chosen model survives the conversation:
- `Tokens_predicted = Tokens_current * (1 + Growth_Factor)^Turns_remaining`

## 4. Priority Matrix
| Priority | Quality | Cost | Latency | Use Case |
|----------|---------|------|---------|----------|
| URGENT | 0.6 | 0.1 | 0.3 | Coding, Reasoning |
| CHEAP | 0.2 | 0.6 | 0.2 | Summarization |
| BALANCED | 0.4 | 0.3 | 0.3 | General Chat |

## 5. Decision Logic (Error Recovery)
- **Context Overflow:** Reduces reliability score, recalculates priority, and switches to a larger context model (e.g., Gemini).
- **Latency Spikes:** Real-time latency tracking shifts selection to faster models (e.g., Llama-3-70B).
