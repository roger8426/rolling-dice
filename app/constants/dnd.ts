import type {
  AbilityKey,
  AlignmentKey,
  GenderKey,
  ProfessionData,
  ProfessionKey,
  RaceKey,
  SizeKey,
  SkillKey,
} from '~/types/business/dnd'

// ─── Profession ───────────────────────────────────────────────────────────────

/** 各職業靜態設定（D&D 5e PHB 標準） */
export const PROFESSION_CONFIG: Record<ProfessionKey, ProfessionData> = {
  artificer: {
    label: '奇械師',
    hitDie: 8,
    savingThrowProficiencies: ['constitution', 'intelligence'],
  },
  barbarian: {
    label: '野蠻人',
    hitDie: 12,
    savingThrowProficiencies: ['strength', 'constitution'],
  },
  bard: { label: '吟遊詩人', hitDie: 8, savingThrowProficiencies: ['dexterity', 'charisma'] },
  cleric: { label: '牧師', hitDie: 8, savingThrowProficiencies: ['wisdom', 'charisma'] },
  druid: { label: '德魯伊', hitDie: 8, savingThrowProficiencies: ['intelligence', 'wisdom'] },
  fighter: { label: '戰士', hitDie: 10, savingThrowProficiencies: ['strength', 'constitution'] },
  monk: { label: '武僧', hitDie: 8, savingThrowProficiencies: ['strength', 'dexterity'] },
  paladin: { label: '聖武士', hitDie: 10, savingThrowProficiencies: ['wisdom', 'charisma'] },
  ranger: { label: '遊俠', hitDie: 10, savingThrowProficiencies: ['strength', 'dexterity'] },
  rogue: { label: '遊蕩者', hitDie: 8, savingThrowProficiencies: ['dexterity', 'intelligence'] },
  sorcerer: { label: '術士', hitDie: 6, savingThrowProficiencies: ['constitution', 'charisma'] },
  warlock: { label: '契術師', hitDie: 8, savingThrowProficiencies: ['wisdom', 'charisma'] },
  wizard: { label: '法師', hitDie: 6, savingThrowProficiencies: ['intelligence', 'wisdom'] },
}

// ─── Ability ──────────────────────────────────────────────────────────────────

export const ABILITY_NAMES: Record<AbilityKey, string> = {
  strength: '力量',
  dexterity: '敏捷',
  constitution: '體質',
  intelligence: '智力',
  wisdom: '感知',
  charisma: '魅力',
}

// ─── Skill ────────────────────────────────────────────────────────────────────

export const SKILL_NAMES: Record<SkillKey, string> = {
  // 力量
  athletics: '運動',
  // 敏捷
  acrobatics: '特技',
  sleightOfHand: '巧手',
  stealth: '隱匿',
  // 智力
  arcana: '奧秘',
  history: '歷史',
  investigation: '調查',
  nature: '自然',
  religion: '宗教',
  // 感知
  animalHandling: '馴獸',
  insight: '察言觀色',
  medicine: '醫藥',
  perception: '察覺',
  survival: '求生',
  // 魅力
  deception: '欺瞞',
  intimidation: '威嚇',
  performance: '表演',
  persuasion: '說服',
}

// ─── Alignment ────────────────────────────────────────────────────────────────

export const ALIGNMENT_NAMES: Record<AlignmentKey, string> = {
  lawfulGood: '守序善良',
  neutralGood: '中立善良',
  chaoticGood: '混亂善良',
  lawfulNeutral: '守序中立',
  trueNeutral: '絕對中立',
  chaoticNeutral: '混亂中立',
  lawfulEvil: '守序邪惡',
  neutralEvil: '中立邪惡',
  chaoticEvil: '混亂邪惡',
}

// ─── Race ─────────────────────────────────────────────────────────────────────

export const RACE_NAMES: Record<RaceKey, string> = {
  human: '人類',
  elf: '精靈',
  dwarf: '矮人',
  halfling: '半身人',
  gnome: '地侏',
  halfElf: '半精靈',
  halfOrc: '半獸人',
  tiefling: '提夫林',
  dragonborn: '龍裔',
  aasimar: '阿斯莫',
}

// ─── Size ─────────────────────────────────────────────────────────────────────

/** 體型中文名稱對照表 */
export const SIZE_NAMES: Record<SizeKey, string> = {
  tiny: '微型',
  small: '小型',
  medium: '中型',
  large: '大型',
  huge: '超大型',
  gargantuan: '巨型',
}

// ─── Gender ───────────────────────────────────────────────────────────────────

/** 性別中文名稱對照表 */
export const GENDER_NAMES: Record<GenderKey, string> = {
  male: '男性',
  female: '女性',
  nonBinary: '非二元',
}

// ─── Point Buy ────────────────────────────────────────────────────────────────

/** 購點制總預算（D&D 5e 標準）*/
export const POINT_BUY_BUDGET = 27

/** 購點制單項屬性最低分數 */
export const POINT_BUY_MIN_SCORE = 8

/** 購點制單項屬性最高分數 */
export const POINT_BUY_MAX_SCORE = 15

/** 購點制費用查找表：key 為屬性分數，value 為所需點數（D&D 5e PHB 標準）*/
export const POINT_BUY_COST_TABLE: Readonly<Record<number, number>> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
}

// ─── Custom ─────────────────────────────────────────────────────────────────────

/** 自訂模式屬性分數下限 */
export const CUSTOM_ABILITY_MIN = 1

/** 自訂模式屬性分數上限 */
export const CUSTOM_ABILITY_MAX = 20

// ─── Ability Defaults ─────────────────────────────────────────────────────────

/** 購點制的各屬性初始分數 */
export const POINT_BUY_DEFAULT_SCORE = 8

/** 所有 AbilityKey，用於迭代 */
export const ABILITY_KEYS: readonly AbilityKey[] = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
] as const
