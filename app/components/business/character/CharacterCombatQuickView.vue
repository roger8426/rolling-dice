<template>
  <div class="space-y-6 bg-canvas-elevated p-4">
    <header class="flex items-center justify-between">
      <h2 class="font-display text-lg font-bold text-content">戰鬥速查</h2>
      <div class="flex gap-2">
        <Button :radius="4" bg-color="var(--color-warning)" @click="onShortRest">短休</Button>
        <Button :radius="4" bg-color="var(--color-success)" @click="longRest">長休</Button>
      </div>
    </header>

    <div class="grid gap-4 md:grid-cols-2">
      <BusinessCharacterQuickviewHpCard
        :current-hp="displayCurrentHp"
        :max-hp="effectiveMaxHp"
        :max-adjustment="state.hp.maxAdjustment"
        :temp-hp="state.hp.tempHp"
        @damage="damageHp"
        @heal="healHp"
        @adjust-temp="adjustTempHp"
        @adjust-max="adjustMaxHp"
      />
      <BusinessCharacterQuickviewDefenseCard
        :base-armor-class="totalArmorClass"
        :ac-adjustment="state.acAdjustment"
        :base-speed="totalSpeed"
        :speed-adjustment="state.speedAdjustment"
        :initiative="totalInitiative"
        :passive-perception="totalPassivePerception"
        @adjust-ac="adjustAc"
        @adjust-speed="adjustSpeed"
      />
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <BusinessCharacterQuickviewSavingThrowList
        :ability-scores="totalAbilityScores"
        :proficiency-bonus="proficiencyBonus"
        :proficiencies="character.savingThrowProficiencies"
        :adjustments="state.savingThrowAdjustments"
        @adjust="adjustSavingThrow"
      />
      <BusinessCharacterQuickviewSkillList
        :ability-scores="totalAbilityScores"
        :proficiency-bonus="proficiencyBonus"
        :skills="character.skills"
        :is-jack-of-all-trades="character.isJackOfAllTrades"
      />
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <BusinessCharacterQuickviewAttackList
        :attacks="character.attacks"
        :ability-scores="totalAbilityScores"
        :proficiency-bonus="proficiencyBonus"
      />
      <BusinessCharacterQuickviewPreparedSpellList :prepared-spells="character.preparedSpells" />
    </div>

    <BusinessCharacterQuickviewFeatureList
      :features="character.features"
      :feature-uses="state.featureUses"
      @adjust="adjustFeatureUse"
    />
  </div>
</template>

<script setup lang="ts">
import { Button } from '@ui'
import { useCharacterCombatState } from '~/composables/domain/useCharacterCombatState'
import { useCharacterDerivedStatsFromCharacter } from '~/composables/domain/useCharacterDerivedStats'
import type { Character } from '~/types/business/character'

const props = defineProps<{
  character: Character
}>()

const characterRef = computed(() => props.character)

const {
  totalAbilityScores,
  proficiencyBonus,
  totalHp,
  totalArmorClass,
  totalInitiative,
  totalSpeed,
  totalPassivePerception,
} = useCharacterDerivedStatsFromCharacter(characterRef)

const {
  state,
  effectiveMaxHp,
  displayCurrentHp,
  damageHp,
  healHp,
  adjustTempHp,
  adjustMaxHp,
  adjustAc,
  adjustSpeed,
  adjustSavingThrow,
  adjustFeatureUse,
  shortRest,
  longRest,
} = useCharacterCombatState(props.character.id, totalHp)

function onShortRest(): void {
  const ids = props.character.features
    .filter((f) => f.usage.hasUses && f.usage.recovery === 'shortRest')
    .map((f) => f.id)
  shortRest(ids)
}
</script>
