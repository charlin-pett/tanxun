'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import zhCN from '@/data/zodiac/zh-CN.json';
import en from '@/data/zodiac/en.json';
import ru from '@/data/zodiac/ru.json';
import es from '@/data/zodiac/es.json';
import { getZodiacIndex } from '@/engine/zodiac';

/** 按 locale 加载对应星座数据 */
const ZODIAC_MAP: Record<string, any> = { 'zh-CN': zhCN, en, ru, es };

/** 星座 Emoji 符号 */
const ZODIAC_SYMBOLS: string[] = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

/** 元素配色 */
const ELEMENT_COLORS: Record<string, string> = {
  Fire: 'from-orange-100 to-red-50 border-orange-200 text-orange-800',
  Fuego: 'from-orange-100 to-red-50 border-orange-200 text-orange-800',
  Огонь: 'from-orange-100 to-red-50 border-orange-200 text-orange-800',
  Earth: 'from-amber-100 to-yellow-50 border-amber-200 text-amber-800',
  Tierra: 'from-amber-100 to-yellow-50 border-amber-200 text-amber-800',
  Земля: 'from-amber-100 to-yellow-50 border-amber-200 text-amber-800',
  Air: 'from-sky-100 to-blue-50 border-sky-200 text-sky-800',
  Воздух: 'from-sky-100 to-blue-50 border-sky-200 text-sky-800',
  Aire: 'from-sky-100 to-blue-50 border-sky-200 text-sky-800',
  Water: 'from-cyan-100 to-blue-50 border-cyan-200 text-cyan-800',
  Agua: 'from-cyan-100 to-blue-50 border-cyan-200 text-cyan-800',
  Вода: 'from-cyan-100 to-blue-50 border-cyan-200 text-cyan-800',
};

interface ZodiacCardProps { month: number; day: number; }

export default function ZodiacCard({ month, day }: ZodiacCardProps) {
  const locale = useLocale();
  const dataSet = ZODIAC_MAP[locale] || ZODIAC_MAP['zh-CN'];

  const info = useMemo(() => {
    const idx = getZodiacIndex(month, day);
    if (idx < 0) return null;
    return { index: idx, ...(dataSet as any)[String(idx)] };
  }, [month, day, dataSet]);

  if (!info) return null;

  const symbol = ZODIAC_SYMBOLS[info.index];
  const colorClass = ELEMENT_COLORS[info.element] || ELEMENT_COLORS['Fire'];

  return (
    <div className={`bg-gradient-to-br ${colorClass} rounded-xl border shadow-sm p-6`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-white/70 rounded-full flex items-center justify-center text-2xl shadow-sm">
          {symbol}
        </div>
        <div>
          <h3 className="text-lg font-bold">{info.name}</h3>
          <p className="text-xs opacity-70">{info.englishName} · {info.date}</p>
        </div>
      </div>
      <div className="flex gap-3 mb-4">
        <span className="px-2 py-0.5 bg-white/50 rounded text-xs font-medium">
          {info.element === '火' ? '🔥' : info.element === 'Огонь' ? '🔥' : info.element === 'Fuego' ? '🔥' : '♨'} {info.element}
        </span>
        <span className="px-2 py-0.5 bg-white/50 rounded text-xs font-medium">
          {info.ruler}
        </span>
      </div>
      {info.keywords && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {info.keywords.map((kw: string, i: number) => (
            <span key={i} className="px-2 py-0.5 bg-white/60 rounded text-xs">{kw}</span>
          ))}
        </div>
      )}
      {info.strengths && info.weaknesses && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs font-semibold mb-1 opacity-60">
              {locale === 'en' ? '✨ Strengths' : locale === 'ru' ? '✨ Сильные' : locale === 'es' ? '✨ Virtudes' : '✨ 优点'}
            </p>
            <ul className="space-y-0.5">
              {info.strengths.slice(0, 3).map((s: string, i: number) => (
                <li key={i} className="text-xs">✓ {s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1 opacity-60">
              {locale === 'en' ? '⚠ Challenges' : locale === 'ru' ? '⚠ Слабые' : locale === 'es' ? '⚠ Retos' : '⚠ 缺点'}
            </p>
            <ul className="space-y-0.5">
              {info.weaknesses.slice(0, 3).map((w: string, i: number) => (
                <li key={i} className="text-xs">✗ {w}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {info.personality && (
        <p className="text-sm leading-relaxed opacity-80">{info.personality}</p>
      )}
    </div>
  );
}
