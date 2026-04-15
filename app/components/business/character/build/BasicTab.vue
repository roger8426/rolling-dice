<template>
  <div class="flex flex-col md:flex-row gap-2">
    <div class="space-y-4 px-2 w-1/3">
      <div class="flex items-end gap-2">
        <!-- 角色名稱 -->
        <div class="min-w-20 flex-1">
          <label for="char-name" class="mb-1 block text-xs text-content">
            角色名稱 <span class="text-danger">*</span>
          </label>
          <Input
            id="char-name"
            class="build-input w-full"
            border-color="var(--color-primary)"
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
          <Select
            id="char-gender"
            class="build-select min-w-20"
            border-color="var(--color-primary)"
            dropdown-bg="var(--color-canvas)"
            option-hover-color="var(--color-canvas-inset)"
            option-selected-color="var(--color-canvas-muted)"
            placeholder=""
            :model-value="formState.gender || null"
            :options="genderOptions"
            size="sm"
            @update:model-value="emit('update:gender', String($event))"
          />
        </div>
        <!-- 種族 -->
        <div>
          <label for="char-race" class="mb-1 block text-xs text-content"> 種族 </label>
          <Select
            id="char-race"
            class="build-select min-w-20"
            border-color="var(--color-primary)"
            dropdown-bg="var(--color-canvas)"
            option-hover-color="var(--color-canvas-inset)"
            option-selected-color="var(--color-canvas-muted)"
            :model-value="formState.race || null"
            :options="raceOptions"
            placeholder=""
            size="sm"
            @update:model-value="emit('update:race', String($event))"
          />
        </div>
      </div>
      <div class="flex items-end gap-2">
        <!-- 背景 -->
        <div class="min-w-12 grow">
          <label for="char-background" class="mb-1 block text-xs text-content"> 背景 </label>
          <Input
            id="char-background"
            class="build-input w-full"
            border-color="var(--color-primary)"
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
          <Select
            id="char-alignment"
            class="build-select min-w-24"
            border-color="var(--color-primary)"
            dropdown-bg="var(--color-canvas)"
            option-hover-color="var(--color-canvas-inset)"
            option-selected-color="var(--color-canvas-muted)"
            :model-value="formState.alignment || null"
            :options="alignmentOptions"
            placeholder=""
            size="sm"
            @update:model-value="emit('update:alignment', String($event))"
          />
        </div>
        <!-- 信仰 -->
        <div class="min-w-12 grow">
          <label for="char-faith" class="mb-1 block text-xs text-content"> 信仰 </label>
          <Input
            id="char-faith"
            class="build-input w-full"
            border-color="var(--color-primary)"
            :model-value="formState.faith"
            placeholder=""
            size="sm"
            @update:model-value="emit('update:faith', $event)"
          />
        </div>
      </div>
      <div>
        <label for="char-languages" class="mb-1 block text-xs text-content"> 語言 </label>
        <Input
          id="char-languages"
          class="build-input w-full"
          border-color="var(--color-primary)"
          :radius="0"
          :model-value="formState.languages"
          size="sm"
          outline
          @update:model-value="emit('update:languages', $event)"
        />
      </div>
      <div>
        <label for="char-tools" class="mb-1 block text-xs text-content"> 熟練工具 </label>
        <Input
          id="char-tools"
          class="build-input w-full"
          border-color="var(--color-primary)"
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
            <Select
              :id="`prof-${index}`"
              :model-value="entry.profession || null"
              :options="getProfessionOptions(index)"
              class="build-select w-full"
              border-color="var(--color-primary)"
              dropdown-bg="var(--color-canvas)"
              option-hover-color="var(--color-canvas-inset)"
              option-selected-color="var(--color-canvas-muted)"
              size="sm"
              :placeholder="index === 0 ? '主職業' : '兼職'"
              @update:model-value="updateProfessionKey(index, $event as string)"
            />
          </div>
          <div class="max-w-12">
            <label :for="`prof-level-${index}`" class="mb-1 block text-xs text-content">
              等級
            </label>
            <Input
              :id="`prof-level-${index}`"
              type="number"
              class="build-input w-full"
              border-color="var(--color-primary)"
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
            :model-value="formState.skills[key] ?? 'none'"
            :options="proficiencyOptions"
            class="build-select"
            border-color="var(--color-primary)"
            dropdown-bg="var(--color-canvas)"
            option-hover-color="var(--color-canvas-inset)"
            option-selected-color="var(--color-canvas-muted)"
            size="sm"
            @update:model-value="emit('update:skill', key, $event as string)"
          />
        </div>
      </div>
    </div>
    <!-- 屬性計算區 -->
    <div class="space-y-4 px-2 w-1/3">
      <div>
        <img src="../../../../assets/images/dnd.png" alt="" />
      </div>
      <!-- Method selector -->
      <div>
        <p class="mb-1 text-xs text-content">分配方式</p>
        <div class="flex gap-2">
          <Button
            v-for="method in methods"
            :key="method.key"
            size="sm"
            :outline="formState.abilityMethod !== method.key"
            border-color="var(--color-primary)"
            bg-color="var(--color-primary)"
            text-color="var(--color-content)"
            class="ability-button"
            @click="emit('update:method', method.key)"
          >
            {{ method.label }}
          </Button>
        </div>
      </div>

      <!-- Ability grid -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div v-for="key in ABILITY_KEYS" :key="key" class="space-y-1">
          <label :for="`ability-${key}`" class="block text-xs text-content">
            {{ ABILITY_NAMES[key] }}（{{ formatModifier(formState.abilities[key]) }}）
          </label>

          <!-- Point Buy -->
          <div v-if="formState.abilityMethod === 'pointBuy'" class="flex items-center gap-1 py-0.5">
            <button
              type="button"
              class="flex items-center justify-center size-6 transition-colors hover:bg-surface-hover disabled:opacity-30"
              :disabled="formState.abilities[key] <= POINT_BUY_MIN_SCORE"
              aria-label="減少"
              @click="adjustPointBuy(key, -1)"
            >
              <Icon name="minus" :size="16" />
            </button>
            <span class="w-8 text-center font-mono text-lg font-bold">
              {{ formState.abilities[key] }}
            </span>
            <button
              type="button"
              class="flex items-center justify-center size-6 transition-colors hover:bg-surface-hover disabled:opacity-30"
              :disabled="formState.abilities[key] >= POINT_BUY_MAX_SCORE || !canIncrement(key)"
              aria-label="增加"
              @click="adjustPointBuy(key, 1)"
            >
              <Icon name="plus" :size="16" />
            </button>
          </div>

          <!-- Custom -->
          <div
            v-else-if="formState.abilityMethod === 'custom'"
            class="flex items-center gap-1 py-0.5"
          >
            <button
              type="button"
              class="flex items-center justify-center size-6 transition-colors hover:bg-surface-hover disabled:opacity-30"
              :disabled="formState.abilities[key] <= CUSTOM_ABILITY_MIN"
              aria-label="減少"
              @click="adjustCustomAbility(key, -1)"
            >
              <Icon name="minus" :size="16" />
            </button>
            <span class="w-8 text-center font-mono text-lg font-bold">
              {{ formState.abilities[key] }}
            </span>
            <button
              type="button"
              class="flex items-center justify-center size-6 transition-colors hover:bg-surface-hover disabled:opacity-30"
              :disabled="formState.abilities[key] >= CUSTOM_ABILITY_MAX"
              aria-label="增加"
              @click="adjustCustomAbility(key, 1)"
            >
              <Icon name="plus" :size="16" />
            </button>
          </div>

          <!-- Dice Roll -->
          <div v-else class="flex items-center gap-1 py-0.5">
            <span class="w-8 text-center font-mono text-lg font-bold">
              {{ formState.abilities[key] }}
            </span>
          </div>
        </div>
      </div>

      <!-- Point Buy remaining -->
      <div class="flex items-center justify-between">
        <p v-if="formState.abilityMethod === 'pointBuy'" class="text-sm text-content-muted">
          剩餘點數：
          <span :class="pointBuyRemaining < 0 ? 'text-red-400 font-bold' : 'font-bold'">
            {{ pointBuyRemaining }}
          </span>
          / 27
        </p>
        <div v-else class="size-1"></div>
        <Button
          size="sm"
          outline
          text-color="var(--color-primary)"
          border-color="var(--color-primary)"
          :radius="8"
          class="flex items-center gap-2"
          @click="resetAbilities()"
        >
          <Icon v-if="formState.abilityMethod === 'diceRoll'" name="dice-20" :size="16" />
          {{ formState.abilityMethod === 'diceRoll' ? '擲骰' : '重置屬性' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Icon, Input, Select } from '@ui'
import type { SelectOption } from '@ui'
import {
  ABILITY_KEYS,
  ABILITY_NAMES,
  ALIGNMENT_NAMES,
  CUSTOM_ABILITY_MAX,
  CUSTOM_ABILITY_MIN,
  GENDER_NAMES,
  POINT_BUY_MAX_SCORE,
  POINT_BUY_MIN_SCORE,
  PROFESSION_NAMES,
  RACE_NAMES,
  SKILL_NAMES,
} from '~/constants/dnd'
import { getPointBuyCost } from '~/helpers/ability'
import type { AbilityMethod, CharacterFormState } from '~/types/business/character'
import type { AbilityKey, ProfessionKey, SkillKey } from '~/types/business/dnd'

const props = defineProps<{
  formState: CharacterFormState
  totalLevel: number
  pointBuyRemaining: number
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
  'update:method': [method: AbilityMethod]
  'update:score': [key: AbilityKey, score: number]
  'update:skill': [skill: SkillKey, level: string]
  'roll:all': []
  'reset:abilities': []
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

/**
 * 職業原始資料，共13種
 */
const professionOptions: SelectOption[] = Object.entries(PROFESSION_NAMES).map(
  ([value, label]) => ({ value, label }),
)

/**
 * @param index 職業欄位索引
 * @returns 可選的職業選項列表
 * @description 排除「其他格」已選的職業，不包含自己
 */
const getProfessionOptions = (index: number): SelectOption[] => {
  return professionOptions.filter((option) => {
    return props.formState.professions.every(
      (entry, i) => i === index || entry.profession !== option.value,
    )
  })
}

/**
 * @description 當前職業數量達到上限或存在未選職業欄位時，禁用新增按鈕
 */
const isButtonDisabled = computed(() => {
  const professionsOver = props.formState.professions.length >= 13
  const everSelected = props.formState.professions.some((entry) => !entry.profession)

  return professionsOver || everSelected
})

const proficiencyOptions: SelectOption[] = [
  { value: 'none', label: '無' },
  { value: 'proficient', label: '熟練' },
  { value: 'expertise', label: '專精' },
]

const methods: { key: AbilityMethod; label: string }[] = [
  { key: 'custom', label: '自訂' },
  { key: 'pointBuy', label: '購點' },
  { key: 'diceRoll', label: '擲骰' },
]

function updateProfessionKey(index: number, value: string): void {
  emit('update:profession', index, value as ProfessionKey)
}

function updateProfessionLevel(index: number, value: string): void {
  const level = Math.max(1, Math.min(20, Number(value) || 1))
  emit('update:level', index, level)
}

function formatModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

function canIncrement(key: AbilityKey): boolean {
  const current = props.formState.abilities[key]
  if (current >= POINT_BUY_MAX_SCORE) return false
  const costDiff = getPointBuyCost(current + 1) - getPointBuyCost(current)
  return costDiff <= props.pointBuyRemaining
}

function adjustPointBuy(key: AbilityKey, delta: number): void {
  const current = props.formState.abilities[key]
  const next = current + delta
  if (next < POINT_BUY_MIN_SCORE || next > POINT_BUY_MAX_SCORE) return
  emit('update:score', key, next)
}

function adjustCustomAbility(key: AbilityKey, delta: number): void {
  const current = props.formState.abilities[key]
  const next = Math.max(CUSTOM_ABILITY_MIN, Math.min(CUSTOM_ABILITY_MAX, current + delta))
  emit('update:score', key, next)
}

function resetAbilities(): void {
  if (props.formState.abilityMethod === 'diceRoll') {
    emit('roll:all')
  } else {
    emit('reset:abilities')
  }
}
</script>

<style scoped>
:deep(.ability-button) {
  padding: 0.3625rem 1rem;
}
</style>
