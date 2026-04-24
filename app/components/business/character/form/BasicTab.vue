<template>
  <div class="flex flex-col gap-2 bg-canvas-elevated p-4 sm:p-6 md:flex-row">
    <BusinessCharacterFormCharacterInfoSection
      class="w-full md:w-1/3"
      :form-state="formState"
      :total-level="totalLevel"
      :lock-primary-profession="lockPrimaryProfession"
      @update:name="emit('update:name', $event)"
      @update:gender="emit('update:gender', $event)"
      @update:race="emit('update:race', $event)"
      @update:background="emit('update:background', $event)"
      @update:alignment="emit('update:alignment', $event)"
      @update:faith="emit('update:faith', $event)"
      @update:languages="emit('update:languages', $event)"
      @update:tools="emit('update:tools', $event)"
      @update:weapon-proficiencies="emit('update:weaponProficiencies', $event)"
      @update:armor-proficiencies="emit('update:armorProficiencies', $event)"
      @add="emit('add')"
      @remove="emit('remove', $event)"
      @update:profession="(i, k) => emit('update:profession', i, k)"
      @update:level="(i, l) => emit('update:level', i, l)"
    />

    <BusinessCharacterFormSkillProficiencyGrid
      class="w-full md:w-1/3"
      :skills="formState.skills"
      :is-jack-of-all-trades="formState.isJackOfAllTrades"
      :ability-scores="abilityScores"
      :proficiency-bonus="proficiencyBonus"
      @update:skill="(s, l) => emit('update:skill', s, l)"
      @update:jack-of-all-trades="emit('update:jackOfAllTrades', $event)"
    />

    <div class="w-full md:w-1/3">
      <slot name="ability-panel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AbilityScores, CharacterFormStateBase } from '~/types/business/character'
import type {
  AlignmentKey,
  GenderKey,
  ProfessionKey,
  ProficiencyLevel,
  RaceKey,
  SkillKey,
} from '~/types/business/dnd'

const props = withDefaults(
  defineProps<{
    formState: CharacterFormStateBase
    totalLevel: number
    abilityScores: AbilityScores
    lockPrimaryProfession?: boolean
  }>(),
  { lockPrimaryProfession: false },
)

const proficiencyBonus = computed(() => getProficiencyBonus(props.totalLevel))

const emit = defineEmits<{
  'update:name': [value: string]
  'update:gender': [value: GenderKey | null]
  'update:race': [value: RaceKey | null]
  'update:background': [value: string]
  'update:alignment': [value: AlignmentKey | null]
  'update:faith': [value: string]
  'update:languages': [value: string]
  'update:tools': [value: string]
  'update:weaponProficiencies': [value: string]
  'update:armorProficiencies': [value: string]
  add: []
  remove: [index: number]
  'update:profession': [index: number, key: ProfessionKey]
  'update:level': [index: number, level: number]
  'update:skill': [skill: SkillKey, level: ProficiencyLevel]
  'update:jackOfAllTrades': [value: boolean]
}>()
</script>
