<template>
  <section :aria-labelledby="headingId">
    <header class="mb-3 flex items-center justify-between">
      <h2 :id="headingId" class="font-display text-lg font-bold text-content">已知法術</h2>
      <!-- TODO: 待職業對應的準備數量規則確定後，加回「已準備 N / M」計數 -->
    </header>

    <p
      v-if="missingNames.length > 0"
      class="mb-3 rounded-md border border-warning bg-warning-soft px-3 py-2 text-xs text-warning"
    >
      資料庫中找不到下列法術：{{ missingNames.join('、') }}
    </p>

    <p v-if="groupedSpells.length === 0" class="py-8 text-center text-content-muted">
      尚未掌握任何法術
    </p>
    <div v-else class="space-y-5">
      <div v-for="group in groupedSpells" :key="group.level">
        <div class="mb-2 flex items-center gap-2">
          <h4 class="font-display text-sm font-bold text-content">
            {{ formatSpellLevel(group.level) }}
          </h4>
          <span class="text-xs text-content-muted">{{ group.spells.length }} 個</span>
        </div>
        <Accordion multiple class="spell-accordion">
          <AccordionItem v-for="spell in group.spells" :key="spell.id" :value="spell.id">
            <template #title>
              <div class="flex flex-1 items-center gap-3">
                <Checkbox
                  class="shrink-0"
                  :model-value="spell.level === 0 || isPrepared(spell.id)"
                  :disabled="spell.level === 0"
                  size="sm"
                  color="var(--color-primary)"
                  :aria-label="`準備 ${spell.name}`"
                  @click.stop
                  @update:model-value="onTogglePrepared(spell)"
                />
                <div class="min-w-0 flex-1 text-left">
                  <div class="flex items-center gap-2">
                    <p class="truncate text-sm font-semibold text-content">{{ spell.name }}</p>
                    <div v-if="spell.ritual || spell.concentration" class="flex shrink-0 gap-1">
                      <Badge
                        v-if="spell.ritual"
                        size="sm"
                        bg-color="var(--color-info)"
                        text-color="var(--color-info-soft)"
                      >
                        儀式
                      </Badge>
                      <Badge
                        v-if="spell.concentration"
                        size="sm"
                        bg-color="var(--color-warning)"
                        text-color="var(--color-warning-soft)"
                      >
                        專注
                      </Badge>
                    </div>
                  </div>
                  <p class="mt-0.5 truncate text-xs text-content-muted">
                    {{ SPELL_SCHOOL_LABELS[spell.school] }}
                    <span class="mx-1">·</span>
                    {{ spell.castingTime }}
                    <span class="mx-1">·</span>
                    {{ spell.range }}
                  </p>
                </div>
              </div>
            </template>

            <dl class="space-y-1 text-sm text-content">
              <div class="flex gap-2">
                <dt class="w-16 shrink-0 text-content-muted">成分</dt>
                <dd>{{ formatSpellComponents(spell) }}</dd>
              </div>
              <div class="flex gap-2">
                <dt class="w-16 shrink-0 text-content-muted">持續時間</dt>
                <dd>{{ spell.duration }}</dd>
              </div>
              <div v-if="spell.material" class="flex gap-2">
                <dt class="w-16 shrink-0 text-content-muted">材料</dt>
                <dd>{{ spell.material }}</dd>
              </div>
              <div class="flex gap-2">
                <dt class="w-16 shrink-0 text-content-muted">描述</dt>
                <dd class="whitespace-pre-wrap">{{ spell.desc }}</dd>
              </div>
            </dl>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Accordion, AccordionItem, Badge, Checkbox } from '@ui'
import { SPELL_SCHOOL_LABELS } from '~/constants/dnd'
import type { Character } from '~/types/business/character'
import type { Spell } from '~/types/business/spell'

const props = defineProps<{
  character: Character
}>()

const characterStore = useCharacterStore()
const { getSpell } = useSpells()

const headingId = useId()

const learnedSpellDetails = computed(() => {
  const found: Spell[] = []
  const missing: string[] = []
  for (const id of props.character.learnedSpells) {
    const spell = getSpell(id)
    if (spell) found.push(spell)
    else missing.push(id)
  }
  return { found, missing }
})

const groupedSpells = computed(() => groupSpellsByLevel(learnedSpellDetails.value.found))
const missingNames = computed(() => learnedSpellDetails.value.missing)

const isPrepared = (id: string): boolean => {
  return props.character.preparedSpells.includes(id)
}

const onTogglePrepared = (spell: Spell): void => {
  if (spell.level === 0) return
  const latest = characterStore.getById(props.character.id)
  if (!latest) return
  const next = latest.preparedSpells.includes(spell.id)
    ? latest.preparedSpells.filter((id) => id !== spell.id)
    : [...latest.preparedSpells, spell.id]
  characterStore.patchCharacter(props.character.id, { preparedSpells: next })
}
</script>

<style scoped>
.spell-accordion :deep(button:hover:not(:disabled)) {
  background-color: var(--color-info-soft);
}
</style>
