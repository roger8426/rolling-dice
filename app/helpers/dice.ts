/**
 * 擲骰：回傳每顆骰子的結果陣列，保留投擲順序。
 * @param sides 骰子面數（e.g. 6 代表 d6）
 * @param times 擲骰次數，預設 1
 */
export function rollDice(sides: number, times: number = 1): number[] {
  return Array.from({ length: times }, () => Math.floor(Math.random() * sides) + 1)
}

/**
 * D&D 5e 能力值擲骰：4d6 去最低。
 * 擲 4 顆 d6，排序後取最高 3 顆加總。
 */
export function rollAbilityScore(): number {
  const rolls = rollDice(6, 4)
  const sorted = [...rolls].sort((a, b) => a - b)
  return sorted[1]! + sorted[2]! + sorted[3]!
}
