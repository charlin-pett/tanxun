'use client';

import { useState, useCallback, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { getZodiacIndexByYear, getZodiacOverview, ZODIAC_NAMES } from '@/data/zodiac-fortune/zh-CN';

const TXT: Record<string, any> = {
  'zh-CN': { title: '生肖运势', selectYear: '选择出生年份', selectSign: '选择生肖', signLabel: '您的生肖', overall: '总体运势', luckyNum: '幸运数字', luckyColor: '幸运颜色', luckyDir: '幸运方位', monthly: '每月运势', month: '月', switchSign: '切换生肖', year: '年' },
  en: { title: 'Zodiac Fortune', selectYear: 'Select Birth Year', selectSign: 'Select Sign', signLabel: 'Your Sign', overall: 'Year Overview', luckyNum: 'Lucky Numbers', luckyColor: 'Lucky Colors', luckyDir: 'Lucky Direction', monthly: 'Monthly Fortune', month: 'Month', switchSign: 'Switch Sign', year: 'Year' },
  ru: { title: 'Гороскоп', selectYear: 'Год рождения', selectSign: 'Знак', signLabel: 'Ваш знак', overall: 'Общий прогноз', luckyNum: 'Счастливые числа', luckyColor: 'Цвета удачи', luckyDir: 'Направление', monthly: 'Ежемесячно', month: 'Месяц', switchSign: 'Сменить знак', year: 'Год' },
  es: { title: 'Horóscopo', selectYear: 'Año de nacimiento', selectSign: 'Seleccionar signo', signLabel: 'Tu signo', overall: 'Visión general', luckyNum: 'Números de la suerte', luckyColor: 'Colores de la suerte', luckyDir: 'Dirección', monthly: 'Mensual', month: 'Mes', switchSign: 'Cambiar signo', year: '' },
};

export default function ZodiacFortune() {
  const locale = useLocale();
  const t = TXT[locale] || TXT['zh-CN'];
  const zodiacNames = ZODIAC_NAMES[locale] || ZODIAC_NAMES['zh-CN'];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(1990);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = useCallback(() => {
    const idx = getZodiacIndexByYear(selectedYear);
    setSelectedIndex(idx);
    setShowResult(true);
  }, [selectedYear]);

  const handleReset = useCallback(() => {
    setShowResult(false);
    setSelectedIndex(null);
  }, []);

  const fortune = useMemo(() => {
    if (selectedIndex === null) return null;
    return getZodiacOverview(selectedIndex);
  }, [selectedIndex]);

  const yearOptions: number[] = [];
  for (let y = 2026; y >= 1920; y--) yearOptions.push(y);

  if (showResult && fortune && selectedIndex !== null) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center mb-4">
          <button onClick={handleReset} className="px-4 py-2 text-sm text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors">← {t.switchSign}</button>
        </div>

        <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-6 text-center">
          <div className="text-5xl mb-2">{['🐭','🐮','🐯','🐰','🐲','🐍','🐴','🐏','🐵','🐔','🐶','🐷'][selectedIndex]}</div>
          <h2 className="text-2xl font-bold text-gray-900">{zodiacNames[selectedIndex]}</h2>
          <p className="text-sm text-gray-400">{selectedYear}{t.year}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-3">{t.overall}</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{fortune.overall}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-400 mb-1">{t.luckyNum}</p>
              <p className="text-lg font-bold text-amber-700">{fortune.luckyNumbers.join('、')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">{t.luckyColor}</p>
              <p className="text-lg font-bold text-amber-700">{fortune.luckyColors.join('、')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">{t.luckyDir}</p>
              <p className="text-lg font-bold text-amber-700">{fortune.luckyDirection}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-amber-50 border-b border-amber-200">
            <h3 className="text-base font-bold text-gray-900">{t.monthly}</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {fortune.months.map((m) => (
              <div key={m.month} className="p-4 hover:bg-amber-50/30">
                <p className="text-sm font-bold text-amber-800 mb-1">{m.month}{t.month}月 · {m.title}</p>
                <p className="text-sm text-gray-600">{m.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-6">{t.selectYear}</h2>
        <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))}
          className="w-full h-12 px-4 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4">
          {yearOptions.map(y => <option key={y} value={y}>{y}{t.year}</option>)}
        </select>
        <button onClick={handleSubmit}
          className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-lg transition-colors">
          {locale === 'zh-CN' ? '查看运势' : locale === 'en' ? 'Check Fortune' : locale === 'ru' ? 'Узнать' : 'Ver'}
        </button>
      </div>
    </div>
  );
}
