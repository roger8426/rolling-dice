import { reactive } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockUpdateFormState } from '~/tests/fixtures/character'

const FIREBALL_ID = 'cccccccc-0000-0000-0000-000000000001'
const CANTRIP_ID = 'cccccccc-0000-0000-0000-000000000002'
const UNKNOWN_ID = 'cccccccc-0000-0000-0000-000000000099'

beforeEach(() => {
  vi.resetModules()
  vi.stubGlobal('useSpells', () => ({
    getSpell: (id: string) => {
      if (id === FIREBALL_ID)
        return { id: FIREBALL_ID, level: 1, name: '火焰箭', school: 'evocation' }
      if (id === CANTRIP_ID)
        return { id: CANTRIP_ID, level: 0, name: '火焰術', school: 'evocation' }
      return undefined
    },
  }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

async function setup() {
  const { useCharacterSpellsForm } = await import('~/composables/domain/useCharacterSpellsForm')
  const formState = reactive(createMockUpdateFormState())
  const spells = useCharacterSpellsForm(formState)
  return { formState, spells }
}

describe('useCharacterSpellsForm', () => {
  it('toggleLearnedSpell 可新增與移除掌握的法術', async () => {
    const { formState, spells } = await setup()
    spells.toggleLearnedSpell(FIREBALL_ID)
    expect(formState.learnedSpells).toContain(FIREBALL_ID)
    spells.toggleLearnedSpell(FIREBALL_ID)
    expect(formState.learnedSpells).not.toContain(FIREBALL_ID)
  })

  it('取消掌握某法術時，應同步從 preparedSpells 移除', async () => {
    const { formState, spells } = await setup()
    spells.toggleLearnedSpell(FIREBALL_ID)
    spells.togglePreparedSpell(FIREBALL_ID)
    expect(formState.preparedSpells).toContain(FIREBALL_ID)

    spells.toggleLearnedSpell(FIREBALL_ID)
    expect(formState.learnedSpells).not.toContain(FIREBALL_ID)
    expect(formState.preparedSpells).not.toContain(FIREBALL_ID)
  })

  it('togglePreparedSpell 只允許 learnedSpells 內的 id', async () => {
    const { formState, spells } = await setup()
    spells.togglePreparedSpell(UNKNOWN_ID)
    expect(formState.preparedSpells).toHaveLength(0)
  })

  it('togglePreparedSpell 不允許準備戲法（level 0）', async () => {
    const { formState, spells } = await setup()
    spells.toggleLearnedSpell(CANTRIP_ID)
    spells.togglePreparedSpell(CANTRIP_ID)
    expect(formState.preparedSpells).toHaveLength(0)
  })

  it('togglePreparedSpell 可在已掌握的法術上切換準備狀態', async () => {
    const { formState, spells } = await setup()
    spells.toggleLearnedSpell(FIREBALL_ID)
    spells.togglePreparedSpell(FIREBALL_ID)
    expect(formState.preparedSpells).toContain(FIREBALL_ID)
    spells.togglePreparedSpell(FIREBALL_ID)
    expect(formState.preparedSpells).not.toContain(FIREBALL_ID)
  })
})
