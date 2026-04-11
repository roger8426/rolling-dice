<template>
  <div class="mx-auto max-w-6xl px-4 pb-6">
    <!-- Page header -->
    <PageHeader title="Characters" show-back />

    <!-- Character grid -->
    <div
      v-if="characterStore.characters.length > 0"
      class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6"
    >
      <CharacterCard
        v-for="character in characterStore.characters"
        :key="character.id"
        :character="character"
      />
    </div>

    <!-- Empty state -->
    <NuxtLink
      v-else
      to="/character/build"
      class="group relative flex min-h-[60dvh] cursor-pointer select-none flex-col items-center justify-center overflow-hidden rounded-xl border border-border text-center transition-transform duration-200 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      aria-label="建立角色卡"
    >
      <!-- Background image -->
      <div class="absolute inset-0 bg-cover bg-center" aria-hidden="true" />
      <div
        class="absolute inset-0 bg-[rgba(19,16,17,0.8)] transition-opacity duration-200 group-hover:opacity-75"
        aria-hidden="true"
      />

      <!-- Content -->
      <div class="relative z-10 px-6 py-12 text-content-muted">
        <p class="font-display text-5xl text-content-faint" aria-hidden="true">⚔</p>
        <h2 class="mt-4 font-display text-2xl font-bold text-content">尚無角色卡</h2>
        <p class="mt-2 text-sm">一場偉大的冒險，往往從踏出第一步開始</p>
        <p
          class="mt-4 inline-block transition-[transform,color] duration-200 text-success group-hover:text-success-hover"
        >
          <Icon name="plus" :size="40" />
        </p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue'
import { Icon } from '@ui'

useHead({ title: '角色卡 | Rolling Dice' })

const characterStore = useCharacterStore()
</script>
