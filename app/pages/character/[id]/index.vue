<template>
  <div class="mx-auto max-w-6xl px-4 pb-6">
    <CommonPageHeader title="Detail" :show-back="true">
      <template #actions>
        <NuxtLink
          v-if="character"
          :to="`/character/${character.id}/update`"
          class="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-content-soft transition-colors hover:bg-surface-2 hover:text-content"
        >
          編輯角色卡
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
        <Tab value="combat" disabled>
          <template #label>
            <span class="text-content">戰鬥速查</span>
          </template>
          <p class="py-8 text-center text-content-muted">（尚未開放）</p>
        </Tab>
      </Tabs>
    </div>

    <div v-else class="flex flex-col items-center gap-4 py-16">
      <p class="text-content-muted">找不到此角色</p>
      <NuxtLink
        to="/character"
        class="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-content-inverse transition-colors hover:bg-primary-hover"
      >
        返回角色列表
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Tab, Tabs } from '@ui'

useHead({ title: '角色卡詳情 | Rolling Dice' })

const activeTab = ref('profile')

const route = useRoute()
const characterStore = useCharacterStore()

const id = String(route.params.id)
const character = computed(() => characterStore.getById(id))
</script>
