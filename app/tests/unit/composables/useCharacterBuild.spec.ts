import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockNavigateTo = vi.fn()

// 固定骰子結果以利測試：4d6 = [3, 4, 5, 6]，drop lowest → 15
const mockRollDice = vi.fn(() => [3, 4, 5, 6])

async function getComposable() {
  // 先載入 store（需要 pinia 已就緒）
  const { useCharacterStore } = await import('~/stores/character')
  vi.stubGlobal('useCharacterStore', useCharacterStore)

  const { useCharacterBuild } = await import('~/composables/domain/useCharacterBuild')
  return useCharacterBuild()
}

beforeEach(() => {
  vi.resetModules()
  setActivePinia(createPinia())
  vi.stubGlobal('navigateTo', mockNavigateTo)
  vi.stubGlobal('rollDice', mockRollDice)
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
    const { canSubmit } = await getComposable()
    expect(canSubmit.value).toBe(false)
  })
})

// ─── 職業管理 ──────────────────────────────────────────────────────────────────

describe('useCharacterBuild — 職業管理', () => {
  it('addProfession 應新增一筆等級為 1 的空職業', async () => {
    const { formState, addProfession } = await getComposable()
    addProfession()
    expect(formState.professions).toHaveLength(2)
    expect(formState.professions[1]!.level).toBe(1)
  })

  it('removeProfession 應移除指定索引的職業', async () => {
    const { formState, addProfession, removeProfession } = await getComposable()
    formState.professions[0]!.profession = 'fighter'
    addProfession()
    formState.professions[1]!.profession = 'wizard'
    removeProfession(0)
    expect(formState.professions).toHaveLength(1)
    expect(formState.professions[0]!.profession).toBe('wizard')
  })

  it('removeProfession 在只剩一筆職業時不應移除', async () => {
    const { formState, removeProfession } = await getComposable()
    removeProfession(0)
    expect(formState.professions).toHaveLength(1)
  })

  it('totalLevel 應正確計算所有職業等級總和', async () => {
    const { formState, totalLevel, addProfession } = await getComposable()
    formState.professions[0]!.level = 5
    addProfession()
    formState.professions[1]!.level = 3
    expect(totalLevel.value).toBe(8)
  })
})

// ─── 屬性分配方式切換 ────────────────────────────────────────────────────────────

describe('useCharacterBuild — 屬性分配方式切換', () => {
  it('切換至 pointBuy 應重置所有屬性為 8', async () => {
    const { formState, setAbilityMethod } = await getComposable()
    formState.abilities.strength = 15
    setAbilityMethod('pointBuy')
    expect(formState.abilityMethod).toBe('pointBuy')
    expect(formState.abilities.strength).toBe(8)
  })

  it('切換至 custom 應重置所有屬性為 8', async () => {
    const { formState, setAbilityMethod } = await getComposable()
    formState.abilities.strength = 15
    setAbilityMethod('custom')
    expect(formState.abilityMethod).toBe('custom')
    expect(formState.abilities.strength).toBe(8)
  })

  it('切換至 diceRoll 應呼叫 rollDice 並設定所有屬性', async () => {
    const { formState, setAbilityMethod } = await getComposable()
    setAbilityMethod('diceRoll')
    expect(formState.abilityMethod).toBe('diceRoll')
    // mockRollDice 回傳 [3,4,5,6]，drop lowest → 4+5+6 = 15
    expect(formState.abilities.strength).toBe(15)
    expect(formState.abilities.charisma).toBe(15)
    // 每個屬性各呼叫一次 rollDice(6, 4)，共 6 次
    expect(mockRollDice).toHaveBeenCalledTimes(6)
  })
})

// ─── 擲骰與重置 ──────────────────────────────────────────────────────────────

describe('useCharacterBuild — 擲骰與重置', () => {
  it('rollAllAbilities 應為每個屬性擲骰', async () => {
    const { formState, rollAllAbilities } = await getComposable()
    rollAllAbilities()
    const values = Object.values(formState.abilities)
    expect(values.every((v) => v === 15)).toBe(true)
  })

  it('resetAbilities 應將所有屬性重置為 8', async () => {
    const { formState, resetAbilities } = await getComposable()
    formState.abilities.strength = 20
    formState.abilities.dexterity = 18
    resetAbilities()
    const values = Object.values(formState.abilities)
    expect(values.every((v) => v === 8)).toBe(true)
  })
})

// ─── 購點制 ────────────────────────────────────────────────────────────────────

describe('useCharacterBuild — 購點制', () => {
  it('pointBuyRemaining 在非 pointBuy 模式下應為 0', async () => {
    const { pointBuyRemaining } = await getComposable()
    expect(pointBuyRemaining.value).toBe(0)
  })

  it('pointBuyRemaining 在 pointBuy 模式下應計算剩餘點數', async () => {
    const { formState, pointBuyRemaining, setAbilityMethod } = await getComposable()
    setAbilityMethod('pointBuy')
    // 全部為 8，花費 0，剩餘 27
    expect(pointBuyRemaining.value).toBe(27)
    // 將 strength 從 8 調至 10，花費 2
    formState.abilities.strength = 10
    expect(pointBuyRemaining.value).toBe(25)
  })
})

// ─── 技能熟練度 ──────────────────────────────────────────────────────────────

describe('useCharacterBuild — 技能熟練度', () => {
  it('setSkillProficiency 設定 proficient 後應存入 skills', async () => {
    const { formState, setSkillProficiency } = await getComposable()
    setSkillProficiency('athletics', 'proficient')
    expect(formState.skills.athletics).toBe('proficient')
  })

  it('setSkillProficiency 設定 expertise 後應更新 skills', async () => {
    const { formState, setSkillProficiency } = await getComposable()
    setSkillProficiency('stealth', 'expertise')
    expect(formState.skills.stealth).toBe('expertise')
  })

  it('setSkillProficiency 設定 none 後應從 skills 中移除該技能', async () => {
    const { formState, setSkillProficiency } = await getComposable()
    setSkillProficiency('athletics', 'proficient')
    setSkillProficiency('athletics', 'none')
    expect(formState.skills.athletics).toBeUndefined()
  })
})

// ─── 驗證邏輯 ──────────────────────────────────────────────────────────────────

describe('useCharacterBuild — isTabValid (basic)', () => {
  async function fillRequiredFields() {
    const composable = await getComposable()
    composable.formState.name = '測試角色'
    composable.formState.gender = 'male'
    composable.formState.race = 'human'
    composable.formState.alignment = 'trueNeutral'
    composable.formState.background = '士兵'
    composable.formState.professions = [{ profession: 'fighter', level: 5 }]
    return composable
  }

  it('所有必填欄位填寫完成且職業與屬性合法時，basic tab 應為 valid', async () => {
    const { isTabValid } = await fillRequiredFields()
    expect(isTabValid('basic')).toBe(true)
  })

  it('name 為空白時應為 invalid', async () => {
    const { formState, isTabValid } = await fillRequiredFields()
    formState.name = '   '
    expect(isTabValid('basic')).toBe(false)
  })

  it('gender 為空字串時應為 invalid', async () => {
    const { formState, isTabValid } = await fillRequiredFields()
    formState.gender = ''
    expect(isTabValid('basic')).toBe(false)
  })

  it('race 為空字串時應為 invalid', async () => {
    const { formState, isTabValid } = await fillRequiredFields()
    formState.race = ''
    expect(isTabValid('basic')).toBe(false)
  })

  it('alignment 為空字串時應為 invalid', async () => {
    const { formState, isTabValid } = await fillRequiredFields()
    formState.alignment = ''
    expect(isTabValid('basic')).toBe(false)
  })

  it('background 為空白時應為 invalid', async () => {
    const { formState, isTabValid } = await fillRequiredFields()
    formState.background = ''
    expect(isTabValid('basic')).toBe(false)
  })

  it('職業未選擇（空字串）時應為 invalid', async () => {
    const { formState, isTabValid } = await fillRequiredFields()
    formState.professions[0]!.profession = ''
    expect(isTabValid('basic')).toBe(false)
  })

  it('職業等級為 0 時應為 invalid', async () => {
    const { formState, isTabValid } = await fillRequiredFields()
    formState.professions[0]!.level = 0
    expect(isTabValid('basic')).toBe(false)
  })

  it('職業等級超過 20 時應為 invalid', async () => {
    const { formState, isTabValid } = await fillRequiredFields()
    formState.professions[0]!.level = 21
    expect(isTabValid('basic')).toBe(false)
  })

  it('總等級超過 20 時應為 invalid', async () => {
    const { formState, isTabValid, addProfession } = await fillRequiredFields()
    formState.professions[0]!.level = 15
    addProfession()
    formState.professions[1]!.profession = 'wizard'
    formState.professions[1]!.level = 10
    expect(isTabValid('basic')).toBe(false)
  })

  it('pointBuy 模式下屬性超出合法範圍時應為 invalid', async () => {
    const { formState, isTabValid, setAbilityMethod } = await fillRequiredFields()
    setAbilityMethod('pointBuy')
    // 強制設定超出 pointBuy 範圍的值
    formState.abilities.strength = 20
    expect(isTabValid('basic')).toBe(false)
  })

  it('custom 模式下屬性為 0 時應為 invalid', async () => {
    const { formState, isTabValid } = await fillRequiredFields()
    formState.abilities.strength = 0
    expect(isTabValid('basic')).toBe(false)
  })

  it('custom 模式下屬性超過 20 時應為 invalid', async () => {
    const { formState, isTabValid } = await fillRequiredFields()
    formState.abilities.strength = 21
    expect(isTabValid('basic')).toBe(false)
  })

  it('profile tab 應始終為 valid（全為選填）', async () => {
    const { isTabValid } = await getComposable()
    expect(isTabValid('profile')).toBe(true)
  })
})

// ─── canSubmit ──────────────────────────────────────────────────────────────

describe('useCharacterBuild — canSubmit', () => {
  it('所有 tab 皆 valid 時 canSubmit 應為 true', async () => {
    const { formState, canSubmit } = await getComposable()
    formState.name = '完整角色'
    formState.gender = 'female'
    formState.race = 'elf'
    formState.alignment = 'chaoticGood'
    formState.background = '學者'
    formState.professions = [{ profession: 'wizard', level: 3 }]
    expect(canSubmit.value).toBe(true)
  })

  it('任一必填欄位缺漏時 canSubmit 應為 false', async () => {
    const { formState, canSubmit } = await getComposable()
    formState.name = '缺漏角色'
    formState.gender = 'male'
    // race 未填
    formState.alignment = 'trueNeutral'
    formState.background = '士兵'
    formState.professions = [{ profession: 'fighter', level: 1 }]
    expect(canSubmit.value).toBe(false)
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
    formState.gender = 'male'
    formState.race = 'human'
    formState.alignment = 'lawfulGood'
    formState.background = '貴族'
    formState.professions = [{ profession: 'paladin', level: 5 }]

    submit()
    expect(addSpy).toHaveBeenCalledOnce()
    expect(mockNavigateTo).toHaveBeenCalledWith('/character')
  })

  it('submit 後 isSubmitting 應為 true，canSubmit 應為 false（防重複點擊）', async () => {
    const { formState, submit, isSubmitting, canSubmit } = await getComposable()
    formState.name = '防重複角色'
    formState.gender = 'female'
    formState.race = 'elf'
    formState.alignment = 'chaoticGood'
    formState.background = '學者'
    formState.professions = [{ profession: 'wizard', level: 3 }]

    expect(isSubmitting.value).toBe(false)
    submit()
    expect(isSubmitting.value).toBe(true)
    expect(canSubmit.value).toBe(false)
  })

  it('submit 後再次呼叫 submit 不應重複執行', async () => {
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    const addSpy = vi.spyOn(store, 'addCharacter')

    const { formState, submit } = await getComposable()
    formState.name = '重複測試'
    formState.gender = 'male'
    formState.race = 'human'
    formState.alignment = 'trueNeutral'
    formState.background = '士兵'
    formState.professions = [{ profession: 'fighter', level: 1 }]

    submit()
    submit()
    expect(addSpy).toHaveBeenCalledOnce()
    expect(mockNavigateTo).toHaveBeenCalledOnce()
  })

  it('canSubmit 為 false 時 submit 不應執行任何動作', async () => {
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    const addSpy = vi.spyOn(store, 'addCharacter')

    const { submit } = await getComposable()
    submit()
    expect(addSpy).not.toHaveBeenCalled()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })
})
