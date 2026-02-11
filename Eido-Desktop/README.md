# Eido Desktop (Private)

Production-ready desktop app to talk to the OpenClaw AI ecosystem. Full chat UI, token dashboard, model/sub-agent management, and workspace/memory access. Built with a lightweight, cross-platform stack (Tauri or Electron) and a glass UI aesthetic.

## Core Goals
- Local, private companion for interacting with OpenClaw
- Rich chat with Markdown, media, and voice
- Real-time token usage, cost tracking, and model insights
- Sub-agent orchestration and workspace/memory access
- Private deployment, with options for signing and distribution

## Tech Choices (default)
- Desktop: Tauri + React + TypeScript (cross-platform)
- UI: Glassmorphism (semi-transparent panels, frosted blur, dark mode)
- Data: SQLite local history, memory sources, and memo-bot integration hooks

## Deliverables (initial)
- Project skeletons for Desktop and Website
- Basic UI scaffold and memo-bot bridge
- CI/CD skeletons for private/public deployment

Next steps: confirm OS targets (Windows/macOS/Linux) and whether to sign builds.