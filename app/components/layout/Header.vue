<template>
  <header class="sticky top-0 z-50 border-b border-surface bg-panel">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-3 text-lg font-bold tracking-wider text-content transition-colors hover:text-accent"
        aria-label="Rolling Dice"
      >
        <img src="../../assets/images/dnd.png" alt="Dungeons & Dragons" class="w-16" />
        <h1 class="font-display">Rolling Dice</h1>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="hidden items-center gap-1 md:flex h-full" aria-label="navbar">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex h-full items-center border-b-2 border-b-transparent px-3 font-medium text-content-soft transition-all [&:not(.router-link-exact-active)]:hover:scale-105 [&:not(.router-link-exact-active)]:hover:text-accent [&.router-link-exact-active]:border-b-accent [&.router-link-exact-active]:text-content"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Mobile Hamburger -->
      <button
        class="flex items-center justify-center rounded p-2 text-content-soft transition-colors hover:bg-surface hover:text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring md:hidden"
        :aria-expanded="isMobileMenuOpen"
        aria-label="menu"
        aria-controls="mobile-menu"
        type="button"
        @click="toggleMobileMenu"
      >
        <Icon :name="isMobileMenuOpen ? 'close' : 'list'" :size="22" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Icon } from '@ui'
import { useNavigation } from '~/composables/ui/useNavigation'

const { navItems, isMobileMenuOpen, toggleMobileMenu } = useNavigation()
</script>
