<template>
  <div class="flex flex-col gap-2 bg-canvas-elevated p-4 sm:p-6 md:flex-row">
    <BusinessCharacterFormCharacterInfoSection
      class="w-full md:w-1/3"
      :form-state="formState"
      :total-level="totalLevel"
      :lock-primary-profession="lockPrimaryProfession"
      @update:name="formState.name = $event"
      @update:gender="formState.gender = $event"
      @update:race="formState.race = $event"
      @update:background="formState.background = $event"
      @update:alignment="formState.alignment = $event"
      @update:faith="formState.faith = $event"
      @update:languages="formState.languages = $event"
      @update:tools="formState.tools = $event"
      @update:weapon-proficiencies="formState.weaponProficiencies = $event"
      @update:armor-proficiencies="formState.armorProficiencies = $event"
      @add="addProfession"
      @remove="removeProfession"
      @update:profession="updateProfession"
      @update:level="updateProfessionLevel"
    />

    <BusinessCharacterFormSkillProficiencyGrid
      class="w-full md:w-1/3"
      :skills="formState.skills"
      :is-jack-of-all-trades="formState.isJackOfAllTrades"
      :ability-scores="abilityScores"
      :proficiency-bonus="proficiencyBonus"
      @update:skill="setSkillProficiency"
      @update:jack-of-all-trades="formState.isJackOfAllTrades = $event"
    />

    <div class="w-full md:w-1/3">
      <slot name="ability-panel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AbilityScores, CharacterFormStateBase } from '~/types/business/character'
import type { ProficiencyLevel, ProfessionKey, SkillKey } from '~/types/business/dnd'

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

function addProfession(): void {
  formState.value.professions.push({ profession: null, level: 1 })
}

function removeProfession(index: number): void {
  if (formState.value.professions.length <= 1) return
  formState.value.professions.splice(index, 1)
}

function updateProfession(index: number, key: ProfessionKey): void {
  formState.value.professions[index]!.profession = key
}

function updateProfessionLevel(index: number, level: number): void {
  formState.value.professions[index]!.level = Math.max(1, Math.min(20, Math.trunc(level) || 1))
}

function setSkillProficiency(skill: SkillKey, level: ProficiencyLevel): void {
  formState.value.skills = applySkillProficiency(formState.value.skills, skill, level)
}
</script>
