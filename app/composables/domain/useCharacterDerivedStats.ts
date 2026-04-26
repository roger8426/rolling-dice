import { computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type {
  AbilityScores,
  Character,
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
  validProfessions: ComputedRef<ProfessionEntry[]>
  totalHp: ComputedRef<number>
  totalArmorClass: ComputedRef<number>
  totalInitiative: ComputedRef<number>
  totalSpeed: ComputedRef<number>
  totalPassivePerception: ComputedRef<number>
}

/**
 * 由 update 表單狀態派生角色戰鬥 / 屬性相關衍生數值。
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
    validProfessions,
    totalHp,
    totalArmorClass,
    totalInitiative,
    totalSpeed,
    totalPassivePerception,
  }
}

/**
 * 從已建立的 Character 派生戰鬥 / 屬性數值，給速查（read-only）情境使用。
 * 與 useCharacterDerivedStats 回傳同一組介面，方便共用子元件。
 */
export function useCharacterDerivedStatsFromCharacter(
  character: Ref<Character>,
): CharacterDerivedStats {
  const totalAbilityScores = computed(() => calculateTotalAbilityScores(character.value.abilities))

  const proficiencyBonus = computed(() => getProficiencyBonus(character.value.totalLevel))

  const validProfessions = computed(() => character.value.professions)

  const totalHp = computed(() =>
    calculateTotalHp({
      professions: character.value.professions,
      conModifier: getAbilityModifier(totalAbilityScores.value.constitution),
      isTough: character.value.isTough,
      extraHp: character.value.extraHp,
    }),
  )

  const totalArmorClass = computed(() =>
    getTotalArmorClass(character.value.armorClass, totalAbilityScores.value),
  )

  const totalInitiative = computed(() =>
    calculateTotalInitiative(
      getAbilityModifier(totalAbilityScores.value.dexterity),
      character.value.initiativeBonus,
    ),
  )

  const totalSpeed = computed(() => calculateTotalSpeed(character.value.speedBonus))

  const totalPassivePerception = computed(() => {
    const perceptionBonus = calculatePerceptionSkillBonus({
      wisdomModifier: getAbilityModifier(totalAbilityScores.value.wisdom),
      perceptionLevel: character.value.skills.perception ?? 'none',
      proficiencyBonus: proficiencyBonus.value,
      isJackOfAllTrades: character.value.isJackOfAllTrades,
    })
    return calculateTotalPassivePerception(perceptionBonus, character.value.passivePerceptionBonus)
  })

  return {
    totalAbilityScores,
    proficiencyBonus,
    validProfessions,
    totalHp,
    totalArmorClass,
    totalInitiative,
    totalSpeed,
    totalPassivePerception,
  }
}
