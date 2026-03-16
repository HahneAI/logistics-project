# Claude Code — Project Kickoff Prompt

> Paste this into Claude Code at the start of a new session to initialize the project correctly.

---

## Prompt

```
I am building a React + Vite + Tailwind web application called the DHL/P&G AI Ops Dashboard.

This is a demo-phase app to pitch AI tooling to warehouse leadership. It mimics a TinyTERM terminal aesthetic (dark navy blue, monospace fonts, industrial feel) and includes:
- A boot screen with animated terminal startup and subsite selector
- A 3-panel dashboard: AI chat agent (left), operator metrics (center), system status (right)
- Anthropic Claude API integration for the chat panel, scoped by selected subsite
- Hardcoded fake metrics for demo purposes
- A shift consistency heatmap showing operator behavioral patterns

Reference files in this repo:
- FRONTEND_PROMPT.md — full visual design spec, color palette, component list
- BACKEND_PLAN.md — API integration plan, data structure, module checklist
- DEMO_CHECKLIST.md — master build checklist, work through this top to bottom

Start by:
1. Scaffolding the Vite + React project
2. Installing and configuring Tailwind with the custom color palette from FRONTEND_PROMPT.md
3. Creating the full folder structure as defined in README.md
4. Building BootScreen.jsx with the terminal boot animation and subsite selector

Do not build everything at once. Complete each component fully before moving to the next. Reference DEMO_CHECKLIST.md to track progress. Ask me before making any architectural decisions not covered in the spec files.
```

---

## Notes
- Run this at the start of each Claude Code session to re-orient the agent
- Update the prompt as phases complete to redirect focus
- Keep DEMO_CHECKLIST.md updated so the agent always knows current status
