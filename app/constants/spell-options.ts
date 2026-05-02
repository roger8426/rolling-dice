import type { SelectOption } from '@ui'
import { SPELL_SCHOOLS, SPELL_SCHOOL_LABELS } from './dnd'

/** 環數下拉選項：戲法(0) ~ 9 環 */
export const SPELL_LEVEL_OPTIONS: readonly SelectOption[] = [
  { value: 0, label: '戲法' },
  ...Array.from({ length: 9 }, (_, i) => ({ value: i + 1, label: `${i + 1} 環` })),
]

/** 學派下拉選項：全部 + 八大學派 */
export const SPELL_SCHOOL_OPTIONS: readonly SelectOption[] = [
  { value: '', label: '全部' },
  ...SPELL_SCHOOLS.map((key) => ({ value: key, label: SPELL_SCHOOL_LABELS[key] })),
]
