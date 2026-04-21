<template>
  <section aria-labelledby="section-attacks">
    <div class="mb-4 flex items-center justify-between">
      <h2 id="section-attacks" class="font-display text-lg font-bold text-content">自訂攻擊</h2>
      <Button size="sm" :radius="4" outline @click="emit('add')"> + 新增攻擊 </Button>
    </div>

    <div v-if="attacks.length === 0" class="py-4 text-center text-sm text-content-muted">
      尚無自訂攻擊
    </div>

    <ul v-else class="space-y-3">
      <li
        v-for="attack in attacks"
        :key="attack.id"
        class="flex flex-col gap-3 rounded-lg border border-border-soft bg-surface p-3 sm:flex-row sm:items-end"
      >
        <div class="flex-1">
          <label :for="`attack-name-${attack.id}`" class="mb-1 block text-xs text-content">
            名稱
          </label>
          <CommonAppInput
            :id="`attack-name-${attack.id}`"
            class="w-full"
            :radius="0"
            :model-value="attack.name"
            size="sm"
            outline
            placeholder="武器名稱"
            @update:model-value="emit('update:attack', attack.id, 'name', $event)"
          />
        </div>

        <div class="w-full sm:w-20">
          <label :for="`attack-hit-${attack.id}`" class="mb-1 block text-xs text-content">
            命中
          </label>
          <CommonAppInput
            :id="`attack-hit-${attack.id}`"
            class="w-full"
            :radius="0"
            :model-value="attack.hitBonus != null ? String(attack.hitBonus) : ''"
            type="number"
            size="sm"
            outline
            placeholder="+0"
            @update:model-value="
              emit('update:attack', attack.id, 'hitBonus', $event ? Number($event) : null)
            "
          />
        </div>

        <div class="w-full sm:w-28">
          <label :for="`attack-damage-${attack.id}`" class="mb-1 block text-xs text-content">
            傷害
          </label>
          <CommonAppInput
            :id="`attack-damage-${attack.id}`"
            class="w-full"
            :radius="0"
            :model-value="attack.damage"
            size="sm"
            outline
            placeholder="1d8+3"
            @update:model-value="emit('update:attack', attack.id, 'damage', $event)"
          />
        </div>

        <div class="w-full sm:w-28">
          <label :for="`attack-mod-${attack.id}`" class="mb-1 block text-xs text-content">
            加值
          </label>
          <CommonAppInput
            :id="`attack-mod-${attack.id}`"
            class="w-full"
            :radius="0"
            :model-value="attack.modifier"
            size="sm"
            outline
            placeholder="備註"
            @update:model-value="emit('update:attack', attack.id, 'modifier', $event)"
          />
        </div>

        <Button
          size="sm"
          :radius="4"
          outline
          bg-color="var(--color-danger)"
          text-color="var(--color-danger)"
          aria-label="刪除攻擊"
          @click="emit('remove', attack.id)"
        >
          刪除
        </Button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@ui'
import type { AttackEntry } from '~/types/business/character'

defineProps<{
  attacks: AttackEntry[]
}>()

const emit = defineEmits<{
  add: []
  remove: [id: string]
  'update:attack': [id: string, field: keyof AttackEntry, value: AttackEntry[keyof AttackEntry]]
}>()
</script>
