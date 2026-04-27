<template>
  <div class="mx-auto max-w-6xl px-4 pb-6">
    <CommonPageHeader title="Character Detail" :show-back="true">
      <template #actions>
        <NuxtLink
          v-if="character"
          :to="`/character/${character.id}/update`"
          class="rounded-sm border border-border bg-surface py-2 w-20 text-center text-content-soft transition-colors hover:bg-surface-2 hover:text-content"
        >
          編輯
        </NuxtLink>
      </template>
    </CommonPageHeader>

    <div v-if="character">
      <Tabs
        v-model="activeTab"
        type="border"
        active-color="var(--color-canvas-elevated)"
        inactive-color="var(--color-canvas)"
        label="角色資訊"
      >
        <Tab value="profile">
          <template #label>
            <span class="text-content">角色詳情</span>
          </template>
          <BusinessCharacterDetailTab :character="character" />
        </Tab>
        <Tab value="combat">
          <template #label>
            <span class="text-content">戰鬥速查</span>
          </template>
          <BusinessCharacterCombatQuickView :character="character" />
        </Tab>
      </Tabs>
    </div>

    <CommonNotFound v-else message="找不到此角色" back-to="/character" back-label="返回角色列表" />
  </div>
</template>

<script setup lang="ts">
import { Tab, Tabs } from '@ui'

useHead({ title: '角色卡詳情' })

const activeTab = ref('profile')

const route = useRoute()
const characterStore = useCharacterStore()

const id = getRouteParam(route.params.id)
const character = computed(() => characterStore.getById(id))
</script>
