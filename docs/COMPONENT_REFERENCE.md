# Component Reference — DHL/P&G AI Ops Dashboard

> Troubleshooting reference for all source files. Use this to orient quickly when debugging.

---

## Entry Points

| File | Role |
|---|---|
| `index.html` | HTML shell — loads Google Fonts (VT323, Share Tech Mono), mounts `#root` |
| `src/main.jsx` | React root — renders `<App />` inside `StrictMode` |
| `src/App.jsx` | Top-level state: toggles between `BootScreen` and `Dashboard` via `booted` flag. Wraps everything in `SubsiteProvider` and the scanline overlay div. |
| `src/index.css` | Tailwind base + scrollbar styles + `@keyframes blink` + `.scanlines` utility class |

---

## Components

### `src/components/BootScreen.jsx`
**What it does:** Animated terminal startup sequence followed by subsite selector.

**Key logic:**
- `visibleLines` state drives the staggered line reveal via `useEffect` + `setTimeout`
- Keyboard listener: arrow keys / number keys navigate subsites, Enter confirms
- On confirm: calls `setSubsite()` on context, then calls `onBoot()` prop after 600ms delay
- `onBoot` prop is passed from `App.jsx` and flips `booted` to `true`

**Common issues:**
- Boot animation not playing → check that `BOOT_LINES` array is intact and `visibleLines` starts at `0`
- Subsite not persisting to dashboard → verify `SubsiteContext` is wrapping `App` and `setSubsite` is being called

---

### `src/components/Dashboard.jsx`
**What it does:** 3-panel layout wrapper. Also contains the top status bar and the scorecard toggle.

**Key logic:**
- `showHeatmap` state swaps between the 3-panel layout and `HeatmapView` full-screen
- Panel widths: ChatPanel 30% / MetricsPanel 40% / SystemStatus 30%
- Reads `subsite` and `shiftStart` from `useSubsite()`

**Common issues:**
- Panels overflowing vertically → ensure parent `div` has `h-full` and each panel uses `flex flex-col overflow-hidden`
- Subsite name not showing in top bar → check `subsite?.shortName` — will be null if context not set

---

### `src/components/ChatPanel.jsx`
**What it does:** AI chat interface. Streams Claude responses character by character.

**Key logic:**
- `messages` array holds full conversation history `[{ role, content }]`
- `streamText` holds the in-progress streamed response (cleared after stream completes)
- Calls `sendMessage()` from `api/chat.js` with `onChunk` callback that updates `streamText`
- On stream complete, appends final message to `messages` and clears `streamText`
- Disables input while `loading` is true

**Common issues:**
- `SYS ERROR: API UNAVAILABLE` → missing or invalid `VITE_ANTHROPIC_API_KEY` in `.env`
- Responses not streaming → check browser console for CORS or network errors; confirm `dangerouslyAllowBrowser: true` is set in `api/chat.js`
- Chat not scoped to subsite → verify `subsite?.id` is passed to `sendMessage()` and that `SOPS[subsiteId]` has content

---

### `src/components/MetricsPanel.jsx`
**What it does:** Operator stats display with ASCII progress bars, tier badge, shift health dots, and active operator list.

**Key logic:**
- Pulls base data from `DEMO_METRICS[subsite?.id]`
- `moves` and `score` are local state seeded from base data, jittered every 30 seconds via `setInterval`
- `useEffect` on `base` resets state when subsite changes
- `AsciiBar` component renders `█` filled / `░` empty based on `value/max` ratio
- `StatusDot` maps `online / faulted / moving` to colored pulsing dots

**Common issues:**
- Metrics not updating on subsite switch → check that `useEffect([base])` reset is present
- ASCII bar rendering wrong → `width` prop defaults to 10 blocks; pass explicitly if needed
- Score color not changing → thresholds are `>=80` green, `>=60` yellow, below red

---

### `src/components/SystemStatus.jsx`
**What it does:** AGV node status grid, fault counter, and timestamped system log feed.

**Key logic:**
- Pulls `agvNodes` and `systemLogs` from `DEMO_METRICS[subsite?.id]`
- `useEffect` on `data` resets both when subsite changes
- Second `useEffect` adds a random "heartbeat" log entry every 45 seconds
- Log entry color: `ALERT`/`FAULT` prefix → red, `HEARTBEAT`/`NOMINAL` → green, else text-primary

**Common issues:**
- Logs not resetting on subsite switch → verify `useEffect([data])` is present and `setLogs(data.systemLogs)` is called
- Fault count not showing → check that `agvNodes` array includes entries with `status: 'faulted'`

---

### `src/components/HeatmapView.jsx`
**What it does:** Full-screen shift consistency chart. Toggle between CONSISTENT_DRIVER and RUSH_DRIVER profiles to demonstrate the idle-then-burst pitch scenario.

**Key logic:**
- `activeProfile` state defaults to the current subsite's `heatmapProfile` field from `DEMO_METRICS`
- Data comes from `HEATMAP_PROFILES` in `demoMetrics.js` — 24 blocks of 30-min intervals
- Recharts `BarChart` with `Cell` per bar to apply per-block color from `LEVEL_COLORS`
- RUSH profile: blocks 0–15 are level 0–1 (idle), blocks 16–23 are level 3–4 (burst) — this is the pitch moment
- `CustomTooltip` renders terminal-styled hover popup

**Common issues:**
- Chart not rendering → confirm `recharts` is installed (`npm ls recharts`)
- Colors not applying → `Cell` must be a direct child of `Bar` with `fill` from `LEVEL_COLORS[entry.activityLevel]`
- Profile not defaulting correctly → `defaultProfile` reads from `DEMO_METRICS[subsite?.id]?.heatmapProfile`

---

## API & Data

### `src/api/chat.js`
**What it does:** Anthropic SDK wrapper. Builds the SOP-scoped system prompt and streams the response.

**Key logic:**
- `getSystemPrompt(subsiteId)` injects `SOPS[subsiteId]` into the system message
- `sendMessage(messages, subsiteId, onChunk)` opens a stream and calls `onChunk(delta)` on each text chunk
- Model: `claude-sonnet-4-20250514`, `max_tokens: 1024`
- `dangerouslyAllowBrowser: true` — acceptable for demo, must be replaced with a serverless function before real deployment

**Common issues:**
- API key not loading → must be prefixed `VITE_` in `.env` for Vite to expose it to the browser
- Stream not yielding chunks → check `chunk.type === 'content_block_delta'` and `chunk.delta?.type === 'text_delta'`

---

### `src/constants/sops.js`
SOP text strings keyed by subsite id: `diaper`, `charmin`, `bounty`, `dock`.
Injected directly into the Claude system prompt. Replace with real SOP content here when available.

### `src/constants/demoMetrics.js`
Per-subsite fake metrics objects (`DEMO_METRICS`) and two heatmap data arrays (`HEATMAP_PROFILES`).
All demo data lives here — easy to swap for real data in Phase 2.

### `src/context/SubsiteContext.jsx`
React context providing: `subsite`, `setSubsite`, `operatorName`, `setOperatorName`, `shiftStart`.
Accessed via the `useSubsite()` hook. Must be a parent of any component that reads subsite data.

### `src/utils/timeHelpers.js`
Utility functions: `timeAgo(offsetMin)`, `shiftDuration(shiftStart)`, `logTimestamp(offsetMin)`, `nowTimestamp()`, `jitter(value, variance)`.

---

## Config Files

| File | Purpose |
|---|---|
| `vite.config.js` | Vite build config — React plugin only |
| `tailwind.config.js` | Custom color palette + font families (`font-terminal`, `font-display`) |
| `postcss.config.js` | Tailwind + Autoprefixer |
| `netlify.toml` | Build command: `npm run build`, publish dir: `dist` |
| `.env.example` | Template — copy to `.env` and add `VITE_ANTHROPIC_API_KEY` |
| `.gitignore` | Excludes `node_modules/`, `dist/`, `.env` |

---

*Last updated: Phase 2 complete — full dashboard built, build verified clean.*
