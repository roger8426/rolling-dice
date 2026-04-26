import { reactive } from 'vue'
import { describe, expect, it } from 'vitest'
import { useCharacterFormCore } from '~/composables/domain/useCharacterFormCore'
import type { CharacterFormStateBase } from '~/types/business/character'

function createFormState(overrides: Partial<CharacterFormStateBase> = {}): CharacterFormStateBase {
  return reactive<CharacterFormStateBase>({
    name: '',
    gender: null,
    race: null,
    alignment: null,
    professions: [{ profession: null, level: 1 }],
    skills: {},
    background: null,
    isJackOfAllTrades: false,
    isTough: false,
    faith: null,
    age: null,
    height: null,
    weight: null,
    appearance: null,
    story: null,
    languages: null,
    tools: null,
    weaponProficiencies: null,
    armorProficiencies: null,
    ...overrides,
  })
}

describe('useCharacterFormCore — professions', () => {
  it('totalLevel 應為所有職業等級之和', () => {
    const formState = createFormState({
      professions: [
        { profession: 'fighter', level: 5 },
        { profession: 'wizard', level: 3 },
      ],
    })
    const core = useCharacterFormCore(formState)
    expect(core.totalLevel.value).toBe(8)
  })

  it('addProfession 應追加 level:1 的空職業條目', () => {
    const formState = createFormState()
    const core = useCharacterFormCore(formState)
    core.addProfession()
    expect(formState.professions).toHaveLength(2)
    expect(formState.professions[1]).toEqual({ profession: null, level: 1 })
  })

  it('removeProfession 在只剩一筆時不應移除', () => {
    const formState = createFormState()
    const core = useCharacterFormCore(formState)
    core.removeProfession(0)
    expect(formState.professions).toHaveLength(1)
  })

  it('removeProfession 超過一筆時應移除指定索引', () => {
    const formState = createFormState({
      professions: [
        { profession: 'fighter', level: 2 },
        { profession: 'wizard', level: 3 },
      ],
    })
    const core = useCharacterFormCore(formState)
    core.removeProfession(0)
    expect(formState.professions).toEqual([{ profession: 'wizard', level: 3 }])
  })

  it('updateProfessionLevel 應正確更新指定索引的等級', () => {
    const formState = createFormState()
    const core = useCharacterFormCore(formState)
    core.updateProfessionLevel(0, 10)
    expect(formState.professions[0]!.level).toBe(10)
  })

  it('updateProfessionLevel 超過 20 應 clamp 到 20', () => {
    const formState = createFormState()
    const core = useCharacterFormCore(formState)
    core.updateProfessionLevel(0, 99)
    expect(formState.professions[0]!.level).toBe(20)
  })

  it('updateProfessionLevel 小於 1 應 clamp 到 1', () => {
    const formState = createFormState()
    const core = useCharacterFormCore(formState)
    core.updateProfessionLevel(0, 0)
    expect(formState.professions[0]!.level).toBe(1)
  })

  it('updateProfessionLevel 應截斷小數', () => {
    const formState = createFormState()
    const core = useCharacterFormCore(formState)
    core.updateProfessionLevel(0, 5.7)
    expect(formState.professions[0]!.level).toBe(5)
  })
})

describe('useCharacterFormCore — skills', () => {
  it('setSkillProficiency 設定 proficient 應寫入 skills', () => {
    const formState = createFormState()
    const core = useCharacterFormCore(formState)
    core.setSkillProficiency('athletics', 'proficient')
    expect(formState.skills.athletics).toBe('proficient')
  })

  it('setSkillProficiency 設為 none 應從 skills 移除', () => {
    const formState = createFormState({ skills: { athletics: 'proficient' } })
    const core = useCharacterFormCore(formState)
    core.setSkillProficiency('athletics', 'none')
    expect(formState.skills.athletics).toBeUndefined()
  })
})

describe('useCharacterFormCore — canSubmit', () => {
  it('name 為空時應為 false', () => {
    const formState = createFormState({
      professions: [{ profession: 'fighter', level: 1 }],
    })
    const core = useCharacterFormCore(formState)
    expect(core.canSubmit.value).toBe(false)
  })

  it('name 為空白時應為 false', () => {
    const formState = createFormState({
      name: '   ',
      professions: [{ profession: 'fighter', level: 1 }],
    })
    const core = useCharacterFormCore(formState)
    expect(core.canSubmit.value).toBe(false)
  })

  it('所有職業皆未選擇時應為 false', () => {
    const formState = createFormState({ name: '角色' })
    const core = useCharacterFormCore(formState)
    expect(core.canSubmit.value).toBe(false)
  })

  it('name 有值且至少一個職業已選時應為 true', () => {
    const formState = createFormState({
      name: '角色',
      professions: [{ profession: 'fighter', level: 1 }],
    })
    const core = useCharacterFormCore(formState)
    expect(core.canSubmit.value).toBe(true)
  })

  it('isSubmitting 為 true 時 canSubmit 應為 false（防重複提交）', () => {
    const formState = createFormState({
      name: '角色',
      professions: [{ profession: 'fighter', level: 1 }],
    })
    const core = useCharacterFormCore(formState)
    expect(core.canSubmit.value).toBe(true)
    core.isSubmitting.value = true
    expect(core.canSubmit.value).toBe(false)
  })
})
