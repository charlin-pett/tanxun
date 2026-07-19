'use client';

import { useLocale } from 'next-intl';
import { useMemo } from 'react';
import { Link } from '@/i18n/navigation';
import { CATEGORY_LABELS_CN, CATEGORY_LABELS_EN, CATEGORY_LABELS_RU, CATEGORY_LABELS_ES, CATEGORY_LABELS_KO } from '@/engine/dream/categories';
import hexCN from '@/data/hexagrams/zh-CN.json';
import hexEN from '@/data/hexagrams/en.json';
import hexRU from '@/data/hexagrams/ru.json';
import hexES from '@/data/hexagrams/es.json';
import hexKO from '@/data/hexagrams/ko.json';

const HEX_DATA: Record<string, any> = { 'zh-CN': hexCN, en: hexEN, ru: hexRU, es: hexES, ko: hexKO };

interface DreamResultProps {
  dreamText: string;
  interpretation: string;
  categories: string[];
}

export default function DreamResult({ dreamText, interpretation, categories }: DreamResultProps) {
  const locale = useLocale();
  const hexByLocale = HEX_DATA[locale] || HEX_DATA['zh-CN'];
  const catLabels = locale === 'zh-CN' ? CATEGORY_LABELS_CN : locale === 'en' ? CATEGORY_LABELS_EN : locale === 'ru' ? CATEGORY_LABELS_RU : locale === 'es' ? CATEGORY_LABELS_ES : locale === 'ko' ? CATEGORY_LABELS_KO : CATEGORY_LABELS_CN;
  const TXT: Record<string, any> = {
    'zh-CN': { dreamContent: '梦境内容', analysis: '解梦分析', related: '相关卦象参考', hexagram: '卦' },
    en: { dreamContent: 'Dream Content', analysis: 'Dream Analysis', related: 'Related Hexagrams', hexagram: 'Hex.' },
    ru: { dreamContent: 'Содержание сна', analysis: 'Анализ сна', related: 'Связанные гексаграммы', hexagram: 'Гек.' },
    es: { dreamContent: 'Contenido del Sueño', analysis: 'Análisis del Sueño', related: 'Hexagramas Relacionados', hexagram: 'Hex.' },
    ko: { dreamContent: '꿈 내용', analysis: '꿈 분석', related: '관련 괘', hexagram: '괘' },
  };
  const t = TXT[locale] || TXT['zh-CN'];

  // 按语言获取卦名
  function getHexName(num: number): string {
    const h = (hexByLocale as any)[String(num)];
    return h ? h.name : `#${num}`;
  }
  function getHexFullName(num: number): string {
    const h = (hexByLocale as any)[String(num)];
    return h ? h.fullName : `#${num}`;
  }

  // 推荐卦象（按文本关键词匹配）
  const hexagrams = useMemo(() => {
    const text = dreamText.toLowerCase();
    const picks: { num: number; name: string }[] = [];
    const add = (nums: number[]) => { nums.forEach(n => picks.push({ num: n, name: getHexName(n) })); };
    if (text.includes('水') || text.includes('河') || text.includes('海') || text.includes('雨')) add([29, 39, 5]);
    else if (text.includes('火') || text.includes('烧')) add([30, 49, 38]);
    else if (text.includes('飞')) add([1, 46, 53]);
    else if (text.includes('坠落') || text.includes('掉') || text.includes('跌')) add([23, 47, 39]);
    else if (categories.includes('animals')) add([1, 3, 24]);
    else add([1, 2, 11]);
    return picks;
  }, [dreamText, categories]);

  const sections = interpretation.split('\n\n');

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 to-white rounded-xl border border-amber-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-amber-700 mb-2">{t.dreamContent}</h3>
        <p className="text-gray-700 font-classic leading-relaxed">{dreamText}</p>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {categories.map(cat => (
              <span key={cat} className="px-2 py-0.5 bg-amber-100 text-amber-600 text-xs rounded-full">
                {catLabels[cat] || cat}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-amber-700 to-amber-600 text-white">
          <h3 className="text-lg font-bold">{t.analysis}</h3>
        </div>
        <div className="p-6">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {sections.map((section, i) => {
              if (section.startsWith('【')) {
                const titleEnd = section.indexOf('】');
                if (titleEnd > 0) {
                  const title = section.slice(0, titleEnd + 1);
                  const body = section.slice(titleEnd + 1);
                  return (
                    <div key={i} className="mb-4">
                      <h4 className="text-base font-bold text-amber-800 mb-2">{title}</h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{body}</p>
                    </div>
                  );
                }
              }
              return <p key={i} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">{section}</p>;
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">{t.related}</h3>
        <div className="flex flex-wrap gap-3">
          {hexagrams.map(h => (
            <Link key={h.num} href={`/hexagram/${h.num}`}
              className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors group">
              <span className="text-sm font-medium text-amber-800 group-hover:text-amber-900">
                {t.hexagram} {h.num} · {getHexFullName(h.num)}
              </span>
              <span className="text-xs text-amber-500 ml-1">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
