# DHL/P&G AI Ops Dashboard

> An AI-powered operations dashboard for DHL warehouse floor operators at the P&G Jackson, MO facility. Built to demonstrate the value of AI-assisted SOPs, operator metrics, and floor safety tooling.

---

## What This Is

This is a **demo-phase web application** built to pitch an AI operations system to DHL and P&G leadership. It mimics the TinyTERM terminal aesthetic familiar to floor operators and layers in:

- An AI chat agent trained on facility SOPs, scoped by subsite
- A forklift operator consistency scorecard (behavioral pattern detection)
- AGV network status display
- Shift metrics dashboard

**Current phase**: Demo only — all metrics are hardcoded. No live RTCIS integration yet.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| AI | Anthropic Claude API |
| Charts | Recharts |
| Hosting | Vercel |

---

## Project Structure

```
src/
├── api/
│   └── chat.js              # Anthropic API wrapper
├── components/
│   ├── BootScreen.jsx        # Login + subsite selector
│   ├── Dashboard.jsx         # 3-panel layout
│   ├── ChatPanel.jsx         # AI chat agent
│   ├── MetricsPanel.jsx      # Operator stats
│   ├── SystemStatus.jsx      # AGV nodes + logs
│   └── HeatmapView.jsx       # Consistency timeline
├── context/
│   └── SubsiteContext.jsx    # Global subsite state
├── constants/
│   ├── sops.js               # SOP text per subsite
│   ├── demoMetrics.js        # Fake shift data
│   └── subsites.js           # Subsite config
└── utils/
    └── timeHelpers.js        # Timestamp utilities
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/dhl-ai-dashboard.git
cd dhl-ai-dashboard

# Install dependencies
npm install

# Add your Anthropic API key
cp .env.example .env
# Edit .env and add: VITE_ANTHROPIC_API_KEY=your_key_here

# Run dev server
npm run dev
```

---

## Environment Variables

```
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

> ⚠️ Never commit your `.env` file. It is gitignored by default.

---

## Deployment

Connected to Vercel via GitHub. Every push to `master` triggers a new deploy.

Set `VITE_ANTHROPIC_API_KEY` in Vercel dashboard under Project Settings → Environment Variables.

---

## Roadmap

| Phase | Timeline | Description |
|---|---|---|
| Demo Dashboard + SOP Agent | Months 1–3 | This repo — pitch-ready demo |
| Operator Scorecard V1 | Months 4–6 | Real grab-drop logging, consistency algorithm |
| Trainer System + Tier Engine | Months 7–9 | Tier matrix, supervisor triggers |
| AGV Intelligence Pitch | Months 10–12 | Move bid system, camera vision demo |

---

## Vision

This project is the first step toward a full AI operations platform that transforms how DHL evaluates operator safety, efficiency, and career progression — and how AGV networks are coordinated in real time.

---

*Built by Anthony — DHL Jackson, MO*
