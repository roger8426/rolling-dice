import { ABILITY_KEYS, POINT_BUY_DEFAULT_SCORE } from '~/constants/dnd'
import { tryCalculateSpentPoints } from '~/helpers/ability'
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

  // ─── Point Usage（自訂模式下的指示性點數使用） ────────────────────────────

  const pointBuyUsage = computed<number | null>(() => {
    if (formState.abilityMethod !== 'custom') return null
    return tryCalculateSpentPoints(formState.abilities)
  })

  function updateAbilityScore(key: AbilityKey, score: number): void {
    formState.abilities[key] = score
  }

  // ─── Submit ───────────────────────────────────────────────────────────

  const logger = createLogger('[CharacterBuild]')

  async function submit(): Promise<void> {
    if (!core.canSubmit.value) return
    core.isSubmitting.value = true
    try {
      const created = store.addCharacter(formState)
      if (!created) {
        useToast().error('儲存失敗，請稍後再試')
        core.isSubmitting.value = false
        return
      }
      await navigateTo('/character')
    } catch (error) {
      logger.error('submit failed:', error)
      useToast().error('儲存失敗，請稍後再試')
      core.isSubmitting.value = false
    }
  }

  return {
    activeTab,
    formState,
    core,

    abilities: {
      pointBuyUsage,
      setAbilityMethod,
      rollAllAbilities,
      resetAbilities,
      updateAbilityScore,
    },

    submit,
  }
}
