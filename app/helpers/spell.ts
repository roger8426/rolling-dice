import type { RawSpell, Spell, SpellSchool } from '~/types/business/spell'

const logger = createLogger('[spell]')

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
  if (!school) {
    logger.warn(`未知學派 "${raw.school}"，略過法術：${raw.name}`)
    return null
  }
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

/** 將 Spell 列表依環數分組並組內依中文名稱排序 */
export function groupSpellsByLevel(spells: Spell[]): Array<{ level: number; spells: Spell[] }> {
  const groups = new Map<number, Spell[]>()
  for (const spell of spells) {
    const bucket = groups.get(spell.level) ?? []
    bucket.push(spell)
    groups.set(spell.level, bucket)
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([level, spellsOfLevel]) => ({
      level,
      spells: [...spellsOfLevel].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant')),
    }))
}
