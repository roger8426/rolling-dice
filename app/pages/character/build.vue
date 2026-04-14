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
        <template #label="{ active }">
          <h3 class="text-content" :class="!active && isTabValid('basic') ? 'text-green-400' : ''">
            基本資訊
          </h3>
        </template>
        <div class="bg-canvas-elevated p-4 sm:p-6">
          <BusinessCharacterBuildBasicTab
            :form-state="formState"
            :total-level="totalLevel"
            :point-buy-remaining="pointBuyRemaining"
            :standard-array-assignment="standardArrayAssignment"
            :available-standard-values="availableStandardValues"
            @update:name="formState.name = $event"
            @update:gender="formState.gender = $event as typeof formState.gender"
            @update:race="formState.race = $event as typeof formState.race"
            @update:alignment="formState.alignment = $event as typeof formState.alignment"
            @update:faith="formState.faith = $event"
            @add="addProfession"
            @remove="removeProfession"
            @update:profession="
              (i: number, k: ProfessionKey) => {
                if (formState.professions[i]) formState.professions[i].profession = k
              }
            "
            @update:level="
              (i: number, l: number) => {
                if (formState.professions[i]) formState.professions[i].level = l
              }
            "
            @update:method="setAbilityMethod"
            @update:score="(k: AbilityKey, s: number) => (formState.abilities[k] = s)"
            @assign:standard="(k: AbilityKey, v: number) => assignStandardArrayValue(k, v)"
            @roll:single="rollSingleAbility"
            @roll:all="rollAllAbilities"
          />
        </div>
      </Tab>

      <Tab value="background">
        <template #label="{ active }">
          <h3
            class="text-content"
            :class="!active && isTabValid('background') ? 'text-green-400' : ''"
          >
            背景與技能
          </h3>
        </template>
        <div class="bg-canvas-elevated p-4 sm:p-6">
          <BusinessCharacterBuildBackgroundTab
            :form-state="formState"
            @update:background="formState.background = $event"
            @update:skill="(s: string, l: string) => setSkillProficiency(s, l as ProficiencyLevel)"
          />
        </div>
      </Tab>

      <Tab value="profile">
        <template #label="{ active }">
          <h3
            class="text-content"
            :class="!active && isTabValid('profile') ? 'text-green-400' : ''"
          >
            個人資料
          </h3>
        </template>
        <div class="rounded-b-lg bg-canvas-elevated p-4 sm:p-6">
          <BusinessCharacterBuildProfileTab
            :form-state="formState"
            @update:age="formState.age = $event ? Number($event) : null"
            @update:height="formState.height = $event"
            @update:weight="formState.weight = $event"
            @update:appearance="formState.appearance = $event"
            @update:story="formState.story = $event"
            @update:languages="formState.languages = $event"
            @update:tools="formState.tools = $event"
          />
        </div>
      </Tab>
    </Tabs>

    <div class="mt-8 flex justify-end">
      <Button :disabled="!canSubmit" @click="submit"> 儲存角色卡 </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Tab, Tabs } from '@ui'
import type { AbilityKey, ProficiencyLevel, ProfessionKey } from '~/types/business/dnd'

useHead({ title: '建立角色卡 | Rolling Dice' })

const {
  activeTab,
  formState,
  pointBuyRemaining,
  standardArrayAssignment,
  availableStandardValues,
  setAbilityMethod,
  assignStandardArrayValue,
  rollAllAbilities,
  rollSingleAbility,
  totalLevel,
  addProfession,
  removeProfession,
  setSkillProficiency,
  isTabValid,
  canSubmit,
  submit,
} = useCharacterBuild()
</script>

<style scoped>
/* 讓 build 頁面內所有 Input 元件套用 canvas-inset 背景 */
:deep(.build-input) {
  background-color: var(--color-canvas-inset);
  border-radius: 0.375rem;
}

:deep(.build-select) {
  background-color: var(--color-canvas-inset);
  border-radius: 0.375rem;
}
</style>
