'use client';

import { useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { analyzeName, type NameResult } from '@/engine/name';
import { NUM81 } from '@/engine/name/numerology';

const WX_NAMES: Record<string, string[]> = {
  'zh-CN': ['木', '火', '土', '金', '水'],
  en: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'],
  ru: ['Дерево', 'Огонь', 'Земля', 'Металл', 'Вода'],
  es: ['Madera', 'Fuego', 'Tierra', 'Metal', 'Agua'],
};

const LUCK_TXT: Record<string, Record<string, string>> = {
  'zh-CN': { great: '大吉', good: '吉', semi: '半吉', bad: '凶', very_bad: '大凶' },
  en: { great: 'Excellent', good: 'Good', semi: 'Fair', bad: 'Poor', very_bad: 'Very Poor' },
  ru: { great: 'Отлично', good: 'Хорошо', semi: 'Средне', bad: 'Плохо', very_bad: 'Очень плохо' },
  es: { great: 'Excelente', good: 'Buena', semi: 'Regular', bad: 'Mala', very_bad: 'Muy mala' },
};

export default function NameForm() {
  const locale = useLocale();
  const wxNames = WX_NAMES[locale] || WX_NAMES['zh-CN'];
  const luckTxt = LUCK_TXT[locale] || LUCK_TXT['zh-CN'];

  const TXT: Record<string, any> = {
    'zh-CN': { input: '请输入姓名', placeholder: '输入中文或英文姓名', submit: '开始测试', wuge: '五格剖象', tian: '天格', ren: '人格', di: '地格', wai: '外格', zong: '总格', num: '数理', score: '评分', wuxing: '五行', sancai: '三才配置', westTitle: '生命灵数', exp: '表达数', soul: '灵魂数', per: '个性数', meaning: '含义', recalc: '重新测试', chineseName: '中文姓名', westernName: '英文姓名', stroke: '笔画', luck: '吉凶' },
    en: { input: 'Enter Your Name', placeholder: 'Chinese or English name', submit: 'Analyze', wuge: 'Five Numerologies', tian: 'Family', ren: 'Character', di: 'Earth', wai: 'Outer', zong: 'Total', num: 'Number', score: 'Score', wuxing: 'Element', sancai: 'Three Talents', westTitle: 'Numerology', exp: 'Expression', soul: 'Soul Urge', per: 'Personality', meaning: 'Meaning', recalc: 'Try Again', chineseName: 'Chinese Name', westernName: 'English Name', stroke: 'Stroke', luck: 'Fortune' },
    ru: { input: 'Введите имя', placeholder: 'Китайское или английское имя', submit: 'Анализ', wuge: 'Пять Столпов', tian: 'Небесный', ren: 'Личный', di: 'Земной', wai: 'Внешний', zong: 'Общий', num: 'Число', score: 'Оценка', wuxing: 'Элемент', sancai: 'Три Таланта', westTitle: 'Нумерология', exp: 'Выражение', soul: 'Душа', per: 'Личность', meaning: 'Значение', recalc: 'Заново', chineseName: 'Китайское имя', westernName: 'Английское имя', stroke: 'Черты', luck: 'Судьба' },
    es: { input: 'Ingrese su nombre', placeholder: 'Nombre chino o inglés', submit: 'Analizar', wuge: 'Cinco Numerologías', tian: 'Familia', ren: 'Carácter', di: 'Tierra', wai: 'Externo', zong: 'Total', num: 'Número', score: 'Puntuación', wuxing: 'Elemento', sancai: 'Tres Talentos', westTitle: 'Numerología', exp: 'Expresión', soul: 'Alma', per: 'Personalidad', meaning: 'Significado', recalc: 'Reintentar', chineseName: 'Nombre chino', westernName: 'Nombre inglés', stroke: 'Trazo', luck: 'Fortuna' },
  };
  const t = TXT[locale] || TXT['zh-CN'];

  const [name, setName] = useState('');
  const [result, setResult] = useState<NameResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(() => {
    const trimmed = name.trim();
    if (trimmed.length < 2) { setError(locale === 'zh-CN' ? '请输入至少2个字符' : locale === 'en' ? 'Enter at least 2 characters' : locale === 'ru' ? 'Введите минимум 2 символа' : locale === 'es' ? 'Ingrese al menos 2 caracteres' : ''); return; }
    setError('');
    setResult(analyzeName(trimmed));
  }, [name, locale]);

  const handleReset = useCallback(() => { setResult(null); setName(''); setError(''); }, []);

  return (
    <div className="max-w-lg mx-auto">
      {!result ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">{t.input}</h2>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder={t.placeholder}
            className="w-full h-12 px-4 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4" />
          {error && <p className="text-sm text-red-600 text-center mb-3">{error}</p>}
          <button onClick={handleSubmit} className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-lg transition-colors">{t.submit}</button>
        </div>
      ) : (
        <div>
          <div className="text-center mb-6">
            <button onClick={handleReset} className="px-4 py-2 text-sm text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors">← {t.recalc}</button>
          </div>

          {result.type === 'chinese' ? (
            <ChineseResultView result={result} wxNames={wxNames} luckTxt={luckTxt} t={t} locale={locale} />
          ) : (
            <WesternResultView result={result} t={t} locale={locale} />
          )}
        </div>
      )}
    </div>
  );
}

/** 中文姓名结果展示 */
function ChineseResultView({ result, wxNames, luckTxt, t, locale: loc = 'zh-CN' }: { result: NameResult & { type: 'chinese' }; wxNames: string[]; luckTxt: Record<string, string>; t: any; locale?: string }) {
  const r = result.result;
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-6 text-center">
        <p className="text-xs text-gray-400 mb-1">{t.chineseName}</p>
        <p className="text-2xl font-bold text-gray-900">{result.surname}{result.givenName}</p>
        <p className="text-sm text-gray-500 mt-1">
          {result.surname}({r.strokes[0]}{t.stroke}) {result.givenName.split('').map((c, i) => `${c}(${r.strokes[i + 1] || '?'}${t.stroke})`).join(' ')}
        </p>
      </div>

      {/* 五格表 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-center font-bold">{t.wuge}</div>
        <div className="grid grid-cols-5 divide-x divide-gray-200 text-center">
          {[
            { label: t.tian, val: r.tianNum, score: r.tianScore, ge: r.tianGe },
            { label: t.ren, val: r.renNum, score: r.renScore, ge: r.renGe },
            { label: t.di, val: r.diNum, score: r.diScore, ge: r.diGe },
            { label: t.wai, val: r.waiNum, score: r.waiScore, ge: r.waiGe },
            { label: t.zong, val: r.zongNum, score: r.zongScore, ge: r.zongGe },
          ].map((item, i) => (
            <div key={i} className="p-3">
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="text-lg font-bold text-gray-900">{item.val}</p>
              <p className={`text-xs ${item.score >= 75 ? 'text-green-600' : item.score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                {luckTxt[NUM81[item.val]?.luck || 'semi']}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{wxNames[(item.ge - 1) % 5]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 三才 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-3">{t.sancai}</h3>
        <div className="flex items-center gap-3 justify-center">
          {r.sanCai.map((wx, i) => (
            <span key={i} className={`px-4 py-2 rounded-lg text-sm font-medium ${['bg-green-100 text-green-800','bg-red-100 text-red-800','bg-yellow-100 text-yellow-800','bg-gray-100 text-gray-800','bg-blue-100 text-blue-800'][wx]}`}>
              {wxNames[wx]}
              {i < 2 && <span className="mx-2 text-gray-300">→</span>}
            </span>
          ))}
        </div>
        <p className={`text-center mt-2 text-sm font-medium ${r.sanCaiScore >= 2 ? 'text-green-600' : r.sanCaiScore === 1 ? 'text-amber-600' : 'text-red-500'}`}>
          {r.sanCaiScore >= 2 ? (loc === 'zh-CN' ? '吉' : loc === 'en' ? 'Harmonious' : loc === 'ru' ? 'Гармония' : 'Armonioso') : r.sanCaiScore === 1 ? (loc === 'zh-CN' ? '平' : loc === 'en' ? 'Average' : loc === 'ru' ? 'Средне' : 'Regular') : (loc === 'zh-CN' ? '凶' : loc === 'en' ? 'Conflicting' : loc === 'ru' ? 'Конфликт' : 'Conflictivo')}
        </p>
      </div>
    </div>
  );
}

/** 英文姓名结果展示 */
function WesternResultView({ result, t, locale: loc = 'zh-CN' }: { result: NameResult & { type: 'western' }; t: any; locale?: string }) {
  const r = result.result;
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-6 text-center">
        <p className="text-xs text-gray-400 mb-1">{t.westernName}</p>
        <p className="text-2xl font-bold text-gray-900">{result.fullName}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-center font-bold">{t.westTitle}</div>
        <div className="divide-y divide-gray-100">
          {[
            { label: t.exp, num: r.expression },
            { label: t.soul, num: r.soul },
            { label: t.per, num: r.personality },
          ].map((item, i) => (
            <div key={i} className="p-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-lg font-bold text-amber-800">{item.num}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">{t.meaning}</h3>
        {r.numbers.map((n, i) => (
          <div key={i} className="mb-4 last:mb-0">
            <p className="text-sm font-bold text-amber-800">{n.name} ({n.num})</p>
            <p className="text-sm text-gray-600 mt-1">{loc === 'en' ? n.meaning_en : n.meaning_cn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
