import { describe, expect, it } from 'vitest'
import { rollDice } from '~/helpers/dice'

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
