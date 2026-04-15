<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label for="char-age" class="mb-1 block text-sm font-medium text-content">年齡</label>
        <Input
          id="char-age"
          type="number"
          :model-value="formState.age != null ? String(formState.age) : ''"
          placeholder="例如：25"
          @update:model-value="$emit('update:age', $event)"
        />
      </div>
      <div>
        <label for="char-height" class="mb-1 block text-sm font-medium text-content">身高</label>
        <Input
          id="char-height"
          :model-value="formState.height"
          placeholder="例如：175cm"
          @update:model-value="$emit('update:height', $event)"
        />
      </div>
      <div>
        <label for="char-weight" class="mb-1 block text-sm font-medium text-content">體重</label>
        <Input
          id="char-weight"
          :model-value="formState.weight"
          placeholder="例如：70kg"
          @update:model-value="$emit('update:weight', $event)"
        />
      </div>
    </div>

    <div>
      <label for="char-appearance" class="mb-1 block text-sm font-medium text-content">外貌</label>
      <TextArea
        id="char-appearance"
        :model-value="formState.appearance"
        placeholder="簡述角色的外貌特徵"
        :rows="2"
        :maxlength="200"
        show-count
        @update:model-value="$emit('update:appearance', $event)"
      />
    </div>

    <div>
      <label for="char-story" class="mb-1 block text-sm font-medium text-content">故事</label>
      <TextArea
        id="char-story"
        :model-value="formState.story"
        placeholder="角色的背景故事"
        :rows="4"
        @update:model-value="$emit('update:story', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input, TextArea } from '@ui'
import type { CharacterFormState } from '~/types/business/character'

defineProps<{
  formState: CharacterFormState
}>()

defineEmits<{
  'update:age': [value: string]
  'update:height': [value: string]
  'update:weight': [value: string]
  'update:appearance': [value: string]
  'update:story': [value: string]
  'update:languages': [value: string]
  'update:tools': [value: string]
}>()
</script>
