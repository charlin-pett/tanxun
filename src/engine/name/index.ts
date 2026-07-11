/**
 * 姓名测试统一入口
 *
 * 自动检测姓名类型：
 * - 中文 → 五格剖象法
 * - 非中文 → 西方生命灵数
 */

import { isChineseName, calculateWuGe, getStroke, type WuGeResult } from './chinese';
import { analyzeWesternName, type WesternNumerologyResult } from './western';

export type NameResult =
  | { type: 'chinese'; surname: string; givenName: string; result: WuGeResult }
  | { type: 'western'; fullName: string; result: WesternNumerologyResult };

export function analyzeName(fullName: string): NameResult {
  const trimmed = fullName.trim();

  // 检测是否有中文字符
  const hasChinese = trimmed.split('').some(c => c.charCodeAt(0) >= 0x4e00 && c.charCodeAt(0) <= 0x9fff);

  if (hasChinese) {
    // 中文姓名：姓氏为第一个字，其余为名
    const chars = trimmed.replace(/\s/g, '').split('');
    const surname = chars[0] || '';
    const givenName = chars.slice(1).join('');
    return {
      type: 'chinese',
      surname,
      givenName,
      result: calculateWuGe(surname, givenName),
    };
  } else {
    // 非中文姓名：西方灵数
    return {
      type: 'western',
      fullName: trimmed,
      result: analyzeWesternName(trimmed),
    };
  }
}
