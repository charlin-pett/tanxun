/**
 * Spanish labels for BaZi engine output
 */
import { SIXTY_JIA_ZI } from '@/engine/types';

export const TIAN_GAN_ES = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
export const DI_ZHI_ES = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
export const WU_XING_ES = ['Madera', 'Fuego', 'Tierra', 'Metal', 'Agua'];
export const SHI_SHEN_ES = ['Amigo', 'Robo Riqueza', 'Espíritu Comida', 'Oficial Herido', 'Riqueza Directa', 'Riqueza Indirecta', 'Oficial Directo', 'Siete Muertes', 'Sello Directo', 'Sello Indirecto'];
export const YIN_YANG_ES = ['Yang', 'Yin'];
export const SHI_CHEN_ES = [
  'Zi (23:00-00:59)', 'Chou (01:00-02:59)', 'Yin (03:00-04:59)', 'Mao (05:00-06:59)',
  'Chen (07:00-08:59)', 'Si (09:00-10:59)', 'Wu (11:00-12:59)', 'Wei (13:00-14:59)',
  'Shen (15:00-16:59)', 'You (17:00-18:59)', 'Xu (19:00-20:59)', 'Hai (21:00-22:59)',
];

export const PILLAR_NAMES_ES = ['Año', 'Mes', 'Día', 'Hora'];
export const FOUR_PILLARS_ES = 'Cuatro Pilares';
export const DAY_MASTER_ES = 'Maestro del Día';
export const HIDDEN_STEMS_ES = 'Troncos Ocultos';
export const DA_YUN_ES = 'Década de Suerte';
export const LIU_NIAN_ES = 'Fortuna Anual';
export const SHUN_ES = 'Directo';
export const NI_ES = 'Inverso';
export const START_AGE_ES = 'años de inicio';
export const CURRENT_YEAR_ES = 'Año Actual';

export function getGanTextEs(index: number): string { return TIAN_GAN_ES[index] ?? '?'; }
export function getZhiTextEs(index: number): string { return DI_ZHI_ES[index] ?? '?'; }
export function getGanzhiTextEs(gan: number, zhi: number): string {
  for (let i = 0; i < 60; i++) {
    if (i % 10 === gan && i % 12 === zhi) return SIXTY_JIA_ZI[i];
  }
  return '??';
}
export function getWuxingTextEs(index: number): string { return WU_XING_ES[index] ?? '?'; }
export function getShishenTextEs(index: number): string {
  return SHI_SHEN_ES[index] ?? '?';
}
