import { ref } from 'vue'
import type { Character } from '~/types/models/character'

const STORAGE_KEY = 'rd:characters'

const MOCK_CHARACTERS: Character[] = [
  {
    id: 'char-001',
    name: '亞倫·鐵拳',
    race: 'dwarf',
    professions: ['monk', 'fighter'],
    level: 5,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'char-002',
    name: '璃拉·月之歌',
    race: 'elf',
    professions: ['wizard'],
    level: 3,
    createdAt: '2025-01-15T00:00:00.000Z',
  },
  {
    id: 'char-003',
    name: '達克·暗影',
    race: 'tiefling',
    professions: ['rogue'],
    level: 7,
    createdAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: 'char-004',
    name: '伊莉絲·星焰',
    race: 'halfElf',
    professions: ['sorcerer', 'warlock'],
    level: 13,
    createdAt: '2025-03-01T00:00:00.000Z',
  },
  {
    id: 'char-005',
    name: '瓦爾登·聖盾',
    race: 'human',
    professions: ['paladin', 'cleric'],
    level: 18,
    createdAt: '2025-04-01T00:00:00.000Z',
  },
  {
    id: 'char-006',
    name: '索拉爾·終焉',
    race: 'dragonborn',
    professions: ['barbarian', 'fighter', 'ranger'],
    level: 20,
    createdAt: '2025-05-01T00:00:00.000Z',
  },
]

function loadFromStorage(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Character[]
  } catch {
    // ignore
  }
  return [...MOCK_CHARACTERS]
}

function saveToStorage(characters: Character[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters))
}

export const useCharacterStore = defineStore('character', () => {
  const characters = ref<Character[]>(loadFromStorage())

  function getById(id: string): Character | undefined {
    return characters.value.find((c) => c.id === id)
  }

  function addCharacter(character: Character): void {
    characters.value.push(character)
    saveToStorage(characters.value)
  }

  function removeCharacter(id: string): void {
    characters.value = characters.value.filter((c) => c.id !== id)
    saveToStorage(characters.value)
  }

  return { characters, getById, addCharacter, removeCharacter }
})
