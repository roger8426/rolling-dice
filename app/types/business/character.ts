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

/** 表單用職業條目：允許尚未選擇職業的空值狀態 */
export interface FormProfessionEntry {
  /** 職業（空字串表示尚未選擇） */
  profession: ProfessionKey | ''
  /** 該職業等級（1–20） */
  level: number
}

// ─── Abilities ────────────────────────────────────────────────────────────────

/** 表單用六項屬性分數（純數字），以 AbilityKey 為鍵 */
export type AbilityScores = Record<AbilityKey, number>

/** 角色屬性值儲存單元：基礎分數與獎勵加值 */
export interface AbilityScoreEntry {
  /** 建立角色時的初始屬性分數 */
  basicScore: number
  /** 升級或冒險途中獲得的屬性提升 */
  bonusScore: number
}

/** 角色六項屬性完整資料，以 AbilityKey 為鍵 */
export type CharacterAbilityScores = Record<AbilityKey, AbilityScoreEntry>

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
  totalLevel: number // 角色總等級，等於所有職業等級之和
  abilities: CharacterAbilityScores
  savingThrowProficiencies: AbilityKey[]
  skills: SkillProficiencies
  background: string
  isJackOfAllTrades: boolean // 是否全能高手（1/2 熟練）
  isTough: boolean // 是否具有健壯特質（每等額外 2 HP）
  createdAt: string
  faith: string | null
  age: number | null
  height: string | null
  weight: string | null
  appearance: string | null
  story: string | null
  languages: string | null
  tools: string | null
  weapons: string | null
  armors: string | null
  avatar: string | null
}

// ─── Form State ───────────────────────────────────────────────────────────────

/** 能力值分配方式 */
export type AbilityMethod = 'pointBuy' | 'custom' | 'diceRoll'

/** 角色表單共用基底欄位 */
export interface CharacterFormStateBase {
  name: string
  gender: GenderKey | ''
  race: RaceKey | ''
  alignment: AlignmentKey | ''
  professions: FormProfessionEntry[]
  skills: SkillProficiencies
  background: string
  isJackOfAllTrades: boolean
  isTough: boolean
  faith: string
  age: number | null
  height: string
  weight: string
  appearance: string
  story: string
  languages: string
  tools: string
  weapons: string
  armors: string
}

/** 建立角色表單的 draft 狀態 */
export interface CharacterFormState extends CharacterFormStateBase {
  abilities: AbilityScores
  abilityMethod: AbilityMethod
}

/** 更新角色表單的狀態（abilities 保留 basicScore + bonusScore 結構） */
export interface CharacterUpdateFormState extends CharacterFormStateBase {
  id: string
  abilities: CharacterAbilityScores
}
