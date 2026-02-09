# Token Usage Thresholds

- **Warning (80 %)** – Notify user, schedule normal cleanup soon.
- **High (85 %)** – Recommend immediate normal cleanup.
- **Critical (92 %)** – Aggressive cleanup needed; consider throttling heavy tasks.

These percentages are based on the default OpenClaw session token limit of 205 000 tokens. Adjust `CONFIG.tokenWarning` and `CONFIG.tokenCritical` in the script if your environment differs.