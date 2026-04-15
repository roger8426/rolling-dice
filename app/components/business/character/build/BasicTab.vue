<template>
  <div class="flex flex-col md:flex-row gap-2">
    <BusinessCharacterBuildCharacterInfoSection
      :form-state="formState"
      :total-level="totalLevel"
      @update:name="emit('update:name', $event)"
      @update:gender="emit('update:gender', $event)"
      @update:race="emit('update:race', $event)"
      @update:background="emit('update:background', $event)"
      @update:alignment="emit('update:alignment', $event)"
      @update:faith="emit('update:faith', $event)"
      @update:languages="emit('update:languages', $event)"
      @update:tools="emit('update:tools', $event)"
      @add="emit('add')"
      @remove="emit('remove', $event)"
      @update:profession="(i, k) => emit('update:profession', i, k)"
      @update:level="(i, l) => emit('update:level', i, l)"
    />

    <BusinessCharacterBuildSkillProficiencyGrid
      :skills="formState.skills"
      @update:skill="(s, l) => emit('update:skill', s, l)"
    />

    <BusinessCharacterBuildAbilityScorePanel
      :abilities="formState.abilities"
      :ability-method="formState.abilityMethod"
      :point-buy-remaining="pointBuyRemaining"
      @update:method="emit('update:method', $event)"
      @update:score="(k, s) => emit('update:score', k, s)"
      @roll:all="emit('roll:all')"
      @reset:abilities="emit('reset:abilities')"
    />
  </div>
</template>

<script setup lang="ts">
import type { AbilityMethod, CharacterFormState } from '~/types/business/character'
import type { AbilityKey, ProfessionKey, ProficiencyLevel, SkillKey } from '~/types/business/dnd'

defineProps<{
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
  'update:skill': [skill: SkillKey, level: ProficiencyLevel]
  'roll:all': []
  'reset:abilities': []
}>()
</script>
