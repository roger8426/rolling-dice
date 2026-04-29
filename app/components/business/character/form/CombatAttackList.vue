<template>
  <section aria-labelledby="section-attacks">
    <h2 id="section-attacks" class="mb-4 font-display text-lg font-bold text-content">攻擊模組</h2>

    <ul class="space-y-2">
      <li
        v-for="attack in formState.attacks"
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
            @click="removeAttack(attack.id)"
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
            :model-value="draft.abilityKey ?? ''"
            :options="abilityOptions"
            size="sm"
            placeholder="選擇屬性"
            class="w-28"
            @update:model-value="draft.abilityKey = ($event || null) as AbilityKey | null"
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
            @update:model-value="draft.extraHitBonus = parseIntegerInput($event)"
          />
        </div>
      </div>

      <!-- 第二列：傷害骰多行 entries -->
      <div class="space-y-2">
        <span class="block text-xs text-content">傷害骰</span>
        <div
          v-for="(entry, index) in draft.damageDice"
          :key="entry.id"
          class="flex items-center gap-2"
        >
          <CommonAppInput
            :aria-label="`第 ${index + 1} 行骰數`"
            :radius="0"
            :model-value="entry.count > 0 ? String(entry.count) : ''"
            type="number"
            size="sm"
            outline
            placeholder="0"
            class="w-16"
            @update:model-value="entry.count = parseIntegerInput($event, 0)"
          />
          <CommonAppSelect
            :aria-label="`第 ${index + 1} 行骰面`"
            :model-value="entry.dieType ?? ''"
            :options="dieTypeOptions"
            size="sm"
            placeholder="—"
            class="w-20"
            @update:model-value="entry.dieType = ($event || null) as DamageDieType | null"
          />
          <CommonAppInput
            :aria-label="`第 ${index + 1} 行加值`"
            :radius="0"
            :model-value="entry.bonus != null ? String(entry.bonus) : ''"
            type="number"
            size="sm"
            outline
            placeholder="±0"
            class="w-16"
            @update:model-value="entry.bonus = parseIntegerInput($event)"
          />
          <CommonAppSelect
            :aria-label="`第 ${index + 1} 行傷害類型`"
            :model-value="entry.damageType ?? ''"
            :options="damageTypeOptions"
            size="sm"
            placeholder="—"
            class="flex-1"
            @update:model-value="entry.damageType = ($event || null) as DamageTypeKey | null"
          />
          <button
            type="button"
            :aria-label="`移除第 ${index + 1} 行`"
            class="flex size-8 shrink-0 items-center justify-center rounded-md text-content-muted transition-colors duration-150 hover:text-danger-hover"
            @click="removeDamageEntry(index)"
          >
            <Icon name="trash" :size="16" />
          </button>
        </div>
        <button
          type="button"
          aria-label="新增傷害行"
          class="flex w-full items-center justify-center rounded-lg border border-dashed border-border-soft py-2 text-content-muted transition-colors duration-150 hover:border-border hover:bg-surface hover:text-content"
          @click="addDamageEntry"
        >
          <span class="text-base leading-none">+ 新增傷害骰</span>
        </button>
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
      <Button
        :radius="4"
        :disabled="!draft.name.trim()"
        bg-color="var(--color-primary)"
        @click="saveAttack"
      >
        確認
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Modal, Button, Icon } from '@ui'
import type { SelectOption } from '@ui'
import type {
  AbilityScores,
  AttackDraft,
  AttackEntry,
  CharacterUpdateFormState,
  DamageDieEntry,
} from '~/types/business/character'
import type { AbilityKey, DamageDieType, DamageTypeKey } from '~/types/business/dnd'
import {
  ABILITY_NAMES,
  DAMAGE_DIE_TYPES,
  DAMAGE_TYPE_KEYS,
  DAMAGE_TYPE_LABELS,
} from '~/constants/dnd'

const formState = defineModel<CharacterUpdateFormState>('formState', { required: true })

const props = defineProps<{
  abilityScores: AbilityScores
  proficiencyBonus: number
}>()

const { addAttack, removeAttack, updateAttack } = useCharacterAttacksForm(formState.value)

const abilityOptions: SelectOption[] = [
  { value: '', label: '—' },
  ...Object.entries(ABILITY_NAMES).map(([value, label]) => ({ value, label })),
]

const dieTypeOptions: SelectOption[] = [
  { value: '', label: '—' },
  ...DAMAGE_DIE_TYPES.map((die) => ({ value: die, label: die })),
]

const damageTypeOptions: SelectOption[] = [
  { value: '', label: '—' },
  ...DAMAGE_TYPE_KEYS.map((key) => ({ value: key, label: DAMAGE_TYPE_LABELS[key] })),
]

// ─── Modal 狀態 ───────────────────────────────────────────────────────────────

const modalOpen = ref(false)
const editingId = ref<string | null>(null)

function createEmptyDraft(): AttackDraft {
  return {
    name: '',
    abilityKey: null,
    damageDice: [],
    extraHitBonus: null,
  }
}

function createDamageEntry(): DamageDieEntry {
  return { id: crypto.randomUUID(), dieType: null, count: 0, bonus: null, damageType: null }
}

function addDamageEntry(): void {
  draft.value.damageDice.push(createDamageEntry())
}

function removeDamageEntry(index: number): void {
  draft.value.damageDice.splice(index, 1)
}

const draft = ref<AttackDraft>(createEmptyDraft())

watch(modalOpen, (open) => {
  if (!open) {
    editingId.value = null
    draft.value = createEmptyDraft()
  }
})

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
    damageDice: attack.damageDice.map((entry) => ({ ...entry })),
    extraHitBonus: attack.extraHitBonus,
  }
  modalOpen.value = true
}

function saveAttack() {
  const entry: AttackDraft = {
    ...draft.value,
    damageDice: draft.value.damageDice.map((e) => ({ ...e })),
  }
  if (editingId.value) {
    updateAttack(editingId.value, entry)
  } else {
    addAttack(entry)
  }
  modalOpen.value = false
}

// ─── 計算預覽 ─────────────────────────────────────────────────────────────────

const draftHit = computed(() =>
  getAttackHit(draft.value, props.abilityScores, props.proficiencyBonus),
)
const draftHitColor = computed(() => getHitBonusColorClass(draftHit.value))

function computedHit(attack: AttackEntry): number {
  return getAttackHit(attack, props.abilityScores, props.proficiencyBonus)
}

function hitBonusColor(attack: AttackEntry): string {
  return getHitBonusColorClass(computedHit(attack))
}
</script>
