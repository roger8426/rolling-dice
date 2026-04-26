import type { SkillProficiencies } from '~/types/business/character'
import type { ProficiencyLevel, SkillKey } from '~/types/business/dnd'

/** 套用技能熟練度；level 為 'none' 時刪除該 key。 */
export function applySkillProficiency(
  skills: SkillProficiencies,
  skill: SkillKey,
  level: ProficiencyLevel,
): SkillProficiencies {
  if (level === 'none') {
    const { [skill]: _omitted, ...rest } = skills
    return rest
  }
  return { ...skills, [skill]: level }
}
