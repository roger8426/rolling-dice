<template>
  <section aria-labelledby="section-attacks">
    <h2 id="section-attacks" class="mb-4 font-display text-lg font-bold text-content">攻擊模組</h2>

    <ul class="space-y-2">
      <li
        v-for="attack in attacks"
        :key="attack.id"
        class="flex items-center justify-between rounded-lg border border-border-soft bg-surface px-3 py-2"
      >
        <div>
          <p class="text-sm font-semibold text-content">{{ attack.name || '（未命名）' }}</p>
          <p class="mt-0.5 text-xs text-content-muted">
            命中
            <span class="font-bold" :class="hitBonusColor(attack)">
              {{ formatModifier(computedHit(attack)) }}
            </span>
            <span class="mx-1.5">·</span>
            傷害 {{ formatDamageSummary(attack) }}
          </p>
        </div>
        <div class="flex shrink-0 gap-1">
          <button
            type="button"
            :aria-label="`編輯 ${attack.name || '此攻擊'}`"
            class="flex size-8 items-center justify-center rounded-md text-content-muted transition-colors duration-150 hover:bg-surface-raised hover:text-content"
            @click="openEdit(attack)"
          >
            <Icon name="edit" :size="16" />
          </button>
          <button
            type="button"
            :aria-label="`刪除 ${attack.name || '此攻擊'}`"
            class="flex size-8 items-center justify-center rounded-md text-content-muted transition-colors duration-150 hover:text-danger-hover"
            @click="emit('remove', attack.id)"
          >
            <Icon name="trash" :size="16" />
          </button>
        </div>
      </li>

      <!-- 新增攻擊佔位卡片 -->
      <li>
        <button
          type="button"
          aria-label="新增攻擊"
          class="flex w-full items-center justify-center rounded-lg border border-dashed border-border-soft py-4 text-content-muted transition-colors duration-150 hover:border-border hover:bg-surface hover:text-content"
          @click="openCreate"
        >
          <span class="text-xl leading-none">+</span>
        </button>
      </li>
    </ul>
  </section>

  <!-- 新增 / 編輯 攻擊 Modal -->
  <Modal
    v-model="modalOpen"
    :title="`${editingId ? '編輯' : '新增'}攻擊模組`"
    size="md"
    bg-color="var(--color-canvas-elevated)"
    text-color="var(--color-content)"
    border-color="var(--color-border)"
  >
    <div class="space-y-5">
      <!-- 第一列：名稱 / 屬性 / 額外命中加值 -->
      <div class="flex items-end gap-3">
        <div class="flex-1">
          <label for="attack-modal-name" class="mb-1 block text-xs text-content">名稱</label>
          <CommonAppInput
            id="attack-modal-name"
            :radius="0"
            :model-value="draft.name"
            size="sm"
            outline
            class="w-full"
            @update:model-value="draft.name = $event"
          />
        </div>
        <div>
          <label for="attack-modal-ability" class="mb-1 block text-xs text-content">屬性</label>
          <CommonAppSelect
            id="attack-modal-ability"
            :model-value="draft.abilityKey"
            :options="abilityOptions"
            size="sm"
            placeholder="選擇屬性"
            class="w-28"
            @update:model-value="draft.abilityKey = ($event as AbilityKey | '') ?? ''"
          />
        </div>
        <div>
          <label for="attack-modal-extra-hit" class="mb-1 block text-xs text-content">
            額外命中
          </label>
          <CommonAppInput
            id="attack-modal-extra-hit"
            :radius="0"
            :model-value="draft.extraHitBonus != null ? String(draft.extraHitBonus) : ''"
            type="number"
            size="sm"
            outline
            placeholder="0"
            class="w-16"
            @update:model-value="draft.extraHitBonus = $event ? Number($event) : null"
          />
        </div>
      </div>

      <!-- 第二列：傷害骰（d4～d12）/ 額外傷害加值 -->
      <div class="flex items-end gap-3">
        <div v-for="die in DIE_TYPES" :key="die" class="flex flex-col items-center gap-1">
          <span class="font-mono text-xs text-content">{{ die }}</span>
          <CommonAppInput
            :radius="0"
            :model-value="draft.damageDice[die] > 0 ? String(draft.damageDice[die]) : ''"
            type="number"
            size="sm"
            outline
            placeholder="0"
            class="w-12"
            @update:model-value="draft.damageDice[die] = Number($event) || 0"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="attack-modal-extra-damage" class="text-xs text-content">額外傷害</label>
          <CommonAppInput
            id="attack-modal-extra-damage"
            :radius="0"
            :model-value="draft.extraDamageBonus != null ? String(draft.extraDamageBonus) : ''"
            type="number"
            size="sm"
            outline
            placeholder="0"
            class="w-14"
            @update:model-value="draft.extraDamageBonus = $event ? Number($event) : null"
          />
        </div>
      </div>

      <!-- 第三列：計算結果預覽 -->
      <div class="flex gap-6 rounded-lg border border-border-soft bg-canvas px-4 py-3">
        <div class="flex items-center gap-2">
          <span class="text-xs text-content-muted">命中</span>
          <span class="text-sm font-bold" :class="draftHitColor">
            {{ formatModifier(draftHit) }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-content-muted">傷害</span>
          <span class="text-sm font-bold text-content">{{ formatDamageSummary(draft) }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <Button :radius="4" bg-color="var(--color-primary)" @click="saveAttack"> 確認 </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Modal, Button, Icon } from '@ui'
import type { SelectOption } from '@ui'
import type { AbilityScores, AttackEntry } from '~/types/business/character'
import type { AbilityKey, DamageDieType } from '~/types/business/dnd'
import { ABILITY_NAMES } from '~/constants/dnd'

const props = defineProps<{
  attacks: AttackEntry[]
  abilityScores: AbilityScores
  proficiencyBonus: number
}>()

const emit = defineEmits<{
  add: [entry: Omit<AttackEntry, 'id'>]
  remove: [id: string]
  'update:attack': [id: string, data: Omit<AttackEntry, 'id'>]
}>()

// ─── 常數 ─────────────────────────────────────────────────────────────────────

const DIE_TYPES: DamageDieType[] = ['d4', 'd6', 'd8', 'd10', 'd12']

const abilityOptions: SelectOption[] = [
  { value: '', label: '—' },
  ...Object.entries(ABILITY_NAMES).map(([value, label]) => ({ value, label })),
]

// ─── Modal 狀態 ───────────────────────────────────────────────────────────────

const modalOpen = ref(false)
const editingId = ref<string | null>(null)

function createEmptyDraft(): Omit<AttackEntry, 'id'> {
  return {
    name: '',
    abilityKey: '',
    damageDice: { d4: 0, d6: 0, d8: 0, d10: 0, d12: 0 },
    extraHitBonus: null,
    extraDamageBonus: null,
  }
}

const draft = ref<Omit<AttackEntry, 'id'>>(createEmptyDraft())

function openCreate() {
  editingId.value = null
  draft.value = createEmptyDraft()
  modalOpen.value = true
}

function openEdit(attack: AttackEntry) {
  editingId.value = attack.id
  draft.value = {
    name: attack.name,
    abilityKey: attack.abilityKey,
    damageDice: { ...attack.damageDice },
    extraHitBonus: attack.extraHitBonus,
    extraDamageBonus: attack.extraDamageBonus,
  }
  modalOpen.value = true
}

function saveAttack() {
  const entry = { ...draft.value, damageDice: { ...draft.value.damageDice } }
  if (editingId.value) {
    emit('update:attack', editingId.value, entry)
  } else {
    emit('add', entry)
  }
  modalOpen.value = false
}

// ─── Draft 計算預覽 ───────────────────────────────────────────────────────────

const draftHit = computed(() => {
  const abilityMod = draft.value.abilityKey
    ? getAbilityModifier(props.abilityScores[draft.value.abilityKey])
    : 0
  return abilityMod + props.proficiencyBonus + (draft.value.extraHitBonus ?? 0)
})

const draftHitColor = computed(() => {
  const v = draftHit.value
  if (v > 0) return 'text-success'
  if (v < 0) return 'text-danger'
  return 'text-content-muted'
})

// ─── 列表顯示計算 ─────────────────────────────────────────────────────────────

function computedHit(attack: AttackEntry): number {
  const abilityMod = attack.abilityKey
    ? getAbilityModifier(props.abilityScores[attack.abilityKey])
    : 0
  return abilityMod + props.proficiencyBonus + (attack.extraHitBonus ?? 0)
}

function hitBonusColor(attack: AttackEntry): string {
  const v = computedHit(attack)
  if (v > 0) return 'text-success'
  if (v < 0) return 'text-danger'
  return 'text-content-muted'
}

function formatDamageSummary(attack: Omit<AttackEntry, 'id'>): string {
  const parts = DIE_TYPES.filter((die) => attack.damageDice[die] > 0).map(
    (die, index) => `${index > 0 ? '+' : ''}${attack.damageDice[die]}${die}`,
  )
  if (attack.extraDamageBonus) {
    parts.push(
      attack.extraDamageBonus > 0 ? `+${attack.extraDamageBonus}` : String(attack.extraDamageBonus),
    )
  }
  return parts.join(' ') || '—'
}
</script>
