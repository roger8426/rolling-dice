<template>
  <div class="mx-auto max-w-6xl px-4 pb-6">
    <CommonPageHeader title="Edit Character" :show-back="true">
      <template #actions>
        <Button
          :disabled="!canSubmit"
          :loading="isSubmitting"
          :radius="4"
          bg-color="var(--color-primary)"
          @click="submit"
        >
          儲存變更
        </Button>
      </template>
    </CommonPageHeader>

    <CommonNotFound
      v-if="!character"
      message="找不到此角色"
      back-to="/character"
      back-label="返回角色列表"
    />

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
            :lock-primary-profession="true"
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
            @update:age="formState.age = $event"
            @update:height="formState.height = $event"
            @update:weight="formState.weight = $event"
            @update:appearance="formState.appearance = $event"
            @update:story="formState.story = $event"
          />
        </Tab>

        <Tab value="features">
          <template #label>
            <span class="text-content">專長與特性</span>
          </template>
          <BusinessCharacterFormFeaturesTab
            :features="formState.features"
            @add="addFeature"
            @remove="removeFeature"
            @update="updateFeature"
          />
        </Tab>

        <Tab value="combat">
          <template #label>
            <span class="text-content">戰鬥模組</span>
          </template>
          <BusinessCharacterFormCombatTab
            :armor-class="formState.armorClass"
            :attacks="formState.attacks"
            :ability-scores="totalAbilityScores"
            :extra-hp="formState.extraHp"
            :total-hp="totalHp"
            :is-tough="formState.isTough"
            :proficiency-bonus="proficiencyBonus"
            :speed-bonus="formState.speedBonus"
            :initiative-bonus="formState.initiativeBonus"
            :passive-perception-bonus="formState.passivePerceptionBonus"
            :total-speed="totalSpeed"
            :total-initiative="totalInitiative"
            :total-passive-perception="totalPassivePerception"
            :professions="validProfessions"
            :saving-throw-extras="formState.savingThrowExtras"
            @update:armor-type="updateArmorType"
            @update:armor-value="updateArmorValue"
            @update:armor-ability-key="updateArmorAbilityKey"
            @update:shield-value="updateShieldValue"
            @update:extra-hp="updateExtraHp"
            @update:is-tough="formState.isTough = $event"
            @update:speed-bonus="updateSpeedBonus"
            @update:initiative-bonus="updateInitiativeBonus"
            @update:passive-perception-bonus="updatePassivePerceptionBonus"
            @update:saving-throw-extras="updateSavingThrowExtras"
            @add-attack="addAttack"
            @remove-attack="removeAttack"
            @update:attack="updateAttack"
          />
        </Tab>

        <Tab value="spells">
          <template #label>
            <span class="text-content">法術書</span>
          </template>
          <BusinessCharacterFormSpellsTab
            :learned-spells="formState.learnedSpells"
            :prepared-spells="formState.preparedSpells"
            @toggle-learned="toggleLearnedSpell"
            @toggle-prepared="togglePreparedSpell"
          />
        </Tab>
      </Tabs>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Button, Tab, Tabs } from '@ui'

const route = useRoute()
const id = getRouteParam(route.params.id)

useHead({ title: '編輯角色卡' })

const {
  activeTab,
  character,
  formState,
  core,
  derived,
  abilities,
  combat,
  spells,
  features,
  submit,
} = useCharacterUpdate(id)

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
  totalAbilityScores,
  proficiencyBonus,
  validProfessions,
  totalHp,
  totalInitiative,
  totalSpeed,
  totalPassivePerception,
} = derived

const { updateBonusScore } = abilities

const {
  updateExtraHp,
  updateArmorType,
  updateArmorValue,
  updateArmorAbilityKey,
  updateShieldValue,
  updateSpeedBonus,
  updateInitiativeBonus,
  updatePassivePerceptionBonus,
  updateSavingThrowExtras,
  addAttack,
  removeAttack,
  updateAttack,
} = combat

const { toggleLearnedSpell, togglePreparedSpell } = spells

const { addFeature, removeFeature, updateFeature } = features
</script>
