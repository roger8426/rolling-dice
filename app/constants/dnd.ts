import type {
  AbilityKey,
  AlignmentKey,
  ProfessionKey,
  RaceKey,
  SkillKey,
} from '~/types/business/dnd'

// ─── Profession ───────────────────────────────────────────────────────────────

export const PROFESSION_NAMES: Record<ProfessionKey, string> = {
  artificer: '奇械師',
  barbarian: '野蠻人',
  bard: '吟遊詩人',
  cleric: '牧師',
  druid: '德魯伊',
  fighter: '戰士',
  monk: '武僧',
  paladin: '聖武士',
  ranger: '遊俠',
  rogue: '遊蕩者',
  sorcerer: '術士',
  warlock: '契術師',
  wizard: '法師',
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
  acrobatics: '特技',
  animalHandling: '馴獸',
  arcana: '奧秘',
  athletics: '運動',
  deception: '欺瞞',
  history: '歷史',
  insight: '洞察',
  intimidation: '威嚇',
  investigation: '調查',
  medicine: '醫藥',
  nature: '自然',
  perception: '察覺',
  performance: '表演',
  persuasion: '說服',
  religion: '宗教',
  sleightOfHand: '巧手',
  stealth: '隱匿',
  survival: '求生',
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
