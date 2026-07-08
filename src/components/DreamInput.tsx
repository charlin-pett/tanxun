'use client';

import { useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { classifyDream, CATEGORY_LABELS_CN, CATEGORY_LABELS_EN, CATEGORY_LABELS_RU, CATEGORY_LABELS_ES } from '@/engine/dream/categories';
import DreamResult from './DreamResult';

interface DreamHistoryItem {
  id: string; dreamText: string; interpretation: string; categories: string[]; timestamp: number;
}

const CAT_LABELS: Record<string, Record<string, string>> = {
  'zh-CN': CATEGORY_LABELS_CN, en: CATEGORY_LABELS_EN, ru: CATEGORY_LABELS_RU, es: CATEGORY_LABELS_ES,
};

const TXT: Record<string, { title: string; desc: string; placeholder: string; submit: string; history: string; clear: string; cont: string; empty: string; error: string }> = {
  'zh-CN': { title: '描述你的梦境', desc: '请详细描述，越具体解读越准确', placeholder: '例如：我梦见自己在天空飞翔，下面是一片大海……', submit: '开始解梦', history: '解梦记录', clear: '清除记录', cont: '← 继续解梦', empty: '暂无解梦记录', error: '请描述你的梦境' },
  en: { title: 'Describe Your Dream', desc: 'The more detail you provide, the more accurate your interpretation', placeholder: 'E.g., I dreamed I was flying over the ocean, with a dragon soaring through the clouds...', submit: 'Interpret Dream', history: 'Dream History', clear: 'Clear History', cont: '← Continue Dream', empty: 'No dream history yet', error: 'Please describe your dream' },
  ru: { title: 'Опишите ваш сон', desc: 'Чем больше деталей, тем точнее толкование', placeholder: 'Например: мне снилось, что я лечу над морем, а в облаках парит дракон...', submit: 'Толковать сон', history: 'История снов', clear: 'Очистить', cont: '← Продолжить', empty: 'История пуста', error: 'Опишите ваш сон' },
  es: { title: 'Describe tu sueño', desc: 'Cuantos más detalles proporciones, más precisa será la interpretación', placeholder: 'Ej: Soñé que volaba sobre el océano, con un dragón entre las nubes...', submit: 'Interpretar Sueño', history: 'Historial de Sueños', clear: 'Limpiar', cont: '← Continuar', empty: 'Sin historial aún', error: 'Describe tu sueño' },
};

export default function DreamInput() {
  const locale = useLocale();
  const t = TXT[locale] || TXT['zh-CN'];
  const catLabels = CAT_LABELS[locale] || CAT_LABELS['zh-CN'];

  const [dreamText, setDreamText] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [state, setState] = useState<'input' | 'loading' | 'done' | 'error'>('input');
  const [interpretation, setInterpretation] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<DreamHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('dream_history') || '[]'); } catch { return []; }
    }
    return [];
  });

  const handleTextChange = useCallback((text: string) => {
    setDreamText(text);
    if (text.trim().length >= 2) setCategories(classifyDream(text));
    else setCategories([]);
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = dreamText.trim();
    if (trimmed.length < 2) { setError(t.error); return; }
    setState('loading'); setError('');
    try {
      const res = await fetch('/api/dream', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dreamText: trimmed, categories, locale }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
      const data = await res.json();
      setInterpretation(data.interpretation);
      setState('done');
      const item: DreamHistoryItem = { id: Date.now().toString(), dreamText: trimmed, interpretation: data.interpretation, categories, timestamp: Date.now() };
      const updated = [item, ...history].slice(0, 20);
      setHistory(updated);
      localStorage.setItem('dream_history', JSON.stringify(updated));
    } catch { setError('Network error'); setState('error'); }
  }, [dreamText, categories, history, locale, t.error]);

  const handleReset = useCallback(() => { setState('input'); setDreamText(''); setCategories([]); setInterpretation(''); setError(''); }, []);
  const handleLoadHistory = useCallback((item: DreamHistoryItem) => { setDreamText(item.dreamText); setCategories(item.categories); setInterpretation(item.interpretation); setState('done'); }, []);
  const handleClearHistory = useCallback(() => { setHistory([]); localStorage.removeItem('dream_history'); }, []);

  if (state === 'done') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <button onClick={handleReset} className="px-4 py-2 text-sm text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors">{t.cont}</button>
        </div>
        <DreamResult dreamText={dreamText} interpretation={interpretation} categories={categories} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t.title}</h2>
          <p className="text-sm text-gray-400">{t.desc}</p>
        </div>

        <textarea value={dreamText} onChange={e => handleTextChange(e.target.value)}
          placeholder={t.placeholder}
          className="w-full h-40 p-5 border border-amber-200 rounded-xl resize-none text-gray-700 placeholder-gray-300 bg-amber-50/30 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-classic text-base leading-relaxed shadow-inner"
          maxLength={2000} />

        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-400">{dreamText.length}/2000</p>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {categories.map(cat => (
              <span key={cat} className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                {catLabels[cat] || cat}
              </span>
            ))}
          </div>
        )}

        <button onClick={handleSubmit} disabled={dreamText.trim().length < 2 || state === 'loading'}
          className="mt-6 w-full py-3 bg-amber-700 hover:bg-amber-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
          {t.submit}
        </button>

        {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600 text-center">{error}</p></div>}
      </div>

      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-900">{t.history}</h3>
            <button onClick={handleClearHistory} className="text-xs text-gray-400 hover:text-red-500 transition-colors">{t.clear}</button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.map(item => (
              <button key={item.id} onClick={() => handleLoadHistory(item)}
                className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-amber-50 border border-gray-100 hover:border-amber-200 transition-colors group">
                <p className="text-sm text-gray-700 line-clamp-1 group-hover:text-amber-800">{item.dreamText}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(item.timestamp).toLocaleString(locale === 'zh-CN' ? 'zh-CN' : locale)}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
