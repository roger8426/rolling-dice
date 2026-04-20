<template>
  <div class="mx-auto max-w-6xl px-4 pb-6">
    <CommonPageHeader title="Edit Character" :show-back="true" />

    <div v-if="notFound" class="py-12 text-center">
      <p class="text-content-muted">找不到此角色</p>
      <NuxtLink to="/character" class="mt-4 inline-block text-primary underline">
        返回角色列表
      </NuxtLink>
    </div>

    <template v-else>
      <Tabs
        v-model="activeTab"
        type="border"
        active-color="var(--color-canvas-elevated)"
        inactive-color="var(--color-canvas)"
        label="編輯角色卡"
      >
        <Tab value="basic">
          <template #label>
            <span class="text-content">基本資訊</span>
          </template>
          <BusinessCharacterFormBasicTab
            :form-state="formState"
            :total-level="totalLevel"
            :ability-scores="totalAbilityScores"
            @update:name="formState.name = $event"
            @update:gender="formState.gender = $event as typeof formState.gender"
            @update:race="formState.race = $event as typeof formState.race"
            @update:alignment="formState.alignment = $event as typeof formState.alignment"
            @update:faith="formState.faith = $event"
            @update:languages="formState.languages = $event"
            @update:tools="formState.tools = $event"
            @update:weapons="formState.weapons = $event"
            @update:armors="formState.armors = $event"
            @add="addProfession"
            @remove="removeProfession"
            @update:profession="updateProfession"
            @update:level="updateProfessionLevel"
            @update:background="formState.background = $event"
            @update:skill="setSkillProficiency"
            @update:jack-of-all-trades="formState.isJackOfAllTrades = $event"
          >
            <template #ability-panel>
              <BusinessCharacterFormAbilityScoreUpdatePanel
                :abilities="formState.abilities"
                @update:bonus-score="updateBonusScore"
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
          儲存變更
        </Button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Button, Tab, Tabs } from '@ui'
import { ABILITY_KEYS } from '~/constants/dnd'
import type { AbilityScores } from '~/types/business/character'

const route = useRoute()
const id = String(route.params.id)

useHead({ title: '編輯角色卡 | Rolling Dice' })

const {
  activeTab,
  formState,
  notFound,
  totalLevel,
  addProfession,
  removeProfession,
  updateProfession,
  updateProfessionLevel,
  updateBonusScore,
  setSkillProficiency,
  canSubmit,
  isSubmitting,
  submit,
} = useCharacterUpdate(id)

const totalAbilityScores = computed(
  () =>
    Object.fromEntries(
      ABILITY_KEYS.map((key) => [key, getTotalScore(formState.abilities[key])]),
    ) as AbilityScores,
)
</script>
