/**
 * Russian labels for BaZi engine output
 */
import { SIXTY_JIA_ZI } from '@/engine/types';

export const TIAN_GAN_RU = ['Цзя', 'И', 'Бин', 'Дин', 'У', 'Цзи', 'Гэн', 'Синь', 'Жэнь', 'Гуй'];
export const DI_ZHI_RU = ['Цзы', 'Чоу', 'Инь', 'Мао', 'Чэнь', 'Сы', 'У', 'Вэй', 'Шэнь', 'Ю', 'Сюй', 'Хай'];
export const WU_XING_RU = ['Дерево', 'Огонь', 'Земля', 'Металл', 'Вода'];
export const SHI_SHEN_RU = ['Друг', 'Грабёж', 'Дух Еды', 'Ранение', 'Прямое Богатство', 'Косвенное Богатство', 'Прямой Чиновник', 'Семь Убийств', 'Прямая Печать', 'Косвенная Печать'];
export const YIN_YANG_RU = ['Ян', 'Инь'];
export const SHI_CHEN_RU = [
  'Цзы (23:00-00:59)', 'Чоу (01:00-02:59)', 'Инь (03:00-04:59)', 'Мао (05:00-06:59)',
  'Чэнь (07:00-08:59)', 'Сы (09:00-10:59)', 'У (11:00-12:59)', 'Вэй (13:00-14:59)',
  'Шэнь (15:00-16:59)', 'Ю (17:00-18:59)', 'Сюй (19:00-20:59)', 'Хай (21:00-22:59)',
];

export const PILLAR_NAMES_RU = ['Год', 'Месяц', 'День', 'Час'];
export const FOUR_PILLARS_RU = 'Четыре Столпа';
export const DAY_MASTER_RU = 'Хозяин Дня';
export const HIDDEN_STEMS_RU = 'Скрытые Стволы';
export const DA_YUN_RU = 'Десятилетие';
export const LIU_NIAN_RU = 'Годовая удача';
export const SHUN_RU = 'Прямой';
export const NI_RU = 'Обратный';
export const START_AGE_RU = 'лет начало';
export const CURRENT_YEAR_RU = 'Текущий год';

export function getGanTextRu(index: number): string { return TIAN_GAN_RU[index] ?? '?'; }
export function getZhiTextRu(index: number): string { return DI_ZHI_RU[index] ?? '?'; }
export function getGanzhiTextRu(gan: number, zhi: number): string {
  for (let i = 0; i < 60; i++) {
    if (i % 10 === gan && i % 12 === zhi) return SIXTY_JIA_ZI[i];
  }
  return '??';
}
export function getWuxingTextRu(index: number): string { return WU_XING_RU[index] ?? '?'; }
export function getShishenTextRu(index: number): string {
  return SHI_SHEN_RU[index] ?? '?';
}
