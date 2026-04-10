<template>
  <footer class="border-t border-surface bg-canvas-muted py-6">
    <div class="mx-auto flex max-w-7xl items-center justify-center px-4 sm:px-6">
      <p class="text-xs text-content-faint">Rolling Dice &copy; {{ currentYear }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
