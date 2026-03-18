export const SUBSITES = [
  {
    id: 'diaper', key: '1', label: 'DIAPER LINE', shortName: 'DIAPER',
    suggestedPrompts: [
      'What are the staging zone rules for AGV lanes?',
      'AGV-D04 is faulted — what should I do?',
      'Walk me through the shift handoff checklist.',
    ],
  },
  {
    id: 'charmin', key: '2', label: 'CHARMIN', shortName: 'CHARMIN',
    suggestedPrompts: [
      'Why is the consistency score flagged?',
      'What is the AGV pickup window schedule for C-lanes?',
      'R. Patel has 2 alert flags — what steps should I take?',
    ],
  },
  {
    id: 'bounty', key: '3', label: 'BOUNTY', shortName: 'BOUNTY',
    suggestedPrompts: [
      'What is the AGV pickup interval for B-zone?',
      'What are the overhead clearance rules in B-zone?',
      'Walk me through the conveyor crossing procedure.',
    ],
  },
  {
    id: 'dock', key: '4', label: 'DOCK OPERATIONS', shortName: 'DOCK',
    suggestedPrompts: [
      'Walk me through the outbound load sequence.',
      'What do I do if a trailer moves while being loaded?',
      'What is the scan window for inbound pallets?',
    ],
  },
]

export const SUBSITE_MAP = Object.fromEntries(SUBSITES.map(s => [s.id, s]))
