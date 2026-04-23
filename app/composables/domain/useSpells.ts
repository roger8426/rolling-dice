import { normalizeSpell } from '~/helpers/spell'
import type { RawSpell, Spell } from '~/types/business/spell'

/**
 * 載入並快取 public/json/spells.json 的法術資料。
 * 以 useAsyncData 快取，同 key 多次呼叫共享結果。
 */
export function useSpells() {
  const config = useRuntimeConfig()

  const { data, pending, error } = useAsyncData('spells', async () => {
    const baseURL = config.app.baseURL.endsWith('/') ? config.app.baseURL : `${config.app.baseURL}/`
    const raw = await $fetch<RawSpell[]>(`${baseURL}json/spells.json`)
    return raw.map(normalizeSpell).filter((s): s is Spell => s !== null)
  })

  const spells = computed<Spell[]>(() => data.value ?? [])

  const spellMap = computed(() => new Map(spells.value.map((s) => [s.name, s])))

  function getSpell(name: string): Spell | undefined {
    return spellMap.value.get(name)
  }

  return { spells, spellMap, getSpell, pending, error }
}
