import type { SelectOption } from '@ui'
import { SPELL_SCHOOLS, SPELL_SCHOOL_LABELS } from './dnd'

/** 法術環數篩選值：未選擇 / 全部 / 戲法(0) ~ 9 環 */
export type SpellLevelFilter = 'unselected' | 'all' | number

/** 環數下拉選項：預設「請選擇」避免一次渲染所有法術 */
export const SPELL_LEVEL_OPTIONS: readonly SelectOption[] = [
  { value: 'unselected', label: '請選擇' },
  { value: 'all', label: '全部' },
  { value: '0', label: '戲法' },
  ...Array.from({ length: 9 }, (_, i) => ({ value: String(i + 1), label: `${i + 1} 環` })),
]

/** 學派下拉選項：全部 + 八大學派 */
export const SPELL_SCHOOL_OPTIONS: readonly SelectOption[] = [
  { value: '', label: '全部' },
  ...SPELL_SCHOOLS.map((key) => ({ value: key, label: SPELL_SCHOOL_LABELS[key] })),
]

/** 將 Select emit 的值正規化為 SpellLevelFilter */
export function toSpellLevelFilter(value: string | number | null): SpellLevelFilter {
  if (value === 'unselected' || value === 'all') return value
  if (value == null || value === '') return 'unselected'
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : 'unselected'
}
