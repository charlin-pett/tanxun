/**
 * 天干地支计算工具函数
 *
 * 提供最底层的干支计算逻辑：
 * - 天干/地支/五行的索引转换
 * - 日干支计算（基于公历日期）
 * - 时辰索引计算
 * - 六十甲子索引计算
 *
 * 所有函数返回数字索引，不包含任何自然语言文本。
 * UI 层根据 locale 将索引转为对应文字。
 */
import {
  TIAN_GAN_WU_XING,
  TIAN_GAN_YIN_YANG,
  DI_ZHI_WU_XING,
  DI_ZHI_YIN_YANG,
  SIXTY_JIA_ZI,
} from '@/engine/types';

/**
 * 判断某年是否为闰年
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * 获取某月天数（公历）
 */
export function daysInMonth(year: number, month: number): number {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) return 29;
  return days[month - 1];
}

/**
 * 计算从公元1年1月1日到目标日期的总天数
 */
export function totalDaysFromEpoch(year: number, month: number, day: number): number {
  let total = 0;
  for (let y = 1; y < year; y++) {
    total += isLeapYear(y) ? 366 : 365;
  }
  for (let m = 1; m < month; m++) {
    total += daysInMonth(year, m);
  }
  total += day - 1; // 减去1月1日本身
  return total;
}

/**
 * 计算从 1900年1月1日 到目标日期的天数
 *
 * 1900年1月1日 = 甲戌日（六十甲子索引 10）
 * 用于计算日干支
 */
export function daysSince1900(year: number, month: number, day: number): number {
  const epoch1900 = totalDaysFromEpoch(1900, 1, 1);
  const target = totalDaysFromEpoch(year, month, day);
  return target - epoch1900;
}

/**
 * 获取年干支索引（0-59）
 *
 * 年干支从立春开始，此处使用简化计算（以公历年份为准），
 * 精确计算需根据立春日期调整。
 *
 * 公式：(year - 4) % 60 取六十甲子索引
 */
export function getYearGanzhiIndex(year: number): number {
  // 公元4年为甲子年（索引0）
  return ((year - 4) % 60 + 60) % 60;
}

/**
 * 获取年天干索引 (0-9)
 */
export function getYearGan(year: number): number {
  return ((year - 4) % 10 + 10) % 10;
}

/**
 * 获取年地支索引 (0-11)
 */
export function getYearZhi(year: number): number {
  return ((year - 4) % 12 + 12) % 12;
}

/**
 * 获取日干支索引（0-59）
 *
 * 使用 1900年1月1日（甲戌日，索引10）作为基准。
 * 日干支 = (10 + daysSince1900) % 60
 */
export function getDayGanzhiIndex(year: number, month: number, day: number): number {
  const days = daysSince1900(year, month, day);
  return ((10 + days) % 60 + 60) % 60;
}

/**
 * 获取日天干索引 (0-9)
 */
export function getDayGan(year: number, month: number, day: number): number {
  return getDayGanzhiIndex(year, month, day) % 10;
}

/**
 * 获取日地支索引 (0-11)
 */
export function getDayZhi(year: number, month: number, day: number): number {
  return getDayGanzhiIndex(year, month, day) % 12;
}

/**
 * 根据小时+分钟获取时辰索引 (0-11)
 *
 * 时辰划分（24小时制）：
 *   子时(0): 23:00-00:59
 *   丑时(1): 01:00-02:59
 *   寅时(2): 03:00-04:59
 *   卯时(3): 05:00-06:59
 *   辰时(4): 07:00-08:59
 *   巳时(5): 09:00-10:59
 *   午时(6): 11:00-12:59
 *   未时(7): 13:00-14:59
 *   申时(8): 15:00-16:59
 *   酉时(9): 17:00-18:59
 *   戌时(10): 19:00-20:59
 *   亥时(11): 21:00-22:59
 *
 * @param hour - 小时 (0-23)
 * @param minute - 分钟 (0-59)
 * @returns 时辰索引 (0-11)
 */
export function getHourZhi(hour: number, minute: number = 0): number {
  // 23点→子时(0), 0点→子时(0), 1-2→丑(1), 3-4→寅(2), ...
  if (hour === 23) return 0;
  return Math.floor((hour + 1) / 2);
}

/**
 * 五虎遁：根据年干计算寅月（正月）的天干索引
 *
 * 口诀：
 *   甲己之年丙作首 → 年干0/5 → 寅月干从丙(2)起
 *   乙庚之岁戊为头 → 年干1/6 → 寅月干从戊(4)起
 *   丙辛之岁寻庚上 → 年干2/7 → 寅月干从庚(6)起
 *   丁壬壬寅顺水流 → 年干3/8 → 寅月干从壬(8)起
 *   若问戊癸何处起 → 年干4/9 → 寅月干从甲(0)起
 *
 * @param yearGan - 年天干索引
 * @returns 寅月（正月）的天干索引
 */
export function getMonthStartGan(yearGan: number): number {
  return ((yearGan % 5) * 2 + 2) % 10;
}

/**
 * 根据年干和月份（节气月，0=寅月）获取月天干索引
 *
 * @param yearGan - 年天干索引
 * @param monthIndex - 节气月索引 (0=寅月, 1=卯月, ..., 11=丑月)
 * @returns 月天干索引
 */
export function getMonthGan(yearGan: number, monthIndex: number): number {
  const start = getMonthStartGan(yearGan);
  return (start + monthIndex) % 10;
}

/**
 * 获取月份对应的地支索引
 *
 * 节气月到地支的映射：
 *   寅月(0)→寅(2), 卯月(1)→卯(3), ..., 丑月(11)→丑(1)
 *
 * @param monthIndex - 节气月索引 (0-11, 0=寅月)
 * @returns 地支索引
 */
export function getMonthZhi(monthIndex: number): number {
  return (monthIndex + 2) % 12;
}

/**
 * 根据公历月份近似估算节气月索引
 *
 * 简化版：粗略将公历月份 - 2 作为节气月索引。
 * 精确版需要根据节气日期（立春、惊蛰等）计算。
 *
 * 公历2月≈寅月(0), 3月≈卯月(1), ..., 1月≈丑月(11)
 *
 * @param gregorianMonth - 公历月份 (1-12)
 * @returns 节气月索引 (0-11)
 */
export function gregorianMonthToLunarMonth(gregorianMonth: number): number {
  return ((gregorianMonth - 2) % 12 + 12) % 12;
}

/**
 * 五鼠遁：根据日干计算子时的天干索引
 *
 * 口诀：
 *   甲己还加甲 → 日干0/5 → 子时干从甲(0)起
 *   乙庚丙作初 → 日干1/6 → 子时干从丙(2)起
 *   丙辛从戊起 → 日干2/7 → 子时干从戊(4)起
 *   丁壬庚子居 → 日干3/8 → 子时干从庚(6)起
 *   戊癸何方发 → 日干4/9 → 子时干从壬(8)起
 *
 * @param dayGan - 日天干索引
 * @returns 子时的天干索引
 */
export function getHourStartGan(dayGan: number): number {
  return ((dayGan % 5) * 2) % 10;
}

/**
 * 根据日干和时辰索引获取时天干索引
 *
 * @param dayGan - 日天干索引
 * @param hourZhi - 时辰索引 (0=子时, ..., 11=亥时)
 * @returns 时天干索引
 */
export function getHourGan(dayGan: number, hourZhi: number): number {
  const start = getHourStartGan(dayGan);
  return (start + hourZhi) % 10;
}

/**
 * 获取干支文字表示
 *
 * @param index - 六十甲子索引 (0-59)
 * @returns 干支字符串，如"甲子"
 */
export function getGanzhiText(index: number): string {
  return SIXTY_JIA_ZI[((index % 60) + 60) % 60];
}

/**
 * 获取天干五行索引 (0-4: 木火土金水)
 */
export function getGanWuxing(ganIndex: number): number {
  return TIAN_GAN_WU_XING[ganIndex];
}

/**
 * 获取地支五行索引 (0-4: 木火土金水)
 */
export function getZhiWuxing(zhiIndex: number): number {
  return DI_ZHI_WU_XING[zhiIndex];
}

/**
 * 获取天干阴阳 (0=阳, 1=阴)
 */
export function getGanYinYang(ganIndex: number): number {
  return TIAN_GAN_YIN_YANG[ganIndex];
}

/**
 * 获取地支阴阳 (0=阳, 1=阴)
 */
export function getZhiYinYang(zhiIndex: number): number {
  return DI_ZHI_YIN_YANG[zhiIndex];
}
