import { describe, expect, it, vi } from 'vitest'
import {
  createDicePool,
  getPointBuyCost,
  isValidPointBuyScore,
  tryCalculateSpentPoints,
} from '~/helpers/ability'
import type { AbilityKey } from '~/types/business/dnd'

vi.mock('~/helpers/dice', () => {
  // 故意不依排序順序，確保 createDicePool 真的有執行 sort
  const sequence = [10, 16, 8, 14, 12, 13]
  let i = 0
  return {
    rollAbilityScore: vi.fn(() => sequence[i++ % sequence.length]),
    rollDice: vi.fn(() => [4, 4, 4, 4]),
  }
})

// 輔助：建立六項屬性皆為同一分數的 Record
function uniformScores(score: number): Record<AbilityKey, number> {
  return {
    strength: score,
    dexterity: score,
    constitution: score,
    intelligence: score,
    wisdom: score,
    charisma: score,
  }
}

// ─── isValidPointBuyScore ─────────────────────────────────────────────────────

describe('isValidPointBuyScore', () => {
  it('分數 8（下界）應回傳 true', () => {
    expect(isValidPointBuyScore(8)).toBe(true)
  })

  it('分數 15（上界）應回傳 true', () => {
    expect(isValidPointBuyScore(15)).toBe(true)
  })

  it('分數 10（中段）應回傳 true', () => {
    expect(isValidPointBuyScore(10)).toBe(true)
  })

  it('分數 7（下界以下）應回傳 false', () => {
    expect(isValidPointBuyScore(7)).toBe(false)
  })

  it('分數 16（上界以上）應回傳 false', () => {
    expect(isValidPointBuyScore(16)).toBe(false)
  })

  it('非整數分數應回傳 false', () => {
    expect(isValidPointBuyScore(10.5)).toBe(false)
  })

  it('NaN 應回傳 false', () => {
    expect(isValidPointBuyScore(NaN)).toBe(false)
  })
})

// ─── getPointBuyCost ──────────────────────────────────────────────────────────

describe('getPointBuyCost', () => {
  const costTable: [number, number][] = [
    [8, 0],
    [9, 1],
    [10, 2],
    [11, 3],
    [12, 4],
    [13, 5],
    [14, 7],
    [15, 9],
  ]

  it.each(costTable)('分數 %i 的費用應為 %i', (score, expectedCost) => {
    expect(getPointBuyCost(score)).toBe(expectedCost)
  })

  it('分數 7（非法）應拋出 RangeError', () => {
    expect(() => getPointBuyCost(7)).toThrow(RangeError)
  })

  it('分數 16（非法）應拋出 RangeError', () => {
    expect(() => getPointBuyCost(16)).toThrow(RangeError)
  })
})

// ─── tryCalculateSpentPoints ──────────────────────────────────────────────────

describe('tryCalculateSpentPoints', () => {
  it('六項全為 8 時，回傳 0', () => {
    expect(tryCalculateSpentPoints(uniformScores(8))).toBe(0)
  })

  it('六項全為 10 時，回傳 12（6 × 2）', () => {
    expect(tryCalculateSpentPoints(uniformScores(10))).toBe(12)
  })

  it('六項全為 13 時，回傳 30（超過 27 仍正常累加）', () => {
    expect(tryCalculateSpentPoints(uniformScores(13))).toBe(30)
  })

  it('典型組合 15/14/13/12/10/8 應為 27', () => {
    const scores: Record<AbilityKey, number> = {
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8,
    }
    expect(tryCalculateSpentPoints(scores)).toBe(27)
  })

  it('任一分數為 7（低於下界）時回傳 null', () => {
    const scores = uniformScores(8)
    scores.strength = 7
    expect(tryCalculateSpentPoints(scores)).toBeNull()
  })

  it('任一分數為 16（高於上界）時回傳 null', () => {
    const scores = uniformScores(8)
    scores.strength = 16
    expect(tryCalculateSpentPoints(scores)).toBeNull()
  })
})

// ─── createDicePool ──────────────────────────────────────────────────────────

describe('createDicePool', () => {
  it('應產生 6 個 slot', () => {
    const pool = createDicePool()
    expect(pool).toHaveLength(6)
  })

  it('slot value 應由高到低排序', () => {
    const pool = createDicePool()
    for (let i = 1; i < pool.length; i++) {
      expect(pool[i - 1]!.value).toBeGreaterThanOrEqual(pool[i]!.value)
    }
  })

  it('每個 slot 的 id 應互異', () => {
    const pool = createDicePool()
    const ids = pool.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('所有 slot 的 assignedTo 初始皆為 null', () => {
    const pool = createDicePool()
    expect(pool.every((s) => s.assignedTo === null)).toBe(true)
  })
})
