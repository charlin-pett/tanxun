/**
 * 中文标签转换工具
 *
 * 将引擎输出的数字索引转换为中文文字。
 * 后续加英语/俄语时，只需为每种语言创建对应的 labels 文件。
 *
 * 使用方式：
 *   import { getGanText, getZhiText } from '@/engine/labels';
 *   getGanText(0) → "甲"
 */
import {
  TIAN_GAN,
  DI_ZHI,
  WU_XING,
  SHI_SHEN,
  SIXTY_JIA_ZI,
} from '@/engine/types';

/** 获取天干文字 */
export const getGanText = (index: number): string => TIAN_GAN[index] ?? '?';

/** 获取地支文字 */
export const getZhiText = (index: number): string => DI_ZHI[index] ?? '?';

/** 获取干支组合文字 */
export const getGanzhiText = (gan: number, zhi: number): string => {
  for (let i = 0; i < 60; i++) {
    if (i % 10 === gan && i % 12 === zhi) return SIXTY_JIA_ZI[i];
  }
  return '??';
};

/** 获取五行文字 */
export const getWuxingText = (index: number): string => WU_XING[index] ?? '?';

/** 获取十神文字 */
export const getShishenText = (index: number): string => {
  if (index < 0 || index >= SHI_SHEN.length) return '?';
  return SHI_SHEN[index];
};

/** 获取阴阳文字 */
export const getYinYangText = (index: number): string =>
  index === 0 ? '阳' : '阴';

/** 时辰列表（中文） */
export const SHI_CHEN: string[] = [
  '子时(23:00-00:59)',
  '丑时(01:00-02:59)',
  '寅时(03:00-04:59)',
  '卯时(05:00-06:59)',
  '辰时(07:00-08:59)',
  '巳时(09:00-10:59)',
  '午时(11:00-12:59)',
  '未时(13:00-14:59)',
  '申时(15:00-16:59)',
  '酉时(17:00-18:59)',
  '戌时(19:00-20:59)',
  '亥时(21:00-22:59)',
];

/** 根据小时+分钟获取时辰中文名 */
export const getShiChenText = (hour: number, minute: number = 0): string => {
  const idx = hour === 23 ? 0 : Math.floor((hour + 1) / 2);
  return `${SHI_CHEN[idx]}${idx === 0 && hour === 23 ? '' : ''}`;
};
