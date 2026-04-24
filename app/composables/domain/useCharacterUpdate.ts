import { ABILITY_KEYS } from '~/constants/dnd'
import { createDefaultArmorClass } from '~/helpers/character'
import { applySkillProficiency } from '~/helpers/skill'
import type { AttackEntry, Character, CharacterUpdateFormState } from '~/types/business/character'
import type {
  AbilityKey,
  ArmorType,
  ProficiencyLevel,
  ProfessionKey,
  SkillKey,
} from '~/types/business/dnd'

export type UpdateTab = 'basic' | 'profile' | 'combat' | 'spells' | 'backpack'

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
    skills: { ...character.skills },
    background: character.background ?? null,
    isJackOfAllTrades: character.isJackOfAllTrades ?? false,
    isTough: character.isTough ?? false,
    faith: character.faith ?? null,
    age: character.age ?? null,
    height: character.height ?? null,
    weight: character.weight ?? null,
    appearance: character.appearance ?? null,
    story: character.story ?? null,
    languages: character.languages ?? null,
    tools: character.tools ?? null,
    weaponProficiencies: character.weaponProficiencies ?? null,
    armorProficiencies: character.armorProficiencies ?? null,
    armorClass: character.armorClass ? { ...character.armorClass } : createDefaultArmorClass(),
    speedBonus: character.speedBonus ?? null,
    initiativeBonus: character.initiativeBonus ?? null,
    passivePerceptionBonus: character.passivePerceptionBonus ?? null,
    extraHp: character.extraHp ?? 0,
    attacks: character.attacks?.map((a) => ({ ...a, damageDice: { ...a.damageDice } })) ?? [],
    learnedSpells: [...(character.learnedSpells ?? [])],
    preparedSpells: [...(character.preparedSpells ?? [])],
  }
}

export function useCharacterUpdate(id: string) {
  const store = useCharacterStore()
  const activeTab = ref<UpdateTab>('basic')

  const character = computed(() => store.getById(id))

  const formState = reactive<CharacterUpdateFormState>(
    character.value ? characterToFormState(character.value) : createEmptyUpdateFormState(),
  )

  // ─── Professions ──────────────────────────────────────────────────────

  const totalLevel = computed(() => formState.professions.reduce((sum, p) => sum + p.level, 0))

  function addProfession(): void {
    formState.professions.push({ profession: null, level: 1 })
  }

  function removeProfession(index: number): void {
    if (formState.professions.length <= 1) return
    formState.professions.splice(index, 1)
  }

  function updateProfession(index: number, key: ProfessionKey): void {
    if (formState.professions[index]) formState.professions[index].profession = key
  }

  function updateProfessionLevel(index: number, level: number): void {
    if (formState.professions[index]) formState.professions[index].level = level
  }

  // ─── Abilities ────────────────────────────────────────────────────────

  function updateBonusScore(key: AbilityKey, score: number): void {
    formState.abilities[key].bonusScore = score
  }

  // ─── Skills ───────────────────────────────────────────────────────────

  function setSkillProficiency(skill: SkillKey, level: ProficiencyLevel): void {
    formState.skills = applySkillProficiency(formState.skills, skill, level)
  }
  // ─── Combat ───────────────────────────────────────────────────────

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

  function addAttack(entry: Omit<AttackEntry, 'id'>): void {
    formState.attacks.push({ id: crypto.randomUUID(), ...entry })
  }

  function removeAttack(id: string): void {
    const index = formState.attacks.findIndex((a) => a.id === id)
    if (index !== -1) formState.attacks.splice(index, 1)
  }

  function updateAttack(id: string, data: Omit<AttackEntry, 'id'>): void {
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

  // ─── Derived Stats ────────────────────────────────────────────────────

  const derived = useCharacterDerivedStats(formState)

  // ─── Validation ───────────────────────────────────────────────────────

  const isSubmitting = ref(false)
  const canSubmit = computed(
    () =>
      !isSubmitting.value &&
      formState.name.trim() !== '' &&
      formState.professions.some((p) => p.profession !== null),
  )

  // ─── Submit ───────────────────────────────────────────────────────────

  function submit(): void {
    if (!canSubmit.value) return
    isSubmitting.value = true
    store.updateCharacter(id, formState)
    navigateTo(`/character/${id}`)
  }

  return {
    activeTab,
    character,
    formState,

    // professions
    totalLevel,
    addProfession,
    removeProfession,
    updateProfession,
    updateProfessionLevel,

    // abilities
    updateBonusScore,

    // skills
    setSkillProficiency,

    // combat
    updateExtraHp,
    updateArmorType,
    updateArmorValue,
    updateArmorAbilityKey,
    updateShieldValue,
    updateSpeedBonus,
    updateInitiativeBonus,
    updatePassivePerceptionBonus,
    addAttack,
    removeAttack,
    updateAttack,

    // spells
    toggleLearnedSpell,
    togglePreparedSpell,

    // derived
    derived,

    // validation
    canSubmit,

    // submit
    isSubmitting,
    submit,
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
      ABILITY_KEYS.map((key) => [key, { basicScore: 8, bonusScore: 0 }]),
    ) as CharacterUpdateFormState['abilities'],
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
  }
}
