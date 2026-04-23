import type { RawSpell, Spell, SpellSchool } from '~/types/business/spell'

/** 學派中文顯示名稱 */
export const SPELL_SCHOOL_LABELS: Record<SpellSchool, string> = {
  abjuration: '防護',
  conjuration: '咒法',
  divination: '預言',
  enchantment: '惑控',
  evocation: '塑能',
  illusion: '幻術',
  necromancy: '死靈',
  transmutation: '變化',
}

const CN_TO_SCHOOL: Record<string, SpellSchool> = Object.fromEntries(
  Object.entries(SPELL_SCHOOL_LABELS).map(([key, label]) => [label, key as SpellSchool]),
)

/** 將原始法術資料正規化為 Spell；若學派未知則回傳 null，呼叫端負責過濾 */
export function normalizeSpell(raw: RawSpell): Spell | null {
  const school = CN_TO_SCHOOL[raw.school]
  if (!school) return null
  return { ...raw, school }
}

/** 將法術環數轉為中文顯示（0 為戲法） */
export function formatSpellLevel(level: number): string {
  return level === 0 ? '戲法' : `${level} 環`
}

/** 以「聲勢材」精簡字串描述法術成分 */
export function formatSpellComponents(
  spell: Pick<Spell, 'verbal' | 'somatic' | 'material'>,
): string {
  const parts: string[] = []
  if (spell.verbal) parts.push('聲')
  if (spell.somatic) parts.push('勢')
  if (spell.material) parts.push('材')
  return parts.join(' / ') || '—'
}
