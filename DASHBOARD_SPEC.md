# Eido Relationship Dashboard Integration Specification

## 1. Overview
The Relationship Dashboard is a core integration for Eido Desktop, designed to provide users with deep insights into their interaction with the AI, real-time monitoring of system resources and API usage, and granular control over session-based limitations.

## 2. Dashboard Layout (Grid-Based)
The dashboard uses a 12-column responsive grid layout.

| Section | Size (Desktop) | Size (Mobile) | Components |
|:---|:---:|:---:|:---|
| **Header** | 12 | 12 | System Health, Connection Status, Global Budget |
| **API Usage** | 8 | 12 | Cost Chart, Token Breakdown, Provider Status |
| **Cooldowns** | 4 | 12 | Visual Timers, Rate Limit Status |
| **Relationship** | 6 | 12 | Topic Cloud, Metric Gauges, Project List |
| **Activity** | 6 | 12 | Sub-agent list, Live log, File access |

## 3. Component Specifications

### 3.1 Relationship Metrics
- **History Length:** Total messages & session age.
- **Topics Covered:** Dynamic tag cloud generated from memory access.
- **Shared Projects:** List of active workspace directories/files with high activity.
- **Contact Frequency:** Heatmap of interactions over the last 30 days.
- **Quality Metrics:** 
    - Average Response Time (ms)
    - Helpful/Refined ratio (tracking user edits vs. accepted output).

### 3.2 API Usage Tracking
- **Real-time Counter:** WebSocket-based update on every `exec` or `browser` action.
- **Provider Breakdown:** Per-model (OpenAI, Anthropic, Google) usage bars.
- **Budget Alerts:** Progress bar (Green -> Yellow @ 80% -> Red @ 95%).
- **Trends:** Hourly/Daily/Weekly line charts for token volume.

### 3.3 Cooldown Timers
- **Visual Countdown:** Circular progress bars for action-specific locks.
- **Throttling Logic:** 
    - `ActionLock`: Prevents rapid-fire file writes.
    - `RateLimit`: 10 requests / minute global cap (configurable).
    - `SessionBurst`: Allows 5 heavy tasks then enforces a 60s "cool-off".

## 4. Real-time Update Mechanism
- **Backend:** `node-commander` and `performance-optimizer` scripts push updates to a local state file (`dashboard-state.json`).
- **Frontend:** React + Tailwind UI polling or WebSocket connection to the OpenClaw Gateway.
- **Triggers:** Every tool call (TTS, Browser, Exec) increments counters.

## 5. Configurable Settings
- `budget_limit_usd`: Hard cap for API spending.
- `cooldown_intensity`: Low/Medium/Strict presets.
- `metric_visibility`: Toggle individual cards.
- `mobile_notifications`: Push alerts for budget/cooldown hits.

## 6. Mobile-Responsive Design
- Stacked card layout for screens < 768px.
- Compact "Stat Bubbles" for the header on small devices.
- Swipeable tabs for switching between "Usage" and "Relationship" views.
