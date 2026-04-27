<template>
  <section aria-labelledby="quickview-features-label">
    <h3 id="quickview-features-label" class="mb-2 font-display text-sm font-bold text-content">
      特性
    </h3>

    <p
      v-if="features.length === 0"
      class="rounded-lg border border-dashed border-border-soft bg-surface px-3 py-6 text-center text-xs text-content-muted"
    >
      尚未設定任何特性
    </p>

    <ul v-else class="grid gap-2 sm:grid-cols-2">
      <li
        v-for="feature in features"
        :key="feature.id"
        class="flex flex-col rounded-lg border border-border-soft bg-surface p-3"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-1.5">
              <p class="text-sm font-semibold text-content">{{ feature.name }}</p>
              <Badge size="sm">{{ SOURCE_LABELS[feature.source] }}</Badge>
              <Badge v-if="feature.usage.hasUses" size="sm" bg-color="var(--color-surface-2)">
                {{ RECOVERY_LABELS[feature.usage.recovery] }}
              </Badge>
            </div>
            <p
              v-if="feature.description"
              class="mt-1 text-xs whitespace-pre-line text-content-muted"
            >
              {{ feature.description }}
            </p>
          </div>

          <div v-if="feature.usage.hasUses" class="flex shrink-0 flex-col items-end gap-1">
            <span class="text-base font-bold text-content">
              {{ getCurrent(feature) }}
              <span class="text-xs text-content-muted">/{{ feature.usage.max }}</span>
            </span>
            <div class="flex gap-1">
              <button
                type="button"
                :aria-label="`${feature.name} -1`"
                :disabled="getCurrent(feature) <= 0"
                class="flex size-7 items-center justify-center rounded-md text-content-muted hover:bg-surface-raised hover:text-content disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-content-muted"
                @click="onAdjust(feature, -1)"
              >
                <Icon name="minus" :size="14" />
              </button>
              <button
                type="button"
                :aria-label="`${feature.name} +1`"
                :disabled="getCurrent(feature) >= feature.usage.max"
                class="flex size-7 items-center justify-center rounded-md text-content-muted hover:bg-surface-raised hover:text-content disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-content-muted"
                @click="onAdjust(feature, 1)"
              >
                <Icon name="plus" :size="14" />
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { Badge, Icon } from '@ui'
import type {
  CharacterFeature,
  FeatureSource,
  FeatureUsageRecovery,
} from '~/types/business/character'

const SOURCE_LABELS: Record<FeatureSource, string> = {
  feat: '專長',
  class: '職業',
  race: '種族',
  background: '背景',
  other: '其他',
}

const RECOVERY_LABELS: Record<FeatureUsageRecovery, string> = {
  shortRest: '短休',
  longRest: '長休',
  manual: '手動',
}

const props = defineProps<{
  features: CharacterFeature[]
  featureUses: Partial<Record<string, number>>
}>()

const emit = defineEmits<{
  adjust: [id: string, delta: number, max: number]
}>()

function getCurrent(feature: CharacterFeature): number {
  if (!feature.usage.hasUses) return 0
  return props.featureUses[feature.id] ?? feature.usage.max
}

function onAdjust(feature: CharacterFeature, delta: number): void {
  if (!feature.usage.hasUses) return
  emit('adjust', feature.id, delta, feature.usage.max)
}
</script>
