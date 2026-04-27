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

/** 對 Character 做深拷貝，斷開與 store 內部 reactive proxy 的關聯。 */
function cloneCharacter(c: Character): Character {
  return JSON.parse(JSON.stringify(c)) as Character
}

function loadFromStorage(): Character[] {
  const stored = getLocalStorage<Character[]>(CHARACTERS_STORAGE_KEY)
  if (stored) return stored.map(normalizeCharacter)
  return import.meta.dev ? MOCK_CHARACTERS.map(cloneCharacter) : []
}

/** 補齊新版欄位的預設值，避免舊資料反序列化後缺漏。 */
function normalizeCharacter(character: Character): Character {
  return {
    ...character,
    savingThrowExtras: character.savingThrowExtras ?? [],
    features: character.features ?? [],
  }
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
      savingThrowExtras: [],
      avatar: null,
      extraHp: 0,
      speedBonus: null,
      initiativeBonus: null,
      passivePerceptionBonus: null,
      armorClass: createDefaultArmorClass(),
      attacks: [],
      learnedSpells: [],
      preparedSpells: [],
      features: [],
    }
    characters.value.push(character)
    if (!saveToStorage(characters.value)) {
      characters.value.pop()
      return null
    }
    return cloneCharacter(character)
  }

  function removeCharacter(id: string): void {
    characters.value = characters.value.filter((c) => c.id !== id)
    saveToStorage(characters.value)
  }

  function updateCharacter(id: string, formState: CharacterUpdateFormState): Character | null {
    const index = characters.value.findIndex((c) => c.id === id)
    if (index === -1) return null

    const previous = characters.value[index]!
    const patch = formStateToCharacterPatch(formState)
    const baselineSavingThrows = calculateSavingThrowProficiencies(patch.professions)
    const baselineSet = new Set(baselineSavingThrows)
    const savingThrowExtras = formState.savingThrowExtras.filter((key) => !baselineSet.has(key))
    const savingThrowProficiencies = [...baselineSavingThrows, ...savingThrowExtras]

    const learnedSpells = [...formState.learnedSpells]
    const learnedSet = new Set(learnedSpells)
    const preparedSpells = formState.preparedSpells.filter((name) => learnedSet.has(name))

    const updated: Character = {
      ...previous,
      ...patch,
      abilities: JSON.parse(JSON.stringify(formState.abilities)),
      savingThrowProficiencies,
      savingThrowExtras,
      extraHp: formState.extraHp,
      speedBonus: formState.speedBonus,
      initiativeBonus: formState.initiativeBonus,
      passivePerceptionBonus: formState.passivePerceptionBonus,
      armorClass: JSON.parse(JSON.stringify(formState.armorClass)),
      attacks: JSON.parse(JSON.stringify(formState.attacks)),
      learnedSpells,
      preparedSpells,
      features: JSON.parse(JSON.stringify(formState.features)),
    }

    characters.value[index] = updated
    if (!saveToStorage(characters.value)) {
      characters.value[index] = previous
      return null
    }
    return cloneCharacter(updated)
  }

  /** 重設角色為預設 MOCK_CHARACTERS 並寫回 localStorage（僅供開發階段使用）。 */
  function resetCharacters(): void {
    if (!import.meta.dev) return
    characters.value = MOCK_CHARACTERS.map(cloneCharacter)
    saveToStorage(characters.value)
  }

  return { characters, getById, addCharacter, updateCharacter, removeCharacter, resetCharacters }
})
