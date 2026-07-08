/**
 * 多语言标签转换工具
 *
 * 将引擎输出的数字索引转换为不同语言的文字。
 * 默认输出中文，传入 locale 参数可切换语言。
 *
 * 使用方式：
 *   import { getGanText } from '@/engine/labels';
 *   getGanText(0, 'en') → "Jia"
 *   getGanText(0)       → "甲"（默认中文）
 */
import {
  TIAN_GAN, DI_ZHI, WU_XING, SHI_SHEN, SIXTY_JIA_ZI,
} from '@/engine/types';
import { TIAN_GAN_EN, DI_ZHI_EN, WU_XING_EN, SHI_SHEN_EN, SHI_CHEN_EN as SC_EN } from '@/engine/locale/en';
import { TIAN_GAN_RU, DI_ZHI_RU, WU_XING_RU, SHI_SHEN_RU, SHI_CHEN_RU as SC_RU } from '@/engine/locale/ru';
import { TIAN_GAN_ES, DI_ZHI_ES, WU_XING_ES, SHI_SHEN_ES, SHI_CHEN_ES as SC_ES } from '@/engine/locale/es';

/** 各语言的天干 */
const GAN_MAP: Record<string, string[]> = { 'zh-CN': TIAN_GAN, en: TIAN_GAN_EN, ru: TIAN_GAN_RU, es: TIAN_GAN_ES };
/** 各语言的地支 */
const ZHI_MAP: Record<string, string[]> = { 'zh-CN': DI_ZHI, en: DI_ZHI_EN, ru: DI_ZHI_RU, es: DI_ZHI_ES };
/** 各语言的五行 */
const WX_MAP: Record<string, string[]> = { 'zh-CN': WU_XING, en: WU_XING_EN, ru: WU_XING_RU, es: WU_XING_ES };
/** 各语言的十神 */
const SS_MAP: Record<string, string[]> = { 'zh-CN': SHI_SHEN, en: SHI_SHEN_EN, ru: SHI_SHEN_RU, es: SHI_SHEN_ES };
/** 各语言的时辰 */
const SC_MAP: Record<string, string[]> = {
  'zh-CN': ['子时(23:00-00:59)', '丑时(01:00-02:59)', '寅时(03:00-04:59)', '卯时(05:00-06:59)', '辰时(07:00-08:59)', '巳时(09:00-10:59)', '午时(11:00-12:59)', '未时(13:00-14:59)', '申时(15:00-16:59)', '酉时(17:00-18:59)', '戌时(19:00-20:59)', '亥时(21:00-22:59)'],
  en: SC_EN, ru: SC_RU, es: SC_ES,
};

/** 获取数组（按 locale 回退中文） */
function getArr(map: Record<string, string[]>, loc: string = 'zh-CN'): string[] {
  return map[loc] || map['zh-CN'];
}

/** 获取天干文字 */
export const getGanText = (index: number, locale: string = 'zh-CN'): string =>
  getArr(GAN_MAP, locale)[index] ?? '?';

/** 获取地支文字 */
export const getZhiText = (index: number, locale: string = 'zh-CN'): string =>
  getArr(ZHI_MAP, locale)[index] ?? '?';

/** 获取干支组合文字（干支名随语言，组合名用中文六十甲子） */
export const getGanzhiText = (gan: number, zhi: number): string => {
  for (let i = 0; i < 60; i++) {
    if (i % 10 === gan && i % 12 === zhi) return SIXTY_JIA_ZI[i];
  }
  return '??';
};

/** 获取五行文字 */
export const getWuxingText = (index: number, locale: string = 'zh-CN'): string =>
  getArr(WX_MAP, locale)[index] ?? '?';

/** 获取十神文字 */
export const getShishenText = (index: number, locale: string = 'zh-CN'): string => {
  const arr = getArr(SS_MAP, locale);
  if (index < 0 || index >= arr.length) return '?';
  return arr[index];
};

/** 获取阴阳文字 */
export const getYinYangText = (index: number, locale: string = 'zh-CN'): string =>
  locale === 'zh-CN' ? (index === 0 ? '阳' : '阴') :
  locale === 'en' ? (index === 0 ? 'Yang' : 'Yin') :
  locale === 'ru' ? (index === 0 ? 'Ян' : 'Инь') :
  locale === 'es' ? (index === 0 ? 'Yang' : 'Yin') : '?';

/** 获取时辰文字 */
export const SHI_CHEN = (locale: string = 'zh-CN'): string[] => getArr(SC_MAP, locale);

/** 根据小时+分钟获取时辰文字 */
export const getShiChenText = (hour: number, minute: number = 0, locale: string = 'zh-CN'): string => {
  const idx = hour === 23 ? 0 : Math.floor((hour + 1) / 2);
  const arr = getArr(SC_MAP, locale);
  return arr[idx] ?? '?';
};
