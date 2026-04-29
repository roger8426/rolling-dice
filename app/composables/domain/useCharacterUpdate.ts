import { ABILITY_KEYS, POINT_BUY_DEFAULT_SCORE } from '~/constants/dnd'
import { DEFAULT_CURRENCY } from '~/constants/inventory'
import { createDefaultArmorClass } from '~/helpers/character'
import type { Character, CharacterUpdateFormState } from '~/types/business/character'

export type UpdateTab = 'basic' | 'profile' | 'combat' | 'spells' | 'features' | 'backpack'

// ─── Form State Factories ─────────────────────────────────────────────────────

function characterToFormState(character: Character): CharacterUpdateFormState {
  return {
    id: character.id,
    name: character.name,
    gender: character.gender,
    race: character.race,
    alignment: character.alignment,
    professions: character.professions.map((p) => ({ profession: p.profession, level: p.level })),
    abilities: Object.fromEntries(
      ABILITY_KEYS.map((key) => [
        key,
        {
          basicScore: character.abilities[key].basicScore,
          bonusScore: character.abilities[key].bonusScore,
        },
      ]),
    ) as CharacterUpdateFormState['abilities'],
    savingThrowExtras: [...(character.savingThrowExtras ?? [])],
    skills: { ...character.skills },
    background: character.background,
    isJackOfAllTrades: character.isJackOfAllTrades,
    isTough: character.isTough,
    faith: character.faith,
    age: character.age,
    height: character.height,
    weight: character.weight,
    appearance: character.appearance,
    story: character.story,
    languages: character.languages,
    tools: character.tools,
    weaponProficiencies: character.weaponProficiencies,
    armorProficiencies: character.armorProficiencies,
    armorClass: { ...character.armorClass },
    speedBonus: character.speedBonus ?? 0,
    initiativeBonus: character.initiativeBonus ?? 0,
    passivePerceptionBonus: character.passivePerceptionBonus ?? 0,
    customHpBonus: character.customHpBonus,
    attacks: character.attacks.map((a) => ({
      ...a,
      damageDice: a.damageDice.map((e) => ({ ...e })),
    })),
    learnedSpells: [...character.learnedSpells],
    preparedSpells: [...character.preparedSpells],
    features: character.features.map((f) => ({ ...f, usage: { ...f.usage } })),
    items: character.items.map((i) => ({ ...i })),
    currency: { ...character.currency },
  }
}

function createEmptyUpdateFormState(): CharacterUpdateFormState {
  return {
    id: '',
    name: '',
    gender: null,
    race: null,
    alignment: null,
    professions: [{ profession: null, level: 1 }],
    abilities: Object.fromEntries(
      ABILITY_KEYS.map((key) => [key, { basicScore: POINT_BUY_DEFAULT_SCORE, bonusScore: 0 }]),
    ) as CharacterUpdateFormState['abilities'],
    savingThrowExtras: [],
    skills: {},
    background: null,
    isJackOfAllTrades: false,
    isTough: false,
    faith: null,
    age: null,
    height: null,
    weight: null,
    appearance: null,
    story: null,
    languages: null,
    tools: null,
    weaponProficiencies: null,
    armorProficiencies: null,
    armorClass: createDefaultArmorClass(),
    speedBonus: 0,
    initiativeBonus: 0,
    passivePerceptionBonus: 0,
    customHpBonus: 0,
    attacks: [],
    learnedSpells: [],
    preparedSpells: [],
    features: [],
    items: [],
    currency: { ...DEFAULT_CURRENCY },
  }
}

export function useCharacterUpdate(id: string) {
  const store = useCharacterStore()
  const activeTab = ref<UpdateTab>('basic')

  const character = computed(() => store.getById(id))

  const formState = reactive<CharacterUpdateFormState>(
    character.value ? characterToFormState(character.value) : createEmptyUpdateFormState(),
  )

  // ─── Sub-composables（對齊 CharacterStats / CharacterCapabilities sections） ──

  const derived = useCharacterDerivedStats(formState)
  const stats = useCharacterStatsForm(formState)
  const attacks = useCharacterAttacksForm(formState)
  const features = useCharacterFeaturesForm(formState)

  // ─── Submit guard ─────────────────────────────────────────────────────

  const isSubmitting = ref(false)

  const canSubmit = computed(
    () =>
      !isSubmitting.value &&
      formState.name.trim() !== '' &&
      formState.professions.some((p) => p.profession !== null),
  )

  // ─── Submit ───────────────────────────────────────────────────────────

  const logger = createLogger('[CharacterUpdate]')

  async function submit(): Promise<void> {
    if (!canSubmit.value) return
    isSubmitting.value = true
    try {
      const updated = store.updateCharacter(id, formState)
      if (!updated) {
        useToast().error('儲存失敗，請稍後再試')
        isSubmitting.value = false
        return
      }
      await navigateTo(`/character/${id}`)
    } catch (error) {
      logger.error('submit failed:', error)
      useToast().error('儲存失敗，請稍後再試')
      isSubmitting.value = false
    }
  }

  return {
    activeTab,
    character,
    formState,
    isSubmitting,
    canSubmit,
    derived,
    stats,
    attacks,
    features,
    submit,
  }
}
