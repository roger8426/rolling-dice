import { describe, expect, it } from 'vitest'
import {
  calculateSavingThrowProficiencies,
  createDefaultArmorClass,
  formStateToCharacterPatch,
  getBaseArmorClass,
  getCharacterTier,
  getPassivePerception,
  getTotalArmorClass,
} from '~/helpers/character'
import type {
  AbilityScores,
  ArmorClassConfig,
  CharacterFormStateBase,
} from '~/types/business/character'

describe('getCharacterTier', () => {
  describe('common 等級 (1–4)', () => {
    it('等級 1 應回傳 common', () => {
      expect(getCharacterTier(1)).toBe('common')
    })

    it('等級 4 應回傳 common（上界）', () => {
      expect(getCharacterTier(4)).toBe('common')
    })
  })

  describe('elite 等級 (5–10)', () => {
    it('等級 5 應回傳 elite（下界）', () => {
      expect(getCharacterTier(5)).toBe('elite')
    })

    it('等級 10 應回傳 elite（上界）', () => {
      expect(getCharacterTier(10)).toBe('elite')
    })
  })

  describe('master 等級 (11–16)', () => {
    it('等級 11 應回傳 master（下界）', () => {
      expect(getCharacterTier(11)).toBe('master')
    })

    it('等級 16 應回傳 master（上界）', () => {
      expect(getCharacterTier(16)).toBe('master')
    })
  })

  describe('legendary 等級 (17–20)', () => {
    it('等級 17 應回傳 legendary（下界）', () => {
      expect(getCharacterTier(17)).toBe('legendary')
    })

    it('等級 20 應回傳 legendary（最高等級）', () => {
      expect(getCharacterTier(20)).toBe('legendary')
    })
  })
})

describe('getBaseArmorClass', () => {
  it('輕甲時，AC = baseValue + 完整 dexModifier', () => {
    expect(getBaseArmorClass(11, 3, 'light')).toBe(14)
  })

  it('無甲時，AC = baseValue + 完整 dexModifier', () => {
    expect(getBaseArmorClass(10, -2, 'none')).toBe(8)
  })

  it('未選擇護甲類型（null）時，AC = baseValue + 完整 dexModifier', () => {
    expect(getBaseArmorClass(10, 3, null)).toBe(13)
  })

  it('中甲時，DEX 調整值應上限為 +2（DEX > 2）', () => {
    expect(getBaseArmorClass(14, 4, 'medium')).toBe(16)
  })

  it('中甲時，DEX 不足 +2 取原值', () => {
    expect(getBaseArmorClass(14, 1, 'medium')).toBe(15)
  })

  it('中甲且 DEX 為負數時，仍以負數計算', () => {
    expect(getBaseArmorClass(14, -1, 'medium')).toBe(13)
  })

  it('重甲時，AC = baseValue（不加 DEX）', () => {
    expect(getBaseArmorClass(16, 3, 'heavy')).toBe(16)
  })

  it('重甲且 DEX 為負數時，AC 仍為 baseValue', () => {
    expect(getBaseArmorClass(18, -1, 'heavy')).toBe(18)
  })
})

describe('getTotalArmorClass', () => {
  const baseScores: AbilityScores = {
    strength: 10,
    dexterity: 16, // modifier +3
    constitution: 14,
    intelligence: 10,
    wisdom: 12, // modifier +1
    charisma: 10,
  }

  it('無護甲設定（預設工廠）：10 + 完整 DEX = 13', () => {
    expect(getTotalArmorClass(createDefaultArmorClass(), baseScores)).toBe(13)
  })

  it('輕甲 11 + 盾牌 2：11 + DEX(+3) + 2 = 16', () => {
    const config: ArmorClassConfig = {
      type: 'light',
      value: 11,
      abilityKey: null,
      shieldValue: 2,
    }
    expect(getTotalArmorClass(config, baseScores)).toBe(16)
  })

  it('中甲 14 搭配 DEX +3：套上 +2 上限 = 16，加盾 2 = 18', () => {
    const config: ArmorClassConfig = {
      type: 'medium',
      value: 14,
      abilityKey: null,
      shieldValue: 2,
    }
    expect(getTotalArmorClass(config, baseScores)).toBe(18)
  })

  it('重甲 18：忽略 DEX，加盾 2 = 20', () => {
    const config: ArmorClassConfig = {
      type: 'heavy',
      value: 18,
      abilityKey: null,
      shieldValue: 2,
    }
    expect(getTotalArmorClass(config, baseScores)).toBe(20)
  })

  it('額外屬性加值（wisdom）：10 + DEX(+3) + WIS(+1) = 14', () => {
    const config: ArmorClassConfig = {
      type: 'none',
      value: 10,
      abilityKey: 'wisdom',
      shieldValue: 0,
    }
    expect(getTotalArmorClass(config, baseScores)).toBe(14)
  })

  it('value 為 null 時，fallback 為 10', () => {
    const config: ArmorClassConfig = {
      type: null,
      value: null,
      abilityKey: null,
      shieldValue: 0,
    }
    expect(getTotalArmorClass(config, baseScores)).toBe(13)
  })
})

describe('createDefaultArmorClass', () => {
  it('應回傳 type=none, value=10, abilityKey=null, shield=0', () => {
    expect(createDefaultArmorClass()).toEqual({
      type: 'none',
      value: 10,
      abilityKey: null,
      shieldValue: 0,
    })
  })

  it('多次呼叫應回傳獨立物件，互不影響', () => {
    const a = createDefaultArmorClass()
    const b = createDefaultArmorClass()
    a.value = 20
    expect(b.value).toBe(10)
  })
})

describe('getPassivePerception', () => {
  it('感知加值為正數時，被動感知 = 10 + bonus', () => {
    expect(getPassivePerception(5)).toBe(15)
  })

  it('感知加值為 0 時，被動感知 = 10', () => {
    expect(getPassivePerception(0)).toBe(10)
  })

  it('感知加值為負數時，被動感知 < 10', () => {
    expect(getPassivePerception(-1)).toBe(9)
  })
})

describe('calculateSavingThrowProficiencies', () => {
  it('主職業為 fighter 時，回傳 strength + constitution', () => {
    expect(calculateSavingThrowProficiencies([{ profession: 'fighter', level: 3 }])).toEqual([
      'strength',
      'constitution',
    ])
  })

  it('多職業時，以第一個職業為主職業決定豁免熟練', () => {
    expect(
      calculateSavingThrowProficiencies([
        { profession: 'wizard', level: 5 },
        { profession: 'fighter', level: 3 },
      ]),
    ).toEqual(['intelligence', 'wisdom'])
  })

  it('空陣列時，回傳空陣列', () => {
    expect(calculateSavingThrowProficiencies([])).toEqual([])
  })

  it('回傳陣列為新的陣列（不與 PROFESSION_CONFIG 共享參照）', () => {
    const result = calculateSavingThrowProficiencies([{ profession: 'wizard', level: 1 }])
    result.push('charisma')
    // 第二次呼叫仍為原始結果，代表回傳陣列是獨立副本
    expect(calculateSavingThrowProficiencies([{ profession: 'wizard', level: 1 }])).toEqual([
      'intelligence',
      'wisdom',
    ])
  })
})

describe('formStateToCharacterPatch', () => {
  function createBaseFormState(
    overrides: Partial<CharacterFormStateBase> = {},
  ): CharacterFormStateBase {
    return {
      name: '測試角色',
      gender: 'male',
      race: 'human',
      alignment: 'trueNeutral',
      professions: [{ profession: 'fighter', level: 3 }],
      skills: {},
      background: null,
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
      ...overrides,
    }
  }

  it('基本 happy path：欄位原樣帶入，professions 不變', () => {
    const form = createBaseFormState({
      name: '法師小明',
      professions: [{ profession: 'wizard', level: 5 }],
      faith: '無神論',
      age: 25,
    })
    const patch = formStateToCharacterPatch(form)
    expect(patch.name).toBe('法師小明')
    expect(patch.professions).toEqual([{ profession: 'wizard', level: 5 }])
    expect(patch.totalLevel).toBe(5)
    expect(patch.faith).toBe('無神論')
    expect(patch.age).toBe(25)
  })

  it('gender 為 null 時，回傳 fallback nonBinary', () => {
    const form = createBaseFormState({ gender: null })
    const patch = formStateToCharacterPatch(form)
    expect(patch.gender).toBe('nonBinary')
  })

  it('professions 含 null 條目時應過濾，totalLevel 僅加總有效職業', () => {
    const form = createBaseFormState({
      professions: [
        { profession: 'fighter', level: 3 },
        { profession: null, level: 2 },
        { profession: 'wizard', level: 1 },
      ],
    })
    const patch = formStateToCharacterPatch(form)
    expect(patch.professions).toEqual([
      { profession: 'fighter', level: 3 },
      { profession: 'wizard', level: 1 },
    ])
    expect(patch.totalLevel).toBe(4)
  })

  it('professions 全為 null 時，professions 為空陣列、totalLevel 為 0', () => {
    const form = createBaseFormState({
      professions: [
        { profession: null, level: 1 },
        { profession: null, level: 2 },
      ],
    })
    const patch = formStateToCharacterPatch(form)
    expect(patch.professions).toEqual([])
    expect(patch.totalLevel).toBe(0)
  })

  it('所有可選文字欄位為 null 時，patch 欄位保持 null', () => {
    const form = createBaseFormState()
    const patch = formStateToCharacterPatch(form)
    expect(patch.background).toBeNull()
    expect(patch.faith).toBeNull()
    expect(patch.height).toBeNull()
    expect(patch.weight).toBeNull()
    expect(patch.appearance).toBeNull()
    expect(patch.story).toBeNull()
    expect(patch.languages).toBeNull()
    expect(patch.tools).toBeNull()
    expect(patch.weaponProficiencies).toBeNull()
    expect(patch.armorProficiencies).toBeNull()
  })

  it('age 為 0 時應保留為 0，不視為 null', () => {
    const form = createBaseFormState({ age: 0 })
    const patch = formStateToCharacterPatch(form)
    expect(patch.age).toBe(0)
  })

  it('skills 物件應為淺層複製（與原 form state 不共享參照）', () => {
    const skills = { acrobatics: 'proficient' as const }
    const form = createBaseFormState({ skills })
    const patch = formStateToCharacterPatch(form)
    expect(patch.skills).toEqual(skills)
    expect(patch.skills).not.toBe(skills)
  })
})
