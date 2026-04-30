import { ATTUNEMENT_SLOT_COUNT, DEFAULT_CURRENCY } from '~/constants/inventory'
import { getTotalScore } from '~/helpers/ability'
import { calculateBackpackLoad, calculateMaxCarryWeight } from '~/helpers/inventory'
import type {
  CharacterCurrency,
  InventoryItem,
  InventoryItemDraft,
} from '~/types/business/character'

export function useCharacterInventory(characterId: string) {
  const store = useCharacterStore()

  const character = computed(() => store.getById(characterId))

  const items = ref<InventoryItem[]>(character.value?.items.map((i) => ({ ...i })) ?? [])
  const currency = ref<CharacterCurrency>({
    ...(character.value?.currency ?? { ...DEFAULT_CURRENCY }),
  })

  const backpackItems = computed(() => items.value.filter((i) => i.location === 'backpack'))
  const dimensionalBagItems = computed(() =>
    items.value.filter((i) => i.location === 'dimensionalBag'),
  )
  const attunedItems = computed<InventoryItem[]>(() =>
    items.value.filter((i) => i.isAttuned).slice(0, ATTUNEMENT_SLOT_COUNT),
  )
  const backpackLoad = computed(() => calculateBackpackLoad(backpackItems.value, currency.value))
  const maxCarryWeight = computed(() => {
    const str = character.value?.abilities.strength
    return str ? calculateMaxCarryWeight(getTotalScore(str)) : 0
  })
  const isOverEncumbered = computed(() => backpackLoad.value > maxCarryWeight.value)

  function persist(): void {
    if (!store.updateInventory(characterId, items.value, currency.value)) {
      useToast().error('儲存失敗，請稍後再試')
    }
  }

  function addItem(draft: InventoryItemDraft): void {
    items.value.push({ id: crypto.randomUUID(), ...draft, isAttuned: false })
    persist()
  }

  function removeItem(itemId: string): void {
    const index = items.value.findIndex((i) => i.id === itemId)
    if (index !== -1) {
      items.value.splice(index, 1)
      persist()
    }
  }

  function updateItem(itemId: string, draft: InventoryItemDraft): void {
    const index = items.value.findIndex((i) => i.id === itemId)
    if (index !== -1) {
      items.value[index] = { id: itemId, ...draft, isAttuned: items.value[index]!.isAttuned }
      persist()
    }
  }

  function moveItem(itemId: string): void {
    const item = items.value.find((i) => i.id === itemId)
    if (!item) return
    item.location = item.location === 'backpack' ? 'dimensionalBag' : 'backpack'
    persist()
  }

  function updateCurrency(value: CharacterCurrency): void {
    currency.value = { ...value }
    persist()
  }

  /** 設定第 slotIndex 個 slot 的同調物品；newItemId 為 null 時清空 slot。 */
  function setAttunement(slotIndex: number, newItemId: string | null): void {
    if (slotIndex < 0 || slotIndex >= ATTUNEMENT_SLOT_COUNT) return
    const current = attunedItems.value[slotIndex] ?? null
    if (current?.id === newItemId) return
    if (current) {
      const oldIdx = items.value.findIndex((i) => i.id === current.id)
      if (oldIdx !== -1) items.value[oldIdx] = { ...items.value[oldIdx]!, isAttuned: false }
    }
    if (newItemId) {
      const newIdx = items.value.findIndex((i) => i.id === newItemId)
      if (newIdx !== -1) items.value[newIdx] = { ...items.value[newIdx]!, isAttuned: true }
    }
    persist()
  }

  return {
    items,
    currency,
    backpackItems,
    dimensionalBagItems,
    attunedItems,
    backpackLoad,
    maxCarryWeight,
    isOverEncumbered,
    addItem,
    removeItem,
    updateItem,
    moveItem,
    updateCurrency,
    setAttunement,
  }
}
