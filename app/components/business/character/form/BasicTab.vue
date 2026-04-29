<template>
  <div class="flex flex-col gap-2 bg-canvas-elevated p-4 sm:p-6 md:flex-row">
    <BusinessCharacterFormCharacterInfoSection
      v-model:form-state="formState"
      class="w-full md:w-1/3"
      :total-level="totalLevel"
      :lock-primary-profession="lockPrimaryProfession"
    />

    <BusinessCharacterFormSkillProficiencyGrid
      v-model:form-state="formState"
      class="w-full md:w-1/3"
      :ability-scores="abilityScores"
      :proficiency-bonus="proficiencyBonus"
    />

    <div class="w-full md:w-1/3">
      <slot name="ability-panel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AbilityScores, CharacterFormStateBase } from '~/types/business/character'

const formState = defineModel<CharacterFormStateBase>('formState', { required: true })

const props = withDefaults(
  defineProps<{
    totalLevel: number
    abilityScores: AbilityScores
    lockPrimaryProfession?: boolean
  }>(),
  { lockPrimaryProfession: false },
)

const proficiencyBonus = computed(() => getProficiencyBonus(props.totalLevel))
</script>
