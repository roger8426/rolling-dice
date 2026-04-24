import { ABILITY_KEYS, POINT_BUY_DEFAULT_SCORE } from '~/constants/dnd'
import { getRemainingPoints } from '~/helpers/ability'
import type { AbilityMethod, AbilityScores, CharacterFormState } from '~/types/business/character'
import type { AbilityKey } from '~/types/business/dnd'

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

  const core = useCharacterFormCore(formState)

  // ─── Dice Roll ────────────────────────────────────────────────────────

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

  function updateAbilityScore(key: AbilityKey, score: number): void {
    formState.abilities[key] = score
  }

  // ─── Submit ───────────────────────────────────────────────────────────

  function submit(): void {
    if (!core.canSubmit.value) return
    core.isSubmitting.value = true
    store.addCharacter(formState)
    navigateTo('/character')
  }

  return {
    activeTab,
    formState,
    core,

    abilities: {
      pointBuyRemaining,
      setAbilityMethod,
      rollAllAbilities,
      resetAbilities,
      updateAbilityScore,
    },

    submit,
  }
}
