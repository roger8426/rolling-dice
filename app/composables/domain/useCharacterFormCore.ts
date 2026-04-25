import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { CharacterFormStateBase } from '~/types/business/character'
import type { ProficiencyLevel, ProfessionKey, SkillKey } from '~/types/business/dnd'
import { applySkillProficiency } from '~/helpers/skill'

export interface CharacterFormCore {
  totalLevel: ComputedRef<number>
  addProfession: () => void
  removeProfession: (index: number) => void
  updateProfession: (index: number, key: ProfessionKey) => void
  updateProfessionLevel: (index: number, level: number) => void
  setSkillProficiency: (skill: SkillKey, level: ProficiencyLevel) => void
  isSubmitting: Ref<boolean>
  canSubmit: ComputedRef<boolean>
}

/**
 * 角色表單共用核心邏輯：professions / skills 增刪改、totalLevel 計算、
 * submit guard（isSubmitting + canSubmit）。
 */
export function useCharacterFormCore<T extends CharacterFormStateBase>(
  formState: T,
): CharacterFormCore {
  const totalLevel = computed(() => formState.professions.reduce((sum, p) => sum + p.level, 0))

  function addProfession(): void {
    formState.professions.push({ profession: null, level: 1 })
  }

  function removeProfession(index: number): void {
    if (formState.professions.length <= 1) return
    formState.professions.splice(index, 1)
  }

  function updateProfession(index: number, key: ProfessionKey): void {
    const entry = formState.professions[index]
    if (entry) entry.profession = key
  }

  function updateProfessionLevel(index: number, level: number): void {
    const entry = formState.professions[index]
    if (entry) entry.level = Math.max(1, Math.min(20, Math.trunc(level) || 1))
  }

  function setSkillProficiency(skill: SkillKey, level: ProficiencyLevel): void {
    formState.skills = applySkillProficiency(formState.skills, skill, level)
  }

  const isSubmitting = ref(false)

  const canSubmit = computed(
    () =>
      !isSubmitting.value &&
      formState.name.trim() !== '' &&
      formState.professions.some((p) => p.profession !== null),
  )

  return {
    totalLevel,
    addProfession,
    removeProfession,
    updateProfession,
    updateProfessionLevel,
    setSkillProficiency,
    isSubmitting,
    canSubmit,
  }
}
