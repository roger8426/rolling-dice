<template>
  <section aria-labelledby="quickview-spells-label">
    <h3 id="quickview-spells-label" class="mb-2 font-display text-sm font-bold text-content">
      準備法術
    </h3>

    <p v-if="pending" class="py-6 text-center text-sm text-content-muted">法術資料載入中…</p>

    <p
      v-else-if="missingNames.length > 0"
      class="mb-3 rounded-md border border-warning bg-warning-soft px-3 py-2 text-xs text-warning"
    >
      資料庫中找不到下列法術：{{ missingNames.join('、') }}
    </p>

    <p
      v-if="!pending && groupedSpells.length === 0"
      class="py-6 text-center text-sm text-content-muted"
    >
      尚未準備任何法術
    </p>

    <div v-else-if="!pending" class="space-y-3">
      <div v-for="group in groupedSpells" :key="group.level">
        <div class="mb-1 flex items-center gap-2">
          <h4 class="font-display text-xs font-bold text-content">
            {{ formatSpellLevel(group.level) }}
          </h4>
          <span class="text-xs text-content-muted">{{ group.spells.length }} 個</span>
        </div>
        <ul class="grid grid-cols-2 gap-1">
          <li
            v-for="spell in group.spells"
            :key="spell.name"
            class="rounded-md border border-border-soft bg-surface px-3 py-1.5 text-sm text-content"
          >
            {{ spell.name }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Spell } from '~/types/business/spell'

const props = defineProps<{
  preparedSpells: string[]
}>()

const { getSpell, pending } = useSpells()

const resolvedSpells = computed(() => {
  const found: Spell[] = []
  const missing: string[] = []
  for (const name of props.preparedSpells) {
    const spell = getSpell(name)
    if (spell) found.push(spell)
    else missing.push(name)
  }
  return { found, missing }
})

const groupedSpells = computed(() => groupSpellsByLevel(resolvedSpells.value.found))
const missingNames = computed(() => resolvedSpells.value.missing)
</script>
