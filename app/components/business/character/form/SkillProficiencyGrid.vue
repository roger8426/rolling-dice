<template>
  <div class="flex-1 self-start space-y-1 px-2">
    <div class="flex items-center justify-between">
      <p class="text-xs text-content">技能熟練度</p>
      <label class="flex items-center gap-1.5">
        <span class="text-xs text-content-soft">全能高手</span>
        <Toggle
          :model-value="isJackOfAllTrades"
          size="sm"
          color="var(--color-success)"
          aria-label="全能高手"
          @update:model-value="emit('update:jackOfAllTrades', $event)"
        />
      </label>
    </div>
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <div
        v-for="item in skillList"
        :key="item.key"
        class="flex flex-wrap items-center justify-between rounded-md border border-border gap-1 px-2 py-1.5"
      >
        <span class="text-xs text-content flex-1">
          {{ `${item.name}` }}
          <span class="text-content-muted">({{ item.bonusText }})</span>
        </span>
        <CommonAppSelect
          class="min-w-18 flex-1"
          :model-value="skills[item.key] ?? 'none'"
          :options="proficiencyOptions"
          size="sm"
          @update:model-value="emit('update:skill', item.key, $event as ProficiencyLevel)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectOption } from '@ui'
import { Toggle } from '@ui'
import { SKILL_NAMES, SKILL_TO_ABILITY_MAP } from '~/constants/dnd'
import type { AbilityScores, SkillProficiencies } from '~/types/business/character'
import type { ProficiencyLevel, SkillKey } from '~/types/business/dnd'

const props = defineProps<{
  skills: SkillProficiencies
  isJackOfAllTrades: boolean
  abilityScores: AbilityScores
  proficiencyBonus: number
}>()

const emit = defineEmits<{
  'update:skill': [skill: SkillKey, level: ProficiencyLevel]
  'update:jackOfAllTrades': [value: boolean]
}>()

const skillList = computed(() => {
  const jackBonus = props.isJackOfAllTrades ? Math.floor(props.proficiencyBonus / 2) : 0
  return (Object.entries(SKILL_NAMES) as [SkillKey, string][]).map(([key, name]) => {
    const abilityKey = SKILL_TO_ABILITY_MAP[key]
    const mod = getAbilityModifier(props.abilityScores[abilityKey])
    const proficiency: ProficiencyLevel = props.skills[key] ?? 'none'
    const base = getSkillBonus(mod, proficiency, props.proficiencyBonus)
    const bonus = proficiency === 'none' ? base + jackBonus : base
    return { key, name, bonusText: formatModifier(bonus) }
  })
})

const proficiencyOptions: SelectOption[] = [
  { value: 'none', label: '無' },
  { value: 'proficient', label: '熟練' },
  { value: 'expertise', label: '專精' },
]
</script>
