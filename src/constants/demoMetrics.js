// Fake shift data per subsite — swapped in based on SubsiteContext
// All data is demo-only. No real employee data.

export const DEMO_METRICS = {
  diaper: {
    operator:        'J. MARTINEZ',
    shiftMoves:      142,
    consistencyScore: 81,
    alertFlags:      0,
    tier:            2,
    agvNodes: [
      { id: 'AGV-D01', status: 'online'   },
      { id: 'AGV-D02', status: 'moving'   },
      { id: 'AGV-D03', status: 'online'   },
      { id: 'AGV-D04', status: 'faulted'  },
      { id: 'AGV-D05', status: 'moving'   },
    ],
    activeOperators: [
      { name: 'J. MARTINEZ',  role: 'GX OPERATOR'  },
      { name: 'T. WASHINGTON', role: 'GX OPERATOR' },
      { name: 'D. CHEN',       role: 'TEAM LEAD'   },
      { name: 'R. PATEL',      role: 'GX OPERATOR' },
    ],
    systemLogs: [
      { msg: 'AGV-D04 FAULT: ENCODER MISALIGN — LANE D6', offsetMin: -3  },
      { msg: 'STAGING COMPLETE: LANES D1–D8 CLEAR',       offsetMin: -11 },
      { msg: 'AGV PICKUP CYCLE INITIATED — 12 PALLETS',   offsetMin: -20 },
      { msg: 'OPERATOR LOGIN: J. MARTINEZ [GX-2]',        offsetMin: -28 },
      { msg: 'SHIFT START — DIAPER LINE — 06:00',         offsetMin: -60 },
    ],
    heatmapProfile: 'consistent',
  },

  charmin: {
    operator:        'R. PATEL',
    shiftMoves:      98,
    consistencyScore: 54,
    alertFlags:      2,
    tier:            3,
    agvNodes: [
      { id: 'AGV-C01', status: 'online'  },
      { id: 'AGV-C02', status: 'online'  },
      { id: 'AGV-C03', status: 'faulted' },
    ],
    activeOperators: [
      { name: 'R. PATEL',    role: 'GX OPERATOR' },
      { name: 'M. OKONKWO',  role: 'GX OPERATOR' },
      { name: 'S. JOHNSON',  role: 'TEAM LEAD'   },
    ],
    systemLogs: [
      { msg: 'ALERT: CONSISTENCY DROP BELOW THRESHOLD — R. PATEL', offsetMin: -5  },
      { msg: 'AGV-C03 FAULT: BATTERY CRITICAL',                    offsetMin: -14 },
      { msg: 'PALLET ANOMALY: C4 LANE OBSTRUCTION LOGGED',         offsetMin: -22 },
      { msg: 'STAGING COMPLETE: LANES C1–C6',                      offsetMin: -35 },
      { msg: 'SHIFT START — CHARMIN — 06:00',                      offsetMin: -60 },
    ],
    heatmapProfile: 'rush',
  },

  bounty: {
    operator:        'T. WASHINGTON',
    shiftMoves:      167,
    consistencyScore: 93,
    alertFlags:      0,
    tier:            1,
    agvNodes: [
      { id: 'AGV-B01', status: 'moving'  },
      { id: 'AGV-B02', status: 'moving'  },
      { id: 'AGV-B03', status: 'online'  },
      { id: 'AGV-B04', status: 'online'  },
    ],
    activeOperators: [
      { name: 'T. WASHINGTON', role: 'MASTER OPERATOR' },
      { name: 'K. SILVA',      role: 'GX OPERATOR'     },
      { name: 'A. BROOKS',     role: 'TEAM LEAD'       },
    ],
    systemLogs: [
      { msg: 'AGV PICKUP CYCLE COMPLETE — 18 PALLETS MOVED',  offsetMin: -2  },
      { msg: 'STAGING COMPLETE: ALL B-LANES CLEAR',           offsetMin: -10 },
      { msg: 'CONSISTENCY SCORE UPDATE: T. WASHINGTON — 93',  offsetMin: -18 },
      { msg: 'AGV PICKUP CYCLE INITIATED — B-ZONE',           offsetMin: -30 },
      { msg: 'SHIFT START — BOUNTY — 06:00',                  offsetMin: -60 },
    ],
    heatmapProfile: 'consistent',
  },

  dock: {
    operator:        'D. CHEN',
    shiftMoves:      74,
    consistencyScore: 67,
    alertFlags:      1,
    tier:            2,
    agvNodes: [
      { id: 'AGV-DK1', status: 'online'  },
      { id: 'AGV-DK2', status: 'faulted' },
    ],
    activeOperators: [
      { name: 'D. CHEN',    role: 'DOCK LEAD'   },
      { name: 'L. HARRIS',  role: 'GX OPERATOR' },
      { name: 'P. NGUYEN',  role: 'RECEIVING'   },
      { name: 'B. FLORES',  role: 'SHIPPING'    },
    ],
    systemLogs: [
      { msg: 'ALERT: INBOUND SCAN DELAY — DOOR 7 OVERDUE',   offsetMin: -8  },
      { msg: 'OUTBOUND LOAD COMPLETE — TRAILER #4419 SEALED', offsetMin: -16 },
      { msg: 'INBOUND RECEIVED: 34 PALLETS — DOOR 4',        offsetMin: -25 },
      { msg: 'DRIVER CHECK-IN: TRAILER #4419 — DOOR 6',      offsetMin: -40 },
      { msg: 'SHIFT START — DOCK OPERATIONS — 06:00',        offsetMin: -60 },
    ],
    heatmapProfile: 'rush',
  },
}

// Heatmap data — 24 blocks = 30-min intervals across a 12-hour shift
// activityLevel: 0 (idle) → 4 (burst)
export const HEATMAP_PROFILES = {
  consistent: Array.from({ length: 24 }, (_, i) => ({
    block: i,
    label: `${String(Math.floor(i / 2) + 6).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
    activityLevel: 2 + (Math.random() > 0.7 ? 1 : 0) + (Math.random() > 0.85 ? -1 : 0),
  })),
  rush: Array.from({ length: 24 }, (_, i) => ({
    block: i,
    label: `${String(Math.floor(i / 2) + 6).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
    activityLevel: i < 16 ? (Math.random() > 0.6 ? 1 : 0) : (Math.random() > 0.3 ? 4 : 3),
  })),
}
