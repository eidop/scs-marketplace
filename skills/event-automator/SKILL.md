---
name: event-automator
description: Creates and manages advanced event-driven automations within OpenClaw. Use to define triggers based on Gateway events (chat, agent, heartbeat, health) and execute multi-step workflows, agent turns, or system actions in response.
---

# Event Automator Skill

This skill provides powerful capabilities for building reactive, automated workflows based on OpenClaw Gateway events.

## Core Functionality

- **Event Listening:** Register to listen for specific Gateway events (e.g., `chat`, `agent`, `heartbeat`, `cron`, `health`, `presence`).
- **Conditional Triggering:** Define precise conditions within event payloads to trigger automations.
- **Workflow Execution:** Execute predefined sequences of actions, including:
    - Spawning new agent sessions (`sessions_spawn`).
    - Sending messages (`message`).
    - Modifying configurations (`gateway.config.patch`).
    - Running custom scripts.
- **Monitoring & Alerting:** Set up automated alerts or notifications based on critical event patterns.

## Usage Examples

- "When a new chat message arrives in channel X, summarize it with Agent Y."
- "If a 'health' event indicates high CPU usage, trigger the `performance-optimizer` skill."
- "Send a daily summary of `cron` job successes/failures."
- "Automatically acknowledge specific types of messages."

## Resources

- `scripts/`: Placeholder for scripts to define event listeners, parse event payloads, and execute reactive workflows.
- `references/`: Placeholder for documentation on available Gateway events, their structures, and advanced automation patterns.
