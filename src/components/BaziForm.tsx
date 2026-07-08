'use client';

import { useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import type { BaZiInput } from '@/engine/types';
import { SHI_CHEN } from '@/engine/labels';
import BaziResultView from './BaziResultView';
import BaziTransition from './BaziTransition';

/**
 * 八字排盘表单组件
 *
 * 三屏流程：
 *   表单屏 → 用户输入出生信息
 *   过渡屏 → 全屏动画（5-6秒，八卦五行星座）
 *   结果屏 → 星座卡片 + 八字命盘 + AI命理报告
 */
export default function BaziForm() {
  const locale = useLocale();
  const shiChenOptions = SHI_CHEN(locale);
  // ===== 当前屏幕: 'form' | 'transition' | 'result' =====
  const [screen, setScreen] = useState<'form' | 'transition' | 'result'>('form');

  // ===== 表单数据 =====
  const [formData, setFormData] = useState({
    year: 1990,
    month: 1,
    day: 1,
    timeMode: 'shichen' as 'shichen' | 'exact',
    shichen: 6,
    hour: 12,
    minute: 0,
    gender: 0 as 0 | 1,
  });

  // ===== 计算结果 =====
  const [result, setResult] = useState<BaZiInput | null>(null);

  // ===== 错误状态 =====
  const [error, setError] = useState('');

  // ===== 日期天数 =====
  const daysInMonth = new Date(formData.year, formData.month, 0).getDate();

  /**
   * 表单更新
   */
  const updateField = useCallback(
    (field: string, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setError('');
    },
    []
  );

  /**
   * 提交表单 → 进入过渡动画
   */
  const handleSubmit = useCallback(() => {
    const { year, month, day, shichen, hour, minute, gender, timeMode } = formData;

    if (!year || year < 1900 || year > 2100) {
      setError('请输入有效的年份（1900-2100）');
      return;
    }
    if (!month || month < 1 || month > 12) {
      setError('请选择月份');
      return;
    }
    if (!day || day < 1 || day > daysInMonth) {
      setError('请输入有效的日期');
      return;
    }

    // 计算最终的小时和分钟
    let finalHour: number;
    let finalMinute: number;

    if (timeMode === 'shichen') {
      if (shichen === 0) {
        finalHour = 23;
        finalMinute = 30;
      } else {
        finalHour = shichen * 2 - 1;
        finalMinute = 0;
      }
    } else {
      finalHour = hour;
      finalMinute = minute;
    }

    const input: BaZiInput = {
      year,
      month,
      day,
      hour: finalHour,
      minute: finalMinute,
      gender,
    };

    // 存入结果，切换到过渡动画
    setResult(input);
    setScreen('transition');
    setError('');
  }, [formData, daysInMonth]);

  /**
   * 过渡动画完成 → 显示结果
   */
  const handleTransitionComplete = useCallback(() => {
    setScreen('result');
  }, []);

  /**
   * 重新输入
   */
  const handleReset = useCallback(() => {
    setScreen('form');
    setResult(null);
    setError('');
  }, []);

  // ===== 年份选项 =====
  const yearOptions: number[] = [];
  for (let y = 2026; y >= 1920; y--) {
    yearOptions.push(y);
  }

  // ===== 渲染 =====
  return (
    <div className="max-w-lg mx-auto">
      {/* ===== 过渡动画屏 ===== */}
      {screen === 'transition' && (
        <BaziTransition onComplete={handleTransitionComplete} />
      )}

      {/* ===== 表单屏 ===== */}
      {screen === 'form' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
            输入出生信息
          </h2>

          <div className="space-y-5">
            {/* 出生年份 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                出生年份
              </label>
              <select
                value={formData.year}
                onChange={(e) => updateField('year', parseInt(e.target.value))}
                className="w-full h-10 px-3 rounded-lg border border-gray-200
                           text-gray-900 bg-white
                           focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}年
                  </option>
                ))}
              </select>
            </div>

            {/* 月份和日期 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  月份
                </label>
                <select
                  value={formData.month}
                  onChange={(e) =>
                    updateField('month', parseInt(e.target.value))
                  }
                  className="w-full h-10 px-3 rounded-lg border border-gray-200
                             text-gray-900 bg-white
                             focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}月
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  日期
                </label>
                <select
                  value={formData.day}
                  onChange={(e) =>
                    updateField('day', parseInt(e.target.value))
                  }
                  className="w-full h-10 px-3 rounded-lg border border-gray-200
                             text-gray-900 bg-white
                             focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                    (d) => (
                      <option key={d} value={d}>
                        {d}日
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* 出生时间 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                出生时间
              </label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, timeMode: 'shichen' }))
                  }
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    formData.timeMode === 'shichen'
                      ? 'bg-amber-100 border-amber-400 text-amber-800'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  选择时辰
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, timeMode: 'exact' }))
                  }
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    formData.timeMode === 'exact'
                      ? 'bg-amber-100 border-amber-400 text-amber-800'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  精确时间
                </button>
              </div>

              {formData.timeMode === 'shichen' ? (
                <select
                  value={formData.shichen}
                  onChange={(e) =>
                    updateField('shichen', parseInt(e.target.value))
                  }
                  className="w-full h-10 px-3 rounded-lg border border-gray-200
                             text-gray-900 bg-white
                             focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {shiChenOptions.map((name, idx) => (
                    <option key={idx} value={idx}>
                      {name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={formData.hour}
                    onChange={(e) =>
                      updateField('hour', parseInt(e.target.value))
                    }
                    className="w-full h-10 px-3 rounded-lg border border-gray-200
                               text-gray-900 bg-white
                               focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                      <option key={h} value={h}>
                        {String(h).padStart(2, '0')}时
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.minute}
                    onChange={(e) =>
                      updateField('minute', parseInt(e.target.value))
                    }
                    className="w-full h-10 px-3 rounded-lg border border-gray-200
                               text-gray-900 bg-white
                               focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m} value={m}>
                        {String(m).padStart(2, '0')}分
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* 性别 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性别
              </label>
              <div className="flex gap-4">
                {([['男', 0], ['女', 1]] as const).map(([label, val]) => (
                  <label
                    key={val}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.gender === val
                        ? 'bg-amber-100 border-amber-400 text-amber-800'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={val}
                      checked={formData.gender === val}
                      onChange={() => updateField('gender', val)}
                      className="sr-only"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* 提交按钮 */}
          <button
            onClick={handleSubmit}
            className="mt-6 w-full py-3 bg-amber-700 hover:bg-amber-800
                       text-white text-lg font-medium rounded-lg
                       transition-colors focus:outline-none focus:ring-2
                       focus:ring-amber-500 focus:ring-offset-2"
          >
            排盘测算
          </button>
        </div>
      )}

      {/* ===== 结果屏 ===== */}
      {screen === 'result' && result && (
        <div>
          <div className="text-center mb-6">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-amber-700 hover:text-amber-800
                         border border-amber-300 rounded-lg hover:bg-amber-50
                         transition-colors"
            >
              ← 重新输入
            </button>
          </div>
          <BaziResultView input={result} autoFetchReading={true} />
        </div>
      )}
    </div>
  );
}
