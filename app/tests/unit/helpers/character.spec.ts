import { describe, expect, it } from 'vitest'
import { getBaseArmorClass, getCharacterTier, getPassivePerception } from '~/helpers/character'

describe('getCharacterTier', () => {
  describe('common 等級 (1–4)', () => {
    it('等級 1 應回傳 common', () => {
      expect(getCharacterTier(1)).toBe('common')
    })

    it('等級 4 應回傳 common（上界）', () => {
      expect(getCharacterTier(4)).toBe('common')
    })
  })

  describe('elite 等級 (5–10)', () => {
    it('等級 5 應回傳 elite（下界）', () => {
      expect(getCharacterTier(5)).toBe('elite')
    })

    it('等級 10 應回傳 elite（上界）', () => {
      expect(getCharacterTier(10)).toBe('elite')
    })
  })

  describe('master 等級 (11–16)', () => {
    it('等級 11 應回傳 master（下界）', () => {
      expect(getCharacterTier(11)).toBe('master')
    })

    it('等級 16 應回傳 master（上界）', () => {
      expect(getCharacterTier(16)).toBe('master')
    })
  })

  describe('legendary 等級 (17–20)', () => {
    it('等級 17 應回傳 legendary（下界）', () => {
      expect(getCharacterTier(17)).toBe('legendary')
    })

    it('等級 20 應回傳 legendary（最高等級）', () => {
      expect(getCharacterTier(20)).toBe('legendary')
    })
  })
})

describe('getBaseArmorClass', () => {
  it('敏捷調整值為正數時，AC = 10 + modifier', () => {
    expect(getBaseArmorClass(3)).toBe(13)
  })

  it('敏捷調整值為 0 時，AC = 10', () => {
    expect(getBaseArmorClass(0)).toBe(10)
  })

  it('敏捷調整值為負數時，AC < 10', () => {
    expect(getBaseArmorClass(-2)).toBe(8)
  })
})

describe('getPassivePerception', () => {
  it('感知加值為正數時，被動感知 = 10 + bonus', () => {
    expect(getPassivePerception(5)).toBe(15)
  })

  it('感知加值為 0 時，被動感知 = 10', () => {
    expect(getPassivePerception(0)).toBe(10)
  })

  it('感知加值為負數時，被動感知 < 10', () => {
    expect(getPassivePerception(-1)).toBe(9)
  })
})
