import { DAMAGE_DIE_TYPES } from '~/constants/dnd'
import type { AbilityScores, AttackDraft } from '~/types/business/character'

/** 計算攻擊命中加值：屬性調整值 + 熟練加值 + 額外命中 */
export function getAttackHit(
  attack: AttackDraft,
  abilityScores: AbilityScores,
  proficiencyBonus: number,
): number {
  const abilityMod = attack.abilityKey ? getAbilityModifier(abilityScores[attack.abilityKey]) : 0
  return abilityMod + proficiencyBonus + (attack.extraHitBonus ?? 0)
}

/** 依命中加值正負回傳對應顏色 class */
export function getHitBonusColorClass(hit: number): string {
  if (hit > 0) return 'text-success'
  if (hit < 0) return 'text-danger'
  return 'text-content-muted'
}

/** 將攻擊的傷害骰與額外加值組合為顯示字串，例如 `1d8 +2d6 +3` */
export function formatDamageSummary(attack: AttackDraft): string {
  const parts = DAMAGE_DIE_TYPES.filter((die) => attack.damageDice[die] > 0).map(
    (die, index) => `${index > 0 ? '+' : ''}${attack.damageDice[die]}${die}`,
  )
  if (attack.extraDamageBonus) {
    parts.push(
      attack.extraDamageBonus > 0 ? `+${attack.extraDamageBonus}` : String(attack.extraDamageBonus),
    )
  }
  return parts.join(' ') || '—'
}
