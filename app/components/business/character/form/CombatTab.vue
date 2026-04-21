<template>
  <div class="space-y-8 bg-canvas-elevated p-4 sm:p-6">
    <BusinessCharacterFormCombatArmorClassPanel
      :armor-class="armorClass"
      :ability-scores="abilityScores"
      @update:armor-type="emit('update:armorType', $event)"
      @update:armor-value="emit('update:armorValue', $event)"
      @update:armor-ability-key="emit('update:armorAbilityKey', $event)"
      @update:shield-value="emit('update:shieldValue', $event)"
    />

    <BusinessCharacterFormCombatAttackList
      :attacks="attacks"
      @add="emit('addAttack')"
      @remove="emit('removeAttack', $event)"
      @update:attack="(id, field, value) => emit('update:attack', id, field, value)"
    />

    <!-- TODO: 額外生命值輸入 UI，待 HP 顯示整合完成後再啟用 -->
    <section v-if="false" aria-labelledby="section-extra-hp">
      <h2 id="section-extra-hp" class="mb-4 font-display text-lg font-bold text-content">
        額外生命值
      </h2>
      <CommonAppInput
        id="extra-hp"
        :model-value="String(extraHp)"
        type="number"
        size="sm"
        outline
        @update:model-value="emit('update:extraHp', Number($event) || 0)"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import type { AbilityScores, ArmorClassConfig, AttackEntry } from '~/types/business/character'
import type { AbilityKey, ArmorType } from '~/types/business/dnd'

defineProps<{
  armorClass: ArmorClassConfig
  attacks: AttackEntry[]
  abilityScores: AbilityScores
  extraHp: number
}>()

const emit = defineEmits<{
  'update:armorType': [value: ArmorType | '']
  'update:armorValue': [value: number | null]
  'update:armorAbilityKey': [value: AbilityKey | '']
  'update:shieldValue': [value: number]
  'update:extraHp': [value: number]
  addAttack: []
  removeAttack: [id: string]
  'update:attack': [id: string, field: keyof AttackEntry, value: AttackEntry[keyof AttackEntry]]
}>()
</script>
