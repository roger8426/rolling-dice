<template>
  <div class="space-y-6 bg-canvas-elevated p-4">
    <header class="flex items-center justify-end gap-2">
      <Button :radius="4" bg-color="var(--color-warning)" @click="onShortRest">短休</Button>
      <Button :radius="4" bg-color="var(--color-success)" @click="onLongRest">長休</Button>
    </header>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="flex flex-col gap-4">
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
        <BusinessCharacterQuickviewHitDiceCard
          :professions="character.professions"
          :hit-dice-used="state.hitDiceUsed"
          @adjust="adjustHitDiceUsed"
        />
      </div>
      <BusinessCharacterQuickviewDefenseCard
        :base-armor-class="totalArmorClass"
        :ac-adjustment="state.acAdjustment"
        :base-speed="totalSpeed"
        :speed-adjustment="state.speedAdjustment"
        :initiative="totalInitiative"
        :passive-perception="totalPassivePerception"
        :passive-insight="totalPassiveInsight"
        @adjust-ac="adjustAc"
        @adjust-speed="adjustSpeed"
      />
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <BusinessCharacterQuickviewSavingThrowList
        :ability-scores="totalAbilityScores"
        :proficiency-bonus="proficiencyBonus"
        :proficiencies="savingThrowProficiencies"
        :adjustments="state.savingThrowAdjustments"
        :spellcasting-abilities="character.spellcastingAbilities"
        :custom-spellcasting-bonuses="character.customSpellcastingBonuses"
        @adjust="adjustSavingThrow"
      />
      <BusinessCharacterQuickviewSkillList
        :ability-scores="totalAbilityScores"
        :proficiency-bonus="proficiencyBonus"
        :skills="character.skills"
        :is-jack-of-all-trades="character.isJackOfAllTrades"
      />
    </div>

    <div class="grid items-start gap-4 md:grid-cols-2">
      <BusinessCharacterQuickviewFeatureList
        :features="character.features"
        :feature-uses="state.featureUses"
        @adjust="adjustFeatureUse"
      />

      <div class="flex flex-col gap-4">
        <BusinessCharacterQuickviewSpellSlotsCard
          v-if="hasAnySlot"
          :spell-slots-base="spellSlotsBase"
          :spell-slots-used="state.spellSlotsUsed"
          :pact-slots-base="pactSlotsBase"
          :pact-slots-used="state.pactSlotsUsed"
          @adjust-spell="adjustSpellSlotUsed"
          @adjust-pact="adjustPactSlotUsed"
        />

        <BusinessCharacterQuickviewAttackList
          :attacks="character.attacks"
          :ability-scores="totalAbilityScores"
          :proficiency-bonus="proficiencyBonus"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@ui'
import { useCharacterCombatState } from '~/composables/domain/useCharacterCombatState'
import { useCharacterDerivedStatsFromCharacter } from '~/composables/domain/useCharacterDerivedStats'
import {
  getSuggestedPactSlots,
  getSuggestedRegularSpellSlots,
  mergeSlots,
} from '~/helpers/spell-slots'
import type { Character } from '~/types/business/character'

const props = defineProps<{
  character: Character
}>()

const characterRef = computed(() => props.character)

const {
  totalAbilityScores,
  proficiencyBonus,
  savingThrowProficiencies,
  totalHp,
  totalArmorClass,
  totalInitiative,
  totalSpeed,
  totalPassivePerception,
  totalPassiveInsight,
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
  adjustHitDiceUsed,
  adjustSpellSlotUsed,
  adjustPactSlotUsed,
  shortRest,
  longRest,
} = useCharacterCombatState(props.character.id, totalHp)

const spellSlotsBase = computed(() =>
  mergeSlots(
    getSuggestedRegularSpellSlots(props.character.professions),
    props.character.spellSlotsDelta,
  ),
)
const pactSlotsBase = computed(() =>
  mergeSlots(getSuggestedPactSlots(props.character.professions), props.character.pactSlotsDelta),
)
const hasAnySlot = computed(
  () => Object.keys(spellSlotsBase.value).length + Object.keys(pactSlotsBase.value).length > 0,
)

const onShortRest = (): void => {
  const ids = props.character.features
    .filter((f) => f.usage.hasUses && f.usage.recovery === 'shortRest')
    .map((f) => f.id)
  if (shortRest(ids)) useToast().success('短休完成')
}

const onLongRest = (): void => {
  longRest(props.character.professions)
  useToast().success('長休完成')
}
</script>
