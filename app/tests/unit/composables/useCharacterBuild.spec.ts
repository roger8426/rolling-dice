import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockNavigateTo = vi.fn()

// 固定能力值擲骰結果：每次呼叫都回傳 15
const mockRollAbilityScore = vi.fn(() => 15)

vi.mock('~/helpers/dice', () => ({
  rollAbilityScore: mockRollAbilityScore,
  rollDice: vi.fn(() => [4, 4, 4, 4]),
}))

const mockToastError = vi.fn()

async function getComposable() {
  const { useCharacterStore } = await import('~/stores/character')
  vi.stubGlobal('useCharacterStore', useCharacterStore)

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
    const { canSubmit } = await getComposable()
    expect(canSubmit.value).toBe(false)
  })

  it('formState.isTough 初始值應為 false', async () => {
    const { formState } = await getComposable()
    expect(formState.isTough).toBe(false)
  })
})

// ─── 職業管理 ──────────────────────────────────────────────────────────────────

describe('useCharacterBuild — 職業管理', () => {
  it('totalLevel 應正確計算所有職業等級總和', async () => {
    const { formState, totalLevel } = await getComposable()
    formState.professions[0]!.level = 5
    formState.professions.push({ profession: null, level: 3 })
    expect(totalLevel.value).toBe(8)
  })
})

// ─── 屬性分配方式切換 ────────────────────────────────────────────────────────────

describe('useCharacterBuild — 屬性分配方式切換', () => {
  it('切換至 custom 應重置所有屬性為 8', async () => {
    const { formState, abilities } = await getComposable()
    abilities.setAbilityMethod('diceRoll')
    formState.abilities.strength = 15
    abilities.setAbilityMethod('custom')
    expect(formState.abilityMethod).toBe('custom')
    expect(formState.abilities.strength).toBe(8)
  })

  it('在同一模式下重複呼叫 setAbilityMethod 不應觸發重置', async () => {
    const { formState, abilities } = await getComposable()
    abilities.setAbilityMethod('diceRoll')
    abilities.assignDiceToAbility('strength', formState.dicePool[0]!.id)
    const callCountBefore = mockRollAbilityScore.mock.calls.length

    abilities.setAbilityMethod('diceRoll')

    expect(mockRollAbilityScore.mock.calls.length).toBe(callCountBefore)
    expect(formState.dicePool[0]!.assignedTo).toBe('strength')
  })

  it('切換至 diceRoll 應產生 6 個骰值池且 abilities 維持預設 8', async () => {
    const { formState, abilities } = await getComposable()
    abilities.setAbilityMethod('diceRoll')
    expect(formState.abilityMethod).toBe('diceRoll')
    expect(formState.dicePool).toHaveLength(6)
    expect(formState.dicePool.every((slot) => slot.value === 15)).toBe(true)
    expect(formState.dicePool.every((slot) => slot.assignedTo === null)).toBe(true)
    expect(Object.values(formState.abilities).every((v) => v === 8)).toBe(true)
    expect(mockRollAbilityScore).toHaveBeenCalledTimes(6)
  })
})

// ─── 擲骰與重置 ──────────────────────────────────────────────────────────────

describe('useCharacterBuild — 擲骰與重置', () => {
  it('rollAllAbilities 應重新產生骰值池並清空指派', async () => {
    const { formState, abilities } = await getComposable()
    abilities.setAbilityMethod('diceRoll')
    abilities.assignDiceToAbility('strength', formState.dicePool[0]!.id)
    expect(formState.abilities.strength).toBe(15)

    abilities.rollAllAbilities()
    expect(formState.dicePool).toHaveLength(6)
    expect(formState.dicePool.every((slot) => slot.assignedTo === null)).toBe(true)
    expect(Object.values(formState.abilities).every((v) => v === 8)).toBe(true)
  })

  it('resetAbilities 應將所有屬性重置為 8 並清空骰值池', async () => {
    const { formState, abilities } = await getComposable()
    formState.abilities.strength = 20
    formState.abilities.dexterity = 18
    abilities.setAbilityMethod('diceRoll')
    abilities.resetAbilities()
    expect(Object.values(formState.abilities).every((v) => v === 8)).toBe(true)
    expect(formState.dicePool).toHaveLength(0)
  })
})

// ─── 點數使用指示（自訂模式） ─────────────────────────────────────────────────

describe('useCharacterBuild — pointBuyUsage', () => {
  it('預設（custom 模式）全為 8 時 pointBuyUsage 應為 0', async () => {
    const { abilities } = await getComposable()
    expect(abilities.pointBuyUsage.value).toBe(0)
  })

  it('custom 模式下將 strength 調至 10 後應為 2', async () => {
    const { formState, abilities } = await getComposable()
    formState.abilities.strength = 10
    expect(abilities.pointBuyUsage.value).toBe(2)
  })

  it('custom 模式下總花費可超過 27（純指示，不阻擋）', async () => {
    const { formState, abilities } = await getComposable()
    for (const key of Object.keys(formState.abilities) as (keyof typeof formState.abilities)[]) {
      formState.abilities[key] = 15
    }
    expect(abilities.pointBuyUsage.value).toBe(54)
  })

  it('任一屬性超出 8–15 範圍時 pointBuyUsage 應為 null', async () => {
    const { formState, abilities } = await getComposable()
    formState.abilities.strength = 16
    expect(abilities.pointBuyUsage.value).toBeNull()

    formState.abilities.strength = 7
    expect(abilities.pointBuyUsage.value).toBeNull()
  })

  it('切換至 diceRoll 模式時 pointBuyUsage 應為 null', async () => {
    const { abilities } = await getComposable()
    abilities.setAbilityMethod('diceRoll')
    expect(abilities.pointBuyUsage.value).toBeNull()
  })
})

// ─── 擲骰指派 ────────────────────────────────────────────────────────────────

describe('useCharacterBuild — assignDiceToAbility', () => {
  it('指派 slot 應同步更新 abilities 與 slot.assignedTo', async () => {
    const { formState, abilities } = await getComposable()
    abilities.setAbilityMethod('diceRoll')
    const slot = formState.dicePool[0]!
    abilities.assignDiceToAbility('strength', slot.id)
    expect(formState.abilities.strength).toBe(slot.value)
    expect(formState.dicePool.find((s) => s.id === slot.id)!.assignedTo).toBe('strength')
  })

  it('改指派同一屬性到不同 slot 應釋放舊 slot', async () => {
    const { formState, abilities } = await getComposable()
    abilities.setAbilityMethod('diceRoll')
    const [first, second] = formState.dicePool
    abilities.assignDiceToAbility('strength', first!.id)
    abilities.assignDiceToAbility('strength', second!.id)
    expect(formState.dicePool.find((s) => s.id === first!.id)!.assignedTo).toBeNull()
    expect(formState.dicePool.find((s) => s.id === second!.id)!.assignedTo).toBe('strength')
  })

  it('指派 slotId = null 應釋放該屬性現有指派並回到預設 8', async () => {
    const { formState, abilities } = await getComposable()
    abilities.setAbilityMethod('diceRoll')
    const slot = formState.dicePool[0]!
    abilities.assignDiceToAbility('strength', slot.id)
    abilities.assignDiceToAbility('strength', null)
    expect(formState.abilities.strength).toBe(8)
    expect(formState.dicePool.find((s) => s.id === slot.id)!.assignedTo).toBeNull()
  })
})

// ─── canSubmit ──────────────────────────────────────────────────────────────

describe('useCharacterBuild — canSubmit', () => {
  it('名稱與職業皆填寫時 canSubmit 應為 true', async () => {
    const { formState, canSubmit } = await getComposable()
    formState.name = '完整角色'
    formState.professions[0]!.profession = 'fighter'
    expect(canSubmit.value).toBe(true)
  })

  it('角色名稱為空字串時 canSubmit 應為 false', async () => {
    const { canSubmit } = await getComposable()
    expect(canSubmit.value).toBe(false)
  })

  it('角色名稱為空白時 canSubmit 應為 false', async () => {
    const { formState, canSubmit } = await getComposable()
    formState.name = '   '
    formState.professions[0]!.profession = 'fighter'
    expect(canSubmit.value).toBe(false)
  })

  it('職業未選擇時 canSubmit 應為 false', async () => {
    const { formState, canSubmit } = await getComposable()
    formState.name = '有名稱'
    expect(canSubmit.value).toBe(false)
  })

  it('擲骰模式下骰值池未全部指派時 canSubmit 應為 false', async () => {
    const { formState, abilities, canSubmit } = await getComposable()
    formState.name = '擲骰角色'
    formState.professions[0]!.profession = 'fighter'
    abilities.setAbilityMethod('diceRoll')
    expect(canSubmit.value).toBe(false)

    // 部分指派仍 false
    abilities.assignDiceToAbility('strength', formState.dicePool[0]!.id)
    expect(canSubmit.value).toBe(false)
  })

  it('擲骰模式下 6 個 slot 全部指派後 canSubmit 應為 true', async () => {
    const { formState, abilities, canSubmit } = await getComposable()
    formState.name = '擲骰角色'
    formState.professions[0]!.profession = 'fighter'
    abilities.setAbilityMethod('diceRoll')

    const keys: ReadonlyArray<keyof typeof formState.abilities> = [
      'strength',
      'dexterity',
      'constitution',
      'intelligence',
      'wisdom',
      'charisma',
    ]
    keys.forEach((key, i) => {
      abilities.assignDiceToAbility(key, formState.dicePool[i]!.id)
    })
    expect(canSubmit.value).toBe(true)
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
    const { formState, isSubmitting, canSubmit, submit } = await getComposable()
    formState.name = '防重複角色'
    formState.professions[0]!.profession = 'fighter'

    expect(isSubmitting.value).toBe(false)
    const pending = submit()
    expect(isSubmitting.value).toBe(true)
    expect(canSubmit.value).toBe(false)
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

    const { formState, isSubmitting, submit } = await getComposable()
    formState.name = '失敗角色'
    formState.professions[0]!.profession = 'fighter'

    await submit()
    expect(mockToastError).toHaveBeenCalledWith('儲存失敗，請稍後再試')
    expect(mockNavigateTo).not.toHaveBeenCalled()
    expect(isSubmitting.value).toBe(false)
  })

  it('store.addCharacter 拋出例外時應顯示錯誤 toast 且不導航', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { useCharacterStore } = await import('~/stores/character')
    const store = useCharacterStore()
    vi.spyOn(store, 'addCharacter').mockImplementation(() => {
      throw new Error('unexpected')
    })

    const { formState, isSubmitting, submit } = await getComposable()
    formState.name = '例外角色'
    formState.professions[0]!.profession = 'fighter'

    await submit()
    expect(mockToastError).toHaveBeenCalledWith('儲存失敗，請稍後再試')
    expect(mockNavigateTo).not.toHaveBeenCalled()
    expect(isSubmitting.value).toBe(false)
  })
})
