<template>
  <NuxtLink
    :to="`/character/${character.id}`"
    class="group block transition-shadow duration-200 hover:shadow-[0_0_24px_rgba(223,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    :style="{ borderRadius: '8px' }"
    :aria-label="`查看角色 ${character.name}`"
  >
    <Card
      :radius="8"
      :padding="0"
      shadow="none"
      :bg-color="'var(--rd--color-bg-elevated)'"
      class="overflow-hidden border border-border transition-colors duration-200"
    >
      <!-- Cover: profession image -->
      <template #cover>
        <div class="relative h-52 overflow-hidden">
          <img
            :src="professionImages[character.professions[0]!]"
            :alt="character.professions.map((p) => PROFESSION_NAMES[p]).join(' / ')"
            class="h-full w-full object-contain object-top transition-transform duration-300 group-hover:scale-105"
          />
          <div
            class="absolute right-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-sm font-bold backdrop-blur-sm"
            :style="{ backgroundColor: tierConfig.badgeBg, color: tierConfig.textColor }"
          >
            Lv.{{ character.level }}
          </div>
        </div>
      </template>

      <!-- Body: name + race + profession -->
      <div class="px-4 pb-4 pt-3">
        <h3
          class="truncate font-display text-base font-bold"
          :class="{ 'tier-shimmer': isMaxLevel }"
          :style="{ color: tierConfig.textColor }"
        >
          {{ character.name }}
        </h3>
        <div class="mt-2 flex items-center gap-2">
          <Badge
            :bg-color="'var(--rd--color-surface-2)'"
            :text-color="'var(--rd--color-text-muted)'"
            :radius="4"
            size="sm"
          >
            {{ RACE_NAMES[character.race] }}
          </Badge>
          <span class="text-xs text-content-muted">
            {{ character.professions.map((p) => PROFESSION_NAMES[p]).join(' / ') }}
          </span>
        </div>
      </div>
    </Card>
  </NuxtLink>
</template>

<script setup lang="ts">
import { Badge, Card } from '@ui'
import type { Character } from '~/types/models/character'

const props = defineProps<{
  character: Character
}>()

const tier = computed(() => getCharacterTier(props.character.level))
const tierConfig = computed(() => TIER_CONFIG[tier.value])
const isMaxLevel = computed(() => props.character.level === 20)

const professionImages = getProfessionImages()
</script>
