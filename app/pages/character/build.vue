<template>
  <div class="mx-auto max-w-6xl px-4 pb-6">
    <CommonPageHeader title="Cast Your Character" :show-back="true" />

    <Tabs
      v-model="activeTab"
      type="border"
      active-color="var(--color-canvas-elevated)"
      inactive-color="var(--color-canvas)"
      label="建立角色卡"
    >
      <Tab value="basic">
        <template #label>
          <span class="text-content">基本資訊</span>
        </template>
        <BusinessCharacterFormBasicTab
          :form-state="formState"
          :total-level="totalLevel"
          :ability-scores="formState.abilities"
          @update:name="formState.name = $event"
          @update:gender="formState.gender = $event"
          @update:race="formState.race = $event"
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
          @update:background="formState.background = $event"
          @update:skill="setSkillProficiency"
          @update:jack-of-all-trades="formState.isJackOfAllTrades = $event"
        >
          <template #ability-panel>
            <BusinessCharacterFormAbilityScorePanel
              :abilities="formState.abilities"
              :ability-method="formState.abilityMethod"
              :point-buy-remaining="pointBuyRemaining"
              @update:method="setAbilityMethod"
              @update:score="updateAbilityScore"
              @roll:all="rollAllAbilities"
              @reset:abilities="resetAbilities"
            />
          </template>
        </BusinessCharacterFormBasicTab>
      </Tab>

      <Tab value="profile">
        <template #label>
          <span class="text-content">詳細設定</span>
        </template>
        <BusinessCharacterFormProfileTab
          :form-state="formState"
          @update:age="formState.age = $event"
          @update:height="formState.height = $event"
          @update:weight="formState.weight = $event"
          @update:appearance="formState.appearance = $event"
          @update:story="formState.story = $event"
        />
      </Tab>
    </Tabs>

    <div class="mt-8 flex justify-end">
      <Button
        :disabled="!canSubmit"
        :loading="isSubmitting"
        :radius="4"
        bg-color="var(--color-primary)"
        @click="submit"
      >
        儲存角色卡
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Tab, Tabs } from '@ui'

useHead({ title: '建立角色卡' })

const { activeTab, formState, core, abilities, submit } = useCharacterBuild()
const {
  totalLevel,
  addProfession,
  removeProfession,
  updateProfession,
  updateProfessionLevel,
  setSkillProficiency,
  isSubmitting,
  canSubmit,
} = core
const {
  pointBuyRemaining,
  setAbilityMethod,
  rollAllAbilities,
  resetAbilities,
  updateAbilityScore,
} = abilities
</script>
