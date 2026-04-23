<template>
  <section aria-labelledby="section-prepared-spells">
    <header class="mb-4 flex items-center justify-between">
      <h2 id="section-prepared-spells" class="font-display text-lg font-bold text-content">
        已掌握法術
      </h2>
      <span class="text-xs text-content-muted">
        已準備 <span class="font-bold text-content">{{ preparedSpells.length }}</span> /
        {{ learnedSpells.length }}
      </span>
    </header>

    <p v-if="pending" class="py-6 text-center text-sm text-content-muted">法術資料載入中…</p>
    <p v-else-if="error" class="py-6 text-center text-sm text-danger">法術資料載入失敗</p>
    <p v-else-if="groupedSpells.length === 0" class="py-6 text-center text-sm text-content-muted">
      尚未習得任何法術
    </p>
    <div v-else class="space-y-4 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto md:pr-1">
      <div v-for="group in groupedSpells" :key="group.level">
        <div class="mb-2 flex items-center gap-2">
          <h3 class="font-display text-sm font-bold text-content">
            {{ formatSpellLevel(group.level) }}
          </h3>
          <span class="text-xs text-content-muted">{{ group.spells.length }} 個</span>
        </div>
        <ul class="space-y-1">
          <li
            v-for="spell in group.spells"
            :key="spell.name"
            class="flex items-center gap-3 rounded-md border border-border-soft bg-surface px-3 py-2"
          >
            <Checkbox
              :model-value="isPrepared(spell.name)"
              size="sm"
              :aria-label="`準備 ${spell.name}`"
              @update:model-value="emit('togglePrepared', spell.name)"
            />
            <span class="text-sm font-semibold text-content">{{ spell.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Checkbox } from '@ui'
import type { Spell } from '~/types/business/spell'

const props = defineProps<{
  learnedSpells: string[]
  preparedSpells: string[]
}>()

const emit = defineEmits<{
  togglePrepared: [name: string]
}>()

const { getSpell, pending, error } = useSpells()

const learnedSpellDetails = computed<Spell[]>(() =>
  props.learnedSpells.map((name) => getSpell(name)).filter((s): s is Spell => s !== undefined),
)

const groupedSpells = computed(() => groupSpellsByLevel(learnedSpellDetails.value))

function isPrepared(name: string): boolean {
  return props.preparedSpells.includes(name)
}
</script>
