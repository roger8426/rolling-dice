import type { SelectOption } from '@ui'
import type {
  AbilityKey,
  AlignmentKey,
  ArmorType,
  DamageDieType,
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
  /** 職業（null 表示尚未選擇） */
  profession: ProfessionKey | null
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

/** 角色技能熟練度，僅記錄有熟練或專精的技能；'none' 以 key 不存在表示 */
export type SkillProficiencies = Partial<Record<SkillKey, Exclude<ProficiencyLevel, 'none'>>>

// ─── Character ────────────────────────────────────────────────────────────────

/**
 * Character 中可由 form state 直接產生的欄位子集。
 * 僅供 store 邊界使用（mapper 的輸出 + action 消費），composable/page 不應 import。
 */
export type CharacterWritablePatch = Pick<
  Character,
  | 'name'
  | 'gender'
  | 'race'
  | 'alignment'
  | 'professions'
  | 'totalLevel'
  | 'skills'
  | 'background'
  | 'isJackOfAllTrades'
  | 'isTough'
  | 'faith'
  | 'age'
  | 'height'
  | 'weight'
  | 'appearance'
  | 'story'
  | 'languages'
  | 'tools'
  | 'weaponProficiencies'
  | 'armorProficiencies'
>

export interface Character {
  id: string
  name: string
  gender: GenderKey | null
  race: RaceKey | null
  alignment: AlignmentKey | null
  professions: ProfessionEntry[]
  totalLevel: number // 角色總等級，等於所有職業等級之和
  abilities: CharacterAbilityScores
  savingThrowProficiencies: AbilityKey[]
  /** 使用者額外勾選的豁免熟練（不含主職業 baseline） */
  savingThrowExtras: AbilityKey[]
  skills: SkillProficiencies
  background: string | null
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
  weaponProficiencies: string | null
  armorProficiencies: string | null
  avatar: string | null
  /** 額外生命值（與職業 HP、體質加值、健壯加值累加為總 HP） */
  extraHp: number
  /** 額外移動速度加值，移動速度 = 30 + speedBonus */
  speedBonus: number | null
  /** 額外先攻加值 */
  initiativeBonus: number | null
  /** 額外被動察覺加值 */
  passivePerceptionBonus: number | null
  /** 護甲等級設定 */
  armorClass: ArmorClassConfig
  /** 自訂攻擊列表 */
  attacks: AttackEntry[]
  /** 已掌握的法術名稱列表 */
  learnedSpells: string[]
  /** 今日已準備的法術名稱列表，必為 learnedSpells 的子集 */
  preparedSpells: string[]
  /** 角色特性列表（專長、職業能力等） */
  features: CharacterFeature[]
}

// ─── Form State ───────────────────────────────────────────────────────────────

/** 能力值分配方式 */
export type AbilityMethod = 'custom' | 'diceRoll'

/** 擲骰模式下骰值池單元 */
export interface DiceSlot {
  /** 穩定識別，作為下拉 option 的 key 與 value */
  id: string
  /** 擲骰結果（4d6 取最高 3） */
  value: number
  /** 已指派的屬性 key；尚未指派時為 null */
  assignedTo: AbilityKey | null
}

/** 擲骰指派下拉的單一屬性 view model */
export interface DiceCell {
  /** 該屬性目前指派的 slot id；未指派時為空字串 */
  selectedId: string
  /** 下拉選項（首項為「未指派」+ 6 個骰值，其他屬性已指派的標 disabled） */
  options: SelectOption[]
}

/** 角色表單共用基底欄位（未填欄位統一以 null 表示） */
export interface CharacterFormStateBase {
  name: string
  gender: GenderKey | null
  race: RaceKey | null
  alignment: AlignmentKey | null
  professions: FormProfessionEntry[]
  skills: SkillProficiencies
  background: string | null
  isJackOfAllTrades: boolean
  isTough: boolean
  faith: string | null
  age: number | null
  height: string | null
  weight: string | null
  appearance: string | null
  story: string | null
  languages: string | null
  tools: string | null
  weaponProficiencies: string | null
  armorProficiencies: string | null
}

/** 建立角色表單的 draft 狀態 */
export interface CharacterFormState extends CharacterFormStateBase {
  abilities: AbilityScores
  abilityMethod: AbilityMethod
  /** 擲骰模式下產生的骰值池；其他模式維持空陣列 */
  dicePool: DiceSlot[]
}

// ─── Armor Class ──────────────────────────────────────────────────────────────

/** 護甲等級設定 */
export interface ArmorClassConfig {
  /** 護甲類型（null 表示尚未選擇） */
  type: ArmorType | null
  /** 護甲基礎值（使用者自定義，如皮甲 11、鎖甲 16） */
  value: number | null
  /** 額外屬性調整值所使用的屬性鍵（使用者從六種屬性自選，null 表示無） */
  abilityKey: AbilityKey | null
  /** 盾牌加值（預設 0） */
  shieldValue: number
}

// ─── Attack ───────────────────────────────────────────────────────────────────

/** 自訂攻擊項目 */
export interface AttackEntry {
  /** 唯一識別 */
  id: string
  /** 攻擊名稱 */
  name: string
  /** 命中使用的屬性（null 表示未選擇） */
  abilityKey: AbilityKey | null
  /** 傷害骰數量（0 表示不使用該骰型） */
  damageDice: Record<DamageDieType, number>
  /** 額外命中加值（疊加於屬性調整值 + 熟練加值之上） */
  extraHitBonus: number | null
  /** 額外傷害加值（疊加於傷害骰之上） */
  extraDamageBonus: number | null
}

/** 攻擊草稿（尚未具備 id 的攻擊條目，常見於新增/編輯 modal） */
export type AttackDraft = Omit<AttackEntry, 'id'>

// ─── Features ─────────────────────────────────────────────────────────────────

/** 特性來源分類 */
export type FeatureSource = 'feat' | 'class' | 'race' | 'background' | 'other'

/** 特性次數恢復時機 */
export type FeatureUsageRecovery = 'shortRest' | 'longRest' | 'manual'

/** 特性使用次數設定（discriminated union） */
export type FeatureUsage =
  | { hasUses: false }
  | { hasUses: true; max: number; recovery: FeatureUsageRecovery }

/** 角色特性條目（專長、職業能力等） */
export interface CharacterFeature {
  id: string
  name: string
  description: string | null
  source: FeatureSource
  usage: FeatureUsage
}

/** 特性草稿（尚未具備 id 的條目） */
export type FeatureDraft = Omit<CharacterFeature, 'id'>

/** 更新角色表單的狀態（abilities 保留 basicScore + bonusScore 結構） */
export interface CharacterUpdateFormState extends CharacterFormStateBase {
  id: string
  abilities: CharacterAbilityScores
  /** 使用者額外勾選的豁免熟練（不含主職業 baseline） */
  savingThrowExtras: AbilityKey[]
  /** 護甲等級設定 */
  armorClass: ArmorClassConfig
  /** 額外移動速度加值，移動速度 = 30 + speedBonus */
  speedBonus: number | null
  /** 額外先攻加值 */
  initiativeBonus: number | null
  /** 額外被動察覺加值 */
  passivePerceptionBonus: number | null
  /** 額外生命值（與職業 HP、體質加值、健壯加值累加為總 HP） */
  extraHp: number
  /** 自訂攻擊列表 */
  attacks: AttackEntry[]
  /** 已掌握的法術名稱列表 */
  learnedSpells: string[]
  /** 今日已準備的法術名稱列表，必為 learnedSpells 的子集 */
  preparedSpells: string[]
  /** 角色特性列表 */
  features: CharacterFeature[]
}
