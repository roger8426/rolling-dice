<template>
  <div class="flex flex-col gap-4 bg-canvas-elevated p-4 sm:p-6 md:flex-row">
    <div class="w-full space-y-6 md:w-2/3">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label for="char-age" class="mb-1 block text-xs text-content"> 年齡 </label>
          <CommonAppInput
            id="char-age"
            type="number"
            class="w-full"
            :radius="0"
            :model-value="formState.age !== null ? String(formState.age) : ''"
            size="sm"
            outline
            @update:model-value="$emit('update:age', parseIntegerInput($event))"
          />
        </div>
        <div>
          <label for="char-height" class="mb-1 block text-xs text-content">身高</label>
          <CommonAppInput
            id="char-height"
            class="w-full"
            :radius="0"
            :model-value="formState.height ?? ''"
            size="sm"
            outline
            @update:model-value="$emit('update:height', $event)"
          />
        </div>
        <div>
          <label for="char-weight" class="mb-1 block text-xs text-content">體重</label>
          <CommonAppInput
            id="char-weight"
            class="w-full"
            :radius="0"
            :model-value="formState.weight ?? ''"
            size="sm"
            outline
            @update:model-value="$emit('update:weight', $event)"
          />
        </div>
      </div>

      <div>
        <label for="char-appearance" class="mb-1 block text-xs text-content">外貌</label>
        <div class="border border-primary rounded-md bg-canvas-inset">
          <TextArea
            id="char-appearance"
            class="w-full"
            :border="false"
            :model-value="formState.appearance ?? ''"
            placeholder="簡述角色的外貌特，上限 200 字"
            :rows="2"
            :maxlength="200"
            show-count
            @update:model-value="$emit('update:appearance', $event)"
          />
        </div>
      </div>

      <div>
        <label for="char-story" class="mb-1 block text-xs text-content">故事</label>
        <div class="border border-primary rounded-md bg-canvas-inset">
          <TextArea
            id="char-story"
            class="w-full"
            :border="false"
            :model-value="formState.story ?? ''"
            placeholder="角色背景故事設定，上限 1000 字"
            :rows="10"
            :maxlength="1000"
            show-count
            @update:model-value="$emit('update:story', $event)"
          />
        </div>
      </div>
    </div>
    <div
      class="w-full flex flex-col items-center justify-center border border-primary rounded-md md:w-1/3 px-1 gap-2"
    >
      <img src="~/assets/images/imbad.png" alt="" />
      角色圖片上傳區，開發中...
    </div>
  </div>
</template>

<script setup lang="ts">
import { TextArea } from '@ui'
import type { CharacterFormStateBase } from '~/types/business/character'

defineProps<{
  formState: CharacterFormStateBase
}>()

defineEmits<{
  'update:age': [value: number | null]
  'update:height': [value: string]
  'update:weight': [value: string]
  'update:appearance': [value: string]
  'update:story': [value: string]
}>()
</script>
