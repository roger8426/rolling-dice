import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useId } from 'vue'
import FavoriteSpellList from '~/components/business/character/quickview/FavoriteSpellList.vue'
import { formatSpellLevel, groupSpellsByLevel } from '~/helpers/spell'
import { createMockCharacter } from '~/tests/fixtures/character'
import type { Character } from '~/types/business/character'
import type { Spell } from '~/types/business/spell'

const FIREBALL_ID = 'fav-spell-001'
const FROST_RAY_ID = 'fav-spell-002'
const CANTRIP_ID = 'fav-spell-003'

function makeSpell(overrides: Partial<Spell> & Pick<Spell, 'id' | 'name' | 'level'>): Spell {
  return {
    school: 'evocation',
    castingTime: '1 個動作',
    range: '90 英尺',
    verbal: true,
    somatic: true,
    material: '',
    duration: '瞬間',
    concentration: false,
    ritual: false,
    desc: '',
    ...overrides,
  }
}

const SPELLS: Record<string, Spell> = {
  [FIREBALL_ID]: makeSpell({ id: FIREBALL_ID, name: '火球術', level: 3 }),
  [FROST_RAY_ID]: makeSpell({ id: FROST_RAY_ID, name: '寒冰射線', level: 1, ritual: true }),
  [CANTRIP_ID]: makeSpell({ id: CANTRIP_ID, name: '火花', level: 0 }),
}

beforeEach(() => {
  vi.stubGlobal('useId', useId)
  vi.stubGlobal('useSpells', () => ({ getSpell: (id: string) => SPELLS[id] }))
  vi.stubGlobal('groupSpellsByLevel', groupSpellsByLevel)
  vi.stubGlobal('formatSpellLevel', formatSpellLevel)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function mountList(character: Character) {
  return mount(FavoriteSpellList, {
    props: { character },
    global: {
      mocks: { formatSpellLevel },
    },
  })
}

describe('FavoriteSpellList', () => {
  it('favoriteSpellIds 為空時顯示空狀態提示', () => {
    const character = createMockCharacter({ favoriteSpellIds: [] })
    const wrapper = mountList(character)
    expect(wrapper.text()).toContain('尚未標記常用法術')
  })

  it('依環位分組並由低到高排序', () => {
    const character = createMockCharacter({
      favoriteSpellIds: [FIREBALL_ID, CANTRIP_ID, FROST_RAY_ID],
    })
    const wrapper = mountList(character)
    const groupHeaders = wrapper.findAll('h4').map((el) => el.text())
    expect(groupHeaders).toEqual(['戲法', '1 環', '3 環'])
  })

  it('點選法術 → emit select 事件帶該法術 id', async () => {
    const character = createMockCharacter({ favoriteSpellIds: [FIREBALL_ID] })
    const wrapper = mountList(character)
    await wrapper.find('li button').trigger('click')
    expect(wrapper.emitted('select')).toEqual([[FIREBALL_ID]])
  })

  it('資料庫中不存在的 id 應被靜默過濾，不渲染', () => {
    const character = createMockCharacter({
      favoriteSpellIds: [FIREBALL_ID, 'unknown-id'],
    })
    const wrapper = mountList(character)
    const rows = wrapper.findAll('li button')
    expect(rows).toHaveLength(1)
    expect(rows[0]!.text()).toContain('火球術')
  })
})
