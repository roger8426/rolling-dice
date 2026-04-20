import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Character } from '~/types/business/character'

const mockNavigateTo = vi.fn()

const MOCK_CHARACTER: Character = {
  id: 'update-001',
  name: '測試角色',
  gender: 'male',
  race: 'human',
  alignment: 'trueNeutral',
  professions: [{ profession: 'fighter', level: 5 }],
  totalLevel: 5,
  abilities: {
    strength: { basicScore: 15, bonusScore: 2 },
    dexterity: { basicScore: 14, bonusScore: 0 },
    constitution: { basicScore: 13, bonusScore: 1 },
    intelligence: { basicScore: 12, bonusScore: 0 },
    wisdom: { basicScore: 10, bonusScore: 0 },
    charisma: { basicScore: 8, bonusScore: 0 },
  },
  savingThrowProficiencies: ['strength', 'constitution'],
  skills: { athletics: 'proficient' },
  background: '士兵',
  faith: '坦帕斯',
  age: 35,
  createdAt: '2026-01-01T00:00:00.000Z',
}

async function getComposable(characterId: string) {
  const { useCharacterStore } = await import('~/stores/character')
  vi.stubGlobal('useCharacterStore', useCharacterStore)

  const { useCharacterUpdate } = await import('~/composables/domain/useCharacterUpdate')
  return useCharacterUpdate(characterId)
}

beforeEach(() => {
  vi.resetModules()
  setActivePinia(createPinia())
  vi.stubGlobal('navigateTo', mockNavigateTo)
  localStorage.setItem('roll-dice:characters', JSON.stringify([MOCK_CHARACTER]))
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
  localStorage.clear()
})

// ─── 初始狀態 ──────────────────────────────────────────────────────────────────

describe('useCharacterUpdate — 初始狀態', () => {
  it('應從 store 載入角色並映射至 formState', async () => {
    const { formState, notFound } = await getComposable('update-001')
    expect(notFound).toBe(false)
    expect(formState.id).toBe('update-001')
    expect(formState.name).toBe('測試角色')
    expect(formState.gender).toBe('male')
    expect(formState.race).toBe('human')
  })

  it('應正確映射 abilities（保留 basicScore 與 bonusScore）', async () => {
    const { formState } = await getComposable('update-001')
    expect(formState.abilities.strength).toEqual({ basicScore: 15, bonusScore: 2 })
    expect(formState.abilities.constitution).toEqual({ basicScore: 13, bonusScore: 1 })
  })

  it('應正確映射 optional 欄位', async () => {
    const { formState } = await getComposable('update-001')
    expect(formState.faith).toBe('坦帕斯')
    expect(formState.age).toBe(35)
    expect(formState.height).toBe('')
  })

  it('應正確映射 professions', async () => {
    const { formState } = await getComposable('update-001')
    expect(formState.professions).toHaveLength(1)
    expect(formState.professions[0]).toEqual({ profession: 'fighter', level: 5 })
  })

  it('應正確映射 skills', async () => {
    const { formState } = await getComposable('update-001')
    expect(formState.skills).toEqual({ athletics: 'proficient' })
  })

  it('activeTab 初始值應為 "basic"', async () => {
    const { activeTab } = await getComposable('update-001')
    expect(activeTab.value).toBe('basic')
  })

  it('找不到角色時 notFound 應為 true', async () => {
    const { notFound } = await getComposable('non-existent')
    expect(notFound).toBe(true)
  })
})

// ─── 職業管理 ──────────────────────────────────────────────────────────────────

describe('useCharacterUpdate — 職業管理', () => {
  it('addProfession 應新增一筆等級為 1 的空職業', async () => {
    const { formState, addProfession } = await getComposable('update-001')
    addProfession()
    expect(formState.professions).toHaveLength(2)
    expect(formState.professions[1]!.level).toBe(1)
  })

  it('removeProfession 應移除指定索引的職業', async () => {
    const { formState, addProfession, removeProfession } = await getComposable('update-001')
    addProfession()
    formState.professions[1]!.profession = 'wizard'
    removeProfession(0)
    expect(formState.professions).toHaveLength(1)
    expect(formState.professions[0]!.profession).toBe('wizard')
  })

  it('removeProfession 在只剩一筆職業時不應移除', async () => {
    const { formState, removeProfession } = await getComposable('update-001')
    removeProfession(0)
    expect(formState.professions).toHaveLength(1)
  })

  it('totalLevel 應正確計算所有職業等級總和', async () => {
    const { formState, totalLevel, addProfession } = await getComposable('update-001')
    addProfession()
    formState.professions[1]!.level = 3
    expect(totalLevel.value).toBe(8)
  })
})

// ─── 屬性更新 ──────────────────────────────────────────────────────────────────

describe('useCharacterUpdate — 屬性更新', () => {
  it('updateBonusScore 應只修改 bonusScore，不影響 basicScore', async () => {
    const { formState, updateBonusScore } = await getComposable('update-001')
    updateBonusScore('strength', 4)
    expect(formState.abilities.strength.bonusScore).toBe(4)
    expect(formState.abilities.strength.basicScore).toBe(15)
  })

  it('updateBonusScore 應能設為 0', async () => {
    const { formState, updateBonusScore } = await getComposable('update-001')
    updateBonusScore('strength', 0)
    expect(formState.abilities.strength.bonusScore).toBe(0)
  })
})

// ─── 技能熟練度 ──────────────────────────────────────────────────────────────

describe('useCharacterUpdate — 技能熟練度', () => {
  it('setSkillProficiency 設定 proficient 後應存入 skills', async () => {
    const { formState, setSkillProficiency } = await getComposable('update-001')
    setSkillProficiency('arcana', 'proficient')
    expect(formState.skills.arcana).toBe('proficient')
  })

  it('setSkillProficiency 設定 none 後應從 skills 中移除該技能', async () => {
    const { formState, setSkillProficiency } = await getComposable('update-001')
    setSkillProficiency('athletics', 'none')
    expect(formState.skills.athletics).toBeUndefined()
  })
})

// ─── canSubmit ──────────────────────────────────────────────────────────────

describe('useCharacterUpdate — canSubmit', () => {
  it('角色名稱有值時 canSubmit 應為 true', async () => {
    const { canSubmit } = await getComposable('update-001')
    expect(canSubmit.value).toBe(true)
  })

  it('角色名稱為空字串時 canSubmit 應為 false', async () => {
    const { formState, canSubmit } = await getComposable('update-001')
    formState.name = ''
    expect(canSubmit.value).toBe(false)
  })

  it('角色名稱為空白時 canSubmit 應為 false', async () => {
    const { formState, canSubmit } = await getComposable('update-001')
    formState.name = '   '
    expect(canSubmit.value).toBe(false)
  })
})

// ─── submit ────────────────────────────────────────────────────────────────

describe('useCharacterUpdate — submit', () => {
  it('submit 應呼叫 store.updateCharacter 並導航至角色詳情頁', async () => {
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    const updateSpy = vi.spyOn(store, 'updateCharacter')

    const { submit } = await getComposable('update-001')
    submit()
    expect(updateSpy).toHaveBeenCalledOnce()
    expect(mockNavigateTo).toHaveBeenCalledWith('/character/update-001')
  })

  it('submit 後 isSubmitting 應為 true，canSubmit 應為 false', async () => {
    const { submit, isSubmitting, canSubmit } = await getComposable('update-001')
    submit()
    expect(isSubmitting.value).toBe(true)
    expect(canSubmit.value).toBe(false)
  })

  it('submit 後再次呼叫 submit 不應重複執行', async () => {
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    const updateSpy = vi.spyOn(store, 'updateCharacter')

    const { submit } = await getComposable('update-001')
    submit()
    submit()
    expect(updateSpy).toHaveBeenCalledOnce()
    expect(mockNavigateTo).toHaveBeenCalledOnce()
  })

  it('canSubmit 為 false 時 submit 不應執行任何動作', async () => {
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    const updateSpy = vi.spyOn(store, 'updateCharacter')

    const { formState, submit } = await getComposable('update-001')
    formState.name = ''
    submit()
    expect(updateSpy).not.toHaveBeenCalled()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })
})
