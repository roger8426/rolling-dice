import type { CharacterUpdateFormState } from '~/types/business/character'

/** 角色法術（CharacterCapabilities.learnedSpells / preparedSpells）的 form mutation 包裝 */
export function useCharacterSpellsForm(formState: CharacterUpdateFormState) {
  const { getSpell } = useSpells()

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

  function togglePreparedSpell(id: string): void {
    if (getSpell(id)?.level === 0) return
    if (!formState.learnedSpells.includes(id)) return
    const index = formState.preparedSpells.indexOf(id)
    if (index === -1) {
      formState.preparedSpells.push(id)
    } else {
      formState.preparedSpells.splice(index, 1)
    }
  }

  return { toggleLearnedSpell, togglePreparedSpell }
}
