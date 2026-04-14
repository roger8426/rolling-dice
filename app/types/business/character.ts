import type {
  AbilityKey,
  AlignmentKey,
  GenderKey,
  ProfessionKey,
  ProficiencyLevel,
  RaceKey,
  SkillKey,
} from '~/types/business/dnd'

export type CharacterTier = 'common' | 'elite' | 'master' | 'legendary'

// ─── Professions ──────────────────────────────────────────────────────────────

/** 單一職業條目：職業 key 與該職業等級 */
export interface ProfessionEntry {
  /** 職業 */
  profession: ProfessionKey
  /** 該職業等級（1–20） */
  level: number
}

// ─── Abilities ────────────────────────────────────────────────────────────────

/** 六項屬性分數，以 AbilityKey 為鍵 */
export type AbilityScores = Record<AbilityKey, number>

/** 單項屬性資料：屬性值、調整值與豁免熟練狀態 */
export interface AbilityScore {
  /** 屬性原始分數（1–20） */
  score: number
  /** 調整值，計算方式：floor((score - 10) / 2) */
  modifier: number
  /** 豁免是否熟練 */
  savingThrowProficient: boolean
}

/** 角色六項屬性完整資料，以 AbilityKey 為鍵，確保六項皆存在 */
export type CharacterAbilities = Record<AbilityKey, AbilityScore>

// ─── Skills ───────────────────────────────────────────────────────────────────

/** 角色技能熟練度，僅記錄有熟練或專精的技能 */
export type SkillProficiencies = Partial<Record<SkillKey, ProficiencyLevel>>

// ─── Character ────────────────────────────────────────────────────────────────

export interface Character {
  id: string
  name: string
  gender: GenderKey
  race: RaceKey
  alignment: AlignmentKey
  professions: ProfessionEntry[]
  level: number
  abilities: AbilityScores
  skills: SkillProficiencies
  background: string
  createdAt: string
  faith?: string
  age?: number
  height?: string
  weight?: string
  appearance?: string
  story?: string
  languages?: string
  tools?: string
  avatar?: string
}

// ─── Form State ───────────────────────────────────────────────────────────────

/** 能力值分配方式 */
export type AbilityMethod = 'pointBuy' | 'custom' | 'diceRoll'

/** 建立角色表單的 draft 狀態 */
export interface CharacterFormState {
  name: string
  gender: GenderKey | ''
  race: RaceKey | ''
  alignment: AlignmentKey | ''
  professions: ProfessionEntry[]
  abilities: AbilityScores
  abilityMethod: AbilityMethod
  skills: SkillProficiencies
  background: string
  faith: string
  age: number | null
  height: string
  weight: string
  appearance: string
  story: string
  languages: string
  tools: string
}
