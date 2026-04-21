<template>
  <section aria-labelledby="section-ac">
    <h2 id="section-ac" class="mb-4 font-display text-lg font-bold text-content">護甲等級</h2>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
      <div>
        <label for="armor-type" class="mb-1 block text-xs text-content">著甲類型</label>
        <CommonAppSelect
          id="armor-type"
          :model-value="armorClass.type"
          :options="armorTypeOptions"
          size="sm"
          placeholder="選擇護甲"
          @update:model-value="emit('update:armorType', ($event as ArmorType | '') ?? '')"
        />
      </div>

      <div>
        <label for="armor-value" class="mb-1 block text-xs text-content">護甲基礎值</label>
        <CommonAppInput
          id="armor-value"
          class="w-full"
          :radius="0"
          :model-value="armorClass.value != null ? String(armorClass.value) : ''"
          type="number"
          size="sm"
          outline
          placeholder="10"
          @update:model-value="emit('update:armorValue', $event ? Number($event) : null)"
        />
      </div>

      <div>
        <label for="armor-ability" class="mb-1 block text-xs text-content">屬性調整值</label>
        <CommonAppSelect
          id="armor-ability"
          :model-value="armorClass.abilityKey"
          :options="abilityOptions"
          size="sm"
          placeholder="無"
          @update:model-value="emit('update:armorAbilityKey', ($event as AbilityKey | '') ?? '')"
        />
      </div>

      <div>
        <label for="shield-value" class="mb-1 block text-xs text-content">盾牌加值</label>
        <CommonAppInput
          id="shield-value"
          class="w-full"
          :radius="0"
          :model-value="String(armorClass.shieldValue)"
          type="number"
          size="sm"
          outline
          placeholder="0"
          @update:model-value="emit('update:shieldValue', toNumber($event, 0))"
        />
      </div>

      <div>
        <span id="ac-total-label" class="mb-1 block text-xs text-content">AC</span>
        <output
          aria-labelledby="ac-total-label"
          class="flex h-9 items-center rounded-lg border border-primary bg-surface px-3 text-sm font-bold text-content"
        >
          {{ totalAC }}
        </output>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SelectOption } from '@ui'
import type { AbilityScores, ArmorClassConfig } from '~/types/business/character'
import type { AbilityKey, ArmorType } from '~/types/business/dnd'
import { ABILITY_NAMES, ARMOR_TYPE_NAMES } from '~/constants/dnd'

const props = defineProps<{
  armorClass: ArmorClassConfig
  abilityScores: AbilityScores
}>()

const emit = defineEmits<{
  'update:armorType': [value: ArmorType | '']
  'update:armorValue': [value: number | null]
  'update:armorAbilityKey': [value: AbilityKey | '']
  'update:shieldValue': [value: number]
}>()

const armorTypeOptions: SelectOption[] = Object.entries(ARMOR_TYPE_NAMES).map(([value, label]) => ({
  value,
  label,
}))

const abilityOptions: SelectOption[] = [
  { value: '', label: '無' },
  ...Object.entries(ABILITY_NAMES).map(([value, label]) => ({ value, label })),
]

const totalAC = computed(() => getTotalArmorClass(props.armorClass, props.abilityScores))

function toNumber(value: string, fallback: number): number {
  const num = Number(value)
  return Number.isNaN(num) ? fallback : num
}
</script>
