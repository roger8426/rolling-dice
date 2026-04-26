import { ABILITY_KEYS, POINT_BUY_DEFAULT_SCORE } from '~/constants/dnd'
import { createDicePool, tryCalculateSpentPoints } from '~/helpers/ability'
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
    dicePool: [],
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
    formState.dicePool = createDicePool()
    formState.abilities = createDefaultAbilities()
  }

  function resetAbilities(): void {
    formState.abilities = createDefaultAbilities()
    formState.dicePool = []
  }

  function assignDiceToAbility(key: AbilityKey, slotId: string | null): void {
    const previous = formState.dicePool.find((slot) => slot.assignedTo === key)
    if (previous) previous.assignedTo = null

    if (slotId === null) {
      formState.abilities[key] = POINT_BUY_DEFAULT_SCORE
      return
    }

    const target = formState.dicePool.find((slot) => slot.id === slotId)
    if (!target) return
    target.assignedTo = key
    formState.abilities[key] = target.value
  }

  // ─── Ability Method Switching ─────────────────────────────────────────

  function setAbilityMethod(method: AbilityMethod): void {
    if (formState.abilityMethod === method) return
    formState.abilityMethod = method

    if (method === 'diceRoll') {
      rollAllAbilities()
    } else {
      formState.abilities = createDefaultAbilities()
      formState.dicePool = []
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

  // ─── canSubmit（疊加擲骰指派完成度） ───────────────────────────────────

  const isDiceAssignmentComplete = computed(
    () =>
      formState.abilityMethod !== 'diceRoll' ||
      (formState.dicePool.length === ABILITY_KEYS.length &&
        formState.dicePool.every((slot) => slot.assignedTo !== null)),
  )

  const canSubmit = computed(() => core.canSubmit.value && isDiceAssignmentComplete.value)

  // ─── Submit ───────────────────────────────────────────────────────────

  const logger = createLogger('[CharacterBuild]')

  async function submit(): Promise<void> {
    if (!canSubmit.value) return
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
    canSubmit,

    abilities: {
      pointBuyUsage,
      setAbilityMethod,
      rollAllAbilities,
      resetAbilities,
      updateAbilityScore,
      assignDiceToAbility,
    },

    submit,
  }
}
