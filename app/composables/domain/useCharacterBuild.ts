import { ABILITY_KEYS, POINT_BUY_DEFAULT_SCORE } from '~/constants/dnd'
import { getRemainingPoints } from '~/helpers/ability'
import { applySkillProficiency } from '~/helpers/skill'
import type { AbilityMethod, AbilityScores, CharacterFormState } from '~/types/business/character'
import type { AbilityKey, ProficiencyLevel, ProfessionKey, SkillKey } from '~/types/business/dnd'

export type BuildTab = 'basic' | 'profile'

function createDefaultAbilities(): AbilityScores {
  return Object.fromEntries(
    ABILITY_KEYS.map((key) => [key, POINT_BUY_DEFAULT_SCORE]),
  ) as AbilityScores
}

function createDefaultFormState(): CharacterFormState {
  return {
    name: '',
    gender: null,
    race: null,
    alignment: null,
    professions: [{ profession: null, level: 1 }],
    abilities: createDefaultAbilities(),
    abilityMethod: 'custom',
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
  }
}

export function useCharacterBuild() {
  const store = useCharacterStore()
  const activeTab = ref<BuildTab>('basic')
  const formState = reactive<CharacterFormState>(createDefaultFormState())

  // ─── Dice Roll ────────────────────────────────────────────────────────

  function rollAbilityScore(): number {
    const rolls = rollDice(6, 4)
    const sorted = [...rolls].sort((a, b) => a - b)
    return sorted[1]! + sorted[2]! + sorted[3]!
  }

  function rollAllAbilities(): void {
    for (const key of ABILITY_KEYS) {
      formState.abilities[key] = rollAbilityScore()
    }
  }

  function resetAbilities(): void {
    formState.abilities = createDefaultAbilities()
  }

  // ─── Ability Method Switching ─────────────────────────────────────────

  function setAbilityMethod(method: AbilityMethod): void {
    formState.abilityMethod = method

    if (method === 'diceRoll') {
      rollAllAbilities()
    } else {
      formState.abilities = createDefaultAbilities()
    }
  }

  // ─── Point Buy ────────────────────────────────────────────────────────

  const pointBuyRemaining = computed(() => {
    if (formState.abilityMethod !== 'pointBuy') return 0
    return getRemainingPoints(formState.abilities)
  })

  // ─── Professions ──────────────────────────────────────────────────────

  const totalLevel = computed(() => formState.professions.reduce((sum, p) => sum + p.level, 0))

  function addProfession(): void {
    formState.professions.push({
      profession: null,
      level: 1,
    })
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

  function updateAbilityScore(key: AbilityKey, score: number): void {
    formState.abilities[key] = score
  }

  // ─── Skills ───────────────────────────────────────────────────────────

  function setSkillProficiency(skill: SkillKey, level: ProficiencyLevel): void {
    formState.skills = applySkillProficiency(formState.skills, skill, level)
  }

  // ─── Validation ───────────────────────────────────────────────────────

  const canSubmit = computed(
    () =>
      !isSubmitting.value &&
      formState.name.trim() !== '' &&
      formState.professions.some((p) => p.profession !== null),
  )

  // ─── Submit ───────────────────────────────────────────────────────────

  const isSubmitting = ref(false)

  function submit(): void {
    if (!canSubmit.value) return
    isSubmitting.value = true
    store.addCharacter(formState)
    navigateTo('/character')
  }

  return {
    activeTab,
    formState,

    // abilities
    pointBuyRemaining,
    setAbilityMethod,
    rollAllAbilities,
    resetAbilities,

    // professions
    totalLevel,
    addProfession,
    removeProfession,
    updateProfession,
    updateProfessionLevel,
    updateAbilityScore,

    // skills
    setSkillProficiency,

    // validation
    canSubmit,

    // submit
    isSubmitting,
    submit,
  }
}
