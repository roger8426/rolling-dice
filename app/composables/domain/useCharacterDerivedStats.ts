import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type {
  AbilityScores,
  CharacterUpdateFormState,
  ProfessionEntry,
} from '~/types/business/character'
import {
  calculatePerceptionSkillBonus,
  calculateTotalAbilityScores,
  calculateTotalHp,
  calculateTotalInitiative,
  calculateTotalPassivePerception,
  calculateTotalSpeed,
  getProficiencyBonus,
  getTotalArmorClass,
} from '~/helpers/character'
import { getAbilityModifier } from '~/helpers/ability'

export interface CharacterDerivedStats {
  totalAbilityScores: ComputedRef<AbilityScores>
  proficiencyBonus: ComputedRef<number>
  totalHp: ComputedRef<number>
  totalArmorClass: ComputedRef<number>
  totalInitiative: ComputedRef<number>
  totalSpeed: ComputedRef<number>
  totalPassivePerception: ComputedRef<number>
}

/**
 * 由 update 表單狀態派生角色戰鬥 / 屬性相關衍生數值。
 * 所有計算委派給 helpers 純函式，此 composable 只負責 reactive 包裝與組合。
 */
export function useCharacterDerivedStats(
  formState: CharacterUpdateFormState,
): CharacterDerivedStats {
  const totalAbilityScores = computed(() => calculateTotalAbilityScores(formState.abilities))

  const totalLevel = computed(() => formState.professions.reduce((sum, p) => sum + p.level, 0))
  const proficiencyBonus = computed(() => getProficiencyBonus(totalLevel.value))

  const validProfessions = computed<ProfessionEntry[]>(() =>
    formState.professions.filter((p): p is ProfessionEntry => p.profession !== null),
  )

  const totalHp = computed(() =>
    calculateTotalHp({
      professions: validProfessions.value,
      conModifier: getAbilityModifier(totalAbilityScores.value.constitution),
      isTough: formState.isTough,
      extraHp: formState.extraHp,
    }),
  )

  const totalArmorClass = computed(() =>
    getTotalArmorClass(formState.armorClass, totalAbilityScores.value),
  )

  const totalInitiative = computed(() =>
    calculateTotalInitiative(
      getAbilityModifier(totalAbilityScores.value.dexterity),
      formState.initiativeBonus,
    ),
  )

  const totalSpeed = computed(() => calculateTotalSpeed(formState.speedBonus))

  const totalPassivePerception = computed(() => {
    const perceptionBonus = calculatePerceptionSkillBonus({
      wisdomModifier: getAbilityModifier(totalAbilityScores.value.wisdom),
      perceptionLevel: formState.skills.perception ?? 'none',
      proficiencyBonus: proficiencyBonus.value,
      isJackOfAllTrades: formState.isJackOfAllTrades,
    })
    return calculateTotalPassivePerception(perceptionBonus, formState.passivePerceptionBonus)
  })

  return {
    totalAbilityScores,
    proficiencyBonus,
    totalHp,
    totalArmorClass,
    totalInitiative,
    totalSpeed,
    totalPassivePerception,
  }
}
