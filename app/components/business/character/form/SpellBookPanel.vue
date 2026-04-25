<template>
  <section aria-labelledby="section-spellbook">
    <header class="mb-4 flex items-center justify-between">
      <h2 id="section-spellbook" class="font-display text-lg font-bold text-content">法術清單</h2>
      <span class="text-xs text-content-muted">
        已掌握 <span class="font-bold text-content">{{ learnedSpells.length }}</span> 個法術
      </span>
    </header>

    <!-- Filter bar -->
    <div class="mb-4 space-y-3 rounded-lg border border-border-soft bg-canvas p-3">
      <CommonAppInput
        :radius="0"
        :model-value="keywordInput"
        type="search"
        size="sm"
        outline
        placeholder="搜尋法術名稱"
        class="w-full"
        @update:model-value="onKeywordInput"
      />

      <div class="flex flex-wrap gap-2">
        <div>
          <label for="spell-filter-level" class="mb-1 block text-xs text-content">環數</label>
          <CommonAppSelect
            id="spell-filter-level"
            :model-value="filter.level"
            :options="levelOptions"
            size="sm"
            class="w-24"
            @update:model-value="filter.level = toFilterString($event)"
          />
        </div>
        <div>
          <label for="spell-filter-school" class="mb-1 block text-xs text-content">學派</label>
          <CommonAppSelect
            id="spell-filter-school"
            :model-value="filter.school"
            :options="schoolOptions"
            size="sm"
            class="w-24"
            @update:model-value="filter.school = toFilterString($event)"
          />
        </div>
      </div>

      <div class="flex flex-wrap gap-x-5 gap-y-2 text-xs text-content">
        <label class="inline-flex items-center gap-2">
          <Toggle
            :model-value="filter.ritual"
            size="sm"
            aria-label="只顯示儀式法術"
            @update:model-value="filter.ritual = $event"
          />
          儀式
        </label>
        <label class="inline-flex items-center gap-2">
          <Toggle
            :model-value="filter.concentration"
            size="sm"
            aria-label="只顯示需要專注的法術"
            @update:model-value="filter.concentration = $event"
          />
          專注
        </label>
      </div>
    </div>

    <!-- Body -->
    <p v-if="pending" class="py-8 text-center text-content-muted">法術資料載入中…</p>
    <p v-else-if="error" class="py-8 text-center text-danger">法術資料載入失敗</p>
    <p v-else-if="groupedSpells.length === 0" class="py-8 text-center text-content-muted">
      沒有符合條件的法術
    </p>
    <div v-else class="space-y-5">
      <div v-for="group in groupedSpells" :key="group.level">
        <div class="mb-2 flex items-center gap-2">
          <h3 class="font-display text-sm font-bold text-content">
            {{ formatSpellLevel(group.level) }}
          </h3>
          <span class="text-xs text-content-muted">{{ group.spells.length }} 個</span>
        </div>
        <Accordion multiple class="spell-accordion">
          <AccordionItem v-for="spell in group.spells" :key="spell.name" :value="spell.name">
            <template #title>
              <div class="flex flex-1 items-center gap-3">
                <span class="shrink-0" @click.stop>
                  <Checkbox
                    :model-value="isLearned(spell.name)"
                    size="sm"
                    :aria-label="`掌握 ${spell.name}`"
                    @update:model-value="emit('toggleLearned', spell.name)"
                  />
                </span>
                <div class="min-w-0 flex-1 text-left">
                  <div class="flex items-center gap-2">
                    <p class="truncate text-sm font-semibold text-content">{{ spell.name }}</p>
                    <div v-if="spell.ritual || spell.concentration" class="flex shrink-0 gap-1">
                      <Badge
                        v-if="spell.ritual"
                        size="sm"
                        bg-color="var(--color-info)"
                        text-color="var(--color-info-soft)"
                      >
                        儀式
                      </Badge>
                      <Badge
                        v-if="spell.concentration"
                        size="sm"
                        bg-color="var(--color-warning)"
                        text-color="var(--color-warning-soft)"
                      >
                        專注
                      </Badge>
                    </div>
                  </div>
                  <p class="mt-0.5 truncate text-xs text-content-muted">
                    {{ SPELL_SCHOOL_LABELS[spell.school] }}
                    <span class="mx-1">·</span>
                    {{ spell.castingTime }}
                    <span class="mx-1">·</span>
                    {{ spell.range }}
                  </p>
                </div>
              </div>
            </template>

            <dl class="space-y-1 text-sm text-content">
              <div class="flex gap-2">
                <dt class="w-16 shrink-0 text-content-muted">成分</dt>
                <dd>{{ formatSpellComponents(spell) }}</dd>
              </div>
              <div class="flex gap-2">
                <dt class="w-16 shrink-0 text-content-muted">持續時間</dt>
                <dd>{{ spell.duration }}</dd>
              </div>
              <div v-if="spell.material" class="flex gap-2">
                <dt class="w-16 shrink-0 text-content-muted">材料</dt>
                <dd>{{ spell.material }}</dd>
              </div>
              <div class="flex gap-2">
                <dt class="w-16 shrink-0 text-content-muted">描述</dt>
                <dd class="whitespace-pre-wrap">{{ spell.desc }}</dd>
              </div>
            </dl>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Accordion, AccordionItem, Badge, Checkbox, Toggle } from '@ui'
import type { SelectOption } from '@ui'
import { SPELL_SCHOOL_LABELS, SPELL_SCHOOLS } from '~/constants/dnd'
import type { Spell, SpellSchool } from '~/types/business/spell'

const props = defineProps<{
  learnedSpells: string[]
}>()

const emit = defineEmits<{
  toggleLearned: [name: string]
}>()

const { spells, pending, error } = useSpells()

// ─── Filter ─────────────────────────────────────────────────────────────────

interface SpellFilter {
  keyword: string
  level: string
  school: string
  ritual: boolean
  concentration: boolean
}

const filter = reactive<SpellFilter>({
  keyword: '',
  level: '',
  school: '',
  ritual: false,
  concentration: false,
})

const keywordInput = ref('')
const commitKeyword = debounce((value: string) => {
  filter.keyword = value
}, 250)

function onKeywordInput(value: string) {
  keywordInput.value = value
  commitKeyword(value)
}

onBeforeUnmount(() => commitKeyword.cancel())

/** 將 Select emit 的 `string | number | null` 收斂為 filter 用的字串 */
function toFilterString(value: string | number | null): string {
  return value == null ? '' : String(value)
}

const levelOptions: SelectOption[] = [
  { value: '', label: '全部' },
  { value: '0', label: '戲法' },
  ...Array.from({ length: 9 }, (_, i) => ({ value: String(i + 1), label: `${i + 1} 環` })),
]

const schoolOptions: SelectOption[] = [
  { value: '', label: '全部' },
  ...SPELL_SCHOOLS.map((key) => ({
    value: key,
    label: SPELL_SCHOOL_LABELS[key],
  })),
]

const filteredSpells = computed<Spell[]>(() => {
  const keyword = filter.keyword.trim().toLowerCase()
  const level = filter.level === '' ? null : Number(filter.level)
  const school = filter.school === '' ? null : (filter.school as SpellSchool)

  return spells.value.filter((s) => {
    if (keyword && !s.name.toLowerCase().includes(keyword)) return false
    if (level !== null && s.level !== level) return false
    if (school && s.school !== school) return false
    if (filter.ritual && !s.ritual) return false
    if (filter.concentration && !s.concentration) return false
    return true
  })
})

const groupedSpells = computed(() => groupSpellsByLevel(filteredSpells.value))

function isLearned(name: string): boolean {
  return props.learnedSpells.includes(name)
}
</script>

<style scoped>
.spell-accordion :deep(button:hover:not(:disabled)) {
  background-color: var(--color-info-soft);
}
</style>
