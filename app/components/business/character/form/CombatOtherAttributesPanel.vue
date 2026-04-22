<template>
  <section aria-labelledby="section-combat-stats">
    <h2 id="section-combat-stats" class="mb-4 font-display text-lg font-bold text-content">
      基礎數據
    </h2>
    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col rounded-lg border border-border-soft bg-surface p-3">
        <span id="hp-label" class="text-xs text-content-muted">生命值</span>
        <output aria-labelledby="hp-label" class="mt-1 text-2xl font-bold text-content">
          {{ totalHp }}
        </output>
        <div class="mt-2">
          <label for="extra-hp" class="block text-xs text-content">額外加值</label>
          <CommonAppInput
            id="extra-hp"
            :radius="0"
            :model-value="String(extraHp)"
            type="number"
            size="sm"
            outline
            placeholder="0"
            class="mt-1 w-full"
            @update:model-value="emit('update:extraHp', Number($event) || 0)"
          />
        </div>
        <div class="mt-2 flex items-center gap-2">
          <Toggle
            :model-value="isTough"
            size="sm"
            aria-label="是否持有健壯專長"
            color="var(--color-success)"
            @update:model-value="emit('update:isTough', $event)"
          />
          <span class="text-xs text-content">健壯</span>
        </div>
      </div>

      <div class="flex flex-col rounded-lg border border-border-soft bg-surface p-3">
        <span id="speed-label" class="text-xs text-content-muted">移動速度</span>
        <output aria-labelledby="speed-label" class="mt-1 text-2xl font-bold text-content">
          {{ totalSpeed }}
        </output>
        <div class="mt-2">
          <label for="speed-bonus" class="block text-xs text-content">額外加值</label>
          <CommonAppInput
            id="speed-bonus"
            :radius="0"
            :model-value="speedBonus != null ? String(speedBonus) : ''"
            type="number"
            size="sm"
            outline
            placeholder="0"
            class="mt-1 w-full"
            @update:model-value="emit('update:speedBonus', $event ? Number($event) : null)"
          />
        </div>
      </div>

      <div class="flex flex-col rounded-lg border border-border-soft bg-surface p-3">
        <span id="initiative-label" class="text-xs text-content-muted">先攻</span>
        <output
          aria-labelledby="initiative-label"
          class="mt-1 text-2xl font-bold"
          :class="initiativeTextColor"
        >
          {{ formatModifier(totalInitiative) }}
        </output>
        <div class="mt-2">
          <label for="initiative-bonus" class="block text-xs text-content">額外加值</label>
          <CommonAppInput
            id="initiative-bonus"
            :radius="0"
            :model-value="initiativeBonus != null ? String(initiativeBonus) : ''"
            type="number"
            size="sm"
            outline
            placeholder="0"
            class="mt-1 w-full"
            @update:model-value="emit('update:initiativeBonus', $event ? Number($event) : null)"
          />
        </div>
      </div>

      <div class="flex flex-col rounded-lg border border-border-soft bg-surface p-3">
        <span id="passive-perception-label" class="text-xs text-content-muted">被動察覺</span>
        <output
          aria-labelledby="passive-perception-label"
          class="mt-1 text-2xl font-bold text-content"
        >
          {{ totalPassivePerception }}
        </output>
        <div class="mt-2">
          <label for="passive-perception-bonus" class="block text-xs text-content">額外加值</label>
          <CommonAppInput
            id="passive-perception-bonus"
            :radius="0"
            :model-value="passivePerceptionBonus != null ? String(passivePerceptionBonus) : ''"
            type="number"
            size="sm"
            outline
            placeholder="0"
            class="mt-1 w-full"
            @update:model-value="
              emit('update:passivePerceptionBonus', $event ? Number($event) : null)
            "
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Toggle } from '@ui'
import type { AbilityScores, SkillProficiencies } from '~/types/business/character'

const props = defineProps<{
  abilityScores: AbilityScores
  skills: SkillProficiencies
  proficiencyBonus: number
  isJackOfAllTrades: boolean
  extraHp: number
  totalHp: number
  isTough: boolean
  speedBonus: number | null
  initiativeBonus: number | null
  passivePerceptionBonus: number | null
}>()

const emit = defineEmits<{
  'update:extraHp': [value: number]
  'update:isTough': [value: boolean]
  'update:speedBonus': [value: number | null]
  'update:initiativeBonus': [value: number | null]
  'update:passivePerceptionBonus': [value: number | null]
}>()

const totalSpeed = computed(() => 30 + (props.speedBonus ?? 0))

const dexModifier = computed(() => getAbilityModifier(props.abilityScores.dexterity))
const totalInitiative = computed(() => dexModifier.value + (props.initiativeBonus ?? 0))

const initiativeTextColor = computed(() => {
  const v = totalInitiative.value
  if (v > 0) return 'text-success'
  if (v < 0) return 'text-danger'
  return 'text-content-muted'
})

const perceptionBonus = computed(() => {
  const wis = getAbilityModifier(props.abilityScores.wisdom)
  const level = props.skills.perception ?? 'none'
  if (level === 'none' && props.isJackOfAllTrades) {
    return wis + Math.floor(props.proficiencyBonus / 2)
  }
  return getSkillBonus(wis, level, props.proficiencyBonus)
})

const totalPassivePerception = computed(
  () => getPassivePerception(perceptionBonus.value) + (props.passivePerceptionBonus ?? 0),
)
</script>
