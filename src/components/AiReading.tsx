'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * AI 命理报告组件
 *
 * 四个状态：
 *   idle    → 显示"生成报告"按钮（手动模式）
 *   loading → 旋转动画 + "正在为您推演命理…"
 *   done    → 显示 AI 生成的长篇报告
 *   error   → 显示错误信息 + 重试按钮
 *
 * 两种触发方式：
 *   autoFetch=false（默认）→ 需要用户点击按钮
 *   autoFetch=true        → 挂载后自动开始生成
 */

// ===== 请求参数类型 =====
interface ReadingParams {
  birthInfo: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    gender: string;
  };
  zodiac: { name: string; element: string };
  fourPillars: { year: string; month: string; day: string; hour: string };
  dayMaster: string;
  wuxingSummary: string;
  daYun: string;
  liuNian: string;
}

interface AiReadingProps {
  params: ReadingParams;
  /** true = 自动开始生成（过渡动画完成后使用） */
  autoFetch?: boolean;
}

type ReadingState = 'idle' | 'loading' | 'done' | 'error';

export default function AiReading({ params, autoFetch = false }: AiReadingProps) {
  // 如果 autoFetch=true，初始状态为 'loading'，否则为 'idle'
  const [state, setState] = useState<ReadingState>(autoFetch ? 'loading' : 'idle');
  const [reading, setReading] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [modelHint, setModelHint] = useState<string>('');
  const hasFetched = useRef(false);

  /**
   * 生成命理报告
   */
  const generateReading = useCallback(async () => {
    setState('loading');
    setError('');

    try {
      const response = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || '报告生成失败');
      }

      const data = await response.json();
      setReading(data.reading);
      setModelHint(data.hint || '');
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络异常，请稍后再试');
      setState('error');
    }
  }, [params]);

  /**
   * autoFetch=true 时，挂载后自动触发
   */
  useEffect(() => {
    if (autoFetch && !hasFetched.current) {
      hasFetched.current = true;
      generateReading();
    }
  }, [autoFetch, generateReading]);

  // ===== 初始态（仅手动模式） =====
  if (state === 'idle') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">AI 命理报告</h3>
        <p className="text-sm text-gray-500 mb-6">
          结合八字 + 星座 + 五行，AI 为您生成个性化命理分析报告
        </p>
        <button
          onClick={generateReading}
          className="px-8 py-3 bg-gradient-to-r from-amber-700 to-amber-600
                     text-white font-medium rounded-lg shadow-sm
                     hover:from-amber-800 hover:to-amber-700
                     transition-all duration-200"
        >
          开始测算命理
        </button>
      </div>
    );
  }

  // ===== 加载态 =====
  if (state === 'loading') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        {/* 太极旋转动画 */}
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="absolute inset-0 rounded-full border-4 border-amber-200 border-t-amber-700 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-b from-amber-700 to-amber-900 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">
          正在为您推演命理…
        </h3>
        <p className="text-sm text-gray-400">
          结合八字与星座，综合五行生克，请稍候
        </p>
        <div className="mt-6 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ===== 错误态 =====
  if (state === 'error') {
    return (
      <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">生成失败</h3>
        <p className="text-sm text-gray-500 mb-6">{error}</p>
        <button
          onClick={generateReading}
          className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          重新生成
        </button>
      </div>
    );
  }

  // ===== 完成态 =====
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* 报告头部 */}
      <div className="p-4 bg-gradient-to-r from-amber-700 to-amber-600 text-white">
        <h3 className="text-lg font-bold">AI 命理分析报告</h3>
        <p className="text-xs opacity-80 mt-1">
          基于八字排盘 + 星座分析 + 五行生克综合生成
        </p>
      </div>

      {/* 报告正文 */}
      <div className="p-6">
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {reading}
        </div>

        {/* Mock 提示 */}
        {modelHint && (
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700">{modelHint}</p>
          </div>
        )}

        {/* 页脚 */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            以上内容由 AI 生成，仅供文化参考，请理性看待
          </p>
          <button
            onClick={generateReading}
            className="mt-3 text-xs text-amber-600 hover:text-amber-700 underline"
          >
            重新生成
          </button>
        </div>
      </div>
    </div>
  );
}
