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
          @update:profession="updateProfession"
          @update:level="updateProfessionLevel"
          @update:method="setAbilityMethod"
          @update:score="updateAbilityScore"
          @roll:all="rollAllAbilities"
          @reset:abilities="resetAbilities"
          @update:background="formState.background = $event"
          @update:skill="setSkillProficiency"
        />
      </Tab>

      <Tab value="profile">
        <template #label>
          <span class="text-content">詳細設定</span>
        </template>
        <BusinessCharacterBuildProfileTab
          :form-state="formState"
          @update:age="formState.age = $event ? Number($event) : null"
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
  updateProfession,
  updateProfessionLevel,
  updateAbilityScore,
  setSkillProficiency,
  isSubmitting,
  canSubmit,
  submit,
} = useCharacterBuild()
</script>
