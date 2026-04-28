import { describe, expect, it } from 'vitest'
import { applySkillProficiency } from '~/helpers/skill'

describe('applySkillProficiency', () => {
  it('空 skills 加入 proficient', () => {
    const result = applySkillProficiency({}, 'athletics', 'proficient')
    expect(result).toEqual({ athletics: 'proficient' })
  })

  it('已有熟練度時覆寫為 expertise', () => {
    const result = applySkillProficiency({ athletics: 'proficient' }, 'athletics', 'expertise')
    expect(result).toEqual({ athletics: 'expertise' })
  })

  it("level 為 'none' 時移除該 key", () => {
    const result = applySkillProficiency(
      { athletics: 'proficient', acrobatics: 'expertise' },
      'athletics',
      'none',
    )
    expect(result).toEqual({ acrobatics: 'expertise' })
    expect('athletics' in result).toBe(false)
  })

  it("level 為 'none' 且 key 不存在時不影響其他 key", () => {
    const skills = { acrobatics: 'proficient' } as const
    const result = applySkillProficiency(skills, 'athletics', 'none')
    expect(result).toEqual({ acrobatics: 'proficient' })
  })

  it('不修改原始 skills 物件', () => {
    const original = { athletics: 'proficient' } as const
    applySkillProficiency(original, 'athletics', 'expertise')
    expect(original).toEqual({ athletics: 'proficient' })
  })

  it('可同時存在多個不同技能的熟練度', () => {
    const result = applySkillProficiency({ athletics: 'proficient' }, 'arcana', 'expertise')
    expect(result).toEqual({ athletics: 'proficient', arcana: 'expertise' })
  })
})
