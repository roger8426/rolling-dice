<template>
  <div class="space-y-4 px-2">
    <img src="~/assets/images/dnd.png" alt="" loading="lazy" aria-hidden="true" />
    <!-- Method selector -->
    <div>
      <p class="mb-1 text-xs text-content">分配方式</p>
      <div class="flex gap-2">
        <Button
          v-for="method in methods"
          :key="method.key"
          size="sm"
          :outline="abilityMethod !== method.key"
          border-color="var(--color-primary)"
          bg-color="var(--color-primary)"
          text-color="var(--color-content)"
          class="ability-button"
          @click="emit('update:method', method.key)"
        >
          {{ method.label }}
        </Button>
      </div>
    </div>

    <!-- Ability grid -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div v-for="key in ABILITY_KEYS" :key="key" class="space-y-1">
        <label :for="`ability-${key}`" class="block text-xs text-content">
          {{ ABILITY_NAMES[key] }}（{{ formatModifier(getAbilityModifier(abilities[key])) }}）
        </label>

        <!-- Stepper (custom) -->
        <div v-if="!isDiceMode" class="flex items-center gap-1 py-0.5">
          <button
            type="button"
            class="flex items-center justify-center size-6 transition-colors hover:bg-surface-hover disabled:opacity-30"
            :disabled="abilities[key] <= CUSTOM_ABILITY_MIN"
            aria-label="減少"
            @click="adjustAbility(key, -1)"
          >
            <Icon name="minus" :size="16" />
          </button>
          <span class="w-8 text-center font-mono text-lg font-bold">
            {{ abilities[key] }}
          </span>
          <button
            type="button"
            class="flex items-center justify-center size-6 transition-colors hover:bg-surface-hover disabled:opacity-30"
            :disabled="abilities[key] >= CUSTOM_ABILITY_MAX"
            aria-label="增加"
            @click="adjustAbility(key, 1)"
          >
            <Icon name="plus" :size="16" />
          </button>
        </div>

        <!-- Dice Roll (read-only) -->
        <div v-else class="flex items-center gap-1 py-0.5">
          <span class="w-8 text-center font-mono text-lg font-bold">
            {{ abilities[key] }}
          </span>
        </div>
      </div>
    </div>

    <!-- Point usage indicator (custom mode) -->
    <div class="flex items-center justify-between">
      <p
        v-if="abilityMethod === 'custom'"
        class="text-sm"
        :class="isUsageOver ? 'text-info font-bold' : 'text-content-muted'"
        aria-live="polite"
      >
        {{ usageLabel }}
      </p>
      <div v-else class="size-1"></div>
      <Button
        size="sm"
        outline
        text-color="var(--color-primary)"
        border-color="var(--color-primary)"
        :radius="8"
        class="flex items-center gap-2"
        @click="handleReset"
      >
        <Icon v-if="isDiceMode" name="dice-20" :size="16" />
        {{ isDiceMode ? '擲骰' : '重置屬性' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Icon } from '@ui'
import {
  ABILITY_KEYS,
  ABILITY_NAMES,
  CUSTOM_ABILITY_MAX,
  CUSTOM_ABILITY_MIN,
  POINT_BUY_BUDGET,
} from '~/constants/dnd'
import type { AbilityMethod, AbilityScores } from '~/types/business/character'
import type { AbilityKey } from '~/types/business/dnd'

const props = defineProps<{
  abilities: AbilityScores
  abilityMethod: AbilityMethod
  pointBuyUsage: number | null
}>()

const emit = defineEmits<{
  'update:method': [method: AbilityMethod]
  'update:score': [key: AbilityKey, score: number]
  'roll:all': []
  'reset:abilities': []
}>()

const methods: { key: AbilityMethod; label: string }[] = [
  { key: 'custom', label: '自訂' },
  { key: 'diceRoll', label: '擲骰' },
]

const isDiceMode = computed(() => props.abilityMethod === 'diceRoll')

const usageLabel = computed(() =>
  props.pointBuyUsage === null
    ? '超出購點計算範圍'
    : `已使用 ${props.pointBuyUsage} / ${POINT_BUY_BUDGET} 點`,
)

const isUsageOver = computed(
  () => props.pointBuyUsage === null || props.pointBuyUsage > POINT_BUY_BUDGET,
)

function adjustAbility(key: AbilityKey, delta: number): void {
  const current = props.abilities[key]
  const next = Math.max(CUSTOM_ABILITY_MIN, Math.min(CUSTOM_ABILITY_MAX, current + delta))
  if (next === current) return
  emit('update:score', key, next)
}

function handleReset(): void {
  if (isDiceMode.value) {
    emit('roll:all')
  } else {
    emit('reset:abilities')
  }
}
</script>

<style scoped>
:deep(.ability-button) {
  padding: 0.3625rem 1rem;
}
</style>
