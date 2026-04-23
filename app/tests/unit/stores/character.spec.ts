import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { CHARACTERS_STORAGE_KEY } from '~/constants/storage'
import { useCharacterStore } from '~/stores/character'
import type {
  Character,
  CharacterFormState,
  CharacterUpdateFormState,
} from '~/types/business/character'

const MOCK_CHARACTER: Character = {
  id: 'test-001',
  name: '測試角色',
  gender: 'male',
  race: 'human',
  alignment: 'trueNeutral',
  professions: [{ profession: 'fighter', level: 5 }],
  totalLevel: 5,
  abilities: {
    strength: { basicScore: 15, bonusScore: 0 },
    dexterity: { basicScore: 14, bonusScore: 0 },
    constitution: { basicScore: 13, bonusScore: 0 },
    intelligence: { basicScore: 12, bonusScore: 0 },
    wisdom: { basicScore: 10, bonusScore: 0 },
    charisma: { basicScore: 8, bonusScore: 0 },
  },
  savingThrowProficiencies: ['strength', 'constitution'],
  skills: { athletics: 'proficient' },
  background: '士兵',
  isJackOfAllTrades: false,
  isTough: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  faith: null,
  age: null,
  height: null,
  weight: null,
  appearance: null,
  story: null,
  languages: null,
  tools: null,
  weaponProficiencies: null,
  armorProficiencies: null,
  avatar: null,
  extraHp: 0,
  speedBonus: null,
  initiativeBonus: null,
  passivePerceptionBonus: null,
  armorClass: { type: 'none', value: 10, abilityKey: null, shieldValue: 0 },
  attacks: [],
  learnedSpells: [],
  preparedSpells: [],
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
  abilityMethod: 'custom',
  skills: { arcana: 'proficient' },
  background: '學者',
  isJackOfAllTrades: false,
  isTough: false,
  faith: null,
  age: null,
  height: null,
  weight: null,
  appearance: null,
  story: null,
  languages: null,
  tools: null,
  weaponProficiencies: null,
  armorProficiencies: null,
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
      totalLevel: expect.any(Number),
      createdAt: expect.any(String),
    })
  })

  it('localStorage 有資料時應從 storage 載入，不覆寫', () => {
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    expect(store.characters).toHaveLength(1)
    expect(store.characters[0]!.id).toBe('test-001')
  })
})

describe('useCharacterStore — getById', () => {
  it('存在的 id 應回傳對應的 Character', () => {
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify([MOCK_CHARACTER]))
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
    expect(created.totalLevel).toBe(3)
  })

  it('新增後應同步寫入 localStorage', () => {
    const store = useCharacterStore()
    const created = store.addCharacter(MOCK_FORM_STATE)
    const stored = JSON.parse(localStorage.getItem(CHARACTERS_STORAGE_KEY)!)
    expect(stored.some((c: Character) => c.id === created.id)).toBe(true)
  })

  it('isTough 為 true 時應寫入角色資料', () => {
    const store = useCharacterStore()
    const created = store.addCharacter({ ...MOCK_FORM_STATE, isTough: true })
    expect(created.isTough).toBe(true)
  })

  it('isTough 為 false 時應寫入 false', () => {
    const store = useCharacterStore()
    const created = store.addCharacter({ ...MOCK_FORM_STATE, isTough: false })
    expect(created.isTough).toBe(false)
  })

  it('新增後 speedBonus / initiativeBonus / passivePerceptionBonus 應初始化為 null', () => {
    const store = useCharacterStore()
    const created = store.addCharacter(MOCK_FORM_STATE)
    expect(created.speedBonus).toBeNull()
    expect(created.initiativeBonus).toBeNull()
    expect(created.passivePerceptionBonus).toBeNull()
  })
})

describe('useCharacterStore — removeCharacter', () => {
  it('刪除後該角色不應出現在 characters 中', () => {
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    store.removeCharacter('test-001')
    expect(store.getById('test-001')).toBeUndefined()
  })

  it('刪除後應同步更新 localStorage', () => {
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    store.removeCharacter('test-001')
    const stored = JSON.parse(localStorage.getItem(CHARACTERS_STORAGE_KEY)!)
    expect(stored.some((c: Character) => c.id === 'test-001')).toBe(false)
  })

  it('刪除不存在的 id 時 characters 長度應保持不變', () => {
    const store = useCharacterStore()
    const before = store.characters.length
    store.removeCharacter('non-existent-id')
    expect(store.characters).toHaveLength(before)
  })
})

const MOCK_UPDATE_FORM_STATE: CharacterUpdateFormState = {
  id: 'test-001',
  name: '更新後角色',
  gender: 'female',
  race: 'elf',
  alignment: 'chaoticGood',
  professions: [
    { profession: 'wizard', level: 5 },
    { profession: 'cleric', level: 3 },
  ],
  abilities: {
    strength: { basicScore: 15, bonusScore: 2 },
    dexterity: { basicScore: 14, bonusScore: 0 },
    constitution: { basicScore: 13, bonusScore: 1 },
    intelligence: { basicScore: 12, bonusScore: 0 },
    wisdom: { basicScore: 10, bonusScore: 0 },
    charisma: { basicScore: 8, bonusScore: 0 },
  },
  skills: { arcana: 'proficient', religion: 'proficient' },
  background: '學者',
  isJackOfAllTrades: true,
  isTough: false,
  faith: '密斯特拉',
  age: 120,
  height: '165cm',
  weight: '50kg',
  appearance: '銀白長髮',
  story: '來自遠方的精靈法師',
  languages: '通用語, 精靈語',
  tools: '書法工具',
  weaponProficiencies: null,
  armorProficiencies: null,
  armorClass: { type: 'none', value: 10, abilityKey: null, shieldValue: 0 },
  speedBonus: null,
  initiativeBonus: null,
  passivePerceptionBonus: null,
  extraHp: 0,
  attacks: [],
  learnedSpells: [],
  preparedSpells: [],
}

describe('useCharacterStore — updateCharacter', () => {
  it('更新後角色名稱與欄位應反映新值', () => {
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    const updated = store.updateCharacter('test-001', MOCK_UPDATE_FORM_STATE)
    expect(updated).toBeDefined()
    expect(updated!.name).toBe('更新後角色')
    expect(updated!.gender).toBe('female')
    expect(updated!.race).toBe('elf')
    expect(updated!.faith).toBe('密斯特拉')
    expect(updated!.age).toBe(120)
  })

  it('更新後 totalLevel 應為各職業等級的加總', () => {
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    const updated = store.updateCharacter('test-001', MOCK_UPDATE_FORM_STATE)
    expect(updated!.totalLevel).toBe(8)
  })

  it('更新後 savingThrowProficiencies 應根據主職業重新計算', () => {
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    const updated = store.updateCharacter('test-001', MOCK_UPDATE_FORM_STATE)
    expect(updated!.savingThrowProficiencies).toEqual(['intelligence', 'wisdom'])
  })

  it('更新後 abilities 應保留 basicScore 與 bonusScore', () => {
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    const updated = store.updateCharacter('test-001', MOCK_UPDATE_FORM_STATE)
    expect(updated!.abilities.strength).toEqual({ basicScore: 15, bonusScore: 2 })
    expect(updated!.abilities.constitution).toEqual({ basicScore: 13, bonusScore: 1 })
  })

  it('更新後應保留原始 id 與 createdAt', () => {
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    const updated = store.updateCharacter('test-001', MOCK_UPDATE_FORM_STATE)
    expect(updated!.id).toBe('test-001')
    expect(updated!.createdAt).toBe('2026-01-01T00:00:00.000Z')
  })

  it('更新後應同步寫入 localStorage', () => {
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    store.updateCharacter('test-001', MOCK_UPDATE_FORM_STATE)
    const stored = JSON.parse(localStorage.getItem(CHARACTERS_STORAGE_KEY)!)
    expect(stored[0].name).toBe('更新後角色')
  })

  it('更新不存在的 id 時應回傳 undefined 且 characters 不變', () => {
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    const before = store.characters.length
    const result = store.updateCharacter('non-existent-id', MOCK_UPDATE_FORM_STATE)
    expect(result).toBeUndefined()
    expect(store.characters).toHaveLength(before)
  })

  it('更新後 speedBonus / initiativeBonus / passivePerceptionBonus 應從 formState 寫入', () => {
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    const updated = store.updateCharacter('test-001', {
      ...MOCK_UPDATE_FORM_STATE,
      speedBonus: 10,
      initiativeBonus: 3,
      passivePerceptionBonus: 2,
    })
    expect(updated!.speedBonus).toBe(10)
    expect(updated!.initiativeBonus).toBe(3)
    expect(updated!.passivePerceptionBonus).toBe(2)
  })

  it('formState 的 speedBonus 等為 null 時應寫入 null', () => {
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    const updated = store.updateCharacter('test-001', MOCK_UPDATE_FORM_STATE)
    expect(updated!.speedBonus).toBeNull()
    expect(updated!.initiativeBonus).toBeNull()
    expect(updated!.passivePerceptionBonus).toBeNull()
  })

  it('空字串的 optional 欄位更新後應為 null', () => {
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify([MOCK_CHARACTER]))
    const store = useCharacterStore()
    const updated = store.updateCharacter('test-001', {
      ...MOCK_UPDATE_FORM_STATE,
      faith: '',
      age: null,
      height: '',
    })
    expect(updated!.faith).toBeNull()
    expect(updated!.age).toBeNull()
    expect(updated!.height).toBeNull()
  })
})
