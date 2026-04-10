<template>
  <!-- Swipe-up hint above footer -->
  <div
    ref="hintRef"
    role="button"
    tabindex="0"
    :aria-expanded="isNavOpen"
    aria-haspopup="dialog"
    aria-label="向上滑動以開啟導覽選單"
    class="flex w-full cursor-pointer select-none flex-col items-center gap-1 border-t border-surface bg-panel pb-1 pt-2 text-border transition-colors hover:text-border-strong focus-visible:outline-2 focus-visible:outline-ring"
    @click="toggleNav"
    @keydown.enter.prevent="toggleNav"
    @keydown.space.prevent="toggleNav"
  >
    <Icon name="swipe-up" class="w-24 animate-bounce" />
  </div>

  <!-- Bottom Drawer -->
  <Drawer
    v-model="isNavOpen"
    placement="bottom"
    size="sm"
    :show-close-button="false"
    bg-color="var(--rd--color-panel)"
    text-color="var(--rd--color-text)"
    border-color="var(--rd--color-border)"
  >
    <nav aria-label="導覽" class="flex flex-col gap-1 pt-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="rounded px-3 py-2.5 text-sm font-medium text-content-soft transition-colors hover:bg-surface hover:text-content"
        active-class="bg-surface text-content"
        @click="closeNav"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
  </Drawer>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Drawer, Icon } from '@ui'
import { useNavigation } from '~/composables/ui/useNavigation'
import { useSwipeUpTrigger } from '~/composables/ui/useSwipeUpTrigger'

const { navItems, isNavOpen, toggleNav, closeNav } = useNavigation()

const hintRef = useTemplateRef<HTMLElement>('hintRef')
useSwipeUpTrigger(hintRef)
</script>
