import { ADVENTURES_STORAGE_PREFIX, getAdventuresStorageKey } from '~/constants/storage'
import type { AdventureLog } from '~/types/business/adventure'

function emptyAdventures(): AdventureLog {
  return { entries: [], syncMoneyToCurrency: false }
}

function cloneAdventures(value: AdventureLog): AdventureLog {
  return JSON.parse(JSON.stringify(value)) as AdventureLog
}

export const useAdventureStore = defineStore('adventure', () => {
  const cache = ref(new Map<string, AdventureLog>())

  function load(characterId: string): AdventureLog {
    const cached = cache.value.get(characterId)
    if (cached) return cloneAdventures(cached)
    const stored = getLocalStorage<AdventureLog>(getAdventuresStorageKey(characterId))
    const value = stored ?? emptyAdventures()
    cache.value.set(characterId, value)
    return cloneAdventures(value)
  }

  function save(characterId: string, value: AdventureLog): boolean {
    const previous = cache.value.get(characterId) ?? emptyAdventures()
    const next = cloneAdventures(value)
    cache.value.set(characterId, next)
    if (!setLocalStorage(getAdventuresStorageKey(characterId), next)) {
      cache.value.set(characterId, previous)
      return false
    }
    return true
  }

  function remove(characterId: string): void {
    cache.value.delete(characterId)
    removeLocalStorage(getAdventuresStorageKey(characterId))
  }

  function removeAll(): void {
    cache.value.clear()
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key?.startsWith(ADVENTURES_STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    }
  }

  return {
    load,
    save,
    remove,
    removeAll,
  }
})
