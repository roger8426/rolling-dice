import { reactive } from 'vue'
import { describe, expect, it } from 'vitest'
import { useCharacterStatsForm } from '~/composables/domain/useCharacterStatsForm'
import { createMockUpdateFormState } from '~/tests/fixtures/character'

function setup() {
  const formState = reactive(
    createMockUpdateFormState({
      abilities: {
        strength: { basicScore: 15, bonusScore: 2 },
        dexterity: { basicScore: 14, bonusScore: 0 },
        constitution: { basicScore: 13, bonusScore: 1 },
        intelligence: { basicScore: 12, bonusScore: 0 },
        wisdom: { basicScore: 10, bonusScore: 0 },
        charisma: { basicScore: 8, bonusScore: 0 },
      },
    }),
  )
  const stats = useCharacterStatsForm(formState)
  return { formState, stats }
}

// ─── 屬性更新 ──────────────────────────────────────────────────────────────────

describe('useCharacterStatsForm — 屬性更新', () => {
  it('updateBonusScore 應只修改 bonusScore，不影響 basicScore', () => {
    const { formState, stats } = setup()
    stats.updateBonusScore('strength', 4)
    expect(formState.abilities.strength.bonusScore).toBe(4)
    expect(formState.abilities.strength.basicScore).toBe(15)
  })

  it('updateBonusScore 應能設為 0', () => {
    const { formState, stats } = setup()
    stats.updateBonusScore('strength', 0)
    expect(formState.abilities.strength.bonusScore).toBe(0)
  })
})

// ─── 護甲設定 ──────────────────────────────────────────────────────────────────

describe('useCharacterStatsForm — 護甲設定', () => {
  it('updateArmorType 應更新護甲類型', () => {
    const { formState, stats } = setup()
    stats.updateArmorType('heavy')
    expect(formState.armorClass.type).toBe('heavy')
  })

  it('updateArmorValue 應更新護甲基礎值', () => {
    const { formState, stats } = setup()
    stats.updateArmorValue(16)
    expect(formState.armorClass.value).toBe(16)
  })

  it('updateArmorValue 可設為 null（清空）', () => {
    const { formState, stats } = setup()
    stats.updateArmorValue(null)
    expect(formState.armorClass.value).toBeNull()
  })

  it('updateArmorAbilityKey 應更新額外屬性鍵', () => {
    const { formState, stats } = setup()
    stats.updateArmorAbilityKey('wisdom')
    expect(formState.armorClass.abilityKey).toBe('wisdom')
  })

  it('updateShieldValue 應更新盾牌加值', () => {
    const { formState, stats } = setup()
    stats.updateShieldValue(2)
    expect(formState.armorClass.shieldValue).toBe(2)
  })
})

// ─── 其他屬性 ──────────────────────────────────────────────────────────────────

describe('useCharacterStatsForm — 其他屬性', () => {
  it('updateSpeedBonus 應更新 speedBonus', () => {
    const { formState, stats } = setup()
    stats.updateSpeedBonus(10)
    expect(formState.speedBonus).toBe(10)
  })

  it('updateSpeedBonus 可設為 0（清空）', () => {
    const { formState, stats } = setup()
    stats.updateSpeedBonus(10)
    stats.updateSpeedBonus(0)
    expect(formState.speedBonus).toBe(0)
  })

  it('updateInitiativeBonus 應更新 initiativeBonus', () => {
    const { formState, stats } = setup()
    stats.updateInitiativeBonus(3)
    expect(formState.initiativeBonus).toBe(3)
  })

  it('updateInitiativeBonus 可設為 0（清空）', () => {
    const { formState, stats } = setup()
    stats.updateInitiativeBonus(3)
    stats.updateInitiativeBonus(0)
    expect(formState.initiativeBonus).toBe(0)
  })

  it('updatePassivePerceptionBonus 應更新 passivePerceptionBonus', () => {
    const { formState, stats } = setup()
    stats.updatePassivePerceptionBonus(2)
    expect(formState.passivePerceptionBonus).toBe(2)
  })

  it('updatePassivePerceptionBonus 可設為 0（清空）', () => {
    const { formState, stats } = setup()
    stats.updatePassivePerceptionBonus(2)
    stats.updatePassivePerceptionBonus(0)
    expect(formState.passivePerceptionBonus).toBe(0)
  })
})

// ─── 額外生命值 ────────────────────────────────────────────────────────────────

describe('useCharacterStatsForm — 額外生命值', () => {
  it('updateCustomHpBonus 應更新 customHpBonus', () => {
    const { formState, stats } = setup()
    stats.updateCustomHpBonus(12)
    expect(formState.customHpBonus).toBe(12)
  })
})
