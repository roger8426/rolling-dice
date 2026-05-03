import {
  CASTER_CATEGORY,
  SHARED_CASTER_SLOTS,
  WARLOCK_SLOT_TABLE,
} from '~/constants/spell-slot-table'
import type { SpellLevel, SpellSlots } from '~/types/business/character'
import type { ProfessionKey } from '~/types/business/dnd'

interface ProfessionLike {
  profession: ProfessionKey | null
  level: number
}

/** 一般施法者建議環位（全 / 半 / 三分之一合併計算）；artificer 向上取整，其他 third-caster 向下取整 */
export const getSuggestedRegularSpellSlots = (
  professions: readonly ProfessionLike[],
): SpellSlots => {
  let fullLevels = 0
  let halfLevels = 0
  let thirdNonArtificerLevels = 0
  let artificerLevels = 0

  for (const entry of professions) {
    if (entry.profession === null || entry.level <= 0) continue
    const category = CASTER_CATEGORY[entry.profession]
    if (category === 'full') {
      fullLevels += entry.level
    } else if (category === 'half') {
      halfLevels += entry.level
    } else if (category === 'third') {
      if (entry.profession === 'artificer') artificerLevels += entry.level
      else thirdNonArtificerLevels += entry.level
    }
  }

  const effectiveLevel =
    fullLevels +
    Math.floor(halfLevels / 2) +
    Math.floor(thirdNonArtificerLevels / 3) +
    Math.ceil(artificerLevels / 3)

  if (effectiveLevel < 1 || effectiveLevel > 20) return {}
  return { ...SHARED_CASTER_SLOTS[effectiveLevel - 1] }
}

/** 契術師 pact magic 建議環位；多次契術師等級加總後查表 */
export const getSuggestedPactSlots = (professions: readonly ProfessionLike[]): SpellSlots => {
  let warlockLevels = 0
  for (const entry of professions) {
    if (entry.profession === null || entry.level <= 0) continue
    if (CASTER_CATEGORY[entry.profession] === 'warlock') warlockLevels += entry.level
  }

  if (warlockLevels < 1 || warlockLevels > 20) return {}
  const pact = WARLOCK_SLOT_TABLE[warlockLevels - 1]
  if (!pact) return {}
  const level: SpellLevel = pact.level
  return { [level]: pact.count }
}
