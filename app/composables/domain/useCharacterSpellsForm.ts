import type { CharacterUpdateFormState } from '~/types/business/character'

/** 角色法術（CharacterCapabilities.learnedSpells）的 form mutation 包裝 */
export function useCharacterSpellsForm(formState: CharacterUpdateFormState) {
  function toggleLearnedSpell(id: string): void {
    const index = formState.learnedSpells.indexOf(id)
    if (index === -1) {
      formState.learnedSpells.push(id)
      return
    }
    formState.learnedSpells.splice(index, 1)
    const preparedIndex = formState.preparedSpells.indexOf(id)
    if (preparedIndex !== -1) formState.preparedSpells.splice(preparedIndex, 1)
  }

  return { toggleLearnedSpell }
}
