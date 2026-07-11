import type { Hexagram } from '@/types/hexagram';

import cnData from '@/data/hexagrams/zh-CN.json';
import enData from '@/data/hexagrams/en.json';
import ruData from '@/data/hexagrams/ru.json';
import esData from '@/data/hexagrams/es.json';

const HEX_DATA: Record<string, Record<string, Hexagram>> = {
  'zh-CN': cnData as Record<string, Hexagram>,
  en: enData as Record<string, Hexagram>,
  ru: ruData as Record<string, Hexagram>,
  es: esData as Record<string, Hexagram>,
};

export async function getAllHexagrams(locale: string = 'zh-CN'): Promise<Hexagram[]> {
  const data = HEX_DATA[locale] || HEX_DATA['zh-CN'];
  return Object.values(data).sort((a, b) => a.number - b.number);
}

export async function getHexagramByNumber(number: number, locale: string = 'zh-CN'): Promise<Hexagram | null> {
  const data = HEX_DATA[locale] || HEX_DATA['zh-CN'];
  return data[number.toString()] ?? null;
}
