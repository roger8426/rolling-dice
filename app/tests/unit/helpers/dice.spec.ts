import { afterEach, describe, expect, it, vi } from 'vitest'
import { rollD20, rollDice, rollDie } from '~/helpers/dice'

describe('rollDie', () => {
  it('回傳值為整數且介於 1 到面數之間', () => {
    for (let i = 0; i < 100; i++) {
      const value = rollDie(20)
      expect(Number.isInteger(value)).toBe(true)
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(20)
    }
  })

  it('sides=0 應拋 RangeError', () => {
    expect(() => rollDie(0)).toThrow(RangeError)
  })

  it('sides=-1 應拋 RangeError', () => {
    expect(() => rollDie(-1)).toThrow(RangeError)
  })

  it('sides=2.5 應拋 RangeError', () => {
    expect(() => rollDie(2.5)).toThrow(RangeError)
  })
})

describe('rollDice', () => {
  it('指定次數時，回傳對應長度的陣列', () => {
    expect(rollDice(4, 6)).toHaveLength(4)
  })

  it('每顆骰子結果應在 1 到面數之間', () => {
    const sides = 20
    const results = rollDice(100, sides)
    for (const value of results) {
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(sides)
    }
  })

  it('結果應為整數', () => {
    const results = rollDice(50, 6)
    for (const value of results) {
      expect(Number.isInteger(value)).toBe(true)
    }
  })

  it('sides=0 應拋 RangeError', () => {
    expect(() => rollDice(1, 0)).toThrow(RangeError)
  })

  it('sides=-1 應拋 RangeError', () => {
    expect(() => rollDice(1, -1)).toThrow(RangeError)
  })

  it('times=0 應拋 RangeError', () => {
    expect(() => rollDice(0, 6)).toThrow(RangeError)
  })

  it('times=2.7 應拋 RangeError', () => {
    expect(() => rollDice(2.7, 6)).toThrow(RangeError)
  })
})

describe('rollD20', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('normal 模式擲 1 顆，採用該顆', () => {
    // floor(0.7 * 20) + 1 = 15
    vi.spyOn(Math, 'random').mockReturnValue(0.7)
    const result = rollD20('normal')
    expect(result.rolls).toEqual([15])
    expect(result.chosen).toBe(15)
  })

  it('advantage 模式擲 2 顆，採用較大者', () => {
    // 先 0.1 → 3，再 0.85 → 18
    const seq = [0.1, 0.85]
    let i = 0
    vi.spyOn(Math, 'random').mockImplementation(() => seq[i++]!)
    const result = rollD20('advantage')
    expect(result.rolls).toEqual([3, 18])
    expect(result.chosen).toBe(18)
  })

  it('disadvantage 模式擲 2 顆，採用較小者', () => {
    const seq = [0.85, 0.1]
    let i = 0
    vi.spyOn(Math, 'random').mockImplementation(() => seq[i++]!)
    const result = rollD20('disadvantage')
    expect(result.rolls).toEqual([18, 3])
    expect(result.chosen).toBe(3)
  })

  it('advantage 兩顆相等時採用該值', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const result = rollD20('advantage')
    expect(result.rolls).toEqual([11, 11])
    expect(result.chosen).toBe(11)
  })
})
