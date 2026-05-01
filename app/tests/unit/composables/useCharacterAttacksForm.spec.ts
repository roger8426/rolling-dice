import { reactive } from 'vue'
import { describe, expect, it } from 'vitest'
import { useCharacterAttacksForm } from '~/composables/domain/useCharacterAttacksForm'
import { createAttackDraft, createMockUpdateFormState } from '~/tests/fixtures/character'

function setup() {
  const formState = reactive(createMockUpdateFormState())
  const attacks = useCharacterAttacksForm(formState)
  return { formState, attacks }
}

const defaultEntry = () => createAttackDraft()

describe('useCharacterAttacksForm', () => {
  it('addAttack 應新增一筆攻擊', () => {
    const { formState, attacks } = setup()
    attacks.addAttack(defaultEntry())
    expect(formState.attacks).toHaveLength(1)
    expect(formState.attacks[0]).toMatchObject({
      name: '',
      abilityKey: null,
      damageDice: [],
      extraHitBonus: null,
      applyAbilityToDamage: true,
    })
    expect(formState.attacks[0]!.id).toBeTypeOf('string')
  })

  it('每次 addAttack 產生的 id 應不重複', () => {
    const { formState, attacks } = setup()
    attacks.addAttack(defaultEntry())
    attacks.addAttack(defaultEntry())
    const [a, b] = formState.attacks
    expect(a!.id).not.toBe(b!.id)
  })

  it('removeAttack 應移除指定 id 的攻擊', () => {
    const { formState, attacks } = setup()
    attacks.addAttack(defaultEntry())
    attacks.addAttack(defaultEntry())
    const targetId = formState.attacks[0]!.id
    attacks.removeAttack(targetId)
    expect(formState.attacks).toHaveLength(1)
    expect(formState.attacks[0]!.id).not.toBe(targetId)
  })

  it('removeAttack 找不到對應 id 時不應拋錯', () => {
    const { formState, attacks } = setup()
    attacks.addAttack(defaultEntry())
    expect(() => attacks.removeAttack('non-existent')).not.toThrow()
    expect(formState.attacks).toHaveLength(1)
  })

  it('updateAttack 應以新資料取代整筆攻擊', () => {
    const { formState, attacks } = setup()
    attacks.addAttack(defaultEntry())
    const id = formState.attacks[0]!.id
    attacks.updateAttack(id, {
      name: '長劍',
      abilityKey: 'strength',
      damageDice: [{ id: 'd-1', dieType: 'd8', count: 1, bonus: 3, damageType: 'slashing' }],
      extraHitBonus: 2,
      applyAbilityToDamage: true,
    })
    expect(formState.attacks[0]).toMatchObject({
      id,
      name: '長劍',
      abilityKey: 'strength',
      damageDice: [{ id: 'd-1', dieType: 'd8', count: 1, bonus: 3, damageType: 'slashing' }],
      extraHitBonus: 2,
      applyAbilityToDamage: true,
    })
  })
})
