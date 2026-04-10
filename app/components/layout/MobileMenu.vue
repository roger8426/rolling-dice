<template>
  <Drawer
    id="mobile-menu"
    v-model="isMobileMenuOpen"
    placement="left"
    size="md"
    bg-color="var(--rd--color-panel)"
    text-color="var(--rd--color-text)"
    border-color="var(--rd--color-border)"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <span class="text-base font-bold tracking-wider text-content">
          <span class="text-primary">⚂</span> Rolling Dice
        </span>
      </div>
    </template>

    <nav aria-label="行動版導覽" class="flex flex-col gap-1 pt-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="rounded px-3 py-2.5 text-sm font-medium text-content-soft transition-colors hover:bg-surface hover:text-content"
        active-class="bg-surface text-content"
        @click="closeMobileMenu"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
  </Drawer>
</template>

<script setup lang="ts">
import { Drawer } from '@ui'
import { useNavigation } from '~/composables/ui/useNavigation'

const { navItems, isMobileMenuOpen, closeMobileMenu } = useNavigation()
</script>
