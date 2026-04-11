import type { ProfessionKey, RaceKey } from '~/types/dnd'

export type CharacterTier = 'common' | 'elite' | 'master' | 'legendary'

export interface Character {
  id: string
  name: string
  race: RaceKey
  professions: ProfessionKey[]
  level: number
  createdAt: string
  avatar?: string
}
