/**
 * English labels for BaZi engine output
 */
import { SIXTY_JIA_ZI } from '@/engine/types';

export const TIAN_GAN_EN = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
export const DI_ZHI_EN = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
export const WU_XING_EN = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
export const SHI_SHEN_EN = ['Friend', 'Rob Wealth', 'Food Spirit', 'Hurt Officer', 'Direct Wealth', 'Indirect Wealth', 'Direct Officer', 'Seven Kill', 'Direct Seal', 'Indirect Seal'];
export const YIN_YANG_EN = ['Yang', 'Yin'];
export const SHI_CHEN_EN = [
  'Zi (23:00-00:59)', 'Chou (01:00-02:59)', 'Yin (03:00-04:59)', 'Mao (05:00-06:59)',
  'Chen (07:00-08:59)', 'Si (09:00-10:59)', 'Wu (11:00-12:59)', 'Wei (13:00-14:59)',
  'Shen (15:00-16:59)', 'You (17:00-18:59)', 'Xu (19:00-20:59)', 'Hai (21:00-22:59)',
];

export const PILLAR_NAMES_EN = ['Year', 'Month', 'Day', 'Hour'];
export const FOUR_PILLARS_EN = 'Four Pillars';
export const DAY_MASTER_EN = 'Day Master';
export const HIDDEN_STEMS_EN = 'Hidden Stems';
export const DA_YUN_EN = 'Decade Luck';
export const LIU_NIAN_EN = 'Yearly Fortune';
export const SHUN_EN = 'Forward';
export const NI_EN = 'Reverse';
export const START_AGE_EN = 'years old start';
export const CURRENT_YEAR_EN = 'Current Year';

export function getGanTextEn(index: number): string { return TIAN_GAN_EN[index] ?? '?'; }
export function getZhiTextEn(index: number): string { return DI_ZHI_EN[index] ?? '?'; }
export function getGanzhiTextEn(gan: number, zhi: number): string {
  for (let i = 0; i < 60; i++) {
    if (i % 10 === gan && i % 12 === zhi) return SIXTY_JIA_ZI[i];
  }
  return '??';
}
export function getWuxingTextEn(index: number): string { return WU_XING_EN[index] ?? '?'; }
export function getShishenTextEn(index: number): string {
  return SHI_SHEN_EN[index] ?? '?';
}
