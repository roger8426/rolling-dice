<template>
  <div class="space-y-4 px-2">
    <div>
      <img src="~/assets/images/dnd.png" alt="" />
    </div>

    <p class="text-xs text-content">屬性成長</p>

    <!-- Ability table -->
    <div>
      <!-- Header -->
      <div class="flex items-center justify-between gap-1 border-b border-border pb-1 mb-1">
        <span class="w-20"></span>
        <span class="w-12 text-center text-[10px] text-content-muted">初始值</span>
        <span class="w-2"></span>
        <span class="w-17 text-[10px] text-content-muted text-center">加值</span>
        <span class="w-12 text-[10px] text-content-muted text-center">總值</span>
      </div>

      <!-- Rows -->
      <div
        v-for="key in ABILITY_KEYS"
        :key="key"
        class="flex items-center justify-between gap-1 py-1"
      >
        <label :for="`ability-${key}`" class="w-20 text-xs text-content truncate">
          {{ ABILITY_NAMES[key] }}（{{
            formatModifier(getAbilityModifier(getTotalScore(abilities[key])))
          }}）
        </label>

        <!-- basicScore (read-only) -->
        <span class="w-12 text-center font-mono text-sm text-content-muted">
          {{ abilities[key].basicScore }}
        </span>

        <span class="w-2 text-content-muted text-xs">+</span>

        <!-- bonusScore (editable stepper) -->
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="flex items-center justify-center size-6 transition-colors hover:bg-surface-hover disabled:opacity-30"
            :disabled="abilities[key].bonusScore <= 0"
            aria-label="減少額外加值"
            @click="adjustBonus(key, -1)"
          >
            <Icon name="minus" :size="16" />
          </button>
          <span class="w-4 text-center font-mono text-sm font-bold">
            {{ abilities[key].bonusScore }}
          </span>
          <button
            type="button"
            class="flex items-center justify-center size-6 transition-colors hover:bg-surface-hover"
            aria-label="增加額外加值"
            @click="adjustBonus(key, 1)"
          >
            <Icon name="plus" :size="16" />
          </button>
        </div>
        <!-- Total -->
        <span class="w-12 text-sm text-content-muted text-center">
          {{ abilities[key].basicScore + abilities[key].bonusScore }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@ui'
import { ABILITY_KEYS, ABILITY_NAMES } from '~/constants/dnd'
import type { CharacterAbilityScores } from '~/types/business/character'
import type { AbilityKey } from '~/types/business/dnd'

const props = defineProps<{
  abilities: CharacterAbilityScores
}>()

const emit = defineEmits<{
  'update:bonusScore': [key: AbilityKey, score: number]
}>()

function adjustBonus(key: AbilityKey, delta: number): void {
  const current = props.abilities[key].bonusScore
  const next = Math.max(0, current + delta)
  if (next === current) return
  emit('update:bonusScore', key, next)
}
</script>
