import { describe, expect, it } from 'vitest'
import {
  calculateSpentPoints,
  getPointBuyCost,
  getRemainingPoints,
  isValidPointBuy,
  isValidPointBuyScore,
} from '~/helpers/ability'
import type { AbilityKey } from '~/types/business/dnd'

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

// ─── calculateSpentPoints ─────────────────────────────────────────────────────

describe('calculateSpentPoints', () => {
  it('六項全為 8 時，總花費應為 0', () => {
    expect(calculateSpentPoints(uniformScores(8))).toBe(0)
  })

  it('六項全為 10 時，總花費應為 12（6 × 2）', () => {
    expect(calculateSpentPoints(uniformScores(10))).toBe(12)
  })

  it('六項全為 13 時，總花費應為 30（6 × 5），超出預算', () => {
    expect(calculateSpentPoints(uniformScores(13))).toBe(30)
  })

  it('典型組合 15/14/13/12/10/8 應花費 25 點', () => {
    const scores: Record<AbilityKey, number> = {
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8,
    }
    // 9 + 7 + 5 + 4 + 2 + 0 = 27
    expect(calculateSpentPoints(scores)).toBe(27)
  })

  it('含非法分數時應拋出 RangeError', () => {
    const scores = uniformScores(8)
    scores.strength = 16
    expect(() => calculateSpentPoints(scores)).toThrow(RangeError)
  })
})

// ─── getRemainingPoints ───────────────────────────────────────────────────────

describe('getRemainingPoints', () => {
  it('六項全為 8 時，剩餘點數應為 27', () => {
    expect(getRemainingPoints(uniformScores(8))).toBe(27)
  })

  it('花費 12 點後，剩餘應為 15', () => {
    expect(getRemainingPoints(uniformScores(10))).toBe(15)
  })

  it('花費 27 點後，剩餘應為 0', () => {
    const scores: Record<AbilityKey, number> = {
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8,
    }
    expect(getRemainingPoints(scores)).toBe(0)
  })
})

// ─── isValidPointBuy ──────────────────────────────────────────────────────────

describe('isValidPointBuy', () => {
  it('六項全 8（花費 0）應為合法', () => {
    expect(isValidPointBuy(uniformScores(8))).toBe(true)
  })

  it('15/14/13/12/10/8（花費剛好 27）應為合法', () => {
    const scores: Record<AbilityKey, number> = {
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8,
    }
    expect(isValidPointBuy(scores)).toBe(true)
  })

  it('六項全為 13（花費 30，超出 27）應為非法', () => {
    expect(isValidPointBuy(uniformScores(13))).toBe(false)
  })

  it('含非法分數 7 時應為非法', () => {
    const scores = uniformScores(8)
    scores.strength = 7
    expect(isValidPointBuy(scores)).toBe(false)
  })

  it('含非法分數 16 時應為非法', () => {
    const scores = uniformScores(8)
    scores.strength = 16
    expect(isValidPointBuy(scores)).toBe(false)
  })
})
