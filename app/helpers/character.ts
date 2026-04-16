import type { CharacterTier } from '~/types/business/character'

export function getCharacterTier(level: number): CharacterTier {
  if (level >= 17) return 'legendary'
  if (level >= 11) return 'master'
  if (level >= 5) return 'elite'
  return 'common'
}
