import type {
  Character,
  CharacterCurrency,
  CharacterFormState,
  CharacterUpdateFormState,
  InventoryItem,
} from '~/types/business/character'
import type { AbilityKey } from '~/types/business/dnd'
import { ABILITY_KEYS } from '~/constants/dnd'
import { CHARACTERS_STORAGE_KEY } from '~/constants/storage'
import {
  calculateSavingThrowProficiencies,
  createDefaultArmorClass,
  formStateToCharacterPatch,
} from '~/helpers/character'
import { createDefaultInventory } from '~/helpers/inventory'
import { MOCK_CHARACTERS } from '~/mocks/characters'

/** 對 Character 做深拷貝，斷開與 store 內部 reactive proxy 的關聯。 */
function cloneCharacter(c: Character): Character {
  return JSON.parse(JSON.stringify(c)) as Character
}

function loadFromStorage(): Character[] {
  const stored = getLocalStorage<Character[]>(CHARACTERS_STORAGE_KEY)
  if (stored) {
    return stored.map((c) => ({
      ...createDefaultInventory(),
      ...c,
      savingThrowExtras: c.savingThrowExtras ?? [],
      features: c.features ?? [],
      attacks: c.attacks ?? [],
    }))
  }
  return import.meta.dev ? MOCK_CHARACTERS.map(cloneCharacter) : []
}

function saveToStorage(characters: Character[]): boolean {
  return setLocalStorage(CHARACTERS_STORAGE_KEY, characters)
}

export const useCharacterStore = defineStore('character', () => {
  const characters = ref<Character[]>(loadFromStorage())

  function getById(id: string): Character | undefined {
    const found = characters.value.find((c) => c.id === id)
    return found ? cloneCharacter(found) : undefined
  }

  function addCharacter(formState: CharacterFormState): Character | null {
    const patch = formStateToCharacterPatch(formState)

    const abilities = Object.fromEntries(
      ABILITY_KEYS.map((key) => [
        key,
        {
          origin: formState.abilities[key].origin,
          race: formState.abilities[key].race,
          bonusScore: 0,
        },
      ]),
    ) as Record<AbilityKey, { origin: number; race: number; bonusScore: number }>

    const character: Character = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...patch,
      abilities,
      savingThrowExtras: [],
      avatar: null,
      customHpBonus: 0,
      speedBonus: 0,
      initiativeBonus: 0,
      passivePerceptionBonus: 0,
      armorClass: createDefaultArmorClass(),
      attacks: [],
      learnedSpells: [],
      preparedSpells: [],
      features: [],
      ...createDefaultInventory(),
    }
    characters.value.push(character)
    if (!saveToStorage(characters.value)) {
      characters.value.pop()
      return null
    }
    return cloneCharacter(character)
  }

  function removeCharacter(id: string): boolean {
    const index = characters.value.findIndex((c) => c.id === id)
    if (index === -1) return false
    const previous = characters.value[index]!
    characters.value.splice(index, 1)
    if (!saveToStorage(characters.value)) {
      characters.value.splice(index, 0, previous)
      return false
    }
    return true
  }

  function updateCharacter(id: string, formState: CharacterUpdateFormState): Character | null {
    const index = characters.value.findIndex((c) => c.id === id)
    if (index === -1) return null

    const previous = characters.value[index]!
    const patch = formStateToCharacterPatch(formState)
    const baselineSavingThrows = calculateSavingThrowProficiencies(patch.professions)
    const baselineSet = new Set(baselineSavingThrows)
    const savingThrowExtras = formState.savingThrowExtras.filter((key) => !baselineSet.has(key))

    const learnedSpells = [...formState.learnedSpells]
    const learnedSet = new Set(learnedSpells)
    const preparedSpells = formState.preparedSpells.filter((id) => learnedSet.has(id))

    const updated: Character = {
      ...previous,
      ...patch,
      abilities: JSON.parse(JSON.stringify(formState.abilities)),
      savingThrowExtras,
      customHpBonus: formState.customHpBonus,
      speedBonus: formState.speedBonus,
      initiativeBonus: formState.initiativeBonus,
      passivePerceptionBonus: formState.passivePerceptionBonus,
      armorClass: JSON.parse(JSON.stringify(formState.armorClass)),
      attacks: JSON.parse(JSON.stringify(formState.attacks)),
      learnedSpells,
      preparedSpells,
      features: JSON.parse(JSON.stringify(formState.features)),
      items: JSON.parse(JSON.stringify(formState.items)),
      currency: { ...formState.currency },
    }

    characters.value[index] = updated
    if (!saveToStorage(characters.value)) {
      characters.value[index] = previous
      return null
    }
    return cloneCharacter(updated)
  }

  function updateInventory(
    id: string,
    items: InventoryItem[],
    currency: CharacterCurrency,
  ): boolean {
    const index = characters.value.findIndex((c) => c.id === id)
    if (index === -1) return false
    const previous = characters.value[index]!
    characters.value[index] = {
      ...previous,
      items: JSON.parse(JSON.stringify(items)),
      currency: { ...currency },
    }
    if (!saveToStorage(characters.value)) {
      characters.value[index] = previous
      return false
    }
    return true
  }

  /** 重設角色為預設 MOCK_CHARACTERS 並寫回 localStorage（僅供開發階段使用）。 */
  function resetCharacters(): void {
    if (!import.meta.dev) return
    characters.value = MOCK_CHARACTERS.map(cloneCharacter)
    saveToStorage(characters.value)
  }

  return {
    characters,
    getById,
    addCharacter,
    updateCharacter,
    updateInventory,
    removeCharacter,
    resetCharacters,
  }
})
