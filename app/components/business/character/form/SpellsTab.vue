<template>
  <div class="bg-canvas-elevated p-4 sm:p-6">
    <p v-if="pending" class="py-12 text-center text-content-muted">法術資料載入中…</p>
    <div v-else-if="error" class="flex flex-col items-center gap-3 py-12 text-center">
      <p class="text-danger">法術資料載入失敗</p>
      <Button size="sm" :radius="4" @click="refresh()">重試</Button>
    </div>
    <div v-else class="flex flex-col gap-6 md:flex-row md:items-start">
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
  </div>
</template>

<script setup lang="ts">
import { Button } from '@ui'
defineProps<{
  learnedSpells: string[]
  preparedSpells: string[]
}>()

const emit = defineEmits<{
  toggleLearned: [id: string]
  togglePrepared: [id: string]
}>()

const { pending, error, refresh } = useSpells()
</script>
