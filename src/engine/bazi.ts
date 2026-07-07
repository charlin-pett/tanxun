/**
 * 八字排盘核心算法
 *
 * 根据出生信息计算四柱八字、十神、大运、流年。
 * 语言无关——所有输出为数字索引，UI 层根据 locale 转换显示。
 */
import {
  type Pillar,
  type FourPillars,
  type BaZiInput,
  type BaZiResult,
  type DaYun,
  type LiuNian,
  TIAN_GAN_WU_XING,
  TIAN_GAN_YIN_YANG,
  DI_ZHI_CANG_GAN,
} from '@/engine/types';
import {
  getYearGan,
  getYearZhi,
  getMonthGan,
  getMonthZhi,
  getHourGan,
  getHourZhi,
  getDayGan,
  getDayZhi,
  gregorianMonthToLunarMonth,
} from '@/engine/ganzhi';

/**
 * 计算天干对应的十神关系
 *
 * 以日主（dayMaster）为中心，判定目标天干的十神索引。
 *
 * 十神规则（以日主为中心）：
 *   同我（五行相同）→ 比肩(阴阳同) / 劫财(阴阳异)
 *   我生（日主生目标）→ 食神(阴阳同) / 伤官(阴阳异)
 *   生我（目标生日主）→ 偏印(阴阳同) / 正印(阴阳异)
 *   我克（日主克目标）→ 偏财(阴阳同) / 正财(阴阳异)
 *   克我（目标克日主）→ 七杀(阴阳同) / 正官(阴阳异)
 *
 * @param dmGan  - 日主天干索引 (0-9)
 * @param targetGan - 目标天干索引 (0-9)
 * @returns 十神索引 (0-9)
 */
export function calcShiShen(dmGan: number, targetGan: number): number {
  const dmWx = TIAN_GAN_WU_XING[dmGan];
  const dmYy = TIAN_GAN_YIN_YANG[dmGan];
  const tWx = TIAN_GAN_WU_XING[targetGan];
  const tYy = TIAN_GAN_YIN_YANG[targetGan];

  if (dmWx === tWx) {
    // 同我：五行相同
    return dmYy === tYy ? 0 : 1; // 比肩 / 劫财
  }
  if ((dmWx + 1) % 5 === tWx) {
    // 我生：日主生目标
    return dmYy === tYy ? 2 : 3; // 食神 / 伤官
  }
  if ((dmWx + 4) % 5 === tWx) {
    // 生我：目标生日主
    return dmYy === tYy ? 8 : 9; // 偏印 / 正印
  }
  if ((dmWx + 2) % 5 === tWx) {
    // 我克：日主克目标
    return dmYy === tYy ? 5 : 4; // 偏财 / 正财
  }
  if ((dmWx + 3) % 5 === tWx) {
    // 克我：目标克日主
    return dmYy === tYy ? 7 : 6; // 七杀 / 正官
  }

  return -1; // 不应该发生
}

/**
 * 统计命盘中五行的出现次数
 *
 * @param fourPillars - 四柱
 * @returns [木, 火, 土, 金, 水] 的出现次数
 */
export function countWuXing(fourPillars: FourPillars): number[] {
  const count = [0, 0, 0, 0, 0];

  // 统计四天干
  const gans = [
    fourPillars.year.ganIndex,
    fourPillars.month.ganIndex,
    fourPillars.day.ganIndex,
    fourPillars.hour.ganIndex,
  ];
  for (const g of gans) {
    count[TIAN_GAN_WU_XING[g]]++;
  }

  // 统计四地支的藏干
  const zhis = [
    fourPillars.year,
    fourPillars.month,
    fourPillars.day,
    fourPillars.hour,
  ];
  for (const z of zhis) {
    const cangGans = z.cangGan ?? DI_ZHI_CANG_GAN[z.zhiIndex];
    for (const cg of cangGans) {
      count[TIAN_GAN_WU_XING[cg]]++;
    }
  }

  return count;
}

/**
 * 计算四柱（八字排盘核心）
 *
 * @param input - 出生信息
 * @returns 四柱
 */
export function calcFourPillars(input: BaZiInput): FourPillars {
  const { year, month, day, hour, minute } = input;

  // ===== 年柱 =====
  const yearGan = getYearGan(year);
  const yearZhi = getYearZhi(year);

  // ===== 月柱 =====
  // 近似估算：公历月份转节气月
  const lunarMonth = gregorianMonthToLunarMonth(month);
  const monthGan = getMonthGan(yearGan, lunarMonth);
  const monthZhi = getMonthZhi(lunarMonth);

  // ===== 日柱 =====
  const dayGan = getDayGan(year, month, day);
  const dayZhi = getDayZhi(year, month, day);

  // ===== 时柱 =====
  const hourZhi = getHourZhi(hour, minute);
  const hourGan = getHourGan(dayGan, hourZhi);

  return {
    year: {
      ganIndex: yearGan,
      zhiIndex: yearZhi,
      cangGan: DI_ZHI_CANG_GAN[yearZhi],
    },
    month: {
      ganIndex: monthGan,
      zhiIndex: monthZhi,
      cangGan: DI_ZHI_CANG_GAN[monthZhi],
    },
    day: {
      ganIndex: dayGan,
      zhiIndex: dayZhi,
      cangGan: DI_ZHI_CANG_GAN[dayZhi],
    },
    hour: {
      ganIndex: hourGan,
      zhiIndex: hourZhi,
      cangGan: DI_ZHI_CANG_GAN[hourZhi],
    },
  };
}

/**
 * 计算十神（四天干的十神关系）
 *
 * @param dmGan - 日主天干索引
 * @param fourPillars - 四柱
 * @returns [年干十神, 月干十神, 日干=日主(用-1占位), 时干十神]
 */
export function calcShiShenForPillars(
  dmGan: number,
  fourPillars: FourPillars
): number[] {
  const targets = [
    fourPillars.year.ganIndex,
    fourPillars.month.ganIndex,
    // 日干就是日主自身，不计算十神
    -1,
    fourPillars.hour.ganIndex,
  ];
  return targets.map((t) => (t >= 0 ? calcShiShen(dmGan, t) : -1));
}

/**
 * 判断大运是顺排还是逆排
 *
 * 规则：阳年男 / 阴年女 → 顺排；阴年男 / 阳年女 → 逆排
 * 阳年 = 年干为阳（甲丙戊庚壬，索引0,2,4,6,8）
 *
 * @param yearGan - 年天干索引
 * @param gender - 性别 (0=男, 1=女)
 * @returns true=顺排, false=逆排
 */
export function isDaYunShun(yearGan: number, gender: number): boolean {
  const isYangYear = TIAN_GAN_YIN_YANG[yearGan] === 0; // 阳年
  return (isYangYear && gender === 0) || (!isYangYear && gender === 1);
}

/**
 * 计算大运
 *
 * @param fourPillars - 四柱
 * @param yearGan - 年天干索引
 * @param gender - 性别
 * @returns 大运信息
 */
export function calcDaYun(
  fourPillars: FourPillars,
  yearGan: number,
  gender: number
): DaYun {
  const shun = isDaYunShun(yearGan, gender);
  const monthZhi = fourPillars.month.zhiIndex;
  const monthGan = fourPillars.month.ganIndex;

  // 生成大运各柱（默认排8柱，每柱10年）
  const pillars: Pillar[] = [];
  const totalSteps = 8;

  for (let i = 0; i < totalSteps; i++) {
    if (shun) {
      // 顺排：递增
      const step = i + 1;
      pillars.push({
        ganIndex: (monthGan + step) % 10,
        zhiIndex: (monthZhi + step) % 12,
      });
    } else {
      // 逆排：递减
      const step = i + 1;
      pillars.push({
        ganIndex: ((monthGan - step) % 10 + 10) % 10,
        zhiIndex: ((monthZhi - step) % 12 + 12) % 12,
      });
    }
  }

  // 起运年龄简化计算：默认3岁起运
  // 精确计算需根据出生日到节气日期的天数÷3
  const startAge = 3;

  return { startAge, isShun: shun, pillars };
}

/**
 * 计算当前流年
 *
 * @param year - 当前年份
 * @returns 流年信息
 */
export function calcLiuNian(year: number): LiuNian {
  const ganIndex = ((year - 4) % 10 + 10) % 10;
  const zhiIndex = ((year - 4) % 12 + 12) % 12;
  const age = 0; // 需要在显示时根据出生年 - 当前年计算

  return {
    year,
    pillar: { ganIndex, zhiIndex },
    age,
  };
}

/**
 * 完整八字排盘
 *
 * @param input - 出生信息
 * @returns 完整命盘结果
 */
export function calcBaZi(input: BaZiInput): BaZiResult {
  // 1. 排四柱
  const fourPillars = calcFourPillars(input);

  // 2. 日主
  const dayMaster = fourPillars.day.ganIndex;

  // 3. 十神
  const shiShen = calcShiShenForPillars(dayMaster, fourPillars);

  // 4. 五行统计
  const wuXingCount = countWuXing(fourPillars);

  // 5. 大运
  const daYun = calcDaYun(fourPillars, fourPillars.year.ganIndex, input.gender);

  // 6. 当前流年（使用当前系统年份）
  const currentYear = new Date().getFullYear();
  const liuNian = calcLiuNian(currentYear);

  return {
    input,
    fourPillars,
    dayMaster,
    shiShen,
    wuXingCount,
    daYun,
    liuNian,
  };
}
