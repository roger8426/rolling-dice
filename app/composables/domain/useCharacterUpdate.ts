import { ABILITY_KEYS } from '~/constants/dnd'
import type {
  Character,
  CharacterUpdateFormState,
  SkillProficiencies,
} from '~/types/business/character'
import type { AbilityKey, ProficiencyLevel, ProfessionKey } from '~/types/business/dnd'

export type UpdateTab = 'basic' | 'profile'

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
    background: character.background,
    isJackOfAllTrades: character.isJackOfAllTrades ?? false,
    isTough: character.isTough ?? false,
    faith: character.faith ?? '',
    age: character.age ?? null,
    height: character.height ?? '',
    weight: character.weight ?? '',
    appearance: character.appearance ?? '',
    story: character.story ?? '',
    languages: character.languages ?? '',
    tools: character.tools ?? '',
    weaponProficiencies: character.weaponProficiencies ?? '',
    armorProficiencies: character.armorProficiencies ?? '',
    armorClass: { type: '', value: null, abilities: '' },
    speedBonus: null,
  }
}

export function useCharacterUpdate(id: string) {
  const store = useCharacterStore()
  const activeTab = ref<UpdateTab>('basic')

  const character = store.getById(id)
  const notFound = !character

  const formState = reactive<CharacterUpdateFormState>(
    character ? characterToFormState(character) : createEmptyUpdateFormState(),
  )

  // ─── Professions ──────────────────────────────────────────────────────

  const totalLevel = computed(() => formState.professions.reduce((sum, p) => sum + p.level, 0))

  function addProfession(): void {
    formState.professions.push({ profession: '', level: 1 })
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

  function setSkillProficiency(skill: string, level: ProficiencyLevel): void {
    if (level === 'none') {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (formState.skills as SkillProficiencies)[skill as keyof SkillProficiencies]
    } else {
      ;(formState.skills as SkillProficiencies)[skill as keyof SkillProficiencies] = level
    }
  }

  // ─── Validation ───────────────────────────────────────────────────────

  const isSubmitting = ref(false)
  const canSubmit = computed(() => !isSubmitting.value && formState.name.trim() !== '')

  // ─── Submit ───────────────────────────────────────────────────────────

  function submit(): void {
    if (!canSubmit.value) return
    isSubmitting.value = true
    store.updateCharacter(id, formState)
    navigateTo(`/character/${id}`)
  }

  return {
    activeTab,
    formState,
    notFound,

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
    gender: '',
    race: '',
    alignment: '',
    professions: [{ profession: '', level: 1 }],
    abilities: Object.fromEntries(
      ABILITY_KEYS.map((key) => [key, { basicScore: 8, bonusScore: 0 }]),
    ) as CharacterUpdateFormState['abilities'],
    skills: {},
    background: '',
    isJackOfAllTrades: false,
    isTough: false,
    faith: '',
    age: null,
    height: '',
    weight: '',
    appearance: '',
    story: '',
    languages: '',
    tools: '',
    weaponProficiencies: '',
    armorProficiencies: '',
    armorClass: { type: '', value: null, abilities: '' },
    speedBonus: null,
  }
}
