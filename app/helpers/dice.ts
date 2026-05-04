import type { RollMode } from '~/types/business/dice'

/**
 * 擲一顆骰子，回傳結果。
 * @param sides 骰子面數（e.g. 6 代表 d6），必須為正整數
 * @throws RangeError 當 sides 非正整數
 */
export function rollDie(sides: number): number {
  if (!Number.isInteger(sides) || sides < 1) {
    throw new RangeError(`sides 必須為正整數，收到 ${sides}`)
  }
  return Math.floor(Math.random() * sides) + 1
}

/**
 * 擲多顆骰子，回傳每顆的結果陣列，保留投擲順序。
 * @param times 擲骰次數，必須為正整數
 * @param sides 骰子面數（e.g. 6 代表 d6），必須為正整數
 * @throws RangeError 當 times 或 sides 非正整數
 */
export function rollDice(times: number, sides: number): number[] {
  if (!Number.isInteger(times) || times < 1) {
    throw new RangeError(`times 必須為正整數，收到 ${times}`)
  }
  return Array.from({ length: times }, () => rollDie(sides))
}

/**
 * 依模式擲 d20，回傳原始骰值與採用值。
 * - normal：擲 1 顆，採用該顆
 * - advantage：擲 2 顆，採用較大者
 * - disadvantage：擲 2 顆，採用較小者
 */
export function rollD20(mode: RollMode): { rolls: number[]; chosen: number } {
  if (mode === 'normal') {
    const value = rollDie(20)
    return { rolls: [value], chosen: value }
  }
  const rolls = rollDice(2, 20)
  const [a, b] = rolls as [number, number]
  const chosen = mode === 'advantage' ? Math.max(a, b) : Math.min(a, b)
  return { rolls, chosen }
}
