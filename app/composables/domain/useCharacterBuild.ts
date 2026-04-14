import { ABILITY_KEYS, POINT_BUY_DEFAULT_SCORE, STANDARD_ARRAY } from '~/constants/dnd'
import { getRemainingPoints, isValidPointBuy } from '~/helpers/ability'
import type {
  AbilityMethod,
  AbilityScores,
  CharacterFormState,
  ProfessionEntry,
  SkillProficiencies,
} from '~/types/business/character'
import type { AbilityKey, ProficiencyLevel } from '~/types/business/dnd'

export type BuildTab = 'basic' | 'profession' | 'ability' | 'background' | 'profile'

const BUILD_TABS: BuildTab[] = ['basic', 'profession', 'ability', 'background', 'profile']

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
    professions: [{ profession: '' as ProfessionEntry['profession'], level: 1 }],
    abilities: createDefaultAbilities(),
    abilityMethod: 'pointBuy',
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

  // ─── Standard Array ───────────────────────────────────────────────────

  const standardArrayAssignment = ref<Record<AbilityKey, number | null>>(
    Object.fromEntries(ABILITY_KEYS.map((key) => [key, null])) as Record<AbilityKey, number | null>,
  )

  const availableStandardValues = computed(() => {
    const used = Object.values(standardArrayAssignment.value).filter((v): v is number => v !== null)
    return STANDARD_ARRAY.filter((v) => !used.includes(v))
  })

  // ─── Dice Roll ────────────────────────────────────────────────────────

  function rollAbilityScore(): number {
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
    rolls.sort((a, b) => a - b)
    return rolls[1]! + rolls[2]! + rolls[3]!
  }

  function rollAllAbilities(): void {
    for (const key of ABILITY_KEYS) {
      formState.abilities[key] = rollAbilityScore()
    }
  }

  function rollSingleAbility(key: AbilityKey): void {
    formState.abilities[key] = rollAbilityScore()
  }

  // ─── Ability Method Switching ─────────────────────────────────────────

  function setAbilityMethod(method: AbilityMethod): void {
    formState.abilityMethod = method

    if (method === 'pointBuy') {
      formState.abilities = createDefaultAbilities()
    } else if (method === 'standardArray') {
      formState.abilities = createDefaultAbilities()
      standardArrayAssignment.value = Object.fromEntries(
        ABILITY_KEYS.map((key) => [key, null]),
      ) as Record<AbilityKey, number | null>
    } else if (method === 'diceRoll') {
      rollAllAbilities()
    }
  }

  function assignStandardArrayValue(key: AbilityKey, value: number | null): void {
    // Clear previous assignment of this value
    if (value !== null) {
      for (const k of ABILITY_KEYS) {
        if (standardArrayAssignment.value[k] === value) {
          standardArrayAssignment.value[k] = null
          formState.abilities[k] = POINT_BUY_DEFAULT_SCORE
        }
      }
    }
    standardArrayAssignment.value[key] = value
    formState.abilities[key] = value ?? POINT_BUY_DEFAULT_SCORE
  }

  // ─── Point Buy ────────────────────────────────────────────────────────

  const pointBuyRemaining = computed(() => {
    if (formState.abilityMethod !== 'pointBuy') return 0
    return getRemainingPoints(formState.abilities)
  })

  // ─── Professions ──────────────────────────────────────────────────────

  const totalLevel = computed(() => formState.professions.reduce((sum, p) => sum + p.level, 0))

  function addProfession(): void {
    if (totalLevel.value >= 20) return
    formState.professions.push({
      profession: '' as ProfessionEntry['profession'],
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
      formState.alignment !== ''
    )
  }

  function isProfessionTabValid(): boolean {
    return (
      formState.professions.length > 0 &&
      formState.professions.every(
        (p) => (p.profession as string) !== '' && p.level >= 1 && p.level <= 20,
      ) &&
      totalLevel.value >= 1 &&
      totalLevel.value <= 20
    )
  }

  function isAbilityTabValid(): boolean {
    const { abilityMethod, abilities } = formState
    const allPositive = ABILITY_KEYS.every((key) => abilities[key] > 0)
    if (!allPositive) return false

    if (abilityMethod === 'pointBuy') return isValidPointBuy(abilities)
    if (abilityMethod === 'standardArray') {
      return ABILITY_KEYS.every((key) => standardArrayAssignment.value[key] !== null)
    }
    // diceRoll: just check all > 0
    return true
  }

  function isBackgroundTabValid(): boolean {
    return formState.background.trim() !== ''
  }

  function isTabValid(tab: BuildTab): boolean {
    switch (tab) {
      case 'basic':
        return isBasicTabValid()
      case 'profession':
        return isProfessionTabValid()
      case 'ability':
        return isAbilityTabValid()
      case 'background':
        return isBackgroundTabValid()
      case 'profile':
        return true // all optional
    }
  }

  const canSubmit = computed(() => BUILD_TABS.every((tab) => isTabValid(tab)))

  // ─── Submit ───────────────────────────────────────────────────────────

  function submit(): void {
    if (!canSubmit.value) return
    store.addCharacter(formState)
    navigateTo('/character')
  }

  return {
    activeTab,
    formState,

    // abilities
    pointBuyRemaining,
    standardArrayAssignment,
    availableStandardValues,
    setAbilityMethod,
    assignStandardArrayValue,
    rollAllAbilities,
    rollSingleAbility,

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
    submit,
  }
}
