import { reactive } from 'vue'
import { describe, expect, it } from 'vitest'
import { useCharacterDerivedStats } from '~/composables/domain/useCharacterDerivedStats'
import type { CharacterUpdateFormState } from '~/types/business/character'

function createFormState(
  overrides: Partial<CharacterUpdateFormState> = {},
): CharacterUpdateFormState {
  return reactive<CharacterUpdateFormState>({
    id: 'test-001',
    name: '測試角色',
    gender: 'male',
    race: 'human',
    alignment: 'trueNeutral',
    professions: [{ profession: 'fighter', level: 3 }],
    abilities: {
      strength: { basicScore: 15, bonusScore: 0 },
      dexterity: { basicScore: 14, bonusScore: 0 }, // +2
      constitution: { basicScore: 14, bonusScore: 0 }, // +2
      intelligence: { basicScore: 10, bonusScore: 0 },
      wisdom: { basicScore: 12, bonusScore: 0 }, // +1
      charisma: { basicScore: 10, bonusScore: 0 },
    },
    savingThrowExtras: [],
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
    armorClass: { type: 'none', value: 10, abilityKey: null, shieldValue: 0 },
    speedBonus: null,
    initiativeBonus: null,
    passivePerceptionBonus: null,
    extraHp: 0,
    attacks: [],
    learnedSpells: [],
    preparedSpells: [],
    ...overrides,
  })
}

describe('useCharacterDerivedStats', () => {
  it('totalAbilityScores 應加總 basicScore + bonusScore', () => {
    const formState = createFormState({
      abilities: {
        strength: { basicScore: 15, bonusScore: 2 },
        dexterity: { basicScore: 14, bonusScore: 0 },
        constitution: { basicScore: 13, bonusScore: 1 },
        intelligence: { basicScore: 12, bonusScore: 0 },
        wisdom: { basicScore: 10, bonusScore: 0 },
        charisma: { basicScore: 8, bonusScore: 0 },
      },
    })
    const { totalAbilityScores } = useCharacterDerivedStats(formState)
    expect(totalAbilityScores.value.strength).toBe(17)
    expect(totalAbilityScores.value.constitution).toBe(14)
  })

  it('proficiencyBonus 應依 totalLevel 計算', () => {
    // fighter lv 3 → PB +2
    const formState = createFormState()
    const { proficiencyBonus } = useCharacterDerivedStats(formState)
    expect(proficiencyBonus.value).toBe(2)
  })

  it('totalHp 應依 CON mod + 主職業第 1 級滿骰計算', () => {
    // fighter lv3, CON +2 → 10 + 6 + 6 = 22 class HP + 6 CON = 28
    const formState = createFormState()
    const { totalHp } = useCharacterDerivedStats(formState)
    expect(totalHp.value).toBe(28)
  })

  it('totalArmorClass 應反映 armorClass 設定 + DEX', () => {
    // none 10 + DEX(+2) = 12
    const formState = createFormState()
    const { totalArmorClass } = useCharacterDerivedStats(formState)
    expect(totalArmorClass.value).toBe(12)
  })

  it('totalInitiative 應為 DEX mod + initiativeBonus', () => {
    const formState = createFormState({ initiativeBonus: 3 })
    const { totalInitiative } = useCharacterDerivedStats(formState)
    expect(totalInitiative.value).toBe(2 + 3)
  })

  it('totalSpeed 應為 30 + speedBonus', () => {
    const formState = createFormState({ speedBonus: 10 })
    const { totalSpeed } = useCharacterDerivedStats(formState)
    expect(totalSpeed.value).toBe(40)
  })

  it('totalPassivePerception 應依感知 + 熟練 + 額外加值計算', () => {
    // perception none, WIS +1, PB +2, 無全能高手 → perceptionBonus = 1
    // passive = 10 + 1 + 0 = 11
    const formState = createFormState()
    const { totalPassivePerception } = useCharacterDerivedStats(formState)
    expect(totalPassivePerception.value).toBe(11)
  })

  it('表單欄位變動時，衍生值應重新計算（reactivity）', () => {
    const formState = createFormState()
    const { totalHp } = useCharacterDerivedStats(formState)
    expect(totalHp.value).toBe(28)

    formState.extraHp = 5
    expect(totalHp.value).toBe(33)

    formState.isTough = true
    expect(totalHp.value).toBe(33 + 6) // fighter lv3 tough: 3×2=6
  })

  it('professions 新增未選擇職業的空 row 時，不影響 totalHp', () => {
    const formState = createFormState()
    const { totalHp } = useCharacterDerivedStats(formState)
    const before = totalHp.value
    formState.professions.push({ profession: null, level: 1 })
    expect(totalHp.value).toBe(before)
  })
})
