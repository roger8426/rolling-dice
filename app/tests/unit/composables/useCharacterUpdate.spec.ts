import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockCharacter } from '~/tests/fixtures/character'
import { CHARACTERS_STORAGE_KEY } from '~/constants/storage'

const mockNavigateTo = vi.fn()

const MOCK_CHARACTER = createMockCharacter({
  id: 'update-001',
  abilities: {
    strength: { basicScore: 15, bonusScore: 2 },
    dexterity: { basicScore: 14, bonusScore: 0 },
    constitution: { basicScore: 13, bonusScore: 1 },
    intelligence: { basicScore: 12, bonusScore: 0 },
    wisdom: { basicScore: 10, bonusScore: 0 },
    charisma: { basicScore: 8, bonusScore: 0 },
  },
  isTough: true,
  faith: '坦帕斯',
  age: 35,
  height: '180cm',
  weight: '75kg',
  appearance: '高大健壯',
  story: '曾是王國的士兵',
  languages: '通用語, 精靈語',
  tools: '鍛造工具',
  weaponProficiencies: '長劍',
  armorProficiencies: '鎧甲',
})

const mockToastError = vi.fn()

async function getComposable(characterId: string) {
  const { useCharacterStore } = await import('~/stores/character')
  vi.stubGlobal('useCharacterStore', useCharacterStore)

  const { useCharacterFormCore } = await import('~/composables/domain/useCharacterFormCore')
  vi.stubGlobal('useCharacterFormCore', useCharacterFormCore)

  const { useCharacterDerivedStats } = await import('~/composables/domain/useCharacterDerivedStats')
  vi.stubGlobal('useCharacterDerivedStats', useCharacterDerivedStats)

  vi.stubGlobal('useToast', () => ({ error: mockToastError }))
  vi.stubGlobal('useSpells', () => ({ getSpell: () => undefined }))

  const { useCharacterUpdate } = await import('~/composables/domain/useCharacterUpdate')
  return useCharacterUpdate(characterId)
}

beforeEach(() => {
  vi.resetModules()
  setActivePinia(createPinia())
  vi.stubGlobal('navigateTo', mockNavigateTo)
  localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify([MOCK_CHARACTER]))
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
  localStorage.clear()
})

// ─── 初始狀態 ──────────────────────────────────────────────────────────────────

describe('useCharacterUpdate — 初始狀態', () => {
  it('應從 store 載入角色並映射至 formState', async () => {
    const { formState, character } = await getComposable('update-001')
    expect(character.value).toBeTruthy()
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
    expect(formState.height).toBe('180cm')
  })

  it('應正確映射 isTough', async () => {
    const { formState } = await getComposable('update-001')
    expect(formState.isTough).toBe(true)
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

  it('找不到角色時 character 應為 undefined', async () => {
    const { character } = await getComposable('non-existent')
    expect(character.value).toBeUndefined()
  })
})

// ─── 職業管理 ──────────────────────────────────────────────────────────────────

describe('useCharacterUpdate — 職業管理', () => {
  it('addProfession 應新增一筆等級為 1 的空職業', async () => {
    const { formState, core } = await getComposable('update-001')
    core.addProfession()
    expect(formState.professions).toHaveLength(2)
    expect(formState.professions[1]!.level).toBe(1)
  })

  it('removeProfession 應移除指定索引的職業', async () => {
    const { formState, core } = await getComposable('update-001')
    core.addProfession()
    formState.professions[1]!.profession = 'wizard'
    core.removeProfession(0)
    expect(formState.professions).toHaveLength(1)
    expect(formState.professions[0]!.profession).toBe('wizard')
  })

  it('removeProfession 在只剩一筆職業時不應移除', async () => {
    const { formState, core } = await getComposable('update-001')
    core.removeProfession(0)
    expect(formState.professions).toHaveLength(1)
  })

  it('totalLevel 應正確計算所有職業等級總和', async () => {
    const { formState, core, derived } = await getComposable('update-001')
    core.addProfession()
    formState.professions[1]!.level = 3
    expect(derived.totalLevel.value).toBe(8)
  })
})

// ─── 屬性更新 ──────────────────────────────────────────────────────────────────

describe('useCharacterUpdate — 屬性更新', () => {
  it('updateBonusScore 應只修改 bonusScore，不影響 basicScore', async () => {
    const { formState, abilities } = await getComposable('update-001')
    abilities.updateBonusScore('strength', 4)
    expect(formState.abilities.strength.bonusScore).toBe(4)
    expect(formState.abilities.strength.basicScore).toBe(15)
  })

  it('updateBonusScore 應能設為 0', async () => {
    const { formState, abilities } = await getComposable('update-001')
    abilities.updateBonusScore('strength', 0)
    expect(formState.abilities.strength.bonusScore).toBe(0)
  })
})

// ─── 技能熟練度 ──────────────────────────────────────────────────────────────

describe('useCharacterUpdate — 技能熟練度', () => {
  it('setSkillProficiency 設定 proficient 後應存入 skills', async () => {
    const { formState, core } = await getComposable('update-001')
    core.setSkillProficiency('arcana', 'proficient')
    expect(formState.skills.arcana).toBe('proficient')
  })

  it('setSkillProficiency 設定 none 後應從 skills 中移除該技能', async () => {
    const { formState, core } = await getComposable('update-001')
    core.setSkillProficiency('athletics', 'none')
    expect(formState.skills.athletics).toBeUndefined()
  })
})

// ─── Combat — 護甲設定 ───────────────────────────────────────────────────────

describe('useCharacterUpdate — 護甲設定', () => {
  it('updateArmorType 應更新護甲類型', async () => {
    const { formState, combat } = await getComposable('update-001')
    combat.updateArmorType('heavy')
    expect(formState.armorClass.type).toBe('heavy')
  })

  it('updateArmorValue 應更新護甲基礎值', async () => {
    const { formState, combat } = await getComposable('update-001')
    combat.updateArmorValue(16)
    expect(formState.armorClass.value).toBe(16)
  })

  it('updateArmorValue 可設為 null（清空）', async () => {
    const { formState, combat } = await getComposable('update-001')
    combat.updateArmorValue(null)
    expect(formState.armorClass.value).toBeNull()
  })

  it('updateArmorAbilityKey 應更新額外屬性鍵', async () => {
    const { formState, combat } = await getComposable('update-001')
    combat.updateArmorAbilityKey('wisdom')
    expect(formState.armorClass.abilityKey).toBe('wisdom')
  })

  it('updateShieldValue 應更新盾牌加值', async () => {
    const { formState, combat } = await getComposable('update-001')
    combat.updateShieldValue(2)
    expect(formState.armorClass.shieldValue).toBe(2)
  })
})

// ─── Combat — 其他屬性 ───────────────────────────────────────────────────────

describe('useCharacterUpdate — 其他屬性', () => {
  it('updateSpeedBonus 應更新 speedBonus', async () => {
    const { formState, combat } = await getComposable('update-001')
    combat.updateSpeedBonus(10)
    expect(formState.speedBonus).toBe(10)
  })

  it('updateSpeedBonus 可設為 0（清空）', async () => {
    const { formState, combat } = await getComposable('update-001')
    combat.updateSpeedBonus(10)
    combat.updateSpeedBonus(0)
    expect(formState.speedBonus).toBe(0)
  })

  it('updateInitiativeBonus 應更新 initiativeBonus', async () => {
    const { formState, combat } = await getComposable('update-001')
    combat.updateInitiativeBonus(3)
    expect(formState.initiativeBonus).toBe(3)
  })

  it('updateInitiativeBonus 可設為 0（清空）', async () => {
    const { formState, combat } = await getComposable('update-001')
    combat.updateInitiativeBonus(3)
    combat.updateInitiativeBonus(0)
    expect(formState.initiativeBonus).toBe(0)
  })

  it('updatePassivePerceptionBonus 應更新 passivePerceptionBonus', async () => {
    const { formState, combat } = await getComposable('update-001')
    combat.updatePassivePerceptionBonus(2)
    expect(formState.passivePerceptionBonus).toBe(2)
  })

  it('updatePassivePerceptionBonus 可設為 0（清空）', async () => {
    const { formState, combat } = await getComposable('update-001')
    combat.updatePassivePerceptionBonus(2)
    combat.updatePassivePerceptionBonus(0)
    expect(formState.passivePerceptionBonus).toBe(0)
  })
})

// ─── 額外生命值 ────────────────────────────────────────────────────────────

describe('useCharacterUpdate — 額外生命值', () => {
  it('updateCustomHpBonus 應更新 customHpBonus', async () => {
    const { formState, combat } = await getComposable('update-001')
    combat.updateCustomHpBonus(12)
    expect(formState.customHpBonus).toBe(12)
  })
})

// ─── canSubmit ──────────────────────────────────────────────────────────────

describe('useCharacterUpdate — canSubmit', () => {
  it('角色名稱有值時 canSubmit 應為 true', async () => {
    const { core } = await getComposable('update-001')
    expect(core.canSubmit.value).toBe(true)
  })

  it('角色名稱為空字串時 canSubmit 應為 false', async () => {
    const { formState, core } = await getComposable('update-001')
    formState.name = ''
    expect(core.canSubmit.value).toBe(false)
  })

  it('角色名稱為空白時 canSubmit 應為 false', async () => {
    const { formState, core } = await getComposable('update-001')
    formState.name = '   '
    expect(core.canSubmit.value).toBe(false)
  })
})

// ─── submit ────────────────────────────────────────────────────────────────

describe('useCharacterUpdate — submit', () => {
  it('submit 應呼叫 store.updateCharacter 並導航至角色詳情頁', async () => {
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    const updateSpy = vi.spyOn(store, 'updateCharacter')

    const { submit } = await getComposable('update-001')
    await submit()
    expect(updateSpy).toHaveBeenCalledOnce()
    expect(mockNavigateTo).toHaveBeenCalledWith('/character/update-001')
  })

  it('submit 後 isSubmitting 應為 true，canSubmit 應為 false', async () => {
    const { core, submit } = await getComposable('update-001')
    const pending = submit()
    expect(core.isSubmitting.value).toBe(true)
    expect(core.canSubmit.value).toBe(false)
    await pending
  })

  it('submit 後再次呼叫 submit 不應重複執行', async () => {
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    const updateSpy = vi.spyOn(store, 'updateCharacter')

    const { submit } = await getComposable('update-001')
    await Promise.all([submit(), submit()])
    expect(updateSpy).toHaveBeenCalledOnce()
    expect(mockNavigateTo).toHaveBeenCalledOnce()
  })

  it('canSubmit 為 false 時 submit 不應執行任何動作', async () => {
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    const updateSpy = vi.spyOn(store, 'updateCharacter')

    const { formState, submit } = await getComposable('update-001')
    formState.name = ''
    await submit()
    expect(updateSpy).not.toHaveBeenCalled()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('store.updateCharacter 回傳 null 時應顯示錯誤 toast 且不導航', async () => {
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    vi.spyOn(store, 'updateCharacter').mockReturnValue(null)

    const { core, submit } = await getComposable('update-001')
    await submit()
    expect(mockToastError).toHaveBeenCalledWith('儲存失敗，請稍後再試')
    expect(mockNavigateTo).not.toHaveBeenCalled()
    expect(core.isSubmitting.value).toBe(false)
  })

  it('store.updateCharacter 拋出例外時應顯示錯誤 toast 且不導航', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    vi.spyOn(store, 'updateCharacter').mockImplementation(() => {
      throw new Error('unexpected')
    })

    const { core, submit } = await getComposable('update-001')
    await submit()
    expect(mockToastError).toHaveBeenCalledWith('儲存失敗，請稍後再試')
    expect(mockNavigateTo).not.toHaveBeenCalled()
    expect(core.isSubmitting.value).toBe(false)
  })
})
