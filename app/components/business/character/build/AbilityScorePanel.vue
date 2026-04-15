<template>
  <div class="space-y-4 px-2 w-1/3">
    <div>
      <img src="~/assets/images/dnd.png" alt="" />
    </div>
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
          {{ ABILITY_NAMES[key] }}（{{ formatModifier(abilities[key]) }}）
        </label>

        <!-- Point Buy -->
        <div v-if="abilityMethod === 'pointBuy'" class="flex items-center gap-1 py-0.5">
          <button
            type="button"
            class="flex items-center justify-center size-6 transition-colors hover:bg-surface-hover disabled:opacity-30"
            :disabled="abilities[key] <= POINT_BUY_MIN_SCORE"
            aria-label="減少"
            @click="adjustPointBuy(key, -1)"
          >
            <Icon name="minus" :size="16" />
          </button>
          <span class="w-8 text-center font-mono text-lg font-bold">
            {{ abilities[key] }}
          </span>
          <button
            type="button"
            class="flex items-center justify-center size-6 transition-colors hover:bg-surface-hover disabled:opacity-30"
            :disabled="abilities[key] >= POINT_BUY_MAX_SCORE || !canIncrement(key)"
            aria-label="增加"
            @click="adjustPointBuy(key, 1)"
          >
            <Icon name="plus" :size="16" />
          </button>
        </div>

        <!-- Custom -->
        <div v-else-if="abilityMethod === 'custom'" class="flex items-center gap-1 py-0.5">
          <button
            type="button"
            class="flex items-center justify-center size-6 transition-colors hover:bg-surface-hover disabled:opacity-30"
            :disabled="abilities[key] <= CUSTOM_ABILITY_MIN"
            aria-label="減少"
            @click="adjustCustomAbility(key, -1)"
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
            @click="adjustCustomAbility(key, 1)"
          >
            <Icon name="plus" :size="16" />
          </button>
        </div>

        <!-- Dice Roll -->
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
        <Icon v-if="abilityMethod === 'diceRoll'" name="dice-20" :size="16" />
        {{ abilityMethod === 'diceRoll' ? '擲骰' : '重置屬性' }}
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
import { getPointBuyCost } from '~/helpers/ability'
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

function formatModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

function canIncrement(key: AbilityKey): boolean {
  const current = props.abilities[key]
  if (current >= POINT_BUY_MAX_SCORE) return false
  const costDiff = getPointBuyCost(current + 1) - getPointBuyCost(current)
  return costDiff <= props.pointBuyRemaining
}

function adjustPointBuy(key: AbilityKey, delta: number): void {
  const current = props.abilities[key]
  const next = current + delta
  if (next < POINT_BUY_MIN_SCORE || next > POINT_BUY_MAX_SCORE) return
  emit('update:score', key, next)
}

function adjustCustomAbility(key: AbilityKey, delta: number): void {
  const current = props.abilities[key]
  const next = Math.max(CUSTOM_ABILITY_MIN, Math.min(CUSTOM_ABILITY_MAX, current + delta))
  emit('update:score', key, next)
}

function handleReset(): void {
  if (props.abilityMethod === 'diceRoll') {
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
