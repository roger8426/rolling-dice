<template>
  <div class="space-y-6">
    <div>
      <label for="char-background" class="mb-1 block text-sm font-medium text-content">
        背景 <span class="text-red-400">*</span>
      </label>
      <Input
        id="char-background"
        :model-value="formState.background"
        placeholder="例如：侍祭、學者、罪犯"
        @update:model-value="$emit('update:background', $event)"
      />
    </div>

    <div>
      <p class="mb-3 text-sm font-medium text-content">技能熟練度</p>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div
          v-for="(label, key) in SKILL_NAMES"
          :key="key"
          class="flex items-center justify-between rounded-lg border border-border px-3 py-2"
        >
          <span class="text-sm text-content">{{ label }}</span>
          <Select
            :model-value="formState.skills[key] ?? 'none'"
            :options="proficiencyOptions"
            size="sm"
            @update:model-value="$emit('update:skill', key, $event as string)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input, Select } from '@ui'
import type { SelectOption } from '@ui'
import { SKILL_NAMES } from '~/constants/dnd'
import type { CharacterFormState } from '~/types/business/character'

defineProps<{
  formState: CharacterFormState
}>()

defineEmits<{
  'update:background': [value: string]
  'update:skill': [skill: string, level: string]
}>()

const proficiencyOptions: SelectOption[] = [
  { value: 'none', label: '無' },
  { value: 'proficient', label: '熟練' },
  { value: 'expertise', label: '專精' },
]
</script>
