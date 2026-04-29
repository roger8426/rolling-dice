import type { CharacterUpdateFormState } from '~/types/business/character'
import type { AbilityKey, ArmorType } from '~/types/business/dnd'

/** 角色規則數值（CharacterStats）的 form mutation 包裝 */
export function useCharacterStatsForm(formState: CharacterUpdateFormState) {
  // ─── Abilities ────────────────────────────────────────────────────────

  function updateBonusScore(key: AbilityKey, score: number): void {
    formState.abilities[key].bonusScore = score
  }

  // ─── HP ───────────────────────────────────────────────────────────────

  function updateCustomHpBonus(value: number): void {
    formState.customHpBonus = value
  }

  // ─── Armor Class ──────────────────────────────────────────────────────

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

  // ─── Speed / Initiative / Passive Perception ──────────────────────────

  function updateSpeedBonus(value: number): void {
    formState.speedBonus = value
  }

  function updateInitiativeBonus(value: number): void {
    formState.initiativeBonus = value
  }

  function updatePassivePerceptionBonus(value: number): void {
    formState.passivePerceptionBonus = value
  }

  // ─── Saving Throws ────────────────────────────────────────────────────

  function updateSavingThrowExtras(value: AbilityKey[]): void {
    formState.savingThrowExtras = value
  }

  return {
    updateBonusScore,
    updateCustomHpBonus,
    updateArmorType,
    updateArmorValue,
    updateArmorAbilityKey,
    updateShieldValue,
    updateSpeedBonus,
    updateInitiativeBonus,
    updatePassivePerceptionBonus,
    updateSavingThrowExtras,
  }
}
