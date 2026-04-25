<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title?: string) => (title ? `${title} | Rolling Dice` : 'Rolling Dice'),
})
</script>
