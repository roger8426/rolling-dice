import { ref } from 'vue'
import type { RollEntry, RollEntryDraft } from '~/types/business/dice'

const MAX_ENTRIES = 50

const entries = ref<RollEntry[]>([])

/**
 * 擲骰歷史 log：module-scoped，純記憶體不持久化。
 * push 時自動補 id 與 rolledAt；超過 MAX_ENTRIES 時 FIFO 截掉最舊。
 */
export function useDiceRollLog() {
  const push = (entry: RollEntryDraft): void => {
    const enriched = {
      ...entry,
      id: crypto.randomUUID(),
      rolledAt: Date.now(),
    } as RollEntry
    const next = [enriched, ...entries.value]
    if (next.length > MAX_ENTRIES) next.length = MAX_ENTRIES
    entries.value = next
  }

  const clear = (): void => {
    entries.value = []
  }

  return { entries, push, clear }
}
