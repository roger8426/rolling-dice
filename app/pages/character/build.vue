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
          <h3 class="text-content">基本資訊</h3>
        </template>
        <div class="bg-canvas-elevated p-4 sm:p-6">
          <BusinessCharacterBuildBasicTab
            :form-state="formState"
            :total-level="totalLevel"
            :point-buy-remaining="pointBuyRemaining"
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
            @roll:all="rollAllAbilities"
            @reset:abilities="resetAbilities"
            @update:background="formState.background = $event"
            @update:skill="(s: SkillKey, l: ProficiencyLevel) => setSkillProficiency(s, l)"
          />
        </div>
      </Tab>

      <Tab value="profile">
        <template #label>
          <h3 class="text-content">詳細設定</h3>
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
      <Button :disabled="!canSubmit" :loading="isSubmitting" @click="submit"> 儲存角色卡 </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Tab, Tabs } from '@ui'
import type { AbilityKey, ProficiencyLevel, ProfessionKey, SkillKey } from '~/types/business/dnd'

useHead({ title: '建立角色卡 | Rolling Dice' })

const {
  activeTab,
  formState,
  pointBuyRemaining,
  setAbilityMethod,
  rollAllAbilities,
  resetAbilities,
  totalLevel,
  addProfession,
  removeProfession,
  setSkillProficiency,
  isSubmitting,
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
