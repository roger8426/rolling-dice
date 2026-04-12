// ─── Profession ───────────────────────────────────────────────────────────────

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

// ─── Ability ──────────────────────────────────────────────────────────────────

export type AbilityKey =
  | 'strength'
  | 'dexterity'
  | 'constitution'
  | 'intelligence'
  | 'wisdom'
  | 'charisma'

// ─── Skill ────────────────────────────────────────────────────────────────────

export type SkillKey =
  | 'acrobatics'
  | 'animalHandling'
  | 'arcana'
  | 'athletics'
  | 'deception'
  | 'history'
  | 'insight'
  | 'intimidation'
  | 'investigation'
  | 'medicine'
  | 'nature'
  | 'perception'
  | 'performance'
  | 'persuasion'
  | 'religion'
  | 'sleightOfHand'
  | 'stealth'
  | 'survival'

// ─── Alignment ────────────────────────────────────────────────────────────────

export type MoralityKey = 'good' | 'neutral' | 'evil'

export type OrderKey = 'lawful' | 'neutral' | 'chaotic'

export type AlignmentKey =
  | 'lawfulGood'
  | 'neutralGood'
  | 'chaoticGood'
  | 'lawfulNeutral'
  | 'trueNeutral'
  | 'chaoticNeutral'
  | 'lawfulEvil'
  | 'neutralEvil'
  | 'chaoticEvil'

// ─── Race ─────────────────────────────────────────────────────────────────────

export type RaceKey =
  | 'human'
  | 'elf'
  | 'dwarf'
  | 'halfling'
  | 'gnome'
  | 'halfElf'
  | 'halfOrc'
  | 'tiefling'
  | 'dragonborn'
  | 'aasimar'
