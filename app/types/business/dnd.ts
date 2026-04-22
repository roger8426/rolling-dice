// ─── Profession ───────────────────────────────────────────────────────────────

export type ProfessionKey =
  | 'artificer' // 奇械師
  | 'barbarian' // 野蠻人
  | 'bard' // 吟遊詩人
  | 'cleric' // 牧師
  | 'druid' // 德魯伊
  | 'fighter' // 戰士
  | 'monk' // 武僧
  | 'paladin' // 聖騎士
  | 'ranger' // 游俠
  | 'rogue' // 遊蕩者
  | 'sorcerer' // 術士
  | 'warlock' // 契術師
  | 'wizard' // 魔法師

/** 職業靜態設定資料 */
export interface ProfessionData {
  /** 職業中文名稱 */
  label: string
  /** 生命骰面數（例如 12 代表 d12） */
  hitDie: number
  /** D&D 5e 標準豁免熟練屬性（兩項） */
  savingThrowProficiencies: readonly AbilityKey[]
}

// ─── Ability ──────────────────────────────────────────────────────────────────

export type AbilityKey =
  | 'strength' // 力量
  | 'dexterity' // 敏捷
  | 'constitution' // 體質
  | 'intelligence' // 智力
  | 'wisdom' // 感知
  | 'charisma' // 魅力

// ─── Skill ────────────────────────────────────────────────────────────────────

export type SkillKey =
  //力量
  | 'athletics' // 運動
  //敏捷
  | 'acrobatics' // 特技
  | 'sleightOfHand' // 巧手
  | 'stealth' // 隱匿
  //智力
  | 'arcana' // 奧秘
  | 'history' // 歷史
  | 'investigation' // 調查
  | 'nature' // 自然
  | 'religion' // 宗教
  //感知
  | 'animalHandling' // 馴獸
  | 'insight' // 洞察
  | 'medicine' // 醫藥
  | 'perception' // 察覺
  | 'survival' // 求生
  //魅力
  | 'deception' // 欺瞞
  | 'intimidation' // 威嚇
  | 'performance' // 表演
  | 'persuasion' // 說服

// ─── Alignment ────────────────────────────────────────────────────────────────

export type MoralityKey = 'good' | 'neutral' | 'evil'

export type OrderKey = 'lawful' | 'neutral' | 'chaotic'

export type AlignmentKey =
  | 'lawfulGood'
  | 'neutralGood'
  | 'chaoticGood'
  | 'lawfulNeutral'
  | 'trueNeutral'
  | 'chaoticNeutral'
  | 'lawfulEvil'
  | 'neutralEvil'
  | 'chaoticEvil'

// ─── Race ─────────────────────────────────────────────────────────────────────

export type RaceKey =
  | 'human'
  | 'elf'
  | 'dwarf'
  | 'halfling'
  | 'gnome'
  | 'halfElf'
  | 'halfOrc'
  | 'tiefling'
  | 'dragonborn'
  | 'aasimar'

// ─── Size ─────────────────────────────────────────────────────────────────────

/** 體型：D&D 尺寸分類，從超微型到龐大型 */
export type SizeKey =
  | 'tiny' // 微型
  | 'small' // 小型
  | 'medium' // 中型
  | 'large' // 大型
  | 'huge' // 超大型
  | 'gargantuan' // 巨型

// ─── Proficiency ─────────────────────────────────────────────────────────────

/** 熟練等級：無熟練、熟練、專精 */
export type ProficiencyLevel =
  | 'none' // 無熟練
  | 'proficient' // 熟練
  | 'expertise' // 專精（加值翻倍）

// ─── Gender ───────────────────────────────────────────────────────────────────

/** 性別 */
export type GenderKey =
  | 'male' // 男性
  | 'female' // 女性
  | 'nonBinary' // 非二元

// ─── Armor / Weapon ────────────────────────────────────────────────────────────────

export type ArmorType = 'light' | 'medium' | 'heavy' | 'none'

export type WeaponType = 'simple' | 'martial'

export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100'

export type DamageDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12'
