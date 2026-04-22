<template>
  <section aria-labelledby="section-ac">
    <h2 id="section-ac" class="mb-4 font-display text-lg font-bold text-content">護甲等級</h2>
    <div class="flex flex-wrap gap-2">
      <div>
        <label for="armor-type" class="mb-1 block text-xs text-content">著甲類型</label>
        <CommonAppSelect
          id="armor-type"
          :model-value="armorClass.type"
          :options="armorTypeOptions"
          size="sm"
          placeholder="選擇護甲"
          class="w-18"
          @update:model-value="emit('update:armorType', ($event as ArmorType | '') ?? '')"
        />
      </div>

      <div>
        <label for="armor-value" class="mb-1 block text-xs text-content">基礎值</label>
        <CommonAppInput
          id="armor-value"
          class="w-12"
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
        <span id="dex-mod-label" class="mb-1 block text-xs text-content">敏捷調整值</span>
        <output
          aria-labelledby="dex-mod-label"
          class="flex h-8 w-14 items-center justify-center rounded-lg bg-canvas px-2 text-sm font-bold"
          :class="dexModifierTextColor"
        >
          {{ formatModifier(effectiveDexModifier) }}
        </output>
      </div>

      <div>
        <label for="armor-ability" class="mb-1 block text-xs text-content">無甲防禦</label>
        <CommonAppSelect
          id="armor-ability"
          :model-value="armorClass.abilityKey"
          :options="abilityOptions"
          size="sm"
          placeholder="無"
          class="w-18"
          @update:model-value="emit('update:armorAbilityKey', ($event as AbilityKey | '') ?? '')"
        />
      </div>

      <div>
        <label for="shield-value" class="mb-1 block text-xs text-content">盾牌</label>
        <CommonAppInput
          id="shield-value"
          class="w-12"
          :radius="0"
          :model-value="String(armorClass.shieldValue)"
          type="number"
          size="sm"
          outline
          placeholder="0"
          @update:model-value="emit('update:shieldValue', toNumber($event, 0))"
        />
      </div>
    </div>

    <div class="mt-4 flex items-center justify-end gap-3">
      <span id="ac-total-label" class="text-xs text-content-muted">AC 總計</span>
      <output
        aria-labelledby="ac-total-label"
        class="flex size-12 items-center justify-center rounded-lg border border-border-soft bg-surface text-2xl font-bold text-content"
      >
        {{ totalAC }}
      </output>
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

const effectiveDexModifier = computed(() => {
  const dexMod = getAbilityModifier(props.abilityScores.dexterity)
  const type = props.armorClass.type
  if (type === 'heavy') return 0
  if (type === 'medium') return Math.min(dexMod, 2)
  return dexMod
})

const dexModifierTextColor = computed(() => {
  const v = effectiveDexModifier.value
  if (v > 0) return 'text-success'
  if (v < 0) return 'text-danger'
  return 'text-content-muted'
})

function toNumber(value: string, fallback: number): number {
  const num = Number(value)
  return Number.isNaN(num) ? fallback : num
}
</script>
