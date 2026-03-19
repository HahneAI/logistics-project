# Component Reference — DHL/P&G AI Ops Dashboard

> Troubleshooting reference for all source files. Phase 1 & 2 complete.

---

## Color Palette (Actual RTS Terminal)

Matches the Honeywell/TinyTERM tablet display operators use on the floor. Not the original dark-navy spec — intentionally replaced.

| Token | Hex | Use |
|---|---|---|
| `bg-primary` | `#0000AA` | Main background |
| `bg-secondary` | `#000088` | Top bar, panels |
| `bg-panel` | `#000099` | Card surfaces |
| `accent-cyan` | `#55FFFF` | Active states, cursor |
| `text-primary` | `#FFFF55` | Main text (terminal yellow) |
| `text-dim` | `#AAAAAA` | Labels, secondary |
| `status-green` | `#55FF55` | Online / OK |
| `status-red` | `#FF5555` | Fault / alert |
| `border-panel` | `#5555FF` | Panel borders |

Fonts: `VT323` (headers/display) · `Share Tech Mono` (body/terminal)

---

## Entry Points

| File | Role |
|---|---|
| `index.html` | HTML shell — loads Google Fonts, mounts `#root` |
| `src/main.jsx` | React root — renders `<App />` in StrictMode |
| `src/App.jsx` | Toggles `BootScreen` ↔ `Dashboard` via `booted` flag. Wraps in `SubsiteProvider` + scanline overlay. |
| `src/index.css` | Tailwind base + scrollbar styles + `@keyframes blink` + `.scanlines` class |

---

## Components

### `BootScreen.jsx`
Animated terminal startup → subsite selector.
- `visibleLines` state drives staggered line reveal via `setTimeout`
- Arrow/number keys navigate subsites, Enter confirms
- Calls `setSubsite()` on context, then `onBoot()` after 600ms

**Debug:** Boot not playing → check `BOOT_LINES` array and `visibleLines` starts at `0`. Subsite not persisting → verify `SubsiteContext` wraps `App`.

---

### `Dashboard.jsx`
3-panel layout wrapper + top status bar + scorecard toggle.
- `showHeatmap` swaps 3-panel view ↔ `HeatmapView` full-screen
- HeatmapView is wrapped in `flex-1 overflow-hidden` div — required for chart height resolution
- Station quick-switcher dropdown in top bar updates `SubsiteContext` directly
- Mobile: tab-switched single panel with bottom nav bar

**Debug:** Panels overflowing → check `overflow-hidden` on panel divs. Subsite null in top bar → `subsite?.shortName` from context.

---

### `ChatPanel.jsx`
AI chat with streaming Claude responses.
- `messages[]` holds full conversation history
- `streamText` holds in-progress chunk (cleared on completion)
- Calls `sendMessage()` from `api/chat.js` with `onChunk` callback
- Input disabled while `loading` is true
- Suggested prompt buttons for demo flow

**Debug:** `SYS ERROR: API UNAVAILABLE` → invalid/missing `VITE_ANTHROPIC_API_KEY`. Not streaming → check browser console for CORS; confirm `dangerouslyAllowBrowser: true` in `chat.js`.

---

### `MetricsPanel.jsx`
Operator stats with ASCII progress bars and live jitter.
- Base data from `DEMO_METRICS[subsite?.id]`
- `moves` and `score` jitter every 30s via `setInterval` to simulate live feed
- `useEffect([base])` resets on subsite change
- `AsciiBar`: `█` filled / `░` empty — defaults to 10 blocks
- Score thresholds: `≥80` green · `≥60` yellow · below red

**Debug:** Metrics not resetting on switch → check `useEffect([base])`. ASCII bar wrong → pass `width` prop explicitly.

---

### `SystemStatus.jsx`
AGV node grid, fault counter, timestamped log feed.
- Data from `DEMO_METRICS[subsite?.id]`
- Heartbeat log entry appended every 45s via `setInterval`
- Log color: `ALERT`/`FAULT` prefix → red · `HEARTBEAT`/`NOMINAL` → green

**Debug:** Logs not resetting → verify `useEffect([data])` calls `setLogs(data.systemLogs)`.

---

### `HeatmapView.jsx`
Full-screen shift consistency chart — centerpiece of the leadership pitch.
- Toggles between `CONSISTENT_DRIVER` and `RUSH_DRIVER` profiles
- Defaults to subsite's `heatmapProfile` from `DEMO_METRICS`
- 24 bars = 30-min intervals across a 12-hour shift (06:00–18:00)
- RUSH profile: blocks 0–15 idle/slow → blocks 16–23 burst (the pitch moment)
- **Layout fix:** chart wrapper uses `relative` + inner `absolute inset-0` div so `ResponsiveContainer height="100%"` resolves against a real pixel height (known Recharts/flex gotcha)

**Debug:** Chart blank → the `absolute inset-0` inner wrapper must be present. Colors wrong → `Cell` must be direct child of `Bar` with `fill={LEVEL_COLORS[entry.activityLevel]}`.

---

## API & Data

### `src/api/chat.js`
Anthropic SDK wrapper. `dangerouslyAllowBrowser: true` — demo only, replace with Vercel serverless function before real deployment.
- Model: `claude-sonnet-4-20250514` · `max_tokens: 1024`
- `getSystemPrompt(subsiteId)` injects `SOPS[subsiteId]` text
- `sendMessage(messages, subsiteId, onChunk)` streams response chunks

### `src/constants/sops.js`
SOP text strings keyed by subsite: `diaper` · `charmin` · `bounty` · `dock`. Paste real SOP content here when available. Phase 2: replace with RAG pipeline.

### `src/constants/demoMetrics.js`
`DEMO_METRICS` — per-subsite fake operator data, AGV nodes, logs, heatmap profile key.
`HEATMAP_PROFILES` — `consistent` and `rush` arrays (24 blocks each).

### `src/context/SubsiteContext.jsx`
Provides: `subsite`, `setSubsite`, `shiftStart`. Hook: `useSubsite()`. Must be ancestor of any component reading subsite.

### `src/utils/timeHelpers.js`
`timeAgo(offsetMin)` · `shiftDuration(shiftStart)` · `logTimestamp(offsetMin)` · `nowTimestamp()` · `jitter(value, variance)`

---

## Config

| File | Purpose |
|---|---|
| `vite.config.js` | Vite build — React plugin |
| `tailwind.config.js` | RTS terminal color tokens + font families |
| `postcss.config.js` | Tailwind + Autoprefixer |
| `vercel.json` | Build: `npm run build` · Output: `dist` · SPA rewrites |
| `.env.example` | Copy to `.env`, add `VITE_ANTHROPIC_API_KEY` |
| `.gitignore` | Excludes `node_modules/`, `dist/`, `.env` |

---

## Phase 2+ (Post-Pitch)
- Move API calls to Vercel serverless functions (protect key)
- Supabase for operator data and session logs
- RAG pipeline for real SOP documents
- RTCIS webhook/CSV import for live metrics
- WebSocket for live AGV feed
