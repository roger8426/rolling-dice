import { ref } from 'vue'
import type {
  Character,
  CharacterFormState,
  CharacterUpdateFormState,
} from '~/types/business/character'
import type { AbilityKey } from '~/types/business/dnd'
import { ABILITY_KEYS } from '~/constants/dnd'
import { CHARACTERS_STORAGE_KEY } from '~/constants/storage'
import {
  calculateSavingThrowProficiencies,
  createDefaultArmorClass,
  formStateToCharacterPatch,
} from '~/helpers/character'
import { MOCK_CHARACTERS } from '~/mocks/characters'

function loadFromStorage(): Character[] {
  return getLocalStorage<Character[]>(CHARACTERS_STORAGE_KEY) ?? [...MOCK_CHARACTERS]
}

function saveToStorage(characters: Character[]): void {
  setLocalStorage(CHARACTERS_STORAGE_KEY, characters)
}

export const useCharacterStore = defineStore('character', () => {
  const characters = ref<Character[]>(loadFromStorage())

  function getById(id: string): Character | undefined {
    return characters.value.find((c) => c.id === id)
  }

  function addCharacter(formState: CharacterFormState): Character {
    const patch = formStateToCharacterPatch(formState)
    const savingThrowProficiencies = calculateSavingThrowProficiencies(patch.professions)

    const abilities = Object.fromEntries(
      ABILITY_KEYS.map((key) => [key, { basicScore: formState.abilities[key], bonusScore: 0 }]),
    ) as Record<AbilityKey, { basicScore: number; bonusScore: number }>

    const character: Character = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...patch,
      abilities,
      savingThrowProficiencies,
      avatar: null,
      extraHp: 0,
      speedBonus: null,
      initiativeBonus: null,
      passivePerceptionBonus: null,
      armorClass: createDefaultArmorClass(),
      attacks: [],
      learnedSpells: [],
      preparedSpells: [],
    }
    characters.value.push(character)
    saveToStorage(characters.value)
    return character
  }

  function removeCharacter(id: string): void {
    characters.value = characters.value.filter((c) => c.id !== id)
    saveToStorage(characters.value)
  }

  function updateCharacter(id: string, formState: CharacterUpdateFormState): Character | undefined {
    const index = characters.value.findIndex((c) => c.id === id)
    if (index === -1) return undefined

    const existing = characters.value[index]!
    const patch = formStateToCharacterPatch(formState)
    const savingThrowProficiencies = calculateSavingThrowProficiencies(patch.professions)

    const updated: Character = {
      ...existing,
      ...patch,
      abilities: { ...formState.abilities },
      savingThrowProficiencies,
      extraHp: formState.extraHp,
      speedBonus: formState.speedBonus,
      initiativeBonus: formState.initiativeBonus,
      passivePerceptionBonus: formState.passivePerceptionBonus,
      armorClass: { ...formState.armorClass },
      attacks: formState.attacks.map((a) => ({ ...a })),
      learnedSpells: [...formState.learnedSpells],
      preparedSpells: [...formState.preparedSpells],
    }

    characters.value[index] = updated
    saveToStorage(characters.value)
    return updated
  }

  /**
   * 重設角色資料為預設的 MOCK_CHARACTERS，並儲存到 localStorage。
   * 該方法不進測試，僅供開發階段使用，以快速恢復初始資料狀態。
   */
  function resetCharacters(): void {
    characters.value = [...MOCK_CHARACTERS]
    saveToStorage(characters.value)
  }

  return { characters, getById, addCharacter, updateCharacter, removeCharacter, resetCharacters }
})
