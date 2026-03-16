# Frontend Design Prompt — DHL/P&G AI Ops Dashboard

## Concept
Build a React + Tailwind web application that mimics the aesthetic of **TinyTERM 1.7.11.435** — a blue monospace terminal interface used on warehouse floor tablets. The goal is to feel instantly familiar to DHL/P&G floor operators while layering in modern AI-powered features.

---

## Aesthetic Direction: "Industrial Terminal Reborn"
- **Tone**: Retro-industrial terminal — authoritative, utilitarian, no fluff
- **Feel**: Like TinyTERM got a quiet upgrade that the factory floor would actually trust
- **NOT**: A sleek SaaS dashboard. No gradients on white. No rounded cards with drop shadows. No Inter font.

---

## Color Palette
```
--bg-primary:     #0a0e1a   /* near-black navy — terminal void */
--bg-secondary:   #0d1526   /* slightly lighter panel background */
--bg-panel:       #111c33   /* card/panel surfaces */
--accent-blue:    #1a6aff   /* primary interactive blue */
--accent-cyan:    #00d4ff   /* highlights, active states, cursor blink */
--text-primary:   #c8deff   /* soft blue-white — main readable text */
--text-dim:       #4a6a99   /* secondary/label text */
--text-muted:     #2a3f66   /* borders, dividers */
--status-green:   #00ff9d   /* OK / online / passing */
--status-yellow:  #ffcc00   /* warning / review */
--status-red:     #ff3d3d   /* fault / fail / alert */
--border:         #1e3a6e   /* panel borders */
```

---

## Typography
- **Primary font**: `Courier Prime` or `Share Tech Mono` (Google Fonts) — monospace, terminal feel
- **UI labels**: `VT323` for headers and section titles — authentic terminal character
- **Fallback**: `monospace`
- All text should feel like it belongs on a terminal screen

---

## Layout Structure

### Screen 1 — Login / Boot Screen
- Full screen dark background
- Centered terminal window with a blinking cursor
- Boot sequence animation: lines of text appearing one by one (fake system init messages)
- Final prompt: `SUBSITE LOGIN — SELECT STATION`
- Subsite selector as terminal-style option list (not a dropdown — styled radio buttons or keyboard-navigable list)
- Options: `[1] DIAPER LINE` / `[2] CHARMIN` / `[3] BOUNTY` / `[4] DOCK OPERATIONS`
- A `> CONFIRM` button styled as a terminal command input

### Screen 2 — Main Dashboard
Split into 3 zones:

**LEFT PANEL (30%) — Operator Chat Agent**
- Chat window with monospace bubbles
- User input styled as a terminal command line: `> _`
- Blinking cursor on input
- Subsite context shown at top: `STATION: CHARMIN | SHIFT: ACTIVE`
- AI responses appear with a `SYS:` prefix
- Thin scrollbar, dark track

**CENTER PANEL (40%) — Metrics Display**
- Header: `SHIFT METRICS — [DATE] [TIME]`
- Fake metric rows styled like terminal output tables:
  ```
  OPERATOR.............. J. MARTINEZ
  SHIFT MOVES........... 142
  CONSISTENCY SCORE..... 81/100  [████████░░]
  LAST SCAN............. 00:04:23 AGO
  ALERT FLAGS........... 0
  ```
- Progress bars styled as ASCII block fill: `[████████░░]`
- Status indicators as blinking dots (green/yellow/red)

**RIGHT PANEL (30%) — System Status**
- AGV network status (fake nodes — online/faulted/moving)
- Active operator list for current subsite
- Recent system notifications (styled as terminal log lines)
- Timestamp on every line

### Screen 3 — Scorecard Expanded View (optional drill-down)
- Full width timeline heatmap
- X-axis: shift hours (6hr, 8hr, 10hr, 12hr options)
- Y-axis: activity density
- Color coded: green = steady, yellow = slowing, red = idle, blue = burst/rush
- Built with Recharts or a CSS grid heatmap

---

## Interaction Details
- **Cursor blink**: CSS `@keyframes blink` on all active inputs
- **Boot animation**: `setTimeout` staggered line reveals on login screen
- **Typing effect**: AI responses stream in character by character (simulate streaming)
- **Hover states**: Subtle cyan border glow on interactive elements
- **No smooth rounded corners**: `border-radius: 2px` max — keep it sharp
- **Scanlines overlay** (optional): A subtle CSS `repeating-linear-gradient` overlay at 3% opacity for CRT texture

---

## Component Checklist for Claude Code
- [ ] `BootScreen.jsx` — animated login with subsite selector
- [ ] `Dashboard.jsx` — 3-panel layout wrapper
- [ ] `ChatPanel.jsx` — AI chat with terminal styling + Anthropic API call
- [ ] `MetricsPanel.jsx` — operator stats with ASCII progress bars
- [ ] `SystemStatus.jsx` — AGV nodes + operator list + log feed
- [ ] `HeatmapView.jsx` — shift consistency timeline (Recharts)
- [ ] `useSubsite.js` — global subsite context hook
- [ ] `api/chat.js` — Anthropic API call handler with SOP system prompt
- [ ] `constants/subsites.js` — subsite configs, SOP context strings, fake metrics

---

## Notes for Claude Code Agent
- Use Tailwind utility classes only — no custom CSS files unless necessary
- All fake/demo data lives in `constants/` — easy to swap for real data later
- Anthropic API key loaded from `.env` as `VITE_ANTHROPIC_API_KEY`
- Start with Vite + React scaffold
- Mobile responsive is NOT a priority — this is a tablet/laptop demo
- Keep component files clean and under 150 lines each — split if needed
