/**
 * 天干地支及相关数据类型定义
 *
 * 所有排盘算法的核心数据结构——语言无关。
 * UI 层展示时根据 locale 将 index 转为对应语言文本即可。
 */

/** 天干（十天干） */
export const TIAN_GAN: string[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
/** 天干阴阳：0=阳, 1=阴 */
export const TIAN_GAN_YIN_YANG: number[] = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
/** 天干五行：0=木, 1=木, 2=火, 3=火, 4=土, 5=土, 6=金, 7=金, 8=水, 9=水 */
export const TIAN_GAN_WU_XING: number[] = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];

/** 地支（十二地支） */
export const DI_ZHI: string[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
/** 地支阴阳 */
export const DI_ZHI_YIN_YANG: number[] = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
/** 地支五行：子=水, 丑=土, 寅=木, 卯=木, 辰=土, 巳=火, 午=火, 未=土, 申=金, 酉=金, 戌=土, 亥=水 */
export const DI_ZHI_WU_XING: number[] = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
/** 地支藏干 */
export const DI_ZHI_CANG_GAN: number[][] = [
  [9],       // 子藏癸
  [5, 9, 7], // 丑藏己癸辛
  [0, 2, 4], // 寅藏甲丙戊
  [1],       // 卯藏乙
  [4, 1, 9], // 辰藏戊乙癸
  [2, 4, 6], // 巳藏丙戊庚
  [3, 5],    // 午藏丁己
  [5, 1, 3], // 未藏己丁乙
  [6, 8, 4], // 申藏庚壬戊
  [7],       // 酉藏辛
  [4, 7, 3], // 戌藏戊辛丁
  [8, 0],    // 亥藏壬甲
];

/** 五行名称 */
export const WU_XING: string[] = ['木', '火', '土', '金', '水'];

/** 五行生克关系 */
export const WU_XING_SHENG: number[][] = [
  /*木*/[4], /*木生火*/
  /*火*/[2], /*火生土*/
  /*土*/[3], /*土生金*/
  /*金*/[4], /*金生水*/
  /*水*/[0], /*水生木*/
];
export const WU_XING_KE: number[][] = [
  /*木*/[2], /*木克土*/
  /*火*/[3], /*火克金*/
  /*土*/[4], /*土克水*/
  /*金*/[0], /*金克木*/
  /*水*/[1], /*水克火*/
];

/** 六十甲子（干支组合） */
export const SIXTY_JIA_ZI: string[] = (() => {
  const result: string[] = [];
  for (let i = 0; i < 60; i++) {
    result.push(TIAN_GAN[i % 10] + DI_ZHI[i % 12]);
  }
  return result;
})();

/**
 * 单个柱（年/月/日/时）
 */
export interface Pillar {
  /** 天干索引 (0-9) */
  ganIndex: number;
  /** 地支索引 (0-11) */
  zhiIndex: number;
  /** 藏干索引数组 */
  cangGan?: number[];
}

/**
 * 四柱（八字）
 */
export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

/**
 * 十神关系
 * 比肩(0) 劫财(1) 食神(2) 伤官(3) 正财(4) 偏财(5) 正官(6) 七杀(7) 正印(8) 偏印(9)
 */
export const SHI_SHEN: string[] = [
  '比肩', '劫财', '食神', '伤官', '正财', '偏财', '正官', '七杀', '正印', '偏印',
];

/**
 * 大运信息
 */
export interface DaYun {
  /** 起运年龄（实岁） */
  startAge: number;
  /** 大运是顺排还是逆排 */
  isShun: boolean;
  /** 每柱大运（十年一柱） */
  pillars: Pillar[];
}

/**
 * 流年信息
 */
export interface LiuNian {
  /** 年份 */
  year: number;
  /** 干支 */
  pillar: Pillar;
  /** 年龄 */
  age: number;
  /** 当前运势简要描述 */
  description?: string;
}

/**
 * 完整命盘
 */
export interface BaZiResult {
  /** 输入信息 */
  input: BaZiInput;
  /** 四柱八字 */
  fourPillars: FourPillars;
  /** 日主天干索引 */
  dayMaster: number;
  /** 十神（年干、月干、日支、时干的十神索引） */
  shiShen: number[];
  /** 五行统计 [木, 火, 土, 金, 水] */
  wuXingCount: number[];
  /** 大运 */
  daYun: DaYun;
  /** 当前流年 */
  liuNian?: LiuNian;
}

/**
 * 八字输入信息
 */
export interface BaZiInput {
  /** 公历年份 */
  year: number;
  /** 公历月份 (1-12) */
  month: number;
  /** 公历日期 (1-31) */
  day: number;
  /** 出生时辰 (0-12, 0=子时, 1=丑时, ..., 12=子时晚) */
  hour: number;
  /** 分钟 (0-59) */
  minute: number;
  /** 性别: 0=男, 1=女 */
  gender: 0 | 1;
}
