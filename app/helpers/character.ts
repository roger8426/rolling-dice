import type {
  AbilityScores,
  ArmorClassConfig,
  CharacterFormStateBase,
  CharacterTier,
  CharacterWritablePatch,
  ProfessionEntry,
} from '~/types/business/character'
import type { AbilityKey, ArmorType, ProficiencyLevel } from '~/types/business/dnd'
import { PROFESSION_CONFIG } from '~/constants/dnd'
import { getAbilityModifier } from '~/helpers/ability'

export function getCharacterTier(level: number): CharacterTier {
  if (level >= 17) return 'legendary'
  if (level >= 11) return 'master'
  if (level >= 5) return 'elite'
  return 'common'
}

/**
 * 計算熟練加值：floor((totalLevel - 1) / 4) + 2
 * 1–4 級 → +2、5–8 級 → +3、9–12 級 → +4、13–16 級 → +5、17–20 級 → +6
 */
export function getProficiencyBonus(totalLevel: number): number {
  return Math.floor((totalLevel - 1) / 4) + 2
}

/**
 * 計算豁免加值：modifier + (proficient ? proficiencyBonus : 0)
 */
export function getSavingThrowBonus(
  modifier: number,
  proficient: boolean,
  proficiencyBonus: number,
): number {
  return modifier + (proficient ? proficiencyBonus : 0)
}

/**
 * 計算技能檢定加值：
 * - none → modifier
 * - proficient → modifier + proficiencyBonus
 * - expertise → modifier + proficiencyBonus × 2
 */
export function getSkillBonus(
  modifier: number,
  proficiencyLevel: ProficiencyLevel,
  proficiencyBonus: number,
): number {
  if (proficiencyLevel === 'expertise') return modifier + proficiencyBonus * 2
  if (proficiencyLevel === 'proficient') return modifier + proficiencyBonus
  return modifier
}

/**
 * 計算單一職業的生命值
 * - 主職業（isPrimary）第 1 級取滿生命骰，其餘等級使用平均值
 * - 非主職業全部使用平均值：(hitDie / 2 + 1) × level
 */
export function getClassHitPoints(hitDie: number, level: number, isPrimary: boolean): number {
  const avg = Math.floor(hitDie / 2) + 1
  if (isPrimary && level >= 1) {
    return hitDie + avg * (level - 1)
  }
  return avg * level
}

/**
 * 計算護甲基礎值（AC base + DEX 調整）：
 * - 重甲：baseValue（不加 DEX）
 * - 中甲：baseValue + min(DEX, +2)
 * - 輕甲 / 無甲 / 未選：baseValue + 完整 DEX
 */
export function getBaseArmorClass(
  baseValue: number,
  dexModifier: number,
  type: ArmorType | null,
): number {
  if (type === 'heavy') return baseValue
  if (type === 'medium') return baseValue + Math.min(dexModifier, 2)
  return baseValue + dexModifier
}

/**
 * 由護甲設定與屬性分數計算最終 AC：
 * base（依護甲類型處理 DEX）+ 額外屬性加值 + 盾牌加值。
 */
export function getTotalArmorClass(config: ArmorClassConfig, abilityScores: AbilityScores): number {
  const baseValue = config.value ?? 10
  const dexModifier = getAbilityModifier(abilityScores.dexterity)
  let ac = getBaseArmorClass(baseValue, dexModifier, config.type)

  if (config.abilityKey) {
    ac += getAbilityModifier(abilityScores[config.abilityKey])
  }

  return ac + config.shieldValue
}

/**
 * 建立 Character 預設的護甲設定：無甲、基礎值 10、無額外屬性、無盾牌。
 * 用於新增角色或尚未設定戰鬥資訊時的初始值。
 */
export function createDefaultArmorClass(): ArmorClassConfig {
  return { type: 'none', value: 10, abilityKey: null, shieldValue: 0 }
}

/**
 * 計算被動感知：10 + 感知（Perception）技能加值
 */
export function getPassivePerception(perceptionBonus: number): number {
  return 10 + perceptionBonus
}

/**
 * 由（已過濾的）職業陣列取得豁免熟練屬性，
 * 規則：取主職業（第一個 entry）的 savingThrowProficiencies；無主職業時回傳空陣列。
 */
export function calculateSavingThrowProficiencies(professions: ProfessionEntry[]): AbilityKey[] {
  const primary = professions[0]
  if (!primary) return []
  return [...PROFESSION_CONFIG[primary.profession].savingThrowProficiencies]
}

/**
 * 將 form state 的共用欄位轉為 Character 可寫入的 patch。
 * 僅處理 build/update 兩端共用的欄位；abilities / armorClass / attacks / spells /
 * bonus 欄位 / savingThrowProficiencies 由呼叫端個別拼接。
 *
 * 內部依領域分段組織（identity / progression / profile / proficiencies），
 * 未來領域切片（方案 B）時可對應拆為子 mapper。
 */
export function formStateToCharacterPatch(
  formState: CharacterFormStateBase,
): CharacterWritablePatch {
  // identity
  const name = formState.name
  const gender = formState.gender || 'nonBinary'
  const race = formState.race as CharacterWritablePatch['race']
  const alignment = formState.alignment as CharacterWritablePatch['alignment']

  // progression
  const professions = formState.professions.filter(
    (p): p is ProfessionEntry => p.profession !== null,
  )
  const totalLevel = professions.reduce((sum, p) => sum + p.level, 0)

  // skills & toggles
  const skills = { ...formState.skills }
  const isJackOfAllTrades = formState.isJackOfAllTrades
  const isTough = formState.isTough

  // profile
  const background = formState.background || null
  const faith = formState.faith || null
  const age = formState.age ?? null
  const height = formState.height || null
  const weight = formState.weight || null
  const appearance = formState.appearance || null
  const story = formState.story || null

  // proficiencies
  const languages = formState.languages || null
  const tools = formState.tools || null
  const weaponProficiencies = formState.weaponProficiencies || null
  const armorProficiencies = formState.armorProficiencies || null

  return {
    name,
    gender,
    race,
    alignment,
    professions,
    totalLevel,
    skills,
    isJackOfAllTrades,
    isTough,
    background,
    faith,
    age,
    height,
    weight,
    appearance,
    story,
    languages,
    tools,
    weaponProficiencies,
    armorProficiencies,
  }
}
