import type { Ref } from 'vue'
import { PROFESSION_CONFIG } from '~/constants/dnd'
import { getCombatStateStorageKey } from '~/constants/storage'
import { calculateTotalLevel } from '~/helpers/character'
import type { ProfessionEntry, SpellLevel } from '~/types/business/character'
import type { AbilityKey, ProfessionKey } from '~/types/business/dnd'

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
  /** 各特性目前剩餘次數（key = feature.id）；未出現的 key 視為滿 */
  featureUses: Partial<Record<string, number>>
  /** 各職業已使用生命骰數（key = ProfessionKey）；未出現的 key 視為 0 */
  hitDiceUsed: Partial<Record<ProfessionKey, number>>
  /** 各環級已使用一般法術位數（key = SpellLevel）；未出現的 key 視為 0 */
  spellSlotsUsed: Partial<Record<SpellLevel, number>>
  /** 各環級已使用契術環位數（key = SpellLevel）；未出現的 key 視為 0 */
  pactSlotsUsed: Partial<Record<SpellLevel, number>>
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
    featureUses: {},
    hitDiceUsed: {},
    spellSlotsUsed: {},
    pactSlotsUsed: {},
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
    featureUses: { ...stored.featureUses },
    hitDiceUsed: { ...stored.hitDiceUsed },
    spellSlotsUsed: { ...stored.spellSlotsUsed },
    pactSlotsUsed: { ...stored.pactSlotsUsed },
    updatedAt: stored.updatedAt ?? fallback.updatedAt,
  }
}

/** 將 record[key] 設為 value，等於 defaultValue 時從 record 移除該 key 以保持稀疏 */
function setSparseRecord<K extends string | number, T>(
  record: Partial<Record<K, T>>,
  key: K,
  value: T,
  defaultValue: T,
): Partial<Record<K, T>> {
  const keyStr = String(key)
  const rest = Object.fromEntries(Object.entries(record).filter(([k]) => k !== keyStr)) as Partial<
    Record<K, T>
  >
  return value === defaultValue ? rest : { ...rest, [key]: value }
}

function sumUsedSlots(used: Partial<Record<SpellLevel, number>>): number {
  return Object.values(used).reduce((sum, n) => sum + (n ?? 0), 0)
}

/** 長休：總回復額為 floor(totalLevel/2)（至少 1），依骰面由大到小貪婪分配 */
function recoverHitDice(
  used: Partial<Record<ProfessionKey, number>>,
  professions: readonly ProfessionEntry[],
): Partial<Record<ProfessionKey, number>> {
  const totalLevel = calculateTotalLevel(professions)
  if (totalLevel === 0) return {}

  const sorted = [...professions].sort(
    (a, b) => PROFESSION_CONFIG[b.profession].hitDie - PROFESSION_CONFIG[a.profession].hitDie,
  )

  let pool = Math.max(1, Math.floor(totalLevel / 2))
  const result: Partial<Record<ProfessionKey, number>> = {}

  for (const entry of sorted) {
    const currentlyUsed = used[entry.profession] ?? 0
    if (currentlyUsed === 0) continue
    const recover = pool > 0 ? Math.min(currentlyUsed, pool) : 0
    pool -= recover
    const remaining = currentlyUsed - recover
    if (remaining > 0) {
      result[entry.profession] = remaining
    }
  }

  return result
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
    state.savingThrowAdjustments = setSparseRecord(
      state.savingThrowAdjustments,
      key,
      current + delta,
      0,
    )
    touch()
  }

  // ─── Feature uses ─────────────────────────────────────────────────────

  function getFeatureUse(featureId: string, max: number): number {
    return state.featureUses[featureId] ?? max
  }

  function setFeatureUse(featureId: string, value: number, max: number): void {
    const clamped = Math.min(Math.max(0, value), max)
    state.featureUses = setSparseRecord(state.featureUses, featureId, clamped, max)
    touch()
  }

  function adjustFeatureUse(featureId: string, delta: number, max: number): void {
    if (delta === 0) return
    setFeatureUse(featureId, getFeatureUse(featureId, max) + delta, max)
  }

  // ─── Hit dice ─────────────────────────────────────────────────────────

  /** 取得指定職業已使用生命骰數，未追蹤時回傳 0 */
  function getHitDiceUsed(profession: ProfessionKey): number {
    return state.hitDiceUsed[profession] ?? 0
  }

  /** 設定指定職業已使用生命骰數，clamp 至 [0, level] */
  function setHitDiceUsed(profession: ProfessionKey, value: number, level: number): void {
    const clamped = Math.min(Math.max(0, value), level)
    state.hitDiceUsed = setSparseRecord(state.hitDiceUsed, profession, clamped, 0)
    touch()
  }

  /** 調整指定職業已使用生命骰數，clamp 至 [0, level] */
  function adjustHitDiceUsed(profession: ProfessionKey, delta: number, level: number): void {
    if (delta === 0) return
    setHitDiceUsed(profession, getHitDiceUsed(profession) + delta, level)
  }

  // ─── Spell slots ──────────────────────────────────────────────────────

  function getSpellSlotUsed(level: SpellLevel): number {
    return state.spellSlotsUsed[level] ?? 0
  }

  function setSpellSlotUsed(level: SpellLevel, value: number, max: number): void {
    const clamped = Math.min(Math.max(0, value), Math.max(0, max))
    state.spellSlotsUsed = setSparseRecord(state.spellSlotsUsed, level, clamped, 0)
    touch()
  }

  function adjustSpellSlotUsed(level: SpellLevel, delta: number, max: number): void {
    if (delta === 0) return
    setSpellSlotUsed(level, getSpellSlotUsed(level) + delta, max)
  }

  function getPactSlotUsed(level: SpellLevel): number {
    return state.pactSlotsUsed[level] ?? 0
  }

  function setPactSlotUsed(level: SpellLevel, value: number, max: number): void {
    const clamped = Math.min(Math.max(0, value), Math.max(0, max))
    state.pactSlotsUsed = setSparseRecord(state.pactSlotsUsed, level, clamped, 0)
    touch()
  }

  function adjustPactSlotUsed(level: SpellLevel, delta: number, max: number): void {
    if (delta === 0) return
    setPactSlotUsed(level, getPactSlotUsed(level) + delta, max)
  }

  // ─── Rests ────────────────────────────────────────────────────────────

  /**
   * 短休：恢復傳入 id 對應的特性次數與全部契術環位，HP 與其他臨時調整不變。
   * 回傳是否有實際變更，供呼叫端決定是否顯示完成訊息。
   */
  function shortRest(shortRestFeatureIds: string[]): boolean {
    const targets = new Set(shortRestFeatureIds)
    const hasPactToRecover = sumUsedSlots(state.pactSlotsUsed) > 0

    if (targets.size === 0 && !hasPactToRecover) return false

    if (targets.size > 0) {
      state.featureUses = Object.fromEntries(
        Object.entries(state.featureUses).filter(([k]) => !targets.has(k)),
      ) as Partial<Record<string, number>>
    }
    if (hasPactToRecover) {
      state.pactSlotsUsed = {}
    }
    touch()
    return true
  }

  /** 長休：HP 回滿、清空所有臨時調整與所有特性次數與所有法術位，並依「大骰面優先」貪婪回復生命骰 */
  function longRest(professions: readonly ProfessionEntry[] = []): void {
    state.hp.current = null
    state.hp.tempHp = 0
    state.hp.maxAdjustment = 0
    state.acAdjustment = 0
    state.speedAdjustment = 0
    state.savingThrowAdjustments = {}
    state.featureUses = {}
    state.hitDiceUsed = recoverHitDice(state.hitDiceUsed, professions)
    state.spellSlotsUsed = {}
    state.pactSlotsUsed = {}
    touch()
  }

  // ─── Persist ──────────────────────────────────────────────────────────

  let hasNotifiedFailure = false
  const persist = debounce((snapshot: CombatState) => {
    if (setLocalStorage(storageKey, snapshot)) {
      hasNotifiedFailure = false
    } else if (!hasNotifiedFailure) {
      hasNotifiedFailure = true
      useToast().error('更新失敗，重整後資料可能遺失')
    }
  }, PERSIST_DEBOUNCE_MS)

  watch(
    () => state,
    (current) => persist(JSON.parse(JSON.stringify(current)) as CombatState),
    { deep: true },
  )

  if (getCurrentScope()) {
    onScopeDispose(() => {
      persist.flush()
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
    getFeatureUse,
    setFeatureUse,
    adjustFeatureUse,
    getHitDiceUsed,
    setHitDiceUsed,
    adjustHitDiceUsed,
    getSpellSlotUsed,
    setSpellSlotUsed,
    adjustSpellSlotUsed,
    getPactSlotUsed,
    setPactSlotUsed,
    adjustPactSlotUsed,
    shortRest,
    longRest,
  }
}
