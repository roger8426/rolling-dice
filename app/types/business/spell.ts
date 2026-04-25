/** 法術學派（以英文 camelCase 為 key，中文僅為顯示 label） */
export type SpellSchool =
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation'

/** 來自 public/json/spells.json (v1) 的原始法術資料；school 以中文字串儲存。 */
export interface SpellDto {
  name: string
  level: number
  school: string
  castingTime: string
  range: string
  verbal: boolean
  somatic: boolean
  material: string
  duration: string
  concentration: boolean
  ritual: boolean
  desc: string
}

/** 正規化後的法術資料，供 UI 使用。 */
export interface Spell extends Omit<SpellDto, 'school'> {
  school: SpellSchool
}
