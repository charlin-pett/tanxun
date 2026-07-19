'use client';

import { useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import type { BaZiInput } from '@/engine/types';
import { SHI_CHEN } from '@/engine/labels';
import BaziResultView from './BaziResultView';
import BaziTransition from './BaziTransition';

const TXT: Record<string, any> = {
  'zh-CN': { title: '输入出生信息', year: '出生年份', month: '月份', day: '日期', time: '出生时间', shichen: '选择时辰', exact: '精确时间', gender: '性别', male: '男', female: '女', submit: '排盘测算', reset: '← 重新输入', errYear: '请输入有效的年份（1900-2100）', errMonth: '请选择月份', errDay: '请输入有效的日期', yearSuffix: '年', monthSuffix: '月', daySuffix: '日', hourSuffix: '时', minSuffix: '分' },
  en: { title: 'Birth Information', year: 'Birth Year', month: 'Month', day: 'Day', time: 'Birth Time', shichen: 'By Period', exact: 'Exact Time', gender: 'Gender', male: 'Male', female: 'Female', submit: 'Calculate', reset: '← Re-enter', errYear: 'Enter a valid year (1900-2100)', errMonth: 'Select a month', errDay: 'Enter a valid date', yearSuffix: '', monthSuffix: '', daySuffix: '', hourSuffix: '', minSuffix: '' },
  ru: { title: 'Дата рождения', year: 'Год', month: 'Месяц', day: 'День', time: 'Время', shichen: 'По периоду', exact: 'Точное время', gender: 'Пол', male: 'Муж', female: 'Жен', submit: 'Рассчитать', reset: '← Заново', errYear: 'Введите год (1900-2100)', errMonth: 'Выберите месяц', errDay: 'Введите день', yearSuffix: '', monthSuffix: '', daySuffix: '', hourSuffix: '', minSuffix: '' },
  es: { title: 'Información de nacimiento', year: 'Año', month: 'Mes', day: 'Día', time: 'Hora', shichen: 'Por periodo', exact: 'Hora exacta', gender: 'Género', male: 'Masculino', female: 'Femenino', submit: 'Calcular', reset: '← Repetir', errYear: 'Ingrese año (1900-2100)', errMonth: 'Seleccione mes', errDay: 'Ingrese día', yearSuffix: '', monthSuffix: '', daySuffix: '', hourSuffix: '', minSuffix: '' },
  ko: { title: '생년월일 입력', year: '출생년도', month: '월', day: '일', time: '출생시간', shichen: '시간대 선택', exact: '정확한 시간', gender: '성별', male: '남', female: '여', submit: '사주 보기', reset: '← 다시 입력', errYear: '유효한 연도를 입력하세요 (1900-2100)', errMonth: '월을 선택하세요', errDay: '유효한 날짜를 입력하세요', yearSuffix: '년', monthSuffix: '월', daySuffix: '일', hourSuffix: '시', minSuffix: '분' },
};

export default function BaziForm() {
  const locale = useLocale();
  const t = TXT[locale] || TXT['zh-CN'];
  const shiChenOptions = SHI_CHEN(locale);
  const [screen, setScreen] = useState<'form' | 'transition' | 'result'>('form');
  const [formData, setFormData] = useState({ year: 1990, month: 1, day: 1, timeMode: 'shichen' as 'shichen' | 'exact', shichen: 6, hour: 12, minute: 0, gender: 0 as 0 | 1 });
  const [result, setResult] = useState<BaZiInput | null>(null);
  const [error, setError] = useState('');
  const daysInMonth = new Date(formData.year, formData.month, 0).getDate();

  const updateField = useCallback((field: string, value: string | number) => { setFormData(prev => ({ ...prev, [field]: value })); setError(''); }, []);
  const handleSubmit = useCallback(() => {
    const { year, month, day, shichen, hour, minute, gender, timeMode } = formData;
    if (!year || year < 1900 || year > 2100) { setError(t.errYear); return; }
    if (!month || month < 1 || month > 12) { setError(t.errMonth); return; }
    if (!day || day < 1 || day > daysInMonth) { setError(t.errDay); return; }
    let finalHour: number, finalMinute: number;
    if (timeMode === 'shichen') { finalHour = shichen === 0 ? 23 : shichen * 2 - 1; finalMinute = shichen === 0 ? 30 : 0; }
    else { finalHour = hour; finalMinute = minute; }
    setResult({ year, month, day, hour: finalHour, minute: finalMinute, gender });
    setScreen('transition'); setError('');
  }, [formData, daysInMonth, t.errYear, t.errMonth, t.errDay]);
  const handleTransitionComplete = useCallback(() => setScreen('result'), []);
  const handleReset = useCallback(() => { setScreen('form'); setResult(null); setError(''); }, []);

  const yearOptions: number[] = [];
  for (let y = 2026; y >= 1920; y--) yearOptions.push(y);

  return (
    <div className="max-w-lg mx-auto">
      {screen === 'transition' && <BaziTransition onComplete={handleTransitionComplete} locale={locale} />}
      {screen === 'form' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">{t.title}</h2>
          <div className="space-y-5">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.year}</label>
              <select value={formData.year} onChange={e => updateField('year', parseInt(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                {yearOptions.map(y => <option key={y} value={y}>{y}{t.yearSuffix}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.month}</label>
                <select value={formData.month} onChange={e => updateField('month', parseInt(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}{t.monthSuffix}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.day}</label>
                <select value={formData.day} onChange={e => updateField('day', parseInt(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}{t.daySuffix}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.time}</label>
              <div className="flex gap-2 mb-3">
                <button type="button" onClick={() => setFormData(p => ({ ...p, timeMode: 'shichen' }))}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${formData.timeMode === 'shichen' ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {t.shichen}
                </button>
                <button type="button" onClick={() => setFormData(p => ({ ...p, timeMode: 'exact' }))}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${formData.timeMode === 'exact' ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {t.exact}
                </button>
              </div>
              {formData.timeMode === 'shichen' ? (
                <select value={formData.shichen} onChange={e => updateField('shichen', parseInt(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                  {shiChenOptions.map((name, idx) => <option key={idx} value={idx}>{name}</option>)}
                </select>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <select value={formData.hour} onChange={e => updateField('hour', parseInt(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {Array.from({ length: 24 }, (_, i) => i).map(h => <option key={h} value={h}>{String(h).padStart(2, '0')}{t.hourSuffix}</option>)}
                  </select>
                  <select value={formData.minute} onChange={e => updateField('minute', parseInt(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {[0, 15, 30, 45].map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}{t.minSuffix}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.gender}</label>
              <div className="flex gap-4">
                {([[t.male, 0], [t.female, 1]] as const).map(([label, val]) => (
                  <label key={val} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${formData.gender === val ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    <input type="radio" name="gender" value={val} checked={formData.gender === val} onChange={() => updateField('gender', val)} className="sr-only" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600 text-center">{error}</p></div>}
          <button onClick={handleSubmit} className="mt-6 w-full py-3 bg-amber-700 hover:bg-amber-800 text-white text-lg font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">{t.submit}</button>
        </div>
      )}
      {screen === 'result' && result && (
        <div>
          <div className="text-center mb-6">
            <button onClick={handleReset} className="px-4 py-2 text-sm text-amber-700 hover:text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors">{t.reset}</button>
          </div>
          <BaziResultView input={result} autoFetchReading={true} />
        </div>
      )}
    </div>
  );
}
