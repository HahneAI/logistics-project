# DEMO CHECKLIST — DHL/P&G AI Ops Dashboard
> Master checklist for the 3-month demo build. Check off as complete.

---

## PHASE 1 — Project Setup
- [ ] Initialize Vite + React project
- [ ] Install Tailwind CSS and configure
- [ ] Install dependencies: `recharts`, `@anthropic-ai/sdk`
- [ ] Set up `.env` with `VITE_ANTHROPIC_API_KEY`
- [ ] Add `.env` to `.gitignore`
- [ ] Create folder structure (`components/`, `context/`, `constants/`, `api/`, `utils/`)
- [ ] Initialize Git repo and push to GitHub
- [ ] Connect GitHub repo to Netlify

---

## PHASE 2 — Visual Shell (TinyTERM Aesthetic)
- [ ] Boot screen with animated line-by-line terminal startup sequence
- [ ] Subsite selector (Diaper / Charmin / Bounty / Dock)
- [ ] Main dashboard 3-panel layout
- [ ] Terminal color palette applied globally via Tailwind config
- [ ] Monospace fonts loaded (VT323 + Share Tech Mono)
- [ ] Blinking cursor on all active inputs
- [ ] ASCII-style progress bars in metrics panel
- [ ] Status dot indicators (green / yellow / red)
- [ ] Scanline CRT overlay (optional)

---

## PHASE 3 — AI Chat Agent
- [ ] Anthropic API connected
- [ ] System prompt scoped by selected subsite
- [ ] Placeholder SOP text loaded per subsite
- [ ] Chat messages render in terminal style
- [ ] AI responses stream character-by-character
- [ ] Input styled as terminal command line `> _`
- [ ] Error state handled gracefully

---

## PHASE 4 — Metrics & System Status (Fake Data)
- [ ] Operator stats panel with fake shift data
- [ ] AGV node status display (fake: online / faulted / moving)
- [ ] Active operator list per subsite
- [ ] System log feed with timestamps
- [ ] Metrics auto-refresh every 30 seconds with variance

---

## PHASE 5 — Heatmap / Consistency Demo
- [ ] Shift timeline heatmap component built
- [ ] Two demo profiles: CONSISTENT_DRIVER vs RUSH_DRIVER
- [ ] Toggle between profiles for pitch demonstration
- [ ] Color legend displayed

---

## PHASE 6 — Pitch Prep
- [ ] Full demo flow works end-to-end without errors
- [ ] Deployed live on Netlify with working URL
- [ ] Tested on laptop in presentation mode
- [ ] One-page pitch narrative written
- [ ] Upgrade path slide or talking points prepared (RTCIS integration, scorecard V2)

---

## PITCH READY ✓
All boxes checked = ready to walk into that leadership meeting.
