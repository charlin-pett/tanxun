/**
 * 星座计算工具
 *
 * 根据公历月日计算星座。
 * 语言无关——返回星座索引 (0-11)，UI层根据 locale 转换文字。
 */

/** 星座索引对照（0=白羊, 1=金牛, ..., 11=双鱼） */
export const ZODIAC_NAMES: string[] = [
  '白羊座', '金牛座', '双子座', '巨蟹座',
  '狮子座', '处女座', '天秤座', '天蝎座',
  '射手座', '摩羯座', '水瓶座', '双鱼座',
];

/** 星座日期范围 [月份, 日期] */
const ZODIAC_BOUNDARIES: { month: number; day: number; index: number }[] = [
  { month: 3, day: 21, index: 0 },  // 白羊座 Aries
  { month: 4, day: 20, index: 1 },  // 金牛座 Taurus
  { month: 5, day: 21, index: 2 },  // 双子座 Gemini
  { month: 6, day: 22, index: 3 },  // 巨蟹座 Cancer
  { month: 7, day: 23, index: 4 },  // 狮子座 Leo
  { month: 8, day: 23, index: 5 },  // 处女座 Virgo
  { month: 9, day: 23, index: 6 },  // 天秤座 Libra
  { month: 10, day: 24, index: 7 }, // 天蝎座 Scorpio
  { month: 11, day: 23, index: 8 }, // 射手座 Sagittarius
  { month: 12, day: 22, index: 9 }, // 摩羯座 Capricorn
  { month: 1, day: 20, index: 10 }, // 水瓶座 Aquarius
  { month: 2, day: 19, index: 11 }, // 双鱼座 Pisces
];

/**
 * 根据月日获取星座索引
 *
 * @param month - 月份 (1-12)
 * @param day - 日期 (1-31)
 * @returns 星座索引 (0-11)，无效日期返回 -1
 */
export function getZodiacIndex(month: number, day: number): number {
  if (month < 1 || month > 12 || day < 1 || day > 31) return -1;

  for (const b of ZODIAC_BOUNDARIES) {
    if (
      (month === b.month && day >= b.day) ||
      (month > b.month && month < (b.index === 10 ? 1 : b.month + 1))
    ) {
      return b.index;
    }
    // 跨年处理（摩羯座之后的水瓶座和双鱼座）
    if (month === 1 && b.index >= 10) {
      if (b.index === 10 && day >= b.day) return b.index;
      if (b.index === 11 && day >= ZODIAC_BOUNDARIES[10].day + 1 && day <= b.day) return b.index;
    }
  }

  // 兜底：1月1日-1月19日为摩羯座(9)
  if (month === 1 && day <= 19) return 9;
  // 2月20日之后的为双鱼座(11)
  if (month === 2 && day >= 20) return 11;

  return -1;
}

/**
 * 获取星座的农历月份区间（用于跨年判断）
 *
 * @param index - 星座索引
 * @returns [startMonth, startDay, endMonth, endDay]
 */
export function getZodiacDateRange(index: number): { start: string; end: string } {
  const b = ZODIAC_BOUNDARIES[index];
  const next = ZODIAC_BOUNDARIES[(index + 1) % 12];
  return {
    start: `${b.month}月${b.day}日`,
    end: `${next.month}月${next.day - 1}日`,
  };
}
