import { ref } from 'vue'
import type {
  Character,
  CharacterFormState,
  CharacterUpdateFormState,
  ProfessionEntry,
} from '~/types/business/character'
import type { AbilityKey } from '~/types/business/dnd'
import { ABILITY_KEYS, PROFESSION_CONFIG } from '~/constants/dnd'
import { CHARACTERS_STORAGE_KEY } from '~/constants/storage'
import { createDefaultArmorClass } from '~/helpers/character'
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
    const professions = formState.professions.filter(
      (p): p is ProfessionEntry => p.profession !== null,
    )
    const primaryProfession = professions[0]?.profession

    const abilities = Object.fromEntries(
      ABILITY_KEYS.map((key) => [key, { basicScore: formState.abilities[key], bonusScore: 0 }]),
    ) as Record<AbilityKey, { basicScore: number; bonusScore: number }>

    const savingThrowProficiencies: AbilityKey[] = primaryProfession
      ? [...PROFESSION_CONFIG[primaryProfession].savingThrowProficiencies]
      : []

    const character: Character = {
      id: crypto.randomUUID(),
      name: formState.name,
      gender: formState.gender || 'nonBinary',
      race: formState.race as Character['race'],
      alignment: formState.alignment as Character['alignment'],
      professions,
      totalLevel: formState.professions.reduce((sum, p) => sum + p.level, 0),
      abilities,
      savingThrowProficiencies,
      skills: { ...formState.skills },
      background: formState.background || null,
      isTough: formState.isTough,
      isJackOfAllTrades: formState.isJackOfAllTrades,
      createdAt: new Date().toISOString(),
      faith: formState.faith || null,
      age: formState.age ?? null,
      height: formState.height || null,
      weight: formState.weight || null,
      appearance: formState.appearance || null,
      story: formState.story || null,
      languages: formState.languages || null,
      tools: formState.tools || null,
      weaponProficiencies: formState.weaponProficiencies || null,
      armorProficiencies: formState.armorProficiencies || null,
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
    const professions = formState.professions.filter(
      (p): p is ProfessionEntry => p.profession !== null,
    )
    const primaryProfession = professions[0]?.profession

    const savingThrowProficiencies: AbilityKey[] = primaryProfession
      ? [...PROFESSION_CONFIG[primaryProfession].savingThrowProficiencies]
      : []

    const updated: Character = {
      ...existing,
      name: formState.name,
      gender: formState.gender || 'nonBinary',
      race: formState.race as Character['race'],
      alignment: formState.alignment as Character['alignment'],
      professions,
      totalLevel: professions.reduce((sum, p) => sum + p.level, 0),
      abilities: { ...formState.abilities },
      savingThrowProficiencies,
      skills: { ...formState.skills },
      background: formState.background || null,
      isJackOfAllTrades: formState.isJackOfAllTrades,
      isTough: formState.isTough,
      faith: formState.faith || null,
      age: formState.age ?? null,
      height: formState.height || null,
      weight: formState.weight || null,
      appearance: formState.appearance || null,
      story: formState.story || null,
      languages: formState.languages || null,
      tools: formState.tools || null,
      weaponProficiencies: formState.weaponProficiencies || null,
      armorProficiencies: formState.armorProficiencies || null,
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
