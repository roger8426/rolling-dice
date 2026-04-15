import { ref } from 'vue'
import type { Character, CharacterFormState, ProfessionEntry } from '~/types/business/character'

const STORAGE_KEY = 'rd:characters'

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
    level: 5,
    abilities: {
      strength: 14,
      dexterity: 16,
      constitution: 13,
      intelligence: 8,
      wisdom: 15,
      charisma: 10,
    },
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
    level: 3,
    abilities: {
      strength: 8,
      dexterity: 14,
      constitution: 12,
      intelligence: 16,
      wisdom: 13,
      charisma: 10,
    },
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
    level: 7,
    abilities: {
      strength: 10,
      dexterity: 18,
      constitution: 12,
      intelligence: 14,
      wisdom: 10,
      charisma: 13,
    },
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
    level: 13,
    abilities: {
      strength: 8,
      dexterity: 12,
      constitution: 14,
      intelligence: 10,
      wisdom: 13,
      charisma: 18,
    },
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
    level: 18,
    abilities: {
      strength: 18,
      dexterity: 10,
      constitution: 14,
      intelligence: 8,
      wisdom: 14,
      charisma: 16,
    },
    skills: {
      athletics: 'proficient',
      medicine: 'proficient',
      persuasion: 'proficient',
      religion: 'proficient',
    },
    background: '侍祭',
    faith: '乐翠拿',
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
    level: 20,
    abilities: {
      strength: 20,
      dexterity: 14,
      constitution: 16,
      intelligence: 8,
      wisdom: 12,
      charisma: 10,
    },
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
    const character: Character = {
      id: crypto.randomUUID(),
      name: formState.name,
      gender: formState.gender as Character['gender'],
      race: formState.race as Character['race'],
      alignment: formState.alignment as Character['alignment'],
      professions: formState.professions as ProfessionEntry[],
      level: formState.professions.reduce((sum, p) => sum + p.level, 0),
      abilities: { ...formState.abilities },
      skills: { ...formState.skills },
      background: formState.background,
      createdAt: new Date().toISOString(),
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

  return { characters, getById, addCharacter, removeCharacter }
})
