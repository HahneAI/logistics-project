// Demo data — all hardcoded for pitch. No real employee data.
// Each subsite has 3 operators: consistent driver, trainee, rush driver.

const makeProfile = (levels) =>
  levels.map((activityLevel, i) => ({
    block: i,
    label: `${String(Math.floor(i / 2) + 6).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
    activityLevel,
  }))

export const HEATMAP_PROFILES = {
  // Steady mid-level pacing — one natural dip, single burst at end of shift
  consistent: makeProfile([2,2,3,2,2,3,2,3,2,2,3,2,2,2,3,2,1,2,3,2,2,3,2,4]),
  // Slow but very steady — trainee building baseline, never rushes
  training:   makeProfile([1,2,1,2,1,1,2,1,2,1,1,2,1,2,1,1,2,1,2,1,1,2,1,2]),
  // Idle/slow start, sprint finish — the problematic pattern that triggers alerts
  rush:       makeProfile([0,0,1,0,1,0,0,1,0,1,0,1,1,0,1,0,4,3,4,4,3,4,4,3]),
}

// Profile metadata — used by both MetricsPanel badge and HeatmapView label
export const PROFILE_META = {
  consistent: {
    label:   'CONSISTENT DRIVER',
    summary: 'SUSTAINED PACING — LOW RISK PROFILE',
    color:   'text-status-green',
  },
  training: {
    label:   'TRAINEE — IN DEVELOPMENT',
    summary: 'BUILDING BASELINE — CONSISTENT PACING',
    color:   'text-status-yellow',
  },
  rush: {
    label:   'RUSH DRIVER',
    summary: 'IDLE-THEN-BURST PATTERN DETECTED',
    color:   'text-status-red',
  },
}

export const DEMO_METRICS = {
  diaper: {
    agvNodes: [
      { id: 'AGV-1', status: 'online'  },
      { id: 'AGV-2', status: 'moving'  },
      { id: 'AGV-3', status: 'online'  },
      { id: 'AGV-4', status: 'faulted' },
      { id: 'AGV-5', status: 'moving'  },
    ],
    systemLogs: [
      { msg: 'AGV-D04 FAULT: ENCODER MISALIGN — LANE D6',    offsetMin: -3  },
      { msg: 'STAGING COMPLETE: LANES D1–D8 CLEAR',          offsetMin: -11 },
      { msg: 'AGV PICKUP CYCLE INITIATED — 12 PALLETS',      offsetMin: -20 },
      { msg: 'OPERATOR LOGIN: J. MARTINEZ [GX-2]',           offsetMin: -28 },
      { msg: 'SHIFT START — DIAPER LINE — 06:00',            offsetMin: -60 },
    ],
    operators: [
      {
        name:             'J. MARTINEZ',
        role:             'TIPPING',
        tier:             1,
        shiftMoves:       142,
        consistencyScore: 91,
        alertFlags:       0,
        heatmapProfile:   'consistent',
        equipment:        'tipper',
      },
      {
        name:             'A. BROOKS',
        role:             'TRAINER',
        tier:             4,
        shiftMoves:       76,
        consistencyScore: 69,
        alertFlags:       0,
        heatmapProfile:   'training',
        equipment:        'forks',
      },
      {
        name:             'R. PATEL',
        role:             'SLOW-MOVERS',
        tier:             3,
        shiftMoves:       98,
        consistencyScore: 54,
        alertFlags:       2,
        heatmapProfile:   'rush',
        equipment:        null,
      },
    ],
  },

  charmin: {
    agvNodes: [
      { id: 'AGV-1', status: 'online'  },
      { id: 'AGV-2', status: 'online'  },
      { id: 'AGV-3', status: 'faulted' },
    ],
    systemLogs: [
      { msg: 'ALERT: CONSISTENCY DROP — S. JOHNSON',         offsetMin: -5  },
      { msg: 'AGV-C03 FAULT: BATTERY CRITICAL',              offsetMin: -14 },
      { msg: 'PALLET ANOMALY: C4 LANE OBSTRUCTION LOGGED',   offsetMin: -22 },
      { msg: 'STAGING COMPLETE: LANES C1–C6',                offsetMin: -35 },
      { msg: 'SHIFT START — CHARMIN — 06:00',                offsetMin: -60 },
    ],
    operators: [
      {
        name:             'D. CHEN',
        role:             'FINISHED GOODS',
        tier:             1,
        shiftMoves:       131,
        consistencyScore: 85,
        alertFlags:       0,
        heatmapProfile:   'consistent',
        equipment:        'forks',
      },
      {
        name:             'M. OKONKWO',
        role:             'PREPPERS',
        tier:             4,
        shiftMoves:       71,
        consistencyScore: 66,
        alertFlags:       0,
        heatmapProfile:   'training',
        equipment:        'scanner',
      },
      {
        name:             'S. JOHNSON',
        role:             'SLOW-MOVERS',
        tier:             3,
        shiftMoves:       94,
        consistencyScore: 48,
        alertFlags:       3,
        heatmapProfile:   'rush',
        equipment:        'forks',
      },
    ],
  },

  bounty: {
    agvNodes: [
      { id: 'AGV-1', status: 'moving' },
      { id: 'AGV-2', status: 'moving' },
      { id: 'AGV-3', status: 'online' },
      { id: 'AGV-4', status: 'online' },
    ],
    systemLogs: [
      { msg: 'AGV PICKUP CYCLE COMPLETE — 18 PALLETS MOVED', offsetMin: -2  },
      { msg: 'STAGING COMPLETE: ALL B-LANES CLEAR',          offsetMin: -10 },
      { msg: 'CONSISTENCY SCORE UPDATE: T. WASHINGTON — 93', offsetMin: -18 },
      { msg: 'AGV PICKUP CYCLE INITIATED — B-ZONE',          offsetMin: -30 },
      { msg: 'SHIFT START — BOUNTY — 06:00',                 offsetMin: -60 },
    ],
    operators: [
      {
        name:             'T. WASHINGTON',
        role:             'TIPPING',
        tier:             1,
        shiftMoves:       167,
        consistencyScore: 93,
        alertFlags:       0,
        heatmapProfile:   'consistent',
        equipment:        'tipper',
      },
      {
        name:             'K. SILVA',
        role:             'PREPPERS',
        tier:             4,
        shiftMoves:       89,
        consistencyScore: 72,
        alertFlags:       0,
        heatmapProfile:   'training',
        equipment:        'scanner',
      },
      {
        name:             'C. REED',
        role:             'FINISHED GOODS',
        tier:             3,
        shiftMoves:       103,
        consistencyScore: 51,
        alertFlags:       2,
        heatmapProfile:   'rush',
        equipment:        'forks',
      },
    ],
  },

  dock: {
    agvNodes: [
      { id: 'AGV-1', status: 'online'  },
      { id: 'AGV-2', status: 'faulted' },
    ],
    systemLogs: [
      { msg: 'ALERT: INBOUND SCAN DELAY — DOOR 7 OVERDUE',   offsetMin: -8  },
      { msg: 'OUTBOUND LOAD COMPLETE — TRAILER #4419 SEALED', offsetMin: -16 },
      { msg: 'INBOUND RECEIVED: 34 PALLETS — DOOR 4',        offsetMin: -25 },
      { msg: 'DRIVER CHECK-IN: TRAILER #4419 — DOOR 6',      offsetMin: -40 },
      { msg: 'SHIFT START — DOCK OPERATIONS — 06:00',        offsetMin: -60 },
    ],
    operators: [
      {
        name:             'B. FLORES',
        role:             'RECEIVING',
        tier:             1,
        shiftMoves:       74,
        consistencyScore: 86,
        alertFlags:       0,
        heatmapProfile:   'consistent',
        equipment:        'slip-shooter',
      },
      {
        name:             'P. NGUYEN',
        role:             'TRAINER',
        tier:             4,
        shiftMoves:       52,
        consistencyScore: 63,
        alertFlags:       0,
        heatmapProfile:   'training',
        equipment:        'forks',
      },
      {
        name:             'L. HARRIS',
        role:             'RECEIVING',
        tier:             3,
        shiftMoves:       68,
        consistencyScore: 44,
        alertFlags:       1,
        heatmapProfile:   'rush',
        equipment:        null,
      },
    ],
  },
}
