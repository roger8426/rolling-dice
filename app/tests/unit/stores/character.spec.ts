import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCharacterStore } from '~/stores/character'
import type { Character, CharacterFormState } from '~/types/business/character'

const MOCK_CHARACTER: Character = {
  id: 'test-001',
  name: '測試角色',
  gender: 'male',
  race: 'human',
  alignment: 'trueNeutral',
  professions: [{ profession: 'fighter', level: 5 }],
  level: 5,
  abilities: {
    strength: 15,
    dexterity: 14,
    constitution: 13,
    intelligence: 12,
    wisdom: 10,
    charisma: 8,
  },
  skills: { athletics: 'proficient' },
  background: '士兵',
  createdAt: '2026-01-01T00:00:00.000Z',
}

const MOCK_FORM_STATE: CharacterFormState = {
  name: '新角色',
  gender: 'female',
  race: 'elf',
  alignment: 'chaoticGood',
  professions: [{ profession: 'wizard', level: 3 }],
  abilities: {
    strength: 8,
    dexterity: 14,
    constitution: 12,
    intelligence: 15,
    wisdom: 13,
    charisma: 10,
  },
  abilityMethod: 'standardArray',
  skills: { arcana: 'proficient' },
  background: '學者',
  faith: '',
  age: null,
  height: '',
  weight: '',
  appearance: '',
  story: '',
  languages: '',
  tools: '',
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('useCharacterStore — 初始化', () => {
  it('localStorage 為空時應載入預設 mock 角色（至少一筆，且每筆具備必要欄位）', () => {
    const store = useCharacterStore()
    expect(store.characters.length).toBeGreaterThan(0)
    expect(store.characters[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      race: expect.any(String),
      professions: expect.any(Array),
      level: expect.any(Number),
      createdAt: expect.any(String),
    })
  })

  it('localStorage 有資料時應從 storage 載入，不覆寫', () => {
    localStorage.setItem('rd:characters', JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    expect(store.characters).toHaveLength(1)
    expect(store.characters[0]!.id).toBe('test-001')
  })
})

describe('useCharacterStore — getById', () => {
  it('存在的 id 應回傳對應的 Character', () => {
    localStorage.setItem('rd:characters', JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    const result = store.getById('test-001')
    expect(result).toBeDefined()
    expect(result?.name).toBe('測試角色')
  })

  it('不存在的 id 應回傳 undefined', () => {
    const store = useCharacterStore()
    expect(store.getById('non-existent-id')).toBeUndefined()
  })
})

describe('useCharacterStore — addCharacter', () => {
  it('新增後 characters 長度應 +1', () => {
    const store = useCharacterStore()
    const before = store.characters.length
    store.addCharacter(MOCK_FORM_STATE)
    expect(store.characters).toHaveLength(before + 1)
  })

  it('新增後應可透過 getById 查到新角色', () => {
    const store = useCharacterStore()
    const created = store.addCharacter(MOCK_FORM_STATE)
    expect(store.getById(created.id)).toBeDefined()
    expect(store.getById(created.id)?.name).toBe('新角色')
  })

  it('新增後應自動生成 id 與 createdAt', () => {
    const store = useCharacterStore()
    const created = store.addCharacter(MOCK_FORM_STATE)
    expect(created.id).toBeTruthy()
    expect(created.createdAt).toBeTruthy()
  })

  it('新增後 level 應為各職業等級的加總', () => {
    const store = useCharacterStore()
    const created = store.addCharacter(MOCK_FORM_STATE)
    expect(created.level).toBe(3)
  })

  it('新增後應同步寫入 localStorage', () => {
    const store = useCharacterStore()
    const created = store.addCharacter(MOCK_FORM_STATE)
    const stored = JSON.parse(localStorage.getItem('rd:characters')!)
    expect(stored.some((c: Character) => c.id === created.id)).toBe(true)
  })
})

describe('useCharacterStore — removeCharacter', () => {
  it('刪除後該角色不應出現在 characters 中', () => {
    localStorage.setItem('rd:characters', JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    store.removeCharacter('test-001')
    expect(store.getById('test-001')).toBeUndefined()
  })

  it('刪除後應同步更新 localStorage', () => {
    localStorage.setItem('rd:characters', JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    store.removeCharacter('test-001')
    const stored = JSON.parse(localStorage.getItem('rd:characters')!)
    expect(stored.some((c: Character) => c.id === 'test-001')).toBe(false)
  })

  it('刪除不存在的 id 時 characters 長度應保持不變', () => {
    const store = useCharacterStore()
    const before = store.characters.length
    store.removeCharacter('non-existent-id')
    expect(store.characters).toHaveLength(before)
  })
})
