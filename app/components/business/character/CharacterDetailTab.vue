<template>
  <div class="space-y-8 bg-canvas-elevated p-4">
    <section class="flex items-start gap-8" aria-labelledby="section-basic">
      <div class="flex-1 flex flex-col gap-4">
        <!-- 角色資訊 -->
        <h2 id="section-basic" class="font-display text-lg font-bold text-content">角色資訊</h2>
        <dl class="grid grid-cols-5 gap-x-4 gap-y-3">
          <div>
            <dt class="text-xs text-content-muted">姓名</dt>
            <dd class="mt-0.5 text-sm text-content-soft">{{ character.name }}</dd>
          </div>
          <div>
            <dt class="text-xs text-content-muted">等級</dt>
            <dd class="mt-0.5 text-sm text-content-soft">{{ character.totalLevel }}</dd>
          </div>
          <div>
            <dt class="text-xs text-content-muted">性別</dt>
            <dd class="mt-0.5 text-sm text-content-soft">{{ GENDER_NAMES[character.gender] }}</dd>
          </div>
          <div>
            <dt class="text-xs text-content-muted">種族</dt>
            <dd class="mt-0.5 text-sm text-content-soft">{{ RACE_NAMES[character.race] }}</dd>
          </div>
          <div>
            <dt class="text-xs text-content-muted">背景</dt>
            <dd class="mt-0.5 text-sm text-content-soft">{{ character.background }}</dd>
          </div>
          <div>
            <dt class="text-xs text-content-muted">陣營</dt>
            <dd class="mt-0.5 text-sm text-content-soft">
              {{ ALIGNMENT_NAMES[character.alignment] }}
            </dd>
          </div>
          <div>
            <dt class="text-xs text-content-muted">信仰</dt>
            <dd class="mt-0.5 text-sm text-content-soft">{{ character.faith }}</dd>
          </div>
          <div>
            <dt class="text-xs text-content-muted">年齡</dt>
            <dd class="mt-0.5 text-sm text-content-soft">{{ character.age }}</dd>
          </div>
          <div>
            <dt class="text-xs text-content-muted">身高</dt>
            <dd class="mt-0.5 text-sm text-content-soft">{{ character.height }}</dd>
          </div>
          <div>
            <dt class="text-xs text-content-muted">體重</dt>
            <dd class="mt-0.5 text-sm text-content-soft">{{ character.weight }}</dd>
          </div>
        </dl>
        <!-- 熟練 -->
        <div class="flex flex-col gap-4">
          <h2 id="section-proficiencies" class="font-display text-lg font-bold text-content">
            熟練
          </h2>
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border-soft text-left text-xs text-content-muted">
                <th class="pb-2 font-normal">語言</th>
                <th class="pb-2 font-normal">工具</th>
                <th class="pb-2 font-normal">武器</th>
                <th class="pb-2 font-normal">護甲</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-border-soft">
                <td class="py-2 text-content-soft">{{ character.languages || '—' }}</td>
                <td class="py-2 text-content-soft">{{ character.tools || '—' }}</td>
                <td class="py-2 text-content-soft">—</td>
                <td class="py-2 text-content-soft">—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 職業資訊 -->
        <div class="flex flex-col gap-4 flex-1">
          <h2 id="section-professions" class="font-display text-lg font-bold text-content">職業</h2>
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border-soft text-left text-xs text-content-muted">
                <th class="pb-2 pr-4 font-normal">職業</th>
                <th class="pb-2 pr-4 font-normal text-right">等級</th>
                <th class="pb-2 pr-4 font-normal text-right">生命骰</th>
                <th class="pb-2 pr-4 font-normal text-right">生命值</th>
                <th class="pb-2 font-normal text-right">體質補正</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in classHpRows"
                :key="row.profession"
                class="border-b border-border-soft"
              >
                <td class="py-2 pr-4 text-content-soft">
                  <div class="flex items-center gap-1.5">
                    <img
                      v-if="professionImages[row.profession]"
                      :src="professionImages[row.profession]"
                      alt=""
                      class="size-4"
                      loading="lazy"
                      decoding="async"
                    />
                    {{ row.label }}
                  </div>
                </td>
                <td class="py-2 pr-4 text-right text-content-soft">{{ row.level }}</td>
                <td class="py-2 pr-4 text-right text-content-soft">d{{ row.hitDie }}</td>
                <td class="py-2 pr-4 text-right text-content-soft">{{ row.hp }}</td>
                <td class="py-2 text-right text-content-soft">
                  {{ formatModifier(row.conBonus) }}
                </td>
              </tr>
              <!-- 保留：其他 / 健壯 -->
              <tr class="border-b border-border-soft text-content-muted">
                <td class="py-2">其它</td>
                <td class="py-2 pr-4 text-right">—</td>
                <td class="py-2 pr-4 text-end">健壯</td>
                <td class="py-2 text-right" colspan="2">—</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="font-bold text-content">
                <td class="pt-2 pr-4">合計</td>
                <td class="pt-2 pr-4 text-right">{{ character.totalLevel }}</td>
                <td class="pt-2 pr-4 text-right">—</td>
                <td class="pt-2 text-right" colspan="2">{{ totalHp }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <!-- TODO: 頭像 / 角色圖像區塊，待實作 -->
      <div class="w-1/4 border border-primary h-100"></div>
    </section>

    <div class="flex gap-4">
      <section class="flex-1 w-1/2" aria-labelledby="section-abilities-saves">
        <!-- 屬性與豁免 -->
        <div class="flex flex-col gap-4">
          <h2 id="section-abilities-saves" class="font-display text-lg font-bold text-content">
            屬性與豁免
          </h2>
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="key in ABILITY_KEYS"
              :key="key"
              class="flex flex-col items-center rounded-lg border border-border-soft bg-surface p-3"
            >
              <span
                class="text-xs text-content-muted"
                :class="{ 'text-primary': character.savingThrowProficiencies.includes(key) }"
              >
                {{ ABILITY_NAMES[key] }}
              </span>
              <div class="flex items-center gap-2">
                <span class="mt-1 text-2xl font-bold text-content">
                  {{ getTotalScore(character.abilities[key]) }}
                </span>
                <span
                  class="text-sm"
                  :class="
                    modifierTextColor(getAbilityModifier(getTotalScore(character.abilities[key])))
                  "
                >
                  {{ formatModifier(getAbilityModifier(getTotalScore(character.abilities[key]))) }}
                </span>
              </div>
              <span class="text-xs text-content-soft mt-1">
                豁免
                <span :class="modifierTextColor(savingThrowBonuses[key])">
                  {{ formatModifier(savingThrowBonuses[key]) }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="flex-1 w-1/2" aria-labelledby="section-skills">
        <!-- 技能熟練 -->
        <h2 id="section-skills" class="mb-4 font-display text-lg font-bold text-content">
          技能熟練度
        </h2>
        <div class="grid grid-cols-2 grid-rows-9 grid-flow-col gap-x-6 gap-y-1">
          <div
            v-for="skill in skillList"
            :key="skill.key"
            class="flex items-center justify-between rounded px-3 py-1.5"
          >
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full" :class="proficiencyDotClass(skill.proficiency)" />
              <span class="text-sm text-content-soft"
                >{{ skill.name }}({{ skill.abilityName }})</span
              >
            </div>
            <span class="text-sm font-bold text-content">
              {{ formatModifier(skill.bonus) }}
            </span>
          </div>
        </div>
      </section>
    </div>

    <!-- ─── 背景故事 ─────────────────────────────────────────────────────── -->
    <section aria-labelledby="section-background">
      <h2 id="section-background" class="mb-4 font-display text-lg font-bold text-content">
        背景故事
      </h2>
      <div class="space-y-3">
        {{ character.story || '（無）' }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Character } from '~/types/business/character'
import type { AbilityKey, ProficiencyLevel, SkillKey } from '~/types/business/dnd'
import {
  ABILITY_KEYS,
  ABILITY_NAMES,
  ALIGNMENT_NAMES,
  GENDER_NAMES,
  PROFESSION_CONFIG,
  RACE_NAMES,
  SKILL_NAMES,
  SKILL_TO_ABILITY_MAP,
} from '~/constants/dnd'

const props = defineProps<{
  character: Character
}>()

const professionImages = getProfessionImages()

// ─── Ability Computed ──────────────────────────────────────────────────────

const conModifier = computed(() =>
  getAbilityModifier(getTotalScore(props.character.abilities.constitution)),
)

const classHpRows = computed(() =>
  props.character.professions.map((entry) => {
    const config = PROFESSION_CONFIG[entry.profession]
    const hp = getClassHitPoints(config.hitDie, entry.level)
    const conBonus = conModifier.value * entry.level
    return {
      profession: entry.profession,
      label: config.label,
      level: entry.level,
      hitDie: config.hitDie,
      hp,
      conBonus,
    }
  }),
)

const totalHp = computed(() =>
  classHpRows.value.reduce((sum, row) => sum + row.hp + row.conBonus, 0),
)

const proficiencyBonus = computed(() => getProficiencyBonus(props.character.totalLevel))

const savingThrowBonuses = computed(() => {
  const result = {} as Record<AbilityKey, number>
  for (const key of ABILITY_KEYS) {
    const mod = getAbilityModifier(getTotalScore(props.character.abilities[key]))
    const proficient = props.character.savingThrowProficiencies.includes(key)
    result[key] = getSavingThrowBonus(mod, proficient, proficiencyBonus.value)
  }
  return result
})

// ─── Skill Computed ────────────────────────────────────────────────────────

const skillList = computed(() => {
  const jackBonus = props.character.isJackOfAllTrades ? Math.floor(proficiencyBonus.value / 2) : 0
  return (Object.entries(SKILL_NAMES) as [SkillKey, string][]).map(([key, name]) => {
    const abilityKey = SKILL_TO_ABILITY_MAP[key]
    const mod = getAbilityModifier(getTotalScore(props.character.abilities[abilityKey]))
    const proficiency: ProficiencyLevel = props.character.skills[key] ?? 'none'
    const base = getSkillBonus(mod, proficiency, proficiencyBonus.value)
    const bonus = proficiency === 'none' ? base + jackBonus : base
    const abilityName = ABILITY_NAMES[abilityKey]
    return { key, name, proficiency, bonus, abilityName }
  })
})

const modifierTextColor = (value: number): string => {
  if (value > 0) return 'text-success'
  if (value < 0) return 'text-danger'
  return 'text-content-muted'
}

const proficiencyDotClass = (level: ProficiencyLevel): string => {
  if (level === 'expertise') return 'bg-primary'
  if (level === 'proficient') return 'bg-content-soft'
  return props.character.isJackOfAllTrades ? 'bg-success' : 'bg-border-soft'
}
</script>
