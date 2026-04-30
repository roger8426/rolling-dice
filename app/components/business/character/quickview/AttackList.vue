<template>
  <section aria-labelledby="quickview-attacks-label">
    <h3 id="quickview-attacks-label" class="mb-2 font-display text-sm font-bold text-content">
      攻擊模組
    </h3>
    <p v-if="attacks.length === 0" class="py-6 text-center text-sm text-content-muted">
      尚未設定任何攻擊
    </p>
    <ul v-else class="space-y-2">
      <li
        v-for="attack in attacks"
        :key="attack.id"
        class="rounded-lg border border-border-soft bg-surface px-3 py-2"
      >
        <p class="text-sm font-semibold text-content">{{ attack.name || '（未命名）' }}</p>
        <p class="mt-0.5 text-xs text-content-muted">
          命中
          <span
            class="font-bold"
            :class="getHitBonusColorClass(getAttackHit(attack, abilityScores, proficiencyBonus))"
          >
            {{ formatModifier(getAttackHit(attack, abilityScores, proficiencyBonus)) }}
          </span>
          <span class="mx-1.5">·</span>
          傷害 {{ formatDamageSummary(attack) }}
        </p>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { TotalAbilityScores, AttackEntry } from '~/types/business/character'

defineProps<{
  attacks: AttackEntry[]
  abilityScores: TotalAbilityScores
  proficiencyBonus: number
}>()
</script>
