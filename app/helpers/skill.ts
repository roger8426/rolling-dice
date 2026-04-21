import type { SkillProficiencies } from '~/types/business/character'
import type { ProficiencyLevel, SkillKey } from '~/types/business/dnd'

export function applySkillProficiency(
  skills: SkillProficiencies,
  skill: SkillKey,
  level: ProficiencyLevel,
): SkillProficiencies {
  if (level === 'none') {
    return Object.fromEntries(
      Object.entries(skills).filter(([k]) => k !== skill),
    ) as SkillProficiencies
  }
  return { ...skills, [skill]: level }
}
