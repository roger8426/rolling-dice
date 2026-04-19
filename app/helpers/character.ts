import type { CharacterTier } from '~/types/business/character'
import type { ProficiencyLevel } from '~/types/business/dnd'

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
 * 計算單一職業的生命值（使用平均值公式）：(hitDie / 2 + 1) × level
 */
export function getClassHitPoints(hitDie: number, level: number): number {
  return (Math.floor(hitDie / 2) + 1) * level
}
