<template>
  <div class="flex-1 self-start space-y-1 px-2">
    <p class="text-xs text-content">技能熟練度</p>
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <div
        v-for="(label, key) in SKILL_NAMES"
        :key="key"
        class="flex items-center justify-between rounded-md border border-border px-2 py-1.5"
      >
        <span class="text-xs text-content">{{ label }}</span>
        <Select
          :model-value="skills[key] ?? 'none'"
          :options="proficiencyOptions"
          class="build-select"
          border-color="var(--color-primary)"
          dropdown-bg="var(--color-canvas)"
          option-hover-color="var(--color-canvas-inset)"
          option-selected-color="var(--color-canvas-muted)"
          size="sm"
          @update:model-value="emit('update:skill', key, $event as ProficiencyLevel)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Select } from '@ui'
import type { SelectOption } from '@ui'
import { SKILL_NAMES } from '~/constants/dnd'
import type { SkillProficiencies } from '~/types/business/character'
import type { ProficiencyLevel, SkillKey } from '~/types/business/dnd'

defineProps<{
  skills: SkillProficiencies
}>()

const emit = defineEmits<{
  'update:skill': [skill: SkillKey, level: ProficiencyLevel]
}>()

const proficiencyOptions: SelectOption[] = [
  { value: 'none', label: '無' },
  { value: 'proficient', label: '熟練' },
  { value: 'expertise', label: '專精' },
]
</script>
