import { normalizeSpell } from '~/helpers/spell'
import type { Spell, SpellDto } from '~/types/business/spell'

export interface SkippedSpell {
  name: string
  school: string
}

/** 載入 public/json/spells.json，回傳正規化後的 Spell 與略過的未知學派條目。 */
export function useSpells() {
  const config = useRuntimeConfig()
  const logger = createLogger('[useSpells]')

  const { data, pending, error, refresh } = useAsyncData('spells', async () => {
    const baseURL = config.app.baseURL.endsWith('/') ? config.app.baseURL : `${config.app.baseURL}/`
    const raw = await $fetch<SpellDto[]>(`${baseURL}json/spells.json`)
    const accepted: Spell[] = []
    const skipped: SkippedSpell[] = []
    for (const r of raw) {
      const normalized = normalizeSpell(r)
      if (normalized) {
        accepted.push(normalized)
      } else {
        skipped.push({ name: r.name, school: r.school })
      }
    }
    if (skipped.length > 0) {
      logger.warn(`略過 ${skipped.length} 筆未知學派法術`, skipped)
    }
    return { spells: accepted, skipped }
  })

  const spells = computed<Spell[]>(() => data.value?.spells ?? [])
  const skippedSpells = computed<SkippedSpell[]>(() => data.value?.skipped ?? [])

  const spellMap = computed(() => new Map(spells.value.map((s) => [s.name, s])))

  function getSpell(name: string): Spell | undefined {
    return spellMap.value.get(name)
  }

  return { spells, skippedSpells, spellMap, getSpell, pending, error, refresh }
}
