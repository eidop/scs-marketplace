# HEARTBEAT.md

# Keep this file empty (or with only comments) to skip heartbeat API calls.

# Add tasks below when you want the agent to check something periodically.

---

## Token Usage Monitor
- ADVANCED SYSTEM ACTIVE: Checks every 5 minutes via cron
- THRESHOLD: 80-90% → Cooldown to 10%
- ACTION: Automatic cooldown and agent switching when needed

---

## Manual Check
Run: `node token-orchestrator.js status`
