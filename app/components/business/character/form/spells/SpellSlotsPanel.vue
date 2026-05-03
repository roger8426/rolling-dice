<template>
  <section :aria-labelledby="headingId" class="rounded-lg border border-border-soft bg-canvas p-3">
    <header class="mb-3 flex items-center justify-between gap-2">
      <h3 :id="headingId" class="font-display text-sm font-bold text-content">環位設定</h3>
      <div
        role="tablist"
        aria-label="施法模組"
        class="inline-flex overflow-hidden rounded-md border border-border-soft text-xs"
      >
        <button
          v-for="tab in TABS"
          :key="tab.value"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab.value"
          :class="[
            'px-2.5 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            activeTab === tab.value
              ? 'bg-surface-2 font-semibold text-content'
              : 'bg-surface text-content-muted hover:bg-surface-hover',
          ]"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
    </header>

    <div class="grid grid-cols-3 gap-2">
      <div
        v-for="level in SPELL_LEVELS"
        :key="level"
        class="flex flex-col items-center gap-1 rounded-md border border-border-soft bg-surface px-2 py-2"
      >
        <span class="text-xs text-content-muted">{{ level }} 環</span>
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="flex items-center justify-center size-6 transition-colors hover:bg-surface-hover disabled:opacity-30"
            :disabled="getDisplayed(level) <= 0"
            :aria-label="`減少 ${level} 環${activeTab === 'pact' ? '契術環位' : '環位'}`"
            @click="adjust(level, -1)"
          >
            <Icon name="minus" :size="16" />
          </button>
          <span class="w-5 text-center font-mono text-sm font-bold">
            {{ getDisplayed(level) }}
          </span>
          <button
            type="button"
            class="flex items-center justify-center size-6 transition-colors hover:bg-surface-hover disabled:opacity-30"
            :disabled="getDisplayed(level) >= SLOT_MAX"
            :aria-label="`增加 ${level} 環${activeTab === 'pact' ? '契術環位' : '環位'}`"
            @click="adjust(level, 1)"
          >
            <Icon name="plus" :size="16" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@ui'
import { getSuggestedPactSlots, getSuggestedRegularSpellSlots } from '~/helpers/spell-slots'
import type {
  FormProfessionEntry,
  SpellLevel,
  SpellSlots,
  SpellSlotsDelta,
} from '~/types/business/character'

type SlotTab = 'regular' | 'pact'

const SPELL_LEVELS: readonly SpellLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const SLOT_MAX = 9
const TABS: readonly { value: SlotTab; label: string }[] = [
  { value: 'regular', label: '一般' },
  { value: 'pact', label: '契術' },
]

const props = defineProps<{
  professions: FormProfessionEntry[]
}>()

const spellSlotsDelta = defineModel<SpellSlotsDelta>('spellSlotsDelta', { required: true })
const pactSlotsDelta = defineModel<SpellSlotsDelta>('pactSlotsDelta', { required: true })

const headingId = useId()
const activeTab = ref<SlotTab>('regular')

const regularBase = computed<SpellSlots>(() => getSuggestedRegularSpellSlots(props.professions))
const pactBase = computed<SpellSlots>(() => getSuggestedPactSlots(props.professions))

const activeBase = computed<SpellSlots>(() =>
  activeTab.value === 'pact' ? pactBase.value : regularBase.value,
)
const activeDelta = computed<SpellSlotsDelta>({
  get: () => (activeTab.value === 'pact' ? pactSlotsDelta.value : spellSlotsDelta.value),
  set: (value) => {
    if (activeTab.value === 'pact') pactSlotsDelta.value = value
    else spellSlotsDelta.value = value
  },
})

const getDisplayed = (level: SpellLevel): number => {
  const value = (activeBase.value[level] ?? 0) + (activeDelta.value[level] ?? 0)
  return Math.max(0, Math.min(SLOT_MAX, value))
}

const adjust = (level: SpellLevel, dir: -1 | 1): void => {
  const next = getDisplayed(level) + dir
  if (next < 0 || next > SLOT_MAX) return
  const nextDelta = next - (activeBase.value[level] ?? 0)
  if (nextDelta === 0) {
    const { [level]: _omit, ...rest } = activeDelta.value
    activeDelta.value = rest
  } else {
    activeDelta.value = { ...activeDelta.value, [level]: nextDelta }
  }
}
</script>
