<template>
  <div class="bg-canvas-elevated p-4 sm:p-6">
    <p v-if="pending" class="py-12 text-center text-content-muted">法術資料載入中…</p>
    <div v-else-if="error" class="flex flex-col items-center gap-3 py-12 text-center">
      <p class="text-danger">法術資料載入失敗</p>
      <Button size="sm" bg-color="var(--color-warning)" :radius="4" @click="refresh()">重試</Button>
    </div>
    <div v-else class="flex flex-col gap-6 md:flex-row md:items-start">
      <BusinessCharacterFormSpellsSpellBookPanel
        ref="spellBookRef"
        v-model:form-state="formState"
        class="min-w-0 md:flex-2"
      />

      <BusinessCharacterFormSpellsLearnedSpellList
        :learned-spell-ids="formState.learnedSpells"
        class="min-w-0 md:sticky md:top-4 md:flex-1"
        @select="onSelectLearned"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@ui'
import type { CharacterUpdateFormState } from '~/types/business/character'

const formState = defineModel<CharacterUpdateFormState>('formState', { required: true })

const { pending, error, refresh } = useSpells()

const spellBookRef = ref<{ focusSpell: (id: string) => Promise<void> } | null>(null)

const onSelectLearned = (id: string): void => {
  spellBookRef.value?.focusSpell(id)
}
</script>
