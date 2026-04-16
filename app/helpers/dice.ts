/**
 * 擲骰：回傳每顆骰子的結果陣列，保留投擲順序。
 * @param sides 骰子面數（e.g. 6 代表 d6）
 * @param times 擲骰次數，預設 1
 */
export function rollDice(sides: number, times: number = 1): number[] {
  return Array.from({ length: times }, () => Math.floor(Math.random() * sides) + 1)
}
