import { describe, expect, it } from 'vitest'
import { SPELL_SCHOOL_LABELS } from '~/constants/dnd'
import {
  formatSpellComponents,
  formatSpellLevel,
  groupSpellsByLevel,
  normalizeSpell,
} from '~/helpers/spell'
import type { Spell, SpellDto } from '~/types/business/spell'

function makeDto(overrides: Partial<SpellDto> = {}): SpellDto {
  return {
    name: '火焰箭',
    level: 1,
    school: '塑能',
    castingTime: '1 個動作',
    range: '90 英尺',
    verbal: true,
    somatic: true,
    material: '',
    duration: '瞬間',
    concentration: false,
    ritual: false,
    desc: '測試描述',
    ...overrides,
  }
}

// ─── normalizeSpell ───────────────────────────────────────────────────────────

describe('normalizeSpell', () => {
  it('已知學派（中文）轉換為對應 SpellSchool key', () => {
    const result = normalizeSpell(makeDto({ school: '塑能' }))
    expect(result).not.toBeNull()
    expect(result!.school).toBe('evocation')
  })

  it('所有學派 label 皆可正確轉換', () => {
    for (const [key, label] of Object.entries(SPELL_SCHOOL_LABELS)) {
      const result = normalizeSpell(makeDto({ school: label }))
      expect(result).not.toBeNull()
      expect(result!.school).toBe(key)
    }
  })

  it('未知學派回傳 null', () => {
    const result = normalizeSpell(makeDto({ school: '未知學派' }))
    expect(result).toBeNull()
  })

  it('level 0（戲法）可正常轉換', () => {
    const result = normalizeSpell(makeDto({ level: 0, school: '幻術' }))
    expect(result).not.toBeNull()
    expect(result!.level).toBe(0)
    expect(result!.school).toBe('illusion')
  })

  it('保留其他欄位不變', () => {
    const dto = makeDto({ name: '測試法術', school: '防護' })
    const result = normalizeSpell(dto)
    expect(result!.name).toBe('測試法術')
    expect(result!.castingTime).toBe(dto.castingTime)
  })
})

// ─── CN_TO_SCHOOL reverse map ─────────────────────────────────────────────────

describe('SPELL_SCHOOL_LABELS reverse map', () => {
  it('所有 label 互不相同（reverse map 大小等於原 map）', () => {
    const labels = Object.values(SPELL_SCHOOL_LABELS)
    const unique = new Set(labels)
    expect(unique.size).toBe(labels.length)
  })
})

// ─── formatSpellLevel ─────────────────────────────────────────────────────────

describe('formatSpellLevel', () => {
  it('0 → 戲法', () => {
    expect(formatSpellLevel(0)).toBe('戲法')
  })

  it('1 → 1 環', () => {
    expect(formatSpellLevel(1)).toBe('1 環')
  })

  it('9 → 9 環', () => {
    expect(formatSpellLevel(9)).toBe('9 環')
  })
})

// ─── formatSpellComponents ────────────────────────────────────────────────────

describe('formatSpellComponents', () => {
  it('三個成分都有 → 聲 / 勢 / 材', () => {
    expect(formatSpellComponents({ verbal: true, somatic: true, material: '一根羽毛' })).toBe(
      '聲 / 勢 / 材',
    )
  })

  it('只有聲 → 聲', () => {
    expect(formatSpellComponents({ verbal: true, somatic: false, material: '' })).toBe('聲')
  })

  it('聲 + 材 → 聲 / 材', () => {
    expect(formatSpellComponents({ verbal: true, somatic: false, material: '一片葉子' })).toBe(
      '聲 / 材',
    )
  })

  it('全部 falsy → —', () => {
    expect(formatSpellComponents({ verbal: false, somatic: false, material: '' })).toBe('—')
  })

  it('material 為空字串視為無材料成分', () => {
    expect(formatSpellComponents({ verbal: false, somatic: true, material: '' })).toBe('勢')
  })
})

// ─── groupSpellsByLevel ───────────────────────────────────────────────────────

function makeSpell(name: string, level: number, school: Spell['school'] = 'evocation'): Spell {
  return {
    name,
    level,
    school,
    castingTime: '1 個動作',
    range: '30 英尺',
    verbal: true,
    somatic: false,
    material: '',
    duration: '瞬間',
    concentration: false,
    ritual: false,
    desc: '',
  }
}

describe('groupSpellsByLevel', () => {
  it('空陣列回傳空陣列', () => {
    expect(groupSpellsByLevel([])).toEqual([])
  })

  it('依環數由低至高排序分組', () => {
    const spells = [makeSpell('B', 3), makeSpell('A', 1), makeSpell('C', 2)]
    const groups = groupSpellsByLevel(spells)
    expect(groups.map((g) => g.level)).toEqual([1, 2, 3])
  })

  it('同一環數內依中文名稱排序', () => {
    const spells = [makeSpell('魔法飛彈', 1), makeSpell('火焰箭', 1), makeSpell('魅惑人類', 1)]
    const groups = groupSpellsByLevel(spells)
    const names = groups[0]!.spells.map((s) => s.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'zh-Hant')))
  })

  it('戲法（level 0）與高環法術正確分組', () => {
    const spells = [makeSpell('火焰術', 0), makeSpell('火焰箭', 1)]
    const groups = groupSpellsByLevel(spells)
    expect(groups).toHaveLength(2)
    expect(groups[0]!.level).toBe(0)
    expect(groups[1]!.level).toBe(1)
  })

  it('每個分組的 spells 陣列包含正確的法術', () => {
    const spells = [makeSpell('A', 2), makeSpell('B', 1), makeSpell('C', 2)]
    const groups = groupSpellsByLevel(spells)
    const level2 = groups.find((g) => g.level === 2)!
    expect(level2.spells).toHaveLength(2)
    expect(level2.spells.map((s) => s.name).sort()).toEqual(['A', 'C'])
  })
})
