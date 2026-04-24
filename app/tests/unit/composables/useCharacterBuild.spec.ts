import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockNavigateTo = vi.fn()

// 固定能力值擲骰結果：每次呼叫都回傳 15
const mockRollAbilityScore = vi.fn(() => 15)

const mockToastError = vi.fn()

async function getComposable() {
  const { useCharacterStore } = await import('~/stores/character')
  vi.stubGlobal('useCharacterStore', useCharacterStore)

  const { useCharacterFormCore } = await import('~/composables/domain/useCharacterFormCore')
  vi.stubGlobal('useCharacterFormCore', useCharacterFormCore)

  vi.stubGlobal('useToast', () => ({ error: mockToastError }))

  const { useCharacterBuild } = await import('~/composables/domain/useCharacterBuild')
  return useCharacterBuild()
}

beforeEach(() => {
  vi.resetModules()
  setActivePinia(createPinia())
  vi.stubGlobal('navigateTo', mockNavigateTo)
  vi.stubGlobal('rollAbilityScore', mockRollAbilityScore)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

// ─── 初始狀態 ──────────────────────────────────────────────────────────────────

describe('useCharacterBuild — 初始狀態', () => {
  it('activeTab 初始值應為 "basic"', async () => {
    const { activeTab } = await getComposable()
    expect(activeTab.value).toBe('basic')
  })

  it('formState.name 初始值應為空字串', async () => {
    const { formState } = await getComposable()
    expect(formState.name).toBe('')
  })

  it('formState.abilityMethod 初始值應為 "custom"', async () => {
    const { formState } = await getComposable()
    expect(formState.abilityMethod).toBe('custom')
  })

  it('formState.professions 應有一筆預設職業、等級為 1', async () => {
    const { formState } = await getComposable()
    expect(formState.professions).toHaveLength(1)
    expect(formState.professions[0]!.level).toBe(1)
  })

  it('所有屬性初始值應為 8（購點制預設值）', async () => {
    const { formState } = await getComposable()
    const values = Object.values(formState.abilities)
    expect(values).toHaveLength(6)
    expect(values.every((v) => v === 8)).toBe(true)
  })

  it('canSubmit 初始值應為 false（表單尚未填寫）', async () => {
    const { core } = await getComposable()
    expect(core.canSubmit.value).toBe(false)
  })

  it('formState.isTough 初始值應為 false', async () => {
    const { formState } = await getComposable()
    expect(formState.isTough).toBe(false)
  })
})

// ─── 職業管理 ──────────────────────────────────────────────────────────────────

describe('useCharacterBuild — 職業管理', () => {
  it('addProfession 應新增一筆等級為 1 的空職業', async () => {
    const { formState, core } = await getComposable()
    core.addProfession()
    expect(formState.professions).toHaveLength(2)
    expect(formState.professions[1]!.level).toBe(1)
  })

  it('removeProfession 應移除指定索引的職業', async () => {
    const { formState, core } = await getComposable()
    formState.professions[0]!.profession = 'fighter'
    core.addProfession()
    formState.professions[1]!.profession = 'wizard'
    core.removeProfession(0)
    expect(formState.professions).toHaveLength(1)
    expect(formState.professions[0]!.profession).toBe('wizard')
  })

  it('removeProfession 在只剩一筆職業時不應移除', async () => {
    const { formState, core } = await getComposable()
    core.removeProfession(0)
    expect(formState.professions).toHaveLength(1)
  })

  it('totalLevel 應正確計算所有職業等級總和', async () => {
    const { formState, core } = await getComposable()
    formState.professions[0]!.level = 5
    core.addProfession()
    formState.professions[1]!.level = 3
    expect(core.totalLevel.value).toBe(8)
  })
})

// ─── 屬性分配方式切換 ────────────────────────────────────────────────────────────

describe('useCharacterBuild — 屬性分配方式切換', () => {
  it('切換至 pointBuy 應重置所有屬性為 8', async () => {
    const { formState, abilities } = await getComposable()
    formState.abilities.strength = 15
    abilities.setAbilityMethod('pointBuy')
    expect(formState.abilityMethod).toBe('pointBuy')
    expect(formState.abilities.strength).toBe(8)
  })

  it('切換至 custom 應重置所有屬性為 8', async () => {
    const { formState, abilities } = await getComposable()
    formState.abilities.strength = 15
    abilities.setAbilityMethod('custom')
    expect(formState.abilityMethod).toBe('custom')
    expect(formState.abilities.strength).toBe(8)
  })

  it('切換至 diceRoll 應呼叫 rollAbilityScore 並設定所有屬性', async () => {
    const { formState, abilities } = await getComposable()
    abilities.setAbilityMethod('diceRoll')
    expect(formState.abilityMethod).toBe('diceRoll')
    // mockRollAbilityScore 回傳 15
    expect(formState.abilities.strength).toBe(15)
    expect(formState.abilities.charisma).toBe(15)
    // 每個屬性各呼叫一次 rollAbilityScore，共 6 次
    expect(mockRollAbilityScore).toHaveBeenCalledTimes(6)
  })
})

// ─── 擲骰與重置 ──────────────────────────────────────────────────────────────

describe('useCharacterBuild — 擲骰與重置', () => {
  it('rollAllAbilities 應為每個屬性擲骰', async () => {
    const { formState, abilities } = await getComposable()
    abilities.rollAllAbilities()
    const values = Object.values(formState.abilities)
    expect(values.every((v) => v === 15)).toBe(true)
  })

  it('resetAbilities 應將所有屬性重置為 8', async () => {
    const { formState, abilities } = await getComposable()
    formState.abilities.strength = 20
    formState.abilities.dexterity = 18
    abilities.resetAbilities()
    const values = Object.values(formState.abilities)
    expect(values.every((v) => v === 8)).toBe(true)
  })
})

// ─── 購點制 ────────────────────────────────────────────────────────────────────

describe('useCharacterBuild — 購點制', () => {
  it('pointBuyRemaining 在非 pointBuy 模式下應為 0', async () => {
    const { abilities } = await getComposable()
    expect(abilities.pointBuyRemaining.value).toBe(0)
  })

  it('pointBuyRemaining 在 pointBuy 模式下應計算剩餘點數', async () => {
    const { formState, abilities } = await getComposable()
    abilities.setAbilityMethod('pointBuy')
    // 全部為 8，花費 0，剩餘 27
    expect(abilities.pointBuyRemaining.value).toBe(27)
    // 將 strength 從 8 調至 10，花費 2
    formState.abilities.strength = 10
    expect(abilities.pointBuyRemaining.value).toBe(25)
  })
})

// ─── 技能熟練度 ──────────────────────────────────────────────────────────────

describe('useCharacterBuild — 技能熟練度', () => {
  it('setSkillProficiency 設定 proficient 後應存入 skills', async () => {
    const { formState, core } = await getComposable()
    core.setSkillProficiency('athletics', 'proficient')
    expect(formState.skills.athletics).toBe('proficient')
  })

  it('setSkillProficiency 設定 expertise 後應更新 skills', async () => {
    const { formState, core } = await getComposable()
    core.setSkillProficiency('stealth', 'expertise')
    expect(formState.skills.stealth).toBe('expertise')
  })

  it('setSkillProficiency 設定 none 後應從 skills 中移除該技能', async () => {
    const { formState, core } = await getComposable()
    core.setSkillProficiency('athletics', 'proficient')
    core.setSkillProficiency('athletics', 'none')
    expect(formState.skills.athletics).toBeUndefined()
  })
})

// ─── canSubmit ──────────────────────────────────────────────────────────────

describe('useCharacterBuild — canSubmit', () => {
  it('名稱與職業皆填寫時 canSubmit 應為 true', async () => {
    const { formState, core } = await getComposable()
    formState.name = '完整角色'
    formState.professions[0]!.profession = 'fighter'
    expect(core.canSubmit.value).toBe(true)
  })

  it('角色名稱為空字串時 canSubmit 應為 false', async () => {
    const { core } = await getComposable()
    expect(core.canSubmit.value).toBe(false)
  })

  it('角色名稱為空白時 canSubmit 應為 false', async () => {
    const { formState, core } = await getComposable()
    formState.name = '   '
    formState.professions[0]!.profession = 'fighter'
    expect(core.canSubmit.value).toBe(false)
  })

  it('職業未選擇時 canSubmit 應為 false', async () => {
    const { formState, core } = await getComposable()
    formState.name = '有名稱'
    expect(core.canSubmit.value).toBe(false)
  })
})

// ─── submit ────────────────────────────────────────────────────────────────

describe('useCharacterBuild — submit', () => {
  it('canSubmit 為 true 時 submit 應呼叫 store.addCharacter 並導航至 /character', async () => {
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    const addSpy = vi.spyOn(store, 'addCharacter')

    const { formState, submit } = await getComposable()
    formState.name = '提交角色'
    formState.professions[0]!.profession = 'fighter'

    await submit()
    expect(addSpy).toHaveBeenCalledOnce()
    expect(mockNavigateTo).toHaveBeenCalledWith('/character')
  })

  it('submit 後 isSubmitting 應為 true，canSubmit 應為 false（防重複點擊）', async () => {
    const { formState, core, submit } = await getComposable()
    formState.name = '防重複角色'
    formState.professions[0]!.profession = 'fighter'

    expect(core.isSubmitting.value).toBe(false)
    const pending = submit()
    expect(core.isSubmitting.value).toBe(true)
    expect(core.canSubmit.value).toBe(false)
    await pending
  })

  it('submit 後再次呼叫 submit 不應重複執行', async () => {
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    const addSpy = vi.spyOn(store, 'addCharacter')

    const { formState, submit } = await getComposable()
    formState.name = '重複測試'
    formState.professions[0]!.profession = 'fighter'

    await Promise.all([submit(), submit()])
    expect(addSpy).toHaveBeenCalledOnce()
    expect(mockNavigateTo).toHaveBeenCalledOnce()
  })

  it('canSubmit 為 false 時 submit 不應執行任何動作', async () => {
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    const addSpy = vi.spyOn(store, 'addCharacter')

    const { submit } = await getComposable()
    await submit()
    expect(addSpy).not.toHaveBeenCalled()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('store.addCharacter 回傳 null 時應顯示錯誤 toast 且不導航', async () => {
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    vi.spyOn(store, 'addCharacter').mockReturnValue(null)

    const { formState, core, submit } = await getComposable()
    formState.name = '失敗角色'
    formState.professions[0]!.profession = 'fighter'

    await submit()
    expect(mockToastError).toHaveBeenCalledWith('儲存失敗，請稍後再試')
    expect(mockNavigateTo).not.toHaveBeenCalled()
    expect(core.isSubmitting.value).toBe(false)
  })

  it('store.addCharacter 拋出例外時應顯示錯誤 toast 且不導航', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    vi.spyOn(store, 'addCharacter').mockImplementation(() => {
      throw new Error('unexpected')
    })

    const { formState, core, submit } = await getComposable()
    formState.name = '例外角色'
    formState.professions[0]!.profession = 'fighter'

    await submit()
    expect(mockToastError).toHaveBeenCalledWith('儲存失敗，請稍後再試')
    expect(mockNavigateTo).not.toHaveBeenCalled()
    expect(core.isSubmitting.value).toBe(false)
  })
})
