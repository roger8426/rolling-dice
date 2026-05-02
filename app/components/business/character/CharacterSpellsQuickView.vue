<template>
  <div class="space-y-4 bg-canvas-elevated p-4">
    <p v-if="pending" class="py-12 text-center text-content-muted">法術資料載入中…</p>
    <div v-else-if="error" class="flex flex-col items-center gap-3 py-12 text-center">
      <p class="text-danger">法術資料載入失敗</p>
      <Button size="sm" bg-color="var(--color-warning)" :radius="4" @click="refresh()">
        重試
      </Button>
    </div>
    <BusinessCharacterQuickviewLearnedSpellAccordion v-else :character="character" />
  </div>
</template>

<script setup lang="ts">
import { Button } from '@ui'
import type { Character } from '~/types/business/character'

defineProps<{
  character: Character
}>()

const { pending, error, refresh } = useSpells()
</script>
