<template>
  <div class="space-y-6">
    <div>
      <label for="char-name" class="mb-1 block text-sm font-medium text-info">
        姓名 <span class="text-red-400">*</span>
      </label>
      <Input
        id="char-name"
        border-color="var(--color-info)"
        :model-value="formState.name"
        placeholder="輸入角色名稱"
        outline
        @update:model-value="emit('update:name', $event)"
      />
    </div>

    <div>
      <label for="char-gender" class="mb-1 block text-sm font-medium text-content">
        性別 <span class="text-red-400">*</span>
      </label>
      <Select
        id="char-gender"
        :model-value="formState.gender || null"
        :options="genderOptions"
        placeholder="選擇性別"
        @update:model-value="emit('update:gender', String($event))"
      />
    </div>

    <div>
      <label for="char-race" class="mb-1 block text-sm font-medium text-content">
        種族 <span class="text-red-400">*</span>
      </label>
      <Select
        id="char-race"
        :model-value="formState.race || null"
        :options="raceOptions"
        placeholder="選擇種族"
        @update:model-value="emit('update:race', String($event))"
      />
    </div>

    <div>
      <label for="char-alignment" class="mb-1 block text-sm font-medium text-content">
        陣營 <span class="text-red-400">*</span>
      </label>
      <Select
        id="char-alignment"
        :model-value="formState.alignment || null"
        :options="alignmentOptions"
        placeholder="選擇陣營"
        @update:model-value="emit('update:alignment', String($event))"
      />
    </div>

    <div>
      <label for="char-faith" class="mb-1 block text-sm font-medium text-content"> 信仰 </label>
      <Input
        id="char-faith"
        :model-value="formState.faith"
        placeholder="無信仰"
        @update:model-value="emit('update:faith', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input, Select } from '@ui'
import type { SelectOption } from '@ui'
import { ALIGNMENT_NAMES, GENDER_NAMES, RACE_NAMES } from '~/constants/dnd'
import type { CharacterFormState } from '~/types/business/character'

defineProps<{
  formState: CharacterFormState
}>()

const emit = defineEmits<{
  'update:name': [value: string]
  'update:gender': [value: string]
  'update:race': [value: string]
  'update:alignment': [value: string]
  'update:faith': [value: string]
}>()

const genderOptions: SelectOption[] = Object.entries(GENDER_NAMES).map(([value, label]) => ({
  value,
  label,
}))

const raceOptions: SelectOption[] = Object.entries(RACE_NAMES).map(([value, label]) => ({
  value,
  label,
}))

const alignmentOptions: SelectOption[] = Object.entries(ALIGNMENT_NAMES).map(([value, label]) => ({
  value,
  label,
}))
</script>
