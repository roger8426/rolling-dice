export type ProfessionKey =
  | 'artificer'
  | 'barbarian'
  | 'bard'
  | 'cleric'
  | 'druid'
  | 'fighter'
  | 'monk'
  | 'paladin'
  | 'ranger'
  | 'rogue'
  | 'sorcerer'
  | 'warlock'
  | 'wizard'

export const PROFESSION_NAMES: Record<ProfessionKey, string> = {
  artificer: '奇械師',
  barbarian: '野蠻人',
  bard: '吟遊詩人',
  cleric: '牧師',
  druid: '德魯伊',
  fighter: '戰士',
  monk: '武僧',
  paladin: '聖武士',
  ranger: '遊俠',
  rogue: '遊蕩者',
  sorcerer: '術士',
  warlock: '契術師',
  wizard: '法師',
}

export const INNER_RING_PROFESSIONS: ProfessionKey[] = [
  'barbarian',
  'fighter',
  'monk',
  'paladin',
  'ranger',
  'rogue',
]

export const OUTER_RING_PROFESSIONS: ProfessionKey[] = [
  'artificer',
  'bard',
  'cleric',
  'druid',
  'sorcerer',
  'warlock',
  'wizard',
]

export const ALL_PROFESSIONS: ProfessionKey[] = [
  ...OUTER_RING_PROFESSIONS,
  ...INNER_RING_PROFESSIONS,
]
