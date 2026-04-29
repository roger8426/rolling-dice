import { characterToFormState, createEmptyUpdateFormState } from '~/helpers/characterFormState'
import type { CharacterUpdateFormState } from '~/types/business/character'

export type UpdateTab = 'basic' | 'profile' | 'combat' | 'spells' | 'features' | 'backpack'

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
  const spells = useCharacterSpellsForm(formState)
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
    spells,
    features,
    submit,
  }
}
