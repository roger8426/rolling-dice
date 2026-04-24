/**
 * 解析整數輸入字串為 number 或 null。
 *
 * 過去表單內散落 `Number($event) || 0`、`$event ? Number($event) : null`、
 * `toNumber(v, 0)` 等多種寫法，各自對「空字串」「0」「非數字」有不同語意。
 * 本 util 集中處理：
 *
 * - 空字串、空白、非數字：回傳 `fallback`（未指定時為 `null`）
 * - 合法數字：以 `Math.trunc` 截斷小數後回傳
 *
 * 兩種 overload 對應「允許清空為 null」與「必填有預設值」兩種語意。
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
