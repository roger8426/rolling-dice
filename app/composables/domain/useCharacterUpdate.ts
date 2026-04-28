import { ABILITY_KEYS, POINT_BUY_DEFAULT_SCORE } from '~/constants/dnd'
import { DEFAULT_CURRENCY } from '~/constants/inventory'
import { createDefaultArmorClass } from '~/helpers/character'
import type {
  AttackDraft,
  Character,
  CharacterUpdateFormState,
  FeatureDraft,
} from '~/types/business/character'
import type { AbilityKey, ArmorType } from '~/types/business/dnd'

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
    speedBonus: character.speedBonus,
    initiativeBonus: character.initiativeBonus,
    passivePerceptionBonus: character.passivePerceptionBonus,
    extraHp: character.extraHp,
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
    speedBonus: null,
    initiativeBonus: null,
    passivePerceptionBonus: null,
    extraHp: 0,
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

  const core = useCharacterFormCore(formState)
  const derived = useCharacterDerivedStats(formState)

  // ─── Abilities ────────────────────────────────────────────────────────

  function updateBonusScore(key: AbilityKey, score: number): void {
    formState.abilities[key].bonusScore = score
  }

  // ─── Combat ───────────────────────────────────────────────────────────

  function updateExtraHp(value: number): void {
    formState.extraHp = value
  }

  function updateArmorType(type: ArmorType | null): void {
    formState.armorClass.type = type
  }

  function updateArmorValue(value: number | null): void {
    formState.armorClass.value = value
  }

  function updateArmorAbilityKey(abilityKey: AbilityKey | null): void {
    formState.armorClass.abilityKey = abilityKey
  }

  function updateShieldValue(value: number): void {
    formState.armorClass.shieldValue = value
  }

  function updateSpeedBonus(value: number | null): void {
    formState.speedBonus = value
  }

  function updateInitiativeBonus(value: number | null): void {
    formState.initiativeBonus = value
  }

  function updatePassivePerceptionBonus(value: number | null): void {
    formState.passivePerceptionBonus = value
  }

  function updateSavingThrowExtras(value: AbilityKey[]): void {
    formState.savingThrowExtras = value
  }

  function addAttack(entry: AttackDraft): void {
    formState.attacks.push({ id: crypto.randomUUID(), ...entry })
  }

  function removeAttack(id: string): void {
    const index = formState.attacks.findIndex((a) => a.id === id)
    if (index !== -1) formState.attacks.splice(index, 1)
  }

  function updateAttack(id: string, data: AttackDraft): void {
    const index = formState.attacks.findIndex((a) => a.id === id)
    if (index !== -1) formState.attacks[index] = { id, ...data }
  }

  // ─── Spells ───────────────────────────────────────────────────────────

  function toggleLearnedSpell(name: string): void {
    const index = formState.learnedSpells.indexOf(name)
    if (index === -1) {
      formState.learnedSpells.push(name)
      return
    }
    formState.learnedSpells.splice(index, 1)
    const preparedIndex = formState.preparedSpells.indexOf(name)
    if (preparedIndex !== -1) formState.preparedSpells.splice(preparedIndex, 1)
  }

  function togglePreparedSpell(name: string): void {
    if (!formState.learnedSpells.includes(name)) return
    const index = formState.preparedSpells.indexOf(name)
    if (index === -1) {
      formState.preparedSpells.push(name)
    } else {
      formState.preparedSpells.splice(index, 1)
    }
  }

  // ─── Features ─────────────────────────────────────────────────────────

  function addFeature(draft: FeatureDraft): void {
    formState.features.push({ id: crypto.randomUUID(), ...draft, usage: { ...draft.usage } })
  }

  function removeFeature(id: string): void {
    const index = formState.features.findIndex((f) => f.id === id)
    if (index !== -1) formState.features.splice(index, 1)
  }

  function updateFeature(id: string, draft: FeatureDraft): void {
    const index = formState.features.findIndex((f) => f.id === id)
    if (index !== -1) {
      formState.features[index] = { id, ...draft, usage: { ...draft.usage } }
    }
  }

  // ─── Submit ───────────────────────────────────────────────────────────

  const logger = createLogger('[CharacterUpdate]')

  async function submit(): Promise<void> {
    if (!core.canSubmit.value) return
    core.isSubmitting.value = true
    try {
      const updated = store.updateCharacter(id, formState)
      if (!updated) {
        useToast().error('儲存失敗，請稍後再試')
        core.isSubmitting.value = false
        return
      }
      await navigateTo(`/character/${id}`)
    } catch (error) {
      logger.error('submit failed:', error)
      useToast().error('儲存失敗，請稍後再試')
      core.isSubmitting.value = false
    }
  }

  return {
    activeTab,
    character,
    formState,
    core,
    derived,

    abilities: {
      updateBonusScore,
    },

    combat: {
      updateExtraHp,
      updateArmorType,
      updateArmorValue,
      updateArmorAbilityKey,
      updateShieldValue,
      updateSpeedBonus,
      updateInitiativeBonus,
      updatePassivePerceptionBonus,
      updateSavingThrowExtras,
      addAttack,
      removeAttack,
      updateAttack,
    },

    spells: {
      toggleLearnedSpell,
      togglePreparedSpell,
    },

    features: {
      addFeature,
      removeFeature,
      updateFeature,
    },

    submit,
  }
}
