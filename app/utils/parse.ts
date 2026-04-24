/**
 * 解析整數輸入字串。
 *
 * - 空字串、空白、非數字：回傳 `fallback ?? null`
 * - 合法數字：以 `Math.trunc` 截斷後回傳
 */
export function parseIntegerInput(value: string): number | null
export function parseIntegerInput(value: string, fallback: number): number
export function parseIntegerInput(value: string, fallback?: number): number | null {
  const trimmed = value.trim()
  if (trimmed === '') return fallback ?? null
  const num = Number(trimmed)
  if (!Number.isFinite(num)) return fallback ?? null
  return Math.trunc(num)
}
