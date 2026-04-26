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

        <!-- Stepper (pointBuy / custom) -->
        <div v-if="!isDiceMode" class="flex items-center gap-1 py-0.5">
          <button
            type="button"
            class="flex items-center justify-center size-6 transition-colors hover:bg-surface-hover disabled:opacity-30"
            :disabled="abilities[key] <= getMinScore()"
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
            :disabled="!canIncrease(key)"
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

    <!-- Point Buy remaining -->
    <div class="flex items-center justify-between">
      <p v-if="abilityMethod === 'pointBuy'" class="text-sm text-content-muted">
        剩餘點數：
        <span :class="pointBuyRemaining < 0 ? 'text-red-400 font-bold' : 'font-bold'">
          {{ pointBuyRemaining }}
        </span>
        / 27
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
  POINT_BUY_MAX_SCORE,
  POINT_BUY_MIN_SCORE,
} from '~/constants/dnd'
import type { AbilityMethod, AbilityScores } from '~/types/business/character'
import type { AbilityKey } from '~/types/business/dnd'

const props = defineProps<{
  abilities: AbilityScores
  abilityMethod: AbilityMethod
  pointBuyRemaining: number
}>()

const emit = defineEmits<{
  'update:method': [method: AbilityMethod]
  'update:score': [key: AbilityKey, score: number]
  'roll:all': []
  'reset:abilities': []
}>()

const methods: { key: AbilityMethod; label: string }[] = [
  { key: 'custom', label: '自訂' },
  { key: 'pointBuy', label: '購點' },
  { key: 'diceRoll', label: '擲骰' },
]

const isDiceMode = computed(() => props.abilityMethod === 'diceRoll')

function getMinScore(): number {
  return props.abilityMethod === 'pointBuy' ? POINT_BUY_MIN_SCORE : CUSTOM_ABILITY_MIN
}

function canIncrease(key: AbilityKey): boolean {
  const current = props.abilities[key]
  if (props.abilityMethod === 'pointBuy') {
    if (current >= POINT_BUY_MAX_SCORE) return false
    const costDiff = getPointBuyCost(current + 1) - getPointBuyCost(current)
    return costDiff <= props.pointBuyRemaining
  }
  return current < CUSTOM_ABILITY_MAX
}

function adjustAbility(key: AbilityKey, delta: number): void {
  const current = props.abilities[key]
  const min = getMinScore()
  const max = props.abilityMethod === 'pointBuy' ? POINT_BUY_MAX_SCORE : CUSTOM_ABILITY_MAX
  const next = Math.max(min, Math.min(max, current + delta))
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
