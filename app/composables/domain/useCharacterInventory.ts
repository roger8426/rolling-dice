import { DEFAULT_CURRENCY } from '~/constants/inventory'
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

  function persist(): void {
    if (!store.updateInventory(characterId, items.value, currency.value)) {
      useToast().error('儲存失敗，請稍後再試')
    }
  }

  function addItem(draft: InventoryItemDraft): void {
    items.value.push({ id: crypto.randomUUID(), ...draft })
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
      items.value[index] = { id: itemId, ...draft }
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

  const backpackItems = computed(() => items.value.filter((i) => i.location === 'backpack'))
  const dimensionalBagItems = computed(() =>
    items.value.filter((i) => i.location === 'dimensionalBag'),
  )
  const backpackLoad = computed(() => calculateBackpackLoad(backpackItems.value, currency.value))
  const maxCarryWeight = computed(() => {
    const str = character.value?.abilities.strength
    return str ? calculateMaxCarryWeight(str.basicScore + str.bonusScore) : 0
  })
  const isOverEncumbered = computed(() => backpackLoad.value > maxCarryWeight.value)

  return {
    items,
    currency,
    backpackItems,
    dimensionalBagItems,
    backpackLoad,
    maxCarryWeight,
    isOverEncumbered,
    addItem,
    removeItem,
    updateItem,
    moveItem,
    updateCurrency,
  }
}
