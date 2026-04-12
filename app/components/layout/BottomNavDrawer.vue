<template>
  <!-- Swipe-up hint above footer -->
  <div
    ref="hintRef"
    role="button"
    tabindex="0"
    :aria-expanded="isNavOpen"
    aria-haspopup="dialog"
    aria-label="向上滑動以開啟導覽選單"
    class="flex w-full cursor-pointer select-none flex-col items-center gap-1 border-t border-surface bg-panel-2 pb-1 pt-2 text-border transition-colors hover:text-border-strong focus-visible:outline-2 focus-visible:outline-ring"
    @click="toggleNav"
    @keydown.enter.prevent="toggleNav"
    @keydown.space.prevent="toggleNav"
  >
    <Icon name="swipe-up" class="w-24 animate-bounce" />
  </div>

  <!-- Scoped teleport target：讓 drawer 繼承此元素的 CSS custom property -->
  <div ref="drawerPortal" class="nav-drawer-portal" />

  <!-- Bottom Drawer -->
  <Drawer
    v-model="isNavOpen"
    placement="bottom"
    size="sm"
    :show-close-button="false"
    :teleport-to="drawerPortal ?? 'body'"
    bg-color="var(--rd--color-panel)"
    text-color="var(--rd--color-text)"
    border-color="var(--rd--color-border)"
  >
    <template #header>
      <div class="bg-panel-2 w-full py-1 text-center text-accent font-display">
        Embark On Your Adventure
      </div>
    </template>
    <nav aria-label="導覽" class="flex px-4 py-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-1 flex-col items-center gap-1.5 rounded-lg px-2 py-3 focus:outline-accent transition-colors duration-150"
        :class="isActive(item.to) ? 'text-accent' : 'text-content-muted hover:text-content'"
        @click="closeNav"
      >
        <Icon v-if="item.icon" :name="item.icon" :size="60" />
        <span class="text-sm mt-1 font-medium tracking-wide">{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </Drawer>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import { Drawer, Icon } from '@ui'
import { useNavigation } from '~/composables/ui/useNavigation'
import { useSwipeUpTrigger } from '~/composables/ui/useSwipeUpTrigger'

const { navItems, isNavOpen, toggleNav, closeNav } = useNavigation()

const hintRef = useTemplateRef<HTMLElement>('hintRef')
const drawerPortal = useTemplateRef<HTMLElement>('drawerPortal')
useSwipeUpTrigger(hintRef)

const route = useRoute()

function isActive(to: string): boolean {
  return route.path.startsWith(to)
}
</script>

<style scoped>
.nav-drawer-portal {
  --rui-drawer-header-padding: 0;
}
</style>
