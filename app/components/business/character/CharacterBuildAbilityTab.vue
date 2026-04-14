<template>
  <div class="space-y-6">
    <!-- Method selector -->
    <div>
      <p class="mb-2 text-sm font-medium text-content">分配方式</p>
      <div class="flex gap-2">
        <Button
          v-for="method in methods"
          :key="method.key"
          size="sm"
          :outline="formState.abilityMethod !== method.key"
          @click="$emit('update:method', method.key)"
        >
          {{ method.label }}
        </Button>
      </div>
    </div>

    <!-- Point Buy remaining -->
    <p v-if="formState.abilityMethod === 'pointBuy'" class="text-sm text-content-muted">
      剩餘點數：
      <span :class="pointBuyRemaining < 0 ? 'text-red-400 font-bold' : 'font-bold'">
        {{ pointBuyRemaining }}
      </span>
      / 27
    </p>

    <!-- Ability grid -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div v-for="key in ABILITY_KEYS" :key="key" class="space-y-1">
        <label :for="`ability-${key}`" class="block text-sm font-medium text-content">
          {{ ABILITY_NAMES[key] }}
        </label>

        <!-- Point Buy -->
        <div v-if="formState.abilityMethod === 'pointBuy'" class="flex items-center gap-1">
          <button
            type="button"
            class="rounded px-2 py-1 text-sm font-bold transition-colors hover:bg-surface-hover disabled:opacity-30"
            :disabled="formState.abilities[key] <= POINT_BUY_MIN_SCORE"
            aria-label="減少"
            @click="adjustPointBuy(key, -1)"
          >
            −
          </button>
          <span class="w-8 text-center font-mono text-lg font-bold">
            {{ formState.abilities[key] }}
          </span>
          <button
            type="button"
            class="rounded px-2 py-1 text-sm font-bold transition-colors hover:bg-surface-hover disabled:opacity-30"
            :disabled="formState.abilities[key] >= POINT_BUY_MAX_SCORE || !canIncrement(key)"
            aria-label="增加"
            @click="adjustPointBuy(key, 1)"
          >
            +
          </button>
        </div>

        <!-- Standard Array -->
        <Select
          v-else-if="formState.abilityMethod === 'standardArray'"
          :id="`ability-${key}`"
          :model-value="standardArrayAssignment[key]"
          :options="getStandardArrayOptions(key)"
          placeholder="—"
          @update:model-value="$emit('assign:standard', key, Number($event))"
        />

        <!-- Dice Roll -->
        <div v-else class="flex items-center gap-2">
          <span class="w-8 text-center font-mono text-lg font-bold">
            {{ formState.abilities[key] }}
          </span>
          <Button size="sm" outline @click="$emit('roll:single', key)"> 🎲 </Button>
        </div>

        <p class="text-xs text-content-muted">
          調整值: {{ formatModifier(formState.abilities[key]) }}
        </p>
      </div>
    </div>

    <!-- Dice Roll: roll all button -->
    <Button v-if="formState.abilityMethod === 'diceRoll'" outline @click="$emit('roll:all')">
      🎲 全部重擲
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button, Select } from '@ui'
import type { SelectOption } from '@ui'
import {
  ABILITY_KEYS,
  ABILITY_NAMES,
  POINT_BUY_MAX_SCORE,
  POINT_BUY_MIN_SCORE,
} from '~/constants/dnd'
import { getPointBuyCost } from '~/helpers/ability'
import type { AbilityMethod, CharacterFormState } from '~/types/business/character'
import type { AbilityKey } from '~/types/business/dnd'

const props = defineProps<{
  formState: CharacterFormState
  pointBuyRemaining: number
  standardArrayAssignment: Record<AbilityKey, number | null>
  availableStandardValues: readonly number[]
}>()

const emit = defineEmits<{
  'update:method': [method: AbilityMethod]
  'update:score': [key: AbilityKey, score: number]
  'assign:standard': [key: AbilityKey, value: number]
  'roll:single': [key: AbilityKey]
  'roll:all': []
}>()

const methods: { key: AbilityMethod; label: string }[] = [
  { key: 'pointBuy', label: '購點制' },
  { key: 'standardArray', label: '標準陣列' },
  { key: 'diceRoll', label: '投骰' },
]

function formatModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

function canIncrement(key: AbilityKey): boolean {
  const current = props.formState.abilities[key]
  if (current >= POINT_BUY_MAX_SCORE) return false
  const costDiff = getPointBuyCost(current + 1) - getPointBuyCost(current)
  return costDiff <= props.pointBuyRemaining
}

function adjustPointBuy(key: AbilityKey, delta: number): void {
  const current = props.formState.abilities[key]
  const next = current + delta
  if (next < POINT_BUY_MIN_SCORE || next > POINT_BUY_MAX_SCORE) return
  emit('update:score', key, next)
}

function getStandardArrayOptions(key: AbilityKey): SelectOption[] {
  const current = props.standardArrayAssignment[key]
  const available = props.availableStandardValues
  const values = current !== null ? [current, ...available] : [...available]
  return [...new Set(values)]
    .sort((a, b) => b - a)
    .map((v) => ({
      value: v,
      label: String(v),
    }))
}
</script>
