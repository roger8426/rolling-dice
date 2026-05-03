import { describe, expect, it } from 'vitest'
import { getSuggestedPactSlots, getSuggestedRegularSpellSlots } from '~/helpers/spell-slots'
import type { ProfessionEntry } from '~/types/business/character'
import type { ProfessionKey } from '~/types/business/dnd'

const entry = (profession: ProfessionKey, level: number): ProfessionEntry => ({
  profession,
  level,
  subprofession: null,
})

describe('getSuggestedRegularSpellSlots', () => {
  describe('全施法者單職業', () => {
    it('法師 5 級 → 1:4, 2:3, 3:2', () => {
      expect(getSuggestedRegularSpellSlots([entry('wizard', 5)])).toEqual({ 1: 4, 2: 3, 3: 2 })
    })

    it('牧師 1 級 → 1:2', () => {
      expect(getSuggestedRegularSpellSlots([entry('cleric', 1)])).toEqual({ 1: 2 })
    })

    it('吟遊詩人 20 級 → 9 環表格滿值', () => {
      expect(getSuggestedRegularSpellSlots([entry('bard', 20)])).toEqual({
        1: 4,
        2: 3,
        3: 3,
        4: 3,
        5: 3,
        6: 2,
        7: 2,
        8: 1,
        9: 1,
      })
    })
  })

  describe('半施法者（向下取整）', () => {
    it('聖武士 1 級 → 無環位（effective 0）', () => {
      expect(getSuggestedRegularSpellSlots([entry('paladin', 1)])).toEqual({})
    })

    it('聖武士 2 級 → effective 1 → 1:2', () => {
      expect(getSuggestedRegularSpellSlots([entry('paladin', 2)])).toEqual({ 1: 2 })
    })

    it('遊俠 5 級 → effective 2 → 1:3', () => {
      expect(getSuggestedRegularSpellSlots([entry('ranger', 5)])).toEqual({ 1: 3 })
    })
  })

  describe('奇械師（向上取整）', () => {
    it('奇械師 1 級 → effective 1 → 1:2', () => {
      expect(getSuggestedRegularSpellSlots([entry('artificer', 1)])).toEqual({ 1: 2 })
    })

    it('奇械師 2 級 → effective 1 → 1:2', () => {
      expect(getSuggestedRegularSpellSlots([entry('artificer', 2)])).toEqual({ 1: 2 })
    })

    it('奇械師 4 級 → effective 2 → 1:3', () => {
      expect(getSuggestedRegularSpellSlots([entry('artificer', 4)])).toEqual({ 1: 3 })
    })

    it('奇械師 7 級 → effective 3 → 1:4, 2:2', () => {
      expect(getSuggestedRegularSpellSlots([entry('artificer', 7)])).toEqual({ 1: 4, 2: 2 })
    })
  })

  describe('多職業合併', () => {
    it('牧師 3 + 聖武士 2 → effective 4 → 1:4, 2:3', () => {
      expect(getSuggestedRegularSpellSlots([entry('cleric', 3), entry('paladin', 2)])).toEqual({
        1: 4,
        2: 3,
      })
    })

    it('法師 3 + 牧師 2 → effective 5 → 1:4, 2:3, 3:2', () => {
      expect(getSuggestedRegularSpellSlots([entry('wizard', 3), entry('cleric', 2)])).toEqual({
        1: 4,
        2: 3,
        3: 2,
      })
    })
  })

  describe('契術師不參與一般環位計算', () => {
    it('術士 5 級 → {}（不疊加到一般環位）', () => {
      expect(getSuggestedRegularSpellSlots([entry('warlock', 5)])).toEqual({})
    })

    it('法師 3 + 術士 5 → 一般只看法師 3 → 1:4, 2:2', () => {
      expect(getSuggestedRegularSpellSlots([entry('wizard', 3), entry('warlock', 5)])).toEqual({
        1: 4,
        2: 2,
      })
    })
  })

  describe('非施法職業與邊界', () => {
    it('戰士 5 級 → {}', () => {
      expect(getSuggestedRegularSpellSlots([entry('fighter', 5)])).toEqual({})
    })

    it('空陣列 → {}', () => {
      expect(getSuggestedRegularSpellSlots([])).toEqual({})
    })

    it('null profession 與等級 0 應略過', () => {
      expect(
        getSuggestedRegularSpellSlots([
          { profession: null, level: 5 },
          { profession: 'wizard', level: 0 },
        ]),
      ).toEqual({})
    })
  })
})

describe('getSuggestedPactSlots', () => {
  it('術士 1 級 → 1:1', () => {
    expect(getSuggestedPactSlots([entry('warlock', 1)])).toEqual({ 1: 1 })
  })

  it('術士 5 級 → 3:2', () => {
    expect(getSuggestedPactSlots([entry('warlock', 5)])).toEqual({ 3: 2 })
  })

  it('術士 11 級 → 5:3', () => {
    expect(getSuggestedPactSlots([entry('warlock', 11)])).toEqual({ 5: 3 })
  })

  it('術士 17 級 → 5:4', () => {
    expect(getSuggestedPactSlots([entry('warlock', 17)])).toEqual({ 5: 4 })
  })

  it('非契術師職業 → {}', () => {
    expect(getSuggestedPactSlots([entry('wizard', 5)])).toEqual({})
  })

  it('法師 3 + 術士 5 → 只看術士 5 → 3:2', () => {
    expect(getSuggestedPactSlots([entry('wizard', 3), entry('warlock', 5)])).toEqual({ 3: 2 })
  })

  it('空陣列 → {}', () => {
    expect(getSuggestedPactSlots([])).toEqual({})
  })

  it('null profession 應略過', () => {
    expect(getSuggestedPactSlots([{ profession: null, level: 5 }])).toEqual({})
  })
})
