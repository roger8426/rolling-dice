import { afterEach, describe, expect, it, vi } from 'vitest'
import { rollAbilityScore, rollDice } from '~/helpers/dice'

describe('rollDice', () => {
  it('預設擲 1 次，回傳長度為 1 的陣列', () => {
    const result = rollDice(6)
    expect(result).toHaveLength(1)
  })

  it('指定次數時，回傳對應長度的陣列', () => {
    const result = rollDice(6, 4)
    expect(result).toHaveLength(4)
  })

  it('每顆骰子結果應在 1 到面數之間', () => {
    const sides = 20
    const results = rollDice(sides, 100)
    for (const value of results) {
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(sides)
    }
  })

  it('結果應為整數', () => {
    const results = rollDice(6, 50)
    for (const value of results) {
      expect(Number.isInteger(value)).toBe(true)
    }
  })
})

describe('rollAbilityScore', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('回傳值為整數且介於 3 到 18 之間', () => {
    for (let i = 0; i < 100; i++) {
      const score = rollAbilityScore()
      expect(Number.isInteger(score)).toBe(true)
      expect(score).toBeGreaterThanOrEqual(3)
      expect(score).toBeLessThanOrEqual(18)
    }
  })

  it('4d6 去最低：mock [1,2,3,4] 應回傳 2+3+4 = 9', () => {
    // Math.random → 0, 1/6, 2/6, 3/6 對應 floor * 6 + 1 = 1, 2, 3, 4
    const values = [0, 1 / 6, 2 / 6, 3 / 6]
    let i = 0
    vi.spyOn(Math, 'random').mockImplementation(() => values[i++]!)
    expect(rollAbilityScore()).toBe(9)
  })

  it('4d6 去最低：mock [6,6,6,6] 應回傳 18（最大值）', () => {
    // Math.random → 5/6（接近 1 但不到），floor(5/6 * 6) + 1 = 6
    vi.spyOn(Math, 'random').mockReturnValue(5.9 / 6)
    expect(rollAbilityScore()).toBe(18)
  })
})
