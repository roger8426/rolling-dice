import type { CharacterCurrency, ItemType } from '~/types/business/character'

export const ITEM_TYPE_LABELS: Readonly<Record<ItemType, string>> = {
  weapon: '武器',
  armor: '護甲',
  consumable: '消耗品',
  other: '其他',
}

/** 最大負重（磅）= STR score × CARRY_WEIGHT_PER_STR */
export const CARRY_WEIGHT_PER_STR = 15

/** 50 枚硬幣重 1 磅 */
export const COINS_PER_LB = 50

export const DEFAULT_CURRENCY: Readonly<CharacterCurrency> = {
  cp: 0,
  sp: 0,
  gp: 0,
  pp: 0,
}
