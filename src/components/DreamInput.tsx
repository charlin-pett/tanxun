'use client';

import { useState, useCallback } from 'react';
import { classifyDream, CATEGORY_LABELS_CN } from '@/engine/dream/categories';
import DreamResult from './DreamResult';

/** 历史记录条目 */
interface DreamHistoryItem {
  id: string;
  dreamText: string;
  interpretation: string;
  categories: string[];
  timestamp: number;
}

export default function DreamInput() {
  const [dreamText, setDreamText] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [state, setState] = useState<'input' | 'loading' | 'done' | 'error'>('input');
  const [interpretation, setInterpretation] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<DreamHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('dream_history') || '[]');
      } catch { return []; }
    }
    return [];
  });

  /**
   * 输入变化时实时分析分类
   */
  const handleTextChange = useCallback((text: string) => {
    setDreamText(text);
    if (text.trim().length >= 2) {
      setCategories(classifyDream(text));
    } else {
      setCategories([]);
    }
  }, []);

  /**
   * 提交解梦
   */
  const handleSubmit = useCallback(async () => {
    const trimmed = dreamText.trim();
    if (trimmed.length < 2) {
      setError('请描述你的梦境');
      return;
    }

    setState('loading');
    setError('');

    try {
      const response = await fetch('/api/dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreamText: trimmed,
          categories,
          locale: 'zh-CN',
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || '解梦失败');
      }

      const data = await response.json();
      setInterpretation(data.interpretation);
      setState('done');

      // 保存到历史记录
      const item: DreamHistoryItem = {
        id: Date.now().toString(),
        dreamText: trimmed,
        interpretation: data.interpretation,
        categories,
        timestamp: Date.now(),
      };
      const updatedHistory = [item, ...history].slice(0, 20);
      setHistory(updatedHistory);
      localStorage.setItem('dream_history', JSON.stringify(updatedHistory));
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络异常，请稍后再试');
      setState('error');
    }
  }, [dreamText, categories, history]);

  /**
   * 重新输入
   */
  const handleReset = useCallback(() => {
    setState('input');
    setDreamText('');
    setCategories([]);
    setInterpretation('');
    setError('');
  }, []);

  /**
   * 从历史记录加载
   */
  const handleLoadHistory = useCallback((item: DreamHistoryItem) => {
    setDreamText(item.dreamText);
    setCategories(item.categories);
    setInterpretation(item.interpretation);
    setState('done');
  }, []);

  /**
   * 清除历史
   */
  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('dream_history');
  }, []);

  // ===== 结果态 =====
  if (state === 'done') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-amber-700 hover:text-amber-800
                       border border-amber-300 rounded-lg hover:bg-amber-50
                       transition-colors"
          >
            ← 继续解梦
          </button>
        </div>
        <DreamResult
          dreamText={dreamText}
          interpretation={interpretation}
          categories={categories}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ===== 输入区 ===== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        {/* 纸笺风格标题 */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">描述你的梦境</h2>
          <p className="text-sm text-gray-400">请详细描述，越具体解读越准确</p>
        </div>

        {/* 文本输入框 */}
        <textarea
          value={dreamText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="例如：我梦见自己在天空飞翔，下面是一片大海，远处有一条龙在云中穿行……"
          className="w-full h-40 p-5 border border-amber-200 rounded-xl resize-none
                     text-gray-700 placeholder-gray-300 bg-amber-50/30
                     focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                     font-classic text-base leading-relaxed
                     transition-shadow duration-200 shadow-inner"
          maxLength={2000}
        />

        {/* 字数提示 */}
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-400">
            {dreamText.length}/2000字
          </p>
        </div>

        {/* 分类标签 */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium"
              >
                {CATEGORY_LABELS_CN[cat] || cat}
              </span>
            ))}
          </div>
        )}

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          disabled={dreamText.trim().length < 2 || state === 'loading'}
          className="mt-6 w-full py-3 bg-amber-700 hover:bg-amber-800
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     text-white font-medium rounded-lg
                     transition-colors focus:outline-none focus:ring-2
                     focus:ring-amber-500 focus:ring-offset-2"
        >
          开始解梦
        </button>

        {/* 错误提示 */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}
      </div>

      {/* ===== 解梦历史 ===== */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-900">解梦记录</h3>
            <button
              onClick={handleClearHistory}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              清除记录
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLoadHistory(item)}
                className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-amber-50
                           border border-gray-100 hover:border-amber-200
                           transition-colors group"
              >
                <p className="text-sm text-gray-700 line-clamp-1 group-hover:text-amber-800">
                  {item.dreamText}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(item.timestamp).toLocaleString('zh-CN')}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
