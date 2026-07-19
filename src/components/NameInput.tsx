'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { detectNameMethod, calculateNameFortune } from '@/lib/name-fortune';
import type { NameFortuneResult } from '@/lib/name-fortune';
import NameResult from './NameResult';

const METHOD_LABELS: Record<string, Record<string, string>> = {
  'zh-CN': { chinese: '中国传统', pythagorean: 'Pythagorean', chaldean: 'Chaldean', korean: '韩国姓名学' },
  en: { chinese: 'Chinese', pythagorean: 'Pythagorean', chaldean: 'Chaldean', korean: 'Korean' },
  ru: { chinese: 'Китайский', pythagorean: 'Пифагор', chaldean: 'Халдейский', korean: 'Корейский' },
  es: { chinese: 'Chino', pythagorean: 'Pitagórico', chaldean: 'Caldeo', korean: 'Coreano' },
  ko: { chinese: '중국 전통', pythagorean: '피타고라스', chaldean: '칼데아', korean: '한국 성명학' },
};

const TXT: Record<string, any> = {
  'zh-CN': { title: '姓名预测', subtitle: '输入姓名，探索名字中蕴藏的命运密码', placeholder: '请输入中文姓名（2-4个字）', placeholderEn: '请输入英文/拼音姓名', placeholderKo: '한글 이름을 입력하세요', submit: '开始分析', hint: '支持中文、英文、韩文姓名，自动推荐最佳分析方法', methods: '分析方法', noName: '请输入姓名', detect: '检测到:', suggest: '推荐方法:' },
  en: { title: 'Name Fortune', subtitle: 'Enter your name to uncover its hidden destiny', placeholder: 'Enter Chinese name (2-4 characters)', placeholderEn: 'Enter English/pinyin name', placeholderKo: 'Enter Korean name (Hangul)', submit: 'Analyze', hint: 'Supports Chinese, English, and Korean names with auto-detection', methods: 'Analysis Method', noName: 'Please enter a name', detect: 'Detected:', suggest: 'Suggested:' },
  ru: { title: 'Нумерология имени', subtitle: 'Введите имя, чтобы раскрыть его тайны', placeholder: 'Введите китайское имя', placeholderEn: 'Введите имя на английском', placeholderKo: 'Введите корейское имя', submit: 'Анализировать', hint: 'Поддерживаются китайские, английские и корейские имена', methods: 'Метод анализа', noName: 'Введите имя', detect: 'Обнаружено:', suggest: 'Рекомендуется:' },
  es: { title: 'Numerología del Nombre', subtitle: 'Introduce tu nombre para descubrir su destino oculto', placeholder: 'Introduce nombre chino (2-4 caracteres)', placeholderEn: 'Introduce nombre en inglés', placeholderKo: 'Introduce nombre coreano', submit: 'Analizar', hint: 'Compatible con nombres chinos, ingleses y coreanos', methods: 'Método', noName: 'Introduce un nombre', detect: 'Detectado:', suggest: 'Sugerido:' },
  ko: { title: '이름 운세', subtitle: '이름을 입력하여 숨겨진 운명을 발견하세요', placeholder: '중국어 이름을 입력하세요 (2-4자)', placeholderEn: '영문 이름을 입력하세요', placeholderKo: '한글 이름을 입력하세요', submit: '분석하기', hint: '중국어, 영어, 한국어 이름을 지원하며 자동 감지됩니다', methods: '분석 방법', noName: '이름을 입력하세요', detect: '감지됨:', suggest: '추천 방법:' },
};

export default function NameInput() {
  const locale = useLocale();
  const t = TXT[locale] || TXT['zh-CN'];
  const ml = METHOD_LABELS[locale] || METHOD_LABELS['zh-CN'];

  const [name, setName] = useState('');
  const [method, setMethod] = useState<string>('chinese');
  const [result, setResult] = useState<NameFortuneResult | null>(null);
  const [detected, setDetected] = useState<string[]>([]);
  const [error, setError] = useState('');

  // Detect method on name change
  const handleNameChange = (value: string) => {
    setName(value);
    if (value.trim().length >= 2) {
      const methods = detectNameMethod(value);
      setDetected(methods);
      if (methods.length > 0) setMethod(methods[0]);
    } else {
      setDetected([]);
    }
  };

  const handleSubmit = () => {
    if (name.trim().length < 2) { setError(t.noName); return; }
    setError('');
    const res = calculateNameFortune(name.trim(), method, locale);
    setResult(res);
  };

  const getPlaceholder = () => {
    if (detected.includes('korean')) return t.placeholderKo;
    if (detected.includes('chinese')) return t.placeholder;
    return t.placeholderEn;
  };

  const availableMethods = detected.length > 0 ? detected : ['chinese', 'pythagorean', 'chaldean', 'korean'];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t.title}</h2>
          <p className="text-sm text-gray-400">{t.subtitle}</p>
        </div>

        {/* Name input */}
        <input
          type="text"
          value={name}
          onChange={e => handleNameChange(e.target.value)}
          placeholder={getPlaceholder()}
          className="w-full p-4 border border-amber-200 rounded-xl text-gray-700 placeholder-gray-300 bg-amber-50/30 focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg text-center font-classic"
          maxLength={30}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        {/* Detection hint */}
        {detected.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs text-blue-700">
              {t.detect} {detected.map(d => ml[d]).join(', ')} | {t.suggest} {ml[detected[0]]}
            </p>
          </div>
        )}

        {/* Method selector */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">{t.methods}</p>
          <div className="flex flex-wrap gap-2">
            {availableMethods.map(m => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  method === m
                    ? 'bg-amber-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {ml[m] || m}
              </button>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={name.trim().length < 2}
          className="mt-6 w-full py-3 bg-amber-700 hover:bg-amber-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {t.submit}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">{t.hint}</p>

      {/* Result */}
      {result && <NameResult result={result} locale={locale} method={method} />}
    </div>
  );
}
