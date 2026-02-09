# Model Rotation System

## Overview

Automated model rotation based on task type and token usage.

## Files

- `rotation-reasons.json` – Rules for when to rotate models
- `rotate-model.js` – Manual rotation script
- `auto-rotate-model.js` – Automatic rotation based on token usage
- `rotation-log.json` – Log of rotation events

## Usage

### Check rotation status
```bash
node rotate-model.js status
```

### Rotate for specific reason
```bash
node rotate-model.js high_token_usage
node rotate-model.js image_generation
node rotate-model.js code_tasks
node rotate-model.js heavy_reasoning
node rotate-model.js quick_tasks
```

### Auto-rotate based on token usage
```bash
node auto-rotate-model.js
```

## Rules

| Reason | Model | Fallback | Use Case |
|--------|-------|----------|----------|
| `high_token_usage` | `llama3.1:8b` | — | Reduce token usage when high |
| `image_generation` | `gpt-4o` | `claude-3.5-sonnet` | Generate images |
| `code_tasks` | `qwen-portal/coder-model` | `llama3.1:70b` | Code generation |
| `heavy_reasoning` | `mixtral:8x7b` | `llama3.1:70b` | Complex reasoning |
| `quick_tasks` | `llama3.1:8b` | `qwen-portal/coder-model` | Fast responses |

## Models

- `llama3.1:8b` – Fast, good for simple queries
- `llama3.1:70b` – Strong reasoning, long context
- `mixtral:8x7b` – Multilingual, complex reasoning
- `gemma2:13b` – Balanced performance
- `qwen-portal/coder-model` – Optimized for code
- `gpt-4o` – Multimodal (images + text)

## Integration

Add `node auto-rotate-model.js` to your daily checklist or schedule it as a cron job.

---

**Created:** 2026-02-09
