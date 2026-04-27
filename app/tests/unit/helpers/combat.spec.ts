import { describe, expect, it } from 'vitest'
import { formatDamageSummary, getHitBonusColorClass } from '~/helpers/combat'
import type { AttackDraft } from '~/types/business/character'

const baseDraft = (): AttackDraft => ({
  name: '',
  abilityKey: null,
  damageDice: [],
  extraHitBonus: null,
})

describe('formatDamageSummary', () => {
  it('沒有任何傷害行回傳 —', () => {
    expect(formatDamageSummary(baseDraft())).toBe('—')
  })

  it('count 與 bonus 皆為 0 的行不渲染', () => {
    const draft: AttackDraft = {
      ...baseDraft(),
      damageDice: [
        { id: 'a', dieType: 'd6', count: 0, bonus: 0, damageType: 'fire' },
        { id: 'b', dieType: 'd8', count: 1, bonus: null, damageType: null },
      ],
    }
    expect(formatDamageSummary(draft)).toBe('1d8')
  })

  it('dieType 為 null 即使 count > 0 也不渲染骰部分', () => {
    const draft: AttackDraft = {
      ...baseDraft(),
      damageDice: [{ id: 'a', dieType: null, count: 3, bonus: null, damageType: null }],
    }
    expect(formatDamageSummary(draft)).toBe('—')
  })

  it('dieType 為 null + count > 0 + bonus 有值，只渲染 bonus', () => {
    const draft: AttackDraft = {
      ...baseDraft(),
      damageDice: [{ id: 'a', dieType: null, count: 2, bonus: 4, damageType: 'fire' }],
    }
    expect(formatDamageSummary(draft)).toBe('4 火焰')
  })

  it('未指定類型的行只顯示骰數', () => {
    const draft: AttackDraft = {
      ...baseDraft(),
      damageDice: [{ id: 'a', dieType: 'd6', count: 2, bonus: null, damageType: null }],
    }
    expect(formatDamageSummary(draft)).toBe('2d6')
  })

  it('有類型的行附中文 label', () => {
    const draft: AttackDraft = {
      ...baseDraft(),
      damageDice: [{ id: 'a', dieType: 'd4', count: 2, bonus: null, damageType: 'slashing' }],
    }
    expect(formatDamageSummary(draft)).toBe('2d4 劈砍')
  })

  it('行內正 bonus 緊接 dice 顯示為 +N', () => {
    const draft: AttackDraft = {
      ...baseDraft(),
      damageDice: [{ id: 'a', dieType: 'd8', count: 1, bonus: 5, damageType: 'slashing' }],
    }
    expect(formatDamageSummary(draft)).toBe('1d8+5 劈砍')
  })

  it('行內負 bonus 緊接 dice 顯示為 -N', () => {
    const draft: AttackDraft = {
      ...baseDraft(),
      damageDice: [{ id: 'a', dieType: 'd8', count: 1, bonus: -2, damageType: null }],
    }
    expect(formatDamageSummary(draft)).toBe('1d8-2')
  })

  it('count = 0 但有 bonus 的行視為純定額傷害', () => {
    const draft: AttackDraft = {
      ...baseDraft(),
      damageDice: [{ id: 'a', dieType: null, count: 0, bonus: 10, damageType: 'acid' }],
    }
    expect(formatDamageSummary(draft)).toBe('10 酸蝕')
  })

  it('多行不同骰面 / 加值 / 類型應以 + 串接', () => {
    const draft: AttackDraft = {
      ...baseDraft(),
      damageDice: [
        { id: 'a', dieType: 'd8', count: 1, bonus: 5, damageType: 'slashing' },
        { id: 'b', dieType: 'd8', count: 4, bonus: 10, damageType: 'radiant' },
      ],
    }
    expect(formatDamageSummary(draft)).toBe('1d8+5 劈砍 + 4d8+10 光耀')
  })
})

describe('getHitBonusColorClass', () => {
  it('正數回傳 success 色', () => {
    expect(getHitBonusColorClass(3)).toBe('text-success')
  })

  it('0 回傳 muted 色', () => {
    expect(getHitBonusColorClass(0)).toBe('text-content-muted')
  })

  it('負數回傳 danger 色', () => {
    expect(getHitBonusColorClass(-1)).toBe('text-danger')
  })
})
