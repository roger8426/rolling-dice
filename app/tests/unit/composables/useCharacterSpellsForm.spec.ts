import { reactive } from 'vue'
import { describe, expect, it } from 'vitest'
import { createMockUpdateFormState } from '~/tests/fixtures/character'
import { useCharacterSpellsForm } from '~/composables/domain/useCharacterSpellsForm'

const FIREBALL_ID = 'cccccccc-0000-0000-0000-000000000001'

function setup() {
  const formState = reactive(createMockUpdateFormState())
  const spells = useCharacterSpellsForm(formState)
  return { formState, spells }
}

describe('useCharacterSpellsForm', () => {
  it('toggleLearnedSpell 可新增與移除掌握的法術', () => {
    const { formState, spells } = setup()
    spells.toggleLearnedSpell(FIREBALL_ID)
    expect(formState.learnedSpells).toContain(FIREBALL_ID)
    spells.toggleLearnedSpell(FIREBALL_ID)
    expect(formState.learnedSpells).not.toContain(FIREBALL_ID)
  })

  it('取消掌握某法術時，應同步從 preparedSpells 移除', () => {
    const { formState, spells } = setup()
    spells.toggleLearnedSpell(FIREBALL_ID)
    formState.preparedSpells.push(FIREBALL_ID)

    spells.toggleLearnedSpell(FIREBALL_ID)
    expect(formState.learnedSpells).not.toContain(FIREBALL_ID)
    expect(formState.preparedSpells).not.toContain(FIREBALL_ID)
  })
})
