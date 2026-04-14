<template>
  <div class="space-y-6">
    <div v-for="(entry, index) in formState.professions" :key="index" class="flex items-end gap-3">
      <div class="min-w-0 flex-1">
        <label :for="`prof-${index}`" class="mb-1 block text-sm font-medium text-content">
          職業 {{ index + 1 }} <span v-if="index === 0" class="text-red-400">*</span>
        </label>
        <Select
          :id="`prof-${index}`"
          :model-value="entry.profession || null"
          :options="professionOptions"
          placeholder="選擇職業"
          @update:model-value="updateProfessionKey(index, $event as string)"
        />
      </div>
      <div class="w-20">
        <label :for="`prof-level-${index}`" class="mb-1 block text-sm font-medium text-content">
          等級
        </label>
        <Input
          :id="`prof-level-${index}`"
          type="number"
          :model-value="String(entry.level)"
          @update:model-value="updateProfessionLevel(index, $event)"
        />
      </div>
      <button
        v-if="formState.professions.length > 1"
        type="button"
        class="mb-0.5 shrink-0 rounded p-2 text-content-muted transition-colors hover:text-red-400"
        aria-label="移除此職業"
        @click="$emit('remove', index)"
      >
        <Icon name="x" :size="16" />
      </button>
    </div>

    <div class="flex items-center justify-between">
      <Button size="sm" outline :disabled="totalLevel >= 20" @click="$emit('add')">
        + 新增職業
      </Button>
      <p class="text-sm text-content-muted">
        總等級：
        <span :class="totalLevel > 20 ? 'text-red-400 font-bold' : ''">{{ totalLevel }}</span>
        / 20
      </p>
    </div>

    <p v-if="totalLevel > 20" class="text-sm text-red-400">職業等級總和不可超過 20</p>
  </div>
</template>

<script setup lang="ts">
import { Button, Icon, Input, Select } from '@ui'
import type { SelectOption } from '@ui'
import { PROFESSION_NAMES } from '~/constants/dnd'
import type { CharacterFormState } from '~/types/business/character'
import type { ProfessionKey } from '~/types/business/dnd'

defineProps<{
  formState: CharacterFormState
  totalLevel: number
}>()

const emit = defineEmits<{
  add: []
  remove: [index: number]
  'update:profession': [index: number, key: ProfessionKey]
  'update:level': [index: number, level: number]
}>()

const professionOptions: SelectOption[] = Object.entries(PROFESSION_NAMES).map(
  ([value, label]) => ({ value, label }),
)

function updateProfessionKey(index: number, value: string): void {
  emit('update:profession', index, value as ProfessionKey)
}

function updateProfessionLevel(index: number, value: string): void {
  const level = Math.max(1, Math.min(20, Number(value) || 1))
  emit('update:level', index, level)
}
</script>
