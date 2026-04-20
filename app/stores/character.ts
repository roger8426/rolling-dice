import { ref } from 'vue'
import type {
  Character,
  CharacterFormState,
  CharacterUpdateFormState,
  ProfessionEntry,
} from '~/types/business/character'
import type { AbilityKey } from '~/types/business/dnd'
import { ABILITY_KEYS, PROFESSION_CONFIG } from '~/constants/dnd'

const STORAGE_KEY = 'roll-dice:characters'

const MOCK_CHARACTERS: Character[] = [
  {
    id: 'char-001',
    name: '亞倫·鐵拳',
    gender: 'male',
    race: 'dwarf',
    alignment: 'lawfulNeutral',
    professions: [
      { profession: 'monk', level: 3 },
      { profession: 'fighter', level: 2 },
    ],
    totalLevel: 5,
    abilities: {
      strength: { basicScore: 14, bonusScore: 0 },
      dexterity: { basicScore: 16, bonusScore: 0 },
      constitution: { basicScore: 13, bonusScore: 0 },
      intelligence: { basicScore: 8, bonusScore: 0 },
      wisdom: { basicScore: 15, bonusScore: 0 },
      charisma: { basicScore: 10, bonusScore: 0 },
    },
    savingThrowProficiencies: ['strength', 'dexterity'],
    skills: { athletics: 'proficient', acrobatics: 'proficient' },
    background: '隱士',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'char-002',
    name: '璃拉·月之歌',
    gender: 'female',
    race: 'elf',
    alignment: 'chaoticGood',
    professions: [{ profession: 'wizard', level: 3 }],
    totalLevel: 3,
    abilities: {
      strength: { basicScore: 8, bonusScore: 0 },
      dexterity: { basicScore: 14, bonusScore: 0 },
      constitution: { basicScore: 12, bonusScore: 0 },
      intelligence: { basicScore: 16, bonusScore: 0 },
      wisdom: { basicScore: 13, bonusScore: 0 },
      charisma: { basicScore: 10, bonusScore: 0 },
    },
    savingThrowProficiencies: ['intelligence', 'wisdom'],
    skills: { arcana: 'proficient', history: 'proficient', investigation: 'proficient' },
    background: '學者',
    createdAt: '2025-01-15T00:00:00.000Z',
  },
  {
    id: 'char-003',
    name: '達克·暗影',
    gender: 'male',
    race: 'tiefling',
    alignment: 'chaoticNeutral',
    professions: [{ profession: 'rogue', level: 7 }],
    totalLevel: 7,
    abilities: {
      strength: { basicScore: 10, bonusScore: 0 },
      dexterity: { basicScore: 18, bonusScore: 0 },
      constitution: { basicScore: 12, bonusScore: 0 },
      intelligence: { basicScore: 14, bonusScore: 0 },
      wisdom: { basicScore: 10, bonusScore: 0 },
      charisma: { basicScore: 13, bonusScore: 0 },
    },
    savingThrowProficiencies: ['dexterity', 'intelligence'],
    skills: {
      stealth: 'expertise',
      sleightOfHand: 'proficient',
      deception: 'proficient',
      perception: 'proficient',
    },
    background: '罪犯',
    createdAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: 'char-004',
    name: '伊莉絲·星焰',
    gender: 'female',
    race: 'halfElf',
    alignment: 'neutralGood',
    professions: [
      { profession: 'sorcerer', level: 10 },
      { profession: 'warlock', level: 3 },
    ],
    totalLevel: 13,
    abilities: {
      strength: { basicScore: 8, bonusScore: 0 },
      dexterity: { basicScore: 12, bonusScore: 0 },
      constitution: { basicScore: 14, bonusScore: 0 },
      intelligence: { basicScore: 10, bonusScore: 0 },
      wisdom: { basicScore: 13, bonusScore: 0 },
      charisma: { basicScore: 18, bonusScore: 0 },
    },
    savingThrowProficiencies: ['constitution', 'charisma'],
    skills: { persuasion: 'proficient', deception: 'proficient', arcana: 'proficient' },
    background: '貴族',
    createdAt: '2025-03-01T00:00:00.000Z',
  },
  {
    id: 'char-005',
    name: '瓦爾登·聖盾',
    gender: 'male',
    race: 'human',
    alignment: 'lawfulGood',
    professions: [
      { profession: 'paladin', level: 14 },
      { profession: 'cleric', level: 4 },
    ],
    totalLevel: 18,
    abilities: {
      strength: { basicScore: 18, bonusScore: 0 },
      dexterity: { basicScore: 10, bonusScore: 0 },
      constitution: { basicScore: 14, bonusScore: 0 },
      intelligence: { basicScore: 8, bonusScore: 0 },
      wisdom: { basicScore: 14, bonusScore: 0 },
      charisma: { basicScore: 16, bonusScore: 0 },
    },
    savingThrowProficiencies: ['wisdom', 'charisma'],
    skills: {
      athletics: 'proficient',
      medicine: 'proficient',
      persuasion: 'proficient',
      religion: 'proficient',
    },
    background: '侍祭',
    faith: '樂翠拿',
    createdAt: '2025-04-01T00:00:00.000Z',
  },
  {
    id: 'char-006',
    name: '索拉爾·終焉',
    gender: 'male',
    race: 'dragonborn',
    alignment: 'chaoticGood',
    professions: [
      { profession: 'barbarian', level: 12 },
      { profession: 'fighter', level: 5 },
      { profession: 'ranger', level: 3 },
    ],
    totalLevel: 20,
    abilities: {
      strength: { basicScore: 20, bonusScore: 0 },
      dexterity: { basicScore: 14, bonusScore: 0 },
      constitution: { basicScore: 16, bonusScore: 0 },
      intelligence: { basicScore: 8, bonusScore: 0 },
      wisdom: { basicScore: 12, bonusScore: 0 },
      charisma: { basicScore: 10, bonusScore: 0 },
    },
    savingThrowProficiencies: ['strength', 'constitution'],
    skills: {
      athletics: 'expertise',
      survival: 'proficient',
      perception: 'proficient',
      intimidation: 'proficient',
    },
    background: '異鄉人',
    createdAt: '2025-05-01T00:00:00.000Z',
  },
]

function loadFromStorage(): Character[] {
  return getLocalStorage<Character[]>(STORAGE_KEY) ?? [...MOCK_CHARACTERS]
}

function saveToStorage(characters: Character[]): void {
  setLocalStorage(STORAGE_KEY, characters)
}

export const useCharacterStore = defineStore('character', () => {
  const characters = ref<Character[]>(loadFromStorage())

  function getById(id: string): Character | undefined {
    return characters.value.find((c) => c.id === id)
  }

  function addCharacter(formState: CharacterFormState): Character {
    const professions = formState.professions as ProfessionEntry[]
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
      gender: formState.gender as Character['gender'],
      race: formState.race as Character['race'],
      alignment: formState.alignment as Character['alignment'],
      professions,
      totalLevel: formState.professions.reduce((sum, p) => sum + p.level, 0),
      abilities,
      savingThrowProficiencies,
      skills: { ...formState.skills },
      background: formState.background,
      createdAt: new Date().toISOString(),
      ...(formState.isJackOfAllTrades && { isJackOfAllTrades: true }),
      ...(formState.faith && { faith: formState.faith }),
      ...(formState.age != null && { age: formState.age }),
      ...(formState.height && { height: formState.height }),
      ...(formState.weight && { weight: formState.weight }),
      ...(formState.appearance && { appearance: formState.appearance }),
      ...(formState.story && { story: formState.story }),
      ...(formState.languages && { languages: formState.languages }),
      ...(formState.tools && { tools: formState.tools }),
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
    const professions = formState.professions as ProfessionEntry[]
    const primaryProfession = professions[0]?.profession

    const savingThrowProficiencies: AbilityKey[] = primaryProfession
      ? [...PROFESSION_CONFIG[primaryProfession].savingThrowProficiencies]
      : []

    const updated: Character = {
      ...existing,
      name: formState.name,
      gender: formState.gender as Character['gender'],
      race: formState.race as Character['race'],
      alignment: formState.alignment as Character['alignment'],
      professions,
      totalLevel: professions.reduce((sum, p) => sum + p.level, 0),
      abilities: { ...formState.abilities },
      savingThrowProficiencies,
      skills: { ...formState.skills },
      background: formState.background,
      isJackOfAllTrades: formState.isJackOfAllTrades || undefined,
      faith: formState.faith || undefined,
      age: formState.age ?? undefined,
      height: formState.height || undefined,
      weight: formState.weight || undefined,
      appearance: formState.appearance || undefined,
      story: formState.story || undefined,
      languages: formState.languages || undefined,
      tools: formState.tools || undefined,
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
