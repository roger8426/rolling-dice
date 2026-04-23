<template>
  <div class="flex flex-col gap-6 bg-canvas-elevated p-4 sm:p-6 md:flex-row md:items-start">
    <BusinessCharacterFormSpellBookPanel
      class="min-w-0 md:flex-2"
      :learned-spells="learnedSpells"
      @toggle-learned="emit('toggleLearned', $event)"
    />

    <BusinessCharacterFormPreparedSpellPanel
      class="min-w-0 md:sticky md:top-4 md:flex-1"
      :learned-spells="learnedSpells"
      :prepared-spells="preparedSpells"
      @toggle-prepared="emit('togglePrepared', $event)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  learnedSpells: string[]
  preparedSpells: string[]
}>()

const emit = defineEmits<{
  toggleLearned: [name: string]
  togglePrepared: [name: string]
}>()
</script>
