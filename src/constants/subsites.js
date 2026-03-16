export const SUBSITES = [
  { id: 'diaper',  key: '1', label: 'DIAPER LINE',     shortName: 'DIAPER'  },
  { id: 'charmin', key: '2', label: 'CHARMIN',          shortName: 'CHARMIN' },
  { id: 'bounty',  key: '3', label: 'BOUNTY',           shortName: 'BOUNTY'  },
  { id: 'dock',    key: '4', label: 'DOCK OPERATIONS',  shortName: 'DOCK'    },
]

export const SUBSITE_MAP = Object.fromEntries(SUBSITES.map(s => [s.id, s]))
