<template>
  <div class="flex flex-col gap-8 bg-canvas-elevated p-4 sm:p-6 md:flex-row md:items-start">
    <!-- 左欄：基礎數據 + 護甲等級 -->
    <div class="w-full space-y-8 md:w-1/3">
      <BusinessCharacterFormCombatOtherAttributesPanel
        :extra-hp="extraHp"
        :total-hp="totalHp"
        :is-tough="isTough"
        :speed-bonus="speedBonus"
        :initiative-bonus="initiativeBonus"
        :passive-perception-bonus="passivePerceptionBonus"
        :total-speed="totalSpeed"
        :total-initiative="totalInitiative"
        :total-passive-perception="totalPassivePerception"
        @update:extra-hp="emit('update:extraHp', $event)"
        @update:is-tough="emit('update:isTough', $event)"
        @update:speed-bonus="emit('update:speedBonus', $event)"
        @update:initiative-bonus="emit('update:initiativeBonus', $event)"
        @update:passive-perception-bonus="emit('update:passivePerceptionBonus', $event)"
      />

      <BusinessCharacterFormCombatArmorClassPanel
        :armor-class="armorClass"
        :ability-scores="abilityScores"
        @update:armor-type="emit('update:armorType', $event)"
        @update:armor-value="emit('update:armorValue', $event)"
        @update:armor-ability-key="emit('update:armorAbilityKey', $event)"
        @update:shield-value="emit('update:shieldValue', $event)"
      />

      <BusinessCharacterFormCombatSavingThrowPanel
        :professions="professions"
        :extras="savingThrowExtras"
        :ability-scores="abilityScores"
        :proficiency-bonus="proficiencyBonus"
        @update:extras="emit('update:savingThrowExtras', $event)"
      />
    </div>

    <!-- 右欄：自訂攻擊 -->
    <div class="w-full md:w-2/3">
      <BusinessCharacterFormCombatAttackList
        :attacks="attacks"
        :ability-scores="abilityScores"
        :proficiency-bonus="proficiencyBonus"
        @add="(entry) => emit('addAttack', entry)"
        @remove="emit('removeAttack', $event)"
        @update:attack="(id, data) => emit('update:attack', id, data)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  AbilityScores,
  ArmorClassConfig,
  AttackDraft,
  AttackEntry,
  ProfessionEntry,
} from '~/types/business/character'
import type { AbilityKey, ArmorType } from '~/types/business/dnd'

defineProps<{
  armorClass: ArmorClassConfig
  attacks: AttackEntry[]
  abilityScores: AbilityScores
  extraHp: number
  totalHp: number
  isTough: boolean
  proficiencyBonus: number
  speedBonus: number | null
  initiativeBonus: number | null
  passivePerceptionBonus: number | null
  totalSpeed: number
  totalInitiative: number
  totalPassivePerception: number
  professions: ProfessionEntry[]
  savingThrowExtras: AbilityKey[]
}>()

const emit = defineEmits<{
  'update:armorType': [value: ArmorType | null]
  'update:armorValue': [value: number | null]
  'update:armorAbilityKey': [value: AbilityKey | null]
  'update:shieldValue': [value: number]
  'update:extraHp': [value: number]
  'update:isTough': [value: boolean]
  'update:speedBonus': [value: number | null]
  'update:initiativeBonus': [value: number | null]
  'update:passivePerceptionBonus': [value: number | null]
  'update:savingThrowExtras': [value: AbilityKey[]]
  addAttack: [entry: AttackDraft]
  removeAttack: [id: string]
  'update:attack': [id: string, data: AttackDraft]
}>()
</script>
