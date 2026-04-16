<template>
  <header class="sticky top-0 z-50 border-b border-surface bg-panel">
    <div class="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-3 text-lg font-bold tracking-wider text-content transition-colors hover:text-primary"
        aria-label="Rolling Dice"
      >
        <img src="~assets/images/dnd.png" alt="Dungeons & Dragons" class="w-16" />
        <h1 class="font-display text-xl">Rolling Dice</h1>
      </NuxtLink>
    </div>
  </header>
</template>
