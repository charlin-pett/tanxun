/**
 * 六十四卦数据类型定义
 *
 * 语言无关——所有文本字段按语言存储在对应的 JSON 文件中。
 * 代码层只通过 number（卦序）索引数据。
 */

/**
 * 单条爻辞
 */
export interface HexagramLine {
  /** 爻位名称，如"初九"、"六二" */
  position: string;
  /** 爻辞原文 */
  text: string;
  /** 现代释义 */
  meaning: string;
}

/**
 * 单个卦象
 */
export interface Hexagram {
  /** 卦序（1-64） */
  number: number;
  /** 卦名，如"乾" */
  name: string;
  /** 卦名全称，如"乾为天" */
  fullName: string;
  /** Unicode 卦符字符，如"䷀" */
  symbol: string;
  /** 上卦（外卦），如"乾" */
  upperTrigram: string;
  /** 下卦（内卦），如"乾" */
  lowerTrigram: string;
  /** 卦辞 */
  judgment: string;
  /** 六爻（从初到上） */
  lines: HexagramLine[];
  /** 象传 */
  xiang?: string;
  /** 现代释义/简述 */
  meaning: string;
  /** 分类标签 */
  category?: string;
}

/**
 * 八卦基本信息
 */
export interface Trigram {
  name: string;
  symbol: string;
  attribute: string;
  animal: string;
  element: string;
  direction: string;
}
