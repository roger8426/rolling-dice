import type {
  AbilityKey,
  // AlignmentKey,
  // GenderKey,
  ProfessionKey,
  // ProficiencyLevel,
  RaceKey,
  // SizeKey,
  // SkillKey,
} from '~/types/business/dnd'

export type CharacterTier = 'common' | 'elite' | 'master' | 'legendary'

export interface Character {
  id: string
  name: string
  race: RaceKey
  professions: ProfessionKey[]
  level: number
  createdAt: string
  avatar?: string
}

// ─── Profile ──────────────────────────────────────────────────────────────────

/** 角色個人資料 */
// export interface CharacterProfile {
//   /** 角色名稱 */
//   name: string
//   /** 種族 */
//   race: RaceKey
//   /** 陣營 */
//   alignment: AlignmentKey
//   /** 體型（依 D&D 尺寸分類） */
//   build: SizeKey
//   /** 性別 */
//   gender: GenderKey
//   /** 背景（暫為自由文字，後續改為 BackgroundKey） */
//   background: string
//   /** 所有職業等級加總 */
//   totalLevel: number
//   /** 信仰神祇（選填） */
//   faith?: string
//   /** 年齡（選填） */
//   age?: number
//   /** 身高，自由描述，如 "175cm"（選填） */
//   height?: string
//   /** 體重，自由描述，如 "70kg"（選填） */
//   weight?: string
//   /** 外貌簡述，字數上限 20（選填） */
//   appearance?: string
// }

// ─── Abilities ────────────────────────────────────────────────────────────────

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

// ─── Professions ──────────────────────────────────────────────────────────────

/** 單一職業條目：職業 key 與該職業等級 */
// export interface ProfessionEntry {
//   /** 職業 */
//   profession: ProfessionKey
//   /** 該職業等級（1–20） */
//   level: number
// }

/** 角色職業列表，index 0 為主職業，其餘依序為兼職 */
// export type CharacterProfessions = ProfessionEntry[]

// ─── Skills ───────────────────────────────────────────────────────────────────

/** 單項技能資料 */
// export interface SkillEntry {
//   /** 熟練等級 */
//   proficiency: ProficiencyLevel
// }

/** 角色 18 項技能完整資料，以 SkillKey 為鍵，確保 18 項皆存在 */
// export type CharacterSkills = Record<SkillKey, SkillEntry>
