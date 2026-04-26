import type { Ref } from 'vue'
import { getCombatStateStorageKey } from '~/constants/storage'
import type { AbilityKey } from '~/types/business/dnd'

/** 戰況追蹤資料；獨立於 Character 主資料，僅影響速查顯示 */
export interface CombatState {
  characterId: string
  hp: {
    /** 目前生命值；null 表示未開始追蹤，UI 應顯示 effectiveMaxHp */
    current: number | null
    /** 臨時生命值，受傷時優先扣 */
    tempHp: number
    /** 最大生命臨時調整（疊加於 baseMaxHp） */
    maxAdjustment: number
  }
  /** 護甲等級臨時調整（疊加於基礎 AC） */
  acAdjustment: number
  /** 移動速度臨時調整 */
  speedAdjustment: number
  /** 各項豁免的臨時調整 */
  savingThrowAdjustments: Partial<Record<AbilityKey, number>>
  updatedAt: string
}

const PERSIST_DEBOUNCE_MS = 300

function createDefaultState(characterId: string): CombatState {
  return {
    characterId,
    hp: { current: null, tempHp: 0, maxAdjustment: 0 },
    acAdjustment: 0,
    speedAdjustment: 0,
    savingThrowAdjustments: {},
    updatedAt: new Date().toISOString(),
  }
}

function normalizeState(stored: Partial<CombatState>, characterId: string): CombatState {
  const fallback = createDefaultState(characterId)
  return {
    characterId,
    hp: {
      current: stored.hp?.current ?? null,
      tempHp: Math.max(0, stored.hp?.tempHp ?? 0),
      maxAdjustment: stored.hp?.maxAdjustment ?? 0,
    },
    acAdjustment: stored.acAdjustment ?? 0,
    speedAdjustment: stored.speedAdjustment ?? 0,
    savingThrowAdjustments: { ...stored.savingThrowAdjustments },
    updatedAt: stored.updatedAt ?? fallback.updatedAt,
  }
}

/**
 * 角色速查使用的戰況追蹤狀態：HP / 臨時生命 / AC・速度・豁免的臨時調整。
 * 以獨立 localStorage key 儲存，重整後可還原；與 Character 主資料完全隔離。
 */
export function useCharacterCombatState(characterId: string, baseMaxHp: Ref<number>) {
  const storageKey = getCombatStateStorageKey(characterId)
  const stored = getLocalStorage<CombatState>(storageKey)
  const state = reactive<CombatState>(
    stored ? normalizeState(stored, characterId) : createDefaultState(characterId),
  )

  /** 經調整後的最大生命；不可低於 1 */
  const effectiveMaxHp = computed(() => Math.max(1, baseMaxHp.value + state.hp.maxAdjustment))

  function clampHp(value: number): number {
    return Math.min(Math.max(0, value), effectiveMaxHp.value)
  }

  function touch(): void {
    state.updatedAt = new Date().toISOString()
  }

  // ─── HP ───────────────────────────────────────────────────────────────

  /** 顯示用當前 HP；尚未追蹤時回傳 effectiveMaxHp */
  const displayCurrentHp = computed(() =>
    state.hp.current === null ? effectiveMaxHp.value : state.hp.current,
  )

  function adjustHp(delta: number): void {
    if (delta === 0) return
    if (delta > 0) healHp(delta)
    else damageHp(-delta)
  }

  function damageHp(amount: number): void {
    if (amount <= 0) return
    let remaining = amount
    if (state.hp.tempHp > 0) {
      const absorbed = Math.min(state.hp.tempHp, remaining)
      state.hp.tempHp -= absorbed
      remaining -= absorbed
    }
    if (remaining > 0) {
      state.hp.current = clampHp(displayCurrentHp.value - remaining)
    }
    touch()
  }

  function healHp(amount: number): void {
    if (amount <= 0) return
    state.hp.current = clampHp(displayCurrentHp.value + amount)
    touch()
  }

  function setTempHp(value: number): void {
    state.hp.tempHp = Math.max(0, value)
    touch()
  }

  function adjustTempHp(delta: number): void {
    state.hp.tempHp = Math.max(0, state.hp.tempHp + delta)
    touch()
  }

  function adjustMaxHp(delta: number): void {
    state.hp.maxAdjustment += delta
    if (state.hp.current !== null) {
      state.hp.current = clampHp(state.hp.current)
    }
    touch()
  }

  function resetHp(): void {
    state.hp.current = null
    state.hp.tempHp = 0
    state.hp.maxAdjustment = 0
    touch()
  }

  // ─── Adjustments ──────────────────────────────────────────────────────

  function adjustAc(delta: number): void {
    state.acAdjustment += delta
    touch()
  }

  function adjustSpeed(delta: number): void {
    state.speedAdjustment += delta
    touch()
  }

  function adjustSavingThrow(key: AbilityKey, delta: number): void {
    const current = state.savingThrowAdjustments[key] ?? 0
    const next = current + delta
    const rest = Object.fromEntries(
      Object.entries(state.savingThrowAdjustments).filter(([k]) => k !== key),
    ) as Partial<Record<AbilityKey, number>>
    state.savingThrowAdjustments = next === 0 ? rest : { ...rest, [key]: next }
    touch()
  }

  /** 一次清空所有臨時調整、HP 回滿、tempHp 歸 0、最大生命調整歸 0 */
  function resetAll(): void {
    state.hp.current = null
    state.hp.tempHp = 0
    state.hp.maxAdjustment = 0
    state.acAdjustment = 0
    state.speedAdjustment = 0
    state.savingThrowAdjustments = {}
    touch()
  }

  // ─── Persist ──────────────────────────────────────────────────────────

  const persist = debounce((snapshot: CombatState) => {
    setLocalStorage(storageKey, snapshot)
  }, PERSIST_DEBOUNCE_MS)

  watch(
    () => state,
    (current) => persist(JSON.parse(JSON.stringify(current)) as CombatState),
    { deep: true },
  )

  if (getCurrentScope()) {
    onScopeDispose(() => {
      persist.cancel()
    })
  }

  return {
    state: readonly(state),
    effectiveMaxHp,
    displayCurrentHp,
    adjustHp,
    damageHp,
    healHp,
    setTempHp,
    adjustTempHp,
    adjustMaxHp,
    resetHp,
    adjustAc,
    adjustSpeed,
    adjustSavingThrow,
    resetAll,
  }
}
