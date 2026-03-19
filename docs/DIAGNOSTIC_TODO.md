# Diagnostic TODO — Active Bugs

> Working list of confirmed bugs. Remove entries when fixed and committed.

---

## BUG 01 — Chat: Prompts appear before AI response + last-clicked prompt should hide

**Status:** Open
**Location:** `src/components/ChatPanel.jsx`

**Symptom:**
- Clicking a suggested prompt starts a ~10 second delay where no response appears but the prompt list regenerates anyway — shows prompts with nothing in the chat yet
- After AI responds, the prompt that was just asked reappears in the list (should be hidden until a different prompt is clicked)

**Expected behavior:**
- Prompts should only reappear AFTER the AI response has fully arrived (after `loading` is false and a new assistant message exists)
- The last-clicked prompt should be excluded from the regenerated list
- Rolling behavior: once a second prompt is clicked, the first exclusion clears and the second one is excluded instead (only ever hide the single most-recently-used prompt)

**Root cause to investigate:**
- `showPrompts` condition uses `lastIsAssistant` but `loading` state timing may be allowing the prompt block to render during the stream window before `messages` has the assistant entry
- Check the condition: `showPrompts && lastIsAssistant` — likely a race where `loading` is still true but something causes a re-render that shows the prompts momentarily

**Fix approach:**
- Add `lastClickedPrompt` state (string)
- Set it when a suggested prompt is clicked
- Clear it when a different prompt is clicked
- Filter `suggestedPrompts` to exclude `lastClickedPrompt` when regenerating
- Tighten the `showPrompts` condition: `!loading && lastIsAssistant && messages.length > 0`

---

## BUG 02 — Heatmap: No operator switcher visible

**Status:** Open
**Location:** `src/components/HeatmapView.jsx`

**Symptom:**
- Screenshot confirms heatmap renders correctly for the default operator (T. WASHINGTON — CONSISTENT DRIVER)
- No UI exists to switch between the 3 operators from within the heatmap view
- Operator selector only lives in MetricsPanel — invisible when heatmap toggle is active

**Expected behavior:**
- Heatmap view should expose the same 3-operator selector that MetricsPanel has
- Switching operator in heatmap should update the chart, name, and profile banner instantly
- Since `activeOperatorIdx` lives in SubsiteContext, reading and setting it from HeatmapView should work without any new state

**Fix approach:**
- Pull `activeOperatorIdx` and `setActiveOperatorIdx` from `useSubsite()` in HeatmapView
- Pull `operators` array from `DEMO_METRICS[subsite?.id]`
- Add operator selector buttons in the HeatmapView header (same style as MetricsPanel)
- Place alongside the OPERATOR: name display already in the header row

---

## Pending — AGV Debug Chat

**Status:** Testing in progress (user testing now)
- Results TBD — will document any bugs found after test session

---

*Last updated: 2026-03-19*
