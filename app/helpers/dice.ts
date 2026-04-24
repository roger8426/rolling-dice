/**
 * 擲骰：回傳每顆骰子的結果陣列，保留投擲順序。
 * @param sides 骰子面數（e.g. 6 代表 d6），必須為正整數
 * @param times 擲骰次數，預設 1，必須為正整數
 * @throws RangeError 當 sides 或 times 非正整數
 */
export function rollDice(sides: number, times: number = 1): number[] {
  if (!Number.isInteger(sides) || sides < 1) {
    throw new RangeError(`rollDice: sides 必須為正整數，收到 ${sides}`)
  }
  if (!Number.isInteger(times) || times < 1) {
    throw new RangeError(`rollDice: times 必須為正整數，收到 ${times}`)
  }
  return Array.from({ length: times }, () => Math.floor(Math.random() * sides) + 1)
}

/**
 * D&D 5e 能力值擲骰：4d6 去最低。
 * 擲 4 顆 d6，排序後取最高 3 顆加總。
 */
export function rollAbilityScore(): number {
  const sorted = rollDice(6, 4).sort((a, b) => a - b) as [number, number, number, number]
  const [_, second, third, fourth] = sorted
  return second + third + fourth
}
