<template>
  <section aria-labelledby="quickview-defense-label" class="flex h-full flex-col">
    <h3 id="quickview-defense-label" class="mb-2 font-display text-sm font-bold text-content">
      防禦・行動
    </h3>
    <div class="grid flex-1 grid-cols-2 gap-2">
      <div
        class="flex flex-col items-center justify-center rounded-lg border border-border-soft bg-surface p-3"
      >
        <span class="text-xs text-content-muted">護甲值</span>
        <div class="mt-1 flex items-center gap-2">
          <button
            type="button"
            aria-label="AC -1"
            class="flex size-7 items-center justify-center rounded-md text-content-muted hover:bg-surface-raised hover:text-content"
            @click="emit('adjustAc', -1)"
          >
            <Icon name="minus" :size="14" />
          </button>
          <span class="flex flex-1 items-baseline justify-center gap-1.5">
            <span class="text-2xl font-bold text-content">
              {{ baseArmorClass + acAdjustment }}
            </span>
            <span v-if="acAdjustment !== 0" class="text-xs" :class="adjustmentColor(acAdjustment)">
              ({{ formatModifier(acAdjustment) }})
            </span>
          </span>
          <button
            type="button"
            aria-label="AC +1"
            class="flex size-7 items-center justify-center rounded-md text-content-muted hover:bg-surface-raised hover:text-content"
            @click="emit('adjustAc', 1)"
          >
            <Icon name="plus" :size="14" />
          </button>
        </div>
      </div>

      <div
        class="flex flex-col items-center justify-center rounded-lg border border-border-soft bg-surface p-3"
      >
        <span class="text-xs text-content-muted">速度（呎）</span>
        <div class="mt-1 flex items-center gap-2">
          <button
            type="button"
            aria-label="移動速度 -5"
            class="flex size-7 items-center justify-center rounded-md text-content-muted hover:bg-surface-raised hover:text-content"
            @click="emit('adjustSpeed', -5)"
          >
            <Icon name="minus" :size="14" />
          </button>
          <span class="flex flex-1 items-baseline justify-center gap-1.5">
            <span class="text-2xl font-bold text-content">{{ baseSpeed + speedAdjustment }}</span>
            <span
              v-if="speedAdjustment !== 0"
              class="text-xs"
              :class="adjustmentColor(speedAdjustment)"
            >
              ({{ formatModifier(speedAdjustment) }})
            </span>
          </span>
          <button
            type="button"
            aria-label="移動速度 +5"
            class="flex size-7 items-center justify-center rounded-md text-content-muted hover:bg-surface-raised hover:text-content"
            @click="emit('adjustSpeed', 5)"
          >
            <Icon name="plus" :size="14" />
          </button>
        </div>
      </div>

      <div
        class="flex flex-col items-center justify-center rounded-lg border border-border-soft bg-surface p-3"
      >
        <span class="text-xs text-content-muted">先攻</span>
        <span class="mt-1 text-2xl font-bold" :class="initiativeColor">
          {{ formatModifier(initiative) }}
        </span>
      </div>

      <div
        class="flex flex-col items-center justify-center rounded-lg border border-border-soft bg-surface p-3"
      >
        <span class="text-xs text-content-muted">被動察覺</span>
        <span class="mt-1 text-2xl font-bold text-content">{{ passivePerception }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@ui'

const props = defineProps<{
  baseArmorClass: number
  acAdjustment: number
  baseSpeed: number
  speedAdjustment: number
  initiative: number
  passivePerception: number
}>()

const emit = defineEmits<{
  adjustAc: [delta: number]
  adjustSpeed: [delta: number]
}>()

const initiativeColor = computed(() => {
  if (props.initiative > 0) return 'text-success'
  if (props.initiative < 0) return 'text-danger'
  return 'text-content-muted'
})

function adjustmentColor(value: number): string {
  if (value > 0) return 'text-success'
  if (value < 0) return 'text-danger'
  return 'text-content-muted'
}
</script>
