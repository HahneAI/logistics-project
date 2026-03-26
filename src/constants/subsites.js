export const SUBSITES = [
  {
    id: 'bounty', key: '1', label: 'BOUNTY', shortName: 'BOUNTY',
    suggestedPrompts: [
      'What is the AGV pickup interval for B-zone?',
      'What are the overhead clearance rules in B-zone?',
      'Walk me through the conveyor crossing procedure.',
    ],
  },
  {
    id: 'charmin', key: '2', label: 'GX', shortName: 'GX',
    suggestedPrompts: [
      'Why is the consistency score flagged?',
      'What is the AGV pickup window schedule for C-lanes?',
      'R. Patel has 2 alert flags — what steps should I take?',
    ],
  },
  {
    id: 'diaper', key: '3', label: 'BUILDING 5', shortName: 'BLDG 5',
    suggestedPrompts: [
      'What are the staging zone rules for AGV lanes?',
      'AGV-D04 is faulted — what should I do?',
      'Walk me through the shift handoff checklist.',
    ],
  },
  {
    id: 'dock', key: '4', label: 'BUILDING 10', shortName: 'BLDG 10',
    suggestedPrompts: [
      'Walk me through the outbound load sequence.',
      'What do I do if a trailer moves while being loaded?',
      'What is the scan window for inbound pallets?',
    ],
  },
]

export const SUBSITE_MAP = Object.fromEntries(SUBSITES.map(s => [s.id, s]))
