import {
  POINT_BUY_BUDGET,
  POINT_BUY_COST_TABLE,
  POINT_BUY_MAX_SCORE,
  POINT_BUY_MIN_SCORE,
} from '~/constants/dnd'
import type { AbilityKey } from '~/types/business/dnd'

/**
 * 判斷單項屬性分數是否在購點制合法範圍內（8–15）
 */
export function isValidPointBuyScore(score: number): boolean {
  return Number.isInteger(score) && score >= POINT_BUY_MIN_SCORE && score <= POINT_BUY_MAX_SCORE
}

/**
 * 查表取得購點制費用。
 * 呼叫前必須先以 `isValidPointBuyScore` 驗證，否則拋出錯誤。
 */
export function getPointBuyCost(score: number): number {
  if (!isValidPointBuyScore(score)) {
    throw new RangeError(
      `getPointBuyCost: score ${score} is out of valid range (${POINT_BUY_MIN_SCORE}–${POINT_BUY_MAX_SCORE})`,
    )
  }
  return POINT_BUY_COST_TABLE[score]!
}

/**
 * 計算六項屬性的購點總花費。
 * 若任一分數超出合法範圍，拋出錯誤。
 */
export function calculateSpentPoints(scores: Record<AbilityKey, number>): number {
  return (Object.values(scores) as number[]).reduce((sum, score) => sum + getPointBuyCost(score), 0)
}

/**
 * 計算購點制剩餘點數（預算減去已花費）。
 * 若任一分數超出合法範圍，拋出錯誤。
 */
export function getRemainingPoints(scores: Record<AbilityKey, number>): number {
  return POINT_BUY_BUDGET - calculateSpentPoints(scores)
}

/**
 * 驗證整組屬性是否符合購點制規則：
 * 1. 所有分數皆在合法範圍（8–15）
 * 2. 總花費不超過預算（27 點）
 */
export function isValidPointBuy(scores: Record<AbilityKey, number>): boolean {
  const allScoresValid = (Object.values(scores) as number[]).every(isValidPointBuyScore)
  if (!allScoresValid) return false
  return calculateSpentPoints(scores) <= POINT_BUY_BUDGET
}
