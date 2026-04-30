<template>
  <section :aria-labelledby="headingId">
    <header class="mb-4 flex items-center justify-between">
      <h2 :id="headingId" class="font-display text-lg font-bold text-content">準備法術</h2>
      <span class="text-xs text-content-muted">
        已準備 <span class="font-bold text-content">{{ preparedCount }}</span> /
        {{ preparableCount }}
      </span>
    </header>

    <p
      v-if="missingNames.length > 0"
      class="mb-3 rounded-md border border-warning bg-warning-soft px-3 py-2 text-xs text-warning"
    >
      資料庫中找不到下列法術：{{ missingNames.join('、') }}
    </p>

    <p v-if="groupedSpells.length === 0" class="py-6 text-center text-sm text-content-muted">
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
            :key="spell.id"
            class="flex items-center gap-3 rounded-md border border-border-soft bg-surface px-3 py-2"
          >
            <Checkbox
              v-if="group.level !== 0"
              :model-value="isPrepared(spell.id)"
              size="sm"
              color="var(--color-primary)"
              :aria-label="`準備 ${spell.name}`"
              @update:model-value="togglePreparedSpell(spell.id)"
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
import type { CharacterUpdateFormState } from '~/types/business/character'
import type { Spell } from '~/types/business/spell'

const formState = defineModel<CharacterUpdateFormState>('formState', { required: true })
const { togglePreparedSpell } = useCharacterSpellsForm(formState.value)

const { getSpell } = useSpells()

const headingId = useId()

const learnedSpellDetails = computed(() => {
  const found: Spell[] = []
  const missing: string[] = []
  for (const id of formState.value.learnedSpells) {
    const spell = getSpell(id)
    if (spell) found.push(spell)
    else missing.push(id)
  }
  return { found, missing }
})

const groupedSpells = computed(() => groupSpellsByLevel(learnedSpellDetails.value.found))
const missingNames = computed(() => learnedSpellDetails.value.missing)

const preparableNames = computed(
  () => new Set(learnedSpellDetails.value.found.filter((s) => s.level > 0).map((s) => s.id)),
)

const preparableCount = computed(() => preparableNames.value.size)

const preparedCount = computed(
  () => formState.value.preparedSpells.filter((id) => preparableNames.value.has(id)).length,
)

function isPrepared(id: string): boolean {
  return formState.value.preparedSpells.includes(id)
}
</script>
