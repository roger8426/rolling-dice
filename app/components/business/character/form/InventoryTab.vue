<template>
  <div class="space-y-4 bg-canvas-elevated p-4">
    <h2 class="font-display text-lg font-bold text-content">資產</h2>
    <!-- Currency -->
    <BusinessCharacterFormInventoryCurrencyPanel
      :currency="currency"
      @update:currency="$emit('update-currency', $event)"
    />

    <!-- Bag lists -->
    <div class="grid gap-4 md:grid-cols-2">
      <BusinessCharacterFormInventoryItemList
        :items="backpackItems"
        section="backpack"
        title="背包"
        @add="$emit('add-item', $event)"
        @remove="$emit('remove-item', $event)"
        @update="(id, draft) => $emit('update-item', id, draft)"
        @move-item="$emit('move-item', $event)"
      />
      <BusinessCharacterFormInventoryItemList
        :items="dimensionalBagItems"
        section="dimensionalBag"
        title="次元袋"
        @add="$emit('add-item', $event)"
        @remove="$emit('remove-item', $event)"
        @update="(id, draft) => $emit('update-item', id, draft)"
        @move-item="$emit('move-item', $event)"
      />
    </div>

    <!-- Weight summary -->
    <div
      class="flex items-center justify-end gap-1.5"
      :class="isOverEncumbered ? 'font-semibold text-danger' : 'text-content-muted'"
    >
      <span v-if="isOverEncumbered" class="flex items-center gap-0.5">
        <Icon name="alert-triangle" :size="16" />
      </span>
      <span>負重 {{ formatWeight(backpackLoad) }} / {{ formatWeight(maxCarryWeight) }} 磅</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@ui'
import { formatWeight } from '~/helpers/inventory'
import type {
  CharacterCurrency,
  InventoryItem,
  InventoryItemDraft,
} from '~/types/business/character'

defineProps<{
  backpackItems: InventoryItem[]
  dimensionalBagItems: InventoryItem[]
  currency: CharacterCurrency
  backpackLoad: number
  maxCarryWeight: number
  isOverEncumbered: boolean
}>()

defineEmits<{
  'add-item': [draft: InventoryItemDraft]
  'remove-item': [id: string]
  'update-item': [id: string, draft: InventoryItemDraft]
  'move-item': [id: string]
  'update-currency': [value: CharacterCurrency]
}>()
</script>
