# Backend Plan — DHL/P&G AI Ops Dashboard (Demo Phase)

> This document covers all backend logic, API integration, and data architecture for the 3-month demo build. All data is hardcoded/fake for demo purposes. Real integrations are Phase 2+.

---

## Tech Stack
- **Frontend**: React + Vite + Tailwind
- **AI**: Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Hosting**: Netlify (frontend static deploy)
- **Environment**: `.env` file for API key (`VITE_ANTHROPIC_API_KEY`)
- **No backend server** — all API calls made client-side for demo simplicity

---

## Module 1 — Anthropic Chat Integration

### Goal
Connect the chat panel to Claude API with a system prompt scoped to the selected subsite's SOPs.

### Checklist
- [ ] Create `src/api/chat.js` — wrapper for Anthropic `/v1/messages` POST
- [ ] Accept `messages[]` array and `subsite` string as parameters
- [ ] Build `getSystemPrompt(subsite)` function that returns the correct SOP context per subsite
- [ ] Handle streaming response (simulate character-by-character display in UI)
- [ ] Error handling — show terminal-style error message if API fails
- [ ] Rate limit awareness — disable send button while awaiting response
- [ ] Set `max_tokens: 1024` for chat responses

### System Prompt Structure
```
You are an operations assistant for DHL operators at the P&G facility in Jackson, Missouri.
You are assigned to the [SUBSITE] area.
Answer questions about standard operating procedures, safety protocols, and shift tasks.
Keep answers concise and practical. Use plain language suitable for a warehouse floor environment.
If you do not know the answer, say so clearly and suggest the operator contact their team lead.

[SOP CONTEXT FOR THIS SUBSITE GOES HERE]
```

### SOP Loading Strategy (Demo Phase)
- [ ] Create `src/constants/sops.js` — placeholder SOP text per subsite
- [ ] Structure: `{ diaper: "...", charmin: "...", bounty: "...", dock: "..." }`
- [ ] When real SOPs are available: paste text directly into these constants
- [ ] Future Phase 2: replace with vector store / RAG pipeline

---

## Module 2 — Subsite Context System

### Goal
Track which subsite the operator selected at login and scope all data + AI responses accordingly.

### Checklist
- [ ] Create `src/context/SubsiteContext.jsx` — React context provider
- [ ] Store: `{ subsiteId, subsiteName, shiftStart, operatorName }`
- [ ] Wrap `App.jsx` in provider
- [ ] `useSubsite()` hook exported for all child components
- [ ] Subsite selection on boot screen writes to context
- [ ] All panels read subsite from context — no prop drilling

---

## Module 3 — Fake Metrics Data Layer

### Goal
Populate the metrics panel and system status with realistic-looking demo data.

### Checklist
- [ ] Create `src/constants/demoMetrics.js`
- [ ] Per-subsite fake operator data:
  - Operator name
  - Shift move count
  - Consistency score (0–100)
  - Last scan timestamp (calculated relative to "now")
  - Alert flags count
  - AGV node statuses (array of `{ nodeId, status: 'online'|'faulted'|'moving' }`)
  - Active operator list (array of names + roles)
  - System log feed (array of timestamped strings)
- [ ] Create `src/utils/timeHelpers.js` — helpers for relative timestamps, shift duration
- [ ] Metrics refresh every 30 seconds with minor random variance (simulate live feel)
- [ ] Heatmap data: array of 48 blocks (30-min intervals per 24hr shift) with activity level 0–4

---

## Module 4 — Heatmap / Consistency Visual

### Goal
Show the idle-then-rush behavioral pattern visually for the pitch.

### Checklist
- [ ] Install `recharts` as dependency
- [ ] Create `src/components/HeatmapView.jsx`
- [ ] Input: array of `{ hour, activityLevel }` objects
- [ ] Render as `BarChart` or CSS grid heatmap
- [ ] Color coding: green (steady) / yellow (slowing) / red (idle) / blue (burst)
- [ ] Include two demo operator profiles:
  - `CONSISTENT_DRIVER` — flat green curve
  - `RUSH_DRIVER` — flatline then blue spike in last 2 hours
- [ ] Toggle between profiles in the UI for pitch demonstration

---

## Module 5 — Netlify Deployment

### Checklist
- [ ] Create `netlify.toml` in project root
  ```toml
  [build]
    command = "npm run build"
    publish = "dist"
  ```
- [ ] Add `VITE_ANTHROPIC_API_KEY` as environment variable in Netlify dashboard
- [ ] Confirm `.env` is in `.gitignore` — never commit API key
- [ ] Test production build locally with `npm run build && npm run preview` before deploying
- [ ] Set up continuous deploy from GitHub main branch

---

## Security Notes (Demo Phase)
- API key is exposed client-side in this demo build — acceptable for pitch demo only
- Before any real deployment to operators: move API calls to a Netlify serverless function
- No real employee data is stored or transmitted in demo phase
- Future phases require proper auth (DHL SSO or similar)

---

## Future Phase 2+ Backend (Post-Pitch)
- Netlify serverless functions as API proxy (protect API key)
- Supabase for operator data, session logs, metrics storage
- RAG pipeline for SOP documents (vector search)
- Webhook or CSV import from RTCIS for real metrics
- WebSocket or polling for live AGV status feed
