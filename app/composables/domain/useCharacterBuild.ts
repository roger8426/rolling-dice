import {
  ABILITY_KEYS,
  CUSTOM_ABILITY_MAX,
  CUSTOM_ABILITY_MIN,
  POINT_BUY_DEFAULT_SCORE,
} from '~/constants/dnd'
import { getRemainingPoints, isValidPointBuy } from '~/helpers/ability'
import type {
  AbilityMethod,
  AbilityScores,
  CharacterFormState,
  SkillProficiencies,
} from '~/types/business/character'
import type { ProficiencyLevel } from '~/types/business/dnd'

export type BuildTab = 'basic' | 'profile'

const BUILD_TABS: BuildTab[] = ['basic', 'profile']

function createDefaultAbilities(): AbilityScores {
  return Object.fromEntries(
    ABILITY_KEYS.map((key) => [key, POINT_BUY_DEFAULT_SCORE]),
  ) as AbilityScores
}

function createDefaultFormState(): CharacterFormState {
  return {
    name: '',
    gender: '',
    race: '',
    alignment: '',
    professions: [{ profession: '', level: 1 }],
    abilities: createDefaultAbilities(),
    abilityMethod: 'custom',
    skills: {},
    background: '',
    faith: '',
    age: null,
    height: '',
    weight: '',
    appearance: '',
    story: '',
    languages: '',
    tools: '',
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

    if (method === 'pointBuy') {
      formState.abilities = createDefaultAbilities()
    } else if (method === 'custom') {
      formState.abilities = createDefaultAbilities()
    } else if (method === 'diceRoll') {
      rollAllAbilities()
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
      profession: '',
      level: 1,
    })
  }

  function removeProfession(index: number): void {
    if (formState.professions.length <= 1) return
    formState.professions.splice(index, 1)
  }

  // ─── Skills ───────────────────────────────────────────────────────────

  function setSkillProficiency(skill: string, level: ProficiencyLevel): void {
    if (level === 'none') {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (formState.skills as SkillProficiencies)[skill as keyof SkillProficiencies]
    } else {
      ;(formState.skills as SkillProficiencies)[skill as keyof SkillProficiencies] = level
    }
  }

  // ─── Validation ───────────────────────────────────────────────────────

  function isBasicTabValid(): boolean {
    return (
      formState.name.trim() !== '' &&
      formState.gender !== '' &&
      formState.race !== '' &&
      formState.alignment !== '' &&
      formState.background.trim() !== ''
    )
  }

  function isProfessionTabValid(): boolean {
    return (
      formState.professions.length > 0 &&
      formState.professions.every((p) => p.profession !== '' && p.level >= 1 && p.level <= 20) &&
      totalLevel.value >= 1 &&
      totalLevel.value <= 20
    )
  }

  function isAbilityTabValid(): boolean {
    const { abilityMethod, abilities } = formState
    const allPositive = ABILITY_KEYS.every((key) => abilities[key] > 0)
    if (!allPositive) return false

    if (abilityMethod === 'pointBuy') return isValidPointBuy(abilities)
    if (abilityMethod === 'custom') {
      return ABILITY_KEYS.every(
        (key) => abilities[key] >= CUSTOM_ABILITY_MIN && abilities[key] <= CUSTOM_ABILITY_MAX,
      )
    }
    // diceRoll: just check all > 0
    return true
  }

  function isTabValid(tab: BuildTab): boolean {
    switch (tab) {
      case 'basic':
        return isBasicTabValid() && isProfessionTabValid() && isAbilityTabValid()
      case 'profile':
        return true // all optional
    }
  }

  const canSubmit = computed(
    () => !isSubmitting.value && BUILD_TABS.every((tab) => isTabValid(tab)),
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

    // skills
    setSkillProficiency,

    // validation
    isTabValid,
    canSubmit,

    // submit
    isSubmitting,
    submit,
  }
}
