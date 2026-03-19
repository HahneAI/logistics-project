# Pre-Pitch TODO — DHL/P&G AI Ops Dashboard

> Everything that needs to be done before walking into the leadership meeting.
> Roadmap context: Phase 1 demo pitch targets Month 3 delivery.

---

## DEPLOY

- [ ] Connect GitHub repo to Vercel
- [ ] Add `VITE_ANTHROPIC_API_KEY` as environment variable in Vercel dashboard
- [ ] Confirm live URL is accessible from tablet, laptop, and presentation screen
- [ ] Run `npm run build` locally and verify no build errors before pushing
- [ ] Test full demo flow on live Vercel URL end-to-end

---

## DEMO QA

- [ ] Boot screen animation plays cleanly on first load
- [ ] All 4 subsites selectable and context switches correctly throughout dashboard
- [ ] Chat agent responds and streams correctly on live URL (not just localhost)
- [ ] Heatmap renders and toggles between CONSISTENT_DRIVER and RUSH_DRIVER
- [ ] RUSH_DRIVER profile clearly shows the idle-then-burst pattern — this is the pitch moment
- [ ] Metrics panel jitter gives live feel without breaking numbers
- [ ] AGV fault indicators and system logs populate per subsite
- [ ] Station quick-switcher in top bar works mid-session
- [ ] Test on laptop in actual presentation mode (browser fullscreen, no dev tools)

---

## PITCH NARRATIVE

- [ ] One-page written narrative: the problem, the demo, the ask
  - Frame around the 3 core problems from the roadmap:
    1. Trainer accountability is broken
    2. Operator behavior is invisible between incidents
    3. Floor knowledge is inaccessible at point of need
  - Lead with the rush pattern demo — show it visually before explaining it
  - Close with: *"Phase 1 requires no hardware, no RTCIS access, and no capital investment."*

- [ ] Talking points prepared for the upgrade path (Phase 2+):
  - Phase 2: Real operator scorecard with grab-drop event logging
  - Phase 3: Trainer eligibility gate, student outcome tracking, $4/hr premium proposal
  - Phase 4: AGV intelligence, full performance database, RTCIS integration talks

---

## LEADERSHIP FRAMING

- [ ] Prepare the Trainer Program slide or talking points:
  - Current state vs. proposed state table (wage, selection, accountability, career significance)
  - $4.00/hr premium framing — position it as investment, not cost
  - Student outcome tracking at 30/60/90 days post-certification

- [ ] Prepare the Tier System overview:
  - Tier 4 → 3 → 2 → 1 structure with criteria and benefits
  - Emphasize: *AI recommends, leadership decides* — no automated demotions
  - Consistency score as primary safety signal, not just output numbers

- [ ] Prepare the Business Case summary:
  - Incident reduction → workers comp, OSHA, equipment damage
  - Trainer quality → lower re-training costs, fewer early-tenure safety events
  - Retention → visible career path reduces turnover and onboarding costs
  - SOP compliance → faster new-hire ramp time

---

## SOP CONTENT

- [ ] Review `src/constants/sops.js` — placeholder text is currently in place
- [ ] If any real SOP excerpts are available, paste them in before the pitch
- [ ] Even partial real content makes the chat agent significantly more credible in a live demo

---

## STRETCH (nice to have before pitch)

- [ ] README.md in repo root — clean one-liner description for if leadership looks at the GitHub link
- [ ] Demo script written out — exact click order for a smooth 5-minute walkthrough
- [ ] Backup plan if internet drops: run locally on laptop with `npm run dev`

---

*Delete this file when pitch is delivered and Phase 2 planning begins.*
