<template>
  <div class="space-y-4 px-2">
    <div class="flex items-end gap-2">
      <!-- 角色名稱 -->
      <div class="min-w-20 flex-1">
        <label for="char-name" class="mb-1 block text-xs text-content">
          角色名稱 <span class="text-danger">*</span>
        </label>
        <CommonAppInput
          id="char-name"
          class="w-full"
          :radius="0"
          :model-value="formState.name"
          size="sm"
          outline
          @update:model-value="emit('update:name', $event)"
        />
      </div>
      <!-- 性別 -->
      <div>
        <label for="char-gender" class="mb-1 block text-xs text-content"> 性別 </label>
        <CommonAppSelect
          id="char-gender"
          class="min-w-20"
          placeholder=""
          :model-value="formState.gender || null"
          :options="genderOptions"
          size="sm"
          @update:model-value="emit('update:gender', $event as typeof formState.gender)"
        />
      </div>
      <!-- 種族 -->
      <div>
        <label for="char-race" class="mb-1 block text-xs text-content"> 種族 </label>
        <CommonAppSelect
          id="char-race"
          class="min-w-20"
          :model-value="formState.race || null"
          :options="raceOptions"
          placeholder=""
          size="sm"
          @update:model-value="emit('update:race', $event as typeof formState.race)"
        />
      </div>
    </div>
    <div class="flex items-end gap-2">
      <!-- 背景 -->
      <div class="min-w-12 grow">
        <label for="char-background" class="mb-1 block text-xs text-content"> 背景 </label>
        <CommonAppInput
          id="char-background"
          class="w-full"
          :radius="0"
          :model-value="formState.background"
          size="sm"
          outline
          @update:model-value="emit('update:background', $event)"
        />
      </div>
      <!-- 陣營 -->
      <div>
        <label for="char-alignment" class="mb-1 block text-xs text-content"> 陣營 </label>
        <CommonAppSelect
          id="char-alignment"
          class="min-w-24"
          :model-value="formState.alignment || null"
          :options="alignmentOptions"
          placeholder=""
          size="sm"
          @update:model-value="emit('update:alignment', $event as typeof formState.alignment)"
        />
      </div>
      <!-- 信仰 -->
      <div class="min-w-12 grow">
        <label for="char-faith" class="mb-1 block text-xs text-content"> 信仰 </label>
        <CommonAppInput
          id="char-faith"
          class="w-full"
          :model-value="formState.faith"
          placeholder=""
          size="sm"
          @update:model-value="emit('update:faith', $event)"
        />
      </div>
    </div>
    <div>
      <label for="char-languages" class="mb-1 block text-xs text-content"> 語言 </label>
      <CommonAppInput
        id="char-languages"
        class="w-full"
        :radius="0"
        :model-value="formState.languages"
        size="sm"
        outline
        @update:model-value="emit('update:languages', $event)"
      />
    </div>
    <div>
      <label for="char-tools" class="mb-1 block text-xs text-content"> 熟練工具 </label>
      <CommonAppInput
        id="char-tools"
        class="w-full"
        :radius="0"
        :model-value="formState.tools"
        size="sm"
        outline
        @update:model-value="emit('update:tools', $event)"
      />
    </div>

    <!-- 職業設定 -->
    <div class="space-y-4">
      <div
        v-for="(entry, index) in formState.professions"
        :key="index"
        class="flex items-end gap-3"
      >
        <div class="min-w-16 flex-1">
          <label :for="`prof-${index}`" class="mb-1 block text-xs text-content">
            職業 {{ index + 1 }}
          </label>
          <CommonAppSelect
            :id="`prof-${index}`"
            :model-value="entry.profession || null"
            :options="getProfessionOptions(index)"
            class="w-full"
            size="sm"
            :placeholder="index === 0 ? '主職業' : '兼職'"
            @update:model-value="updateProfessionKey(index, $event as string)"
          />
        </div>
        <div class="max-w-12">
          <label :for="`prof-level-${index}`" class="mb-1 block text-xs text-content"> 等級 </label>
          <CommonAppInput
            :id="`prof-level-${index}`"
            type="number"
            class="w-full"
            size="sm"
            :model-value="String(entry.level)"
            @update:model-value="updateProfessionLevel(index, $event)"
          />
        </div>
        <button
          v-if="index > 0"
          type="button"
          class="flex items-center justify-center border-content bg-danger shrink-0 size-8 rounded text-content transition-colors hover:bg-danger-hover"
          aria-label="移除此職業"
          @click="emit('remove', index)"
        >
          <Icon name="close" :size="20" />
        </button>
        <div v-else class="size-8" />
      </div>

      <div class="flex items-center justify-between">
        <Button
          size="sm"
          outline
          :disabled="isButtonDisabled"
          text-color="var(--color-primary)"
          border-color="var(--color-primary)"
          :radius="8"
          @click="emit('add')"
        >
          + 新增職業
        </Button>
        <p class="text-sm text-content-muted">
          總等級：
          <span :class="totalLevel > 20 ? 'text-red-400 font-bold' : ''">{{ totalLevel }}</span>
          / 20
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Icon } from '@ui'
import type { SelectOption } from '@ui'
import { ALIGNMENT_NAMES, GENDER_NAMES, PROFESSION_CONFIG, RACE_NAMES } from '~/constants/dnd'
import type { CharacterFormState } from '~/types/business/character'
import type { ProfessionKey } from '~/types/business/dnd'

const props = defineProps<{
  formState: CharacterFormState
  totalLevel: number
}>()

const emit = defineEmits<{
  'update:name': [value: string]
  'update:gender': [value: string]
  'update:race': [value: string]
  'update:background': [value: string]
  'update:alignment': [value: string]
  'update:faith': [value: string]
  'update:languages': [value: string]
  'update:tools': [value: string]
  add: []
  remove: [index: number]
  'update:profession': [index: number, key: ProfessionKey]
  'update:level': [index: number, level: number]
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

const professionOptions: SelectOption[] = Object.entries(PROFESSION_CONFIG).map(
  ([value, { label }]) => ({ value, label }),
)

const getProfessionOptions = (index: number): SelectOption[] => {
  return professionOptions.filter((option) => {
    return props.formState.professions.every(
      (entry, i) => i === index || entry.profession !== option.value,
    )
  })
}

const isButtonDisabled = computed(() => {
  const professionsOver = props.formState.professions.length >= 13
  const everSelected = props.formState.professions.some((entry) => !entry.profession)
  return professionsOver || everSelected
})

function updateProfessionKey(index: number, value: string): void {
  emit('update:profession', index, value as ProfessionKey)
}

function updateProfessionLevel(index: number, value: string): void {
  const level = Math.max(1, Math.min(20, Number(value) || 1))
  emit('update:level', index, level)
}
</script>
