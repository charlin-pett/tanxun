'use client';

import { useMemo } from 'react';
import zodiacData from '@/data/zodiac/zh-CN.json';
import { getZodiacIndex, ZODIAC_NAMES } from '@/engine/zodiac';

/**
 * 星座卡片组件
 *
 * 根据出生月日显示星座信息，包括：
 * - 星座名称 + 日期区间
 * - 星座符号元素
 * - 性格关键词
 * - 优点/缺点
 * - 幸运信息
 */
interface ZodiacCardProps {
  month: number;
  day: number;
}

/** 星座对应 Emoji / Unicode 符号 */
const ZODIAC_SYMBOLS: string[] = [
  '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓',
];

/** 星座元素对应的颜色 */
const ELEMENT_COLORS: Record<string, string> = {
  '火': 'from-orange-100 to-red-50 border-orange-200 text-orange-800',
  '土': 'from-amber-100 to-yellow-50 border-amber-200 text-amber-800',
  '风': 'from-sky-100 to-blue-50 border-sky-200 text-sky-800',
  '水': 'from-cyan-100 to-blue-50 border-cyan-200 text-cyan-800',
};

export default function ZodiacCard({ month, day }: ZodiacCardProps) {
  // 获取星座数据
  const zodiacInfo = useMemo(() => {
    const index = getZodiacIndex(month, day);
    if (index < 0) return null;
    const data = (zodiacData as Record<string, any>)[String(index)];
    return { index, ...data };
  }, [month, day]);

  if (!zodiacInfo) {
    return null;
  }

  const symbol = ZODIAC_SYMBOLS[zodiacInfo.index];
  const colorClass = ELEMENT_COLORS[zodiacInfo.element] || ELEMENT_COLORS['火'];

  return (
    <div
      className={`bg-gradient-to-br ${colorClass} rounded-xl border shadow-sm p-6`}
    >
      {/* 头部：符号 + 名称 */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-white/70 rounded-full flex items-center justify-center text-2xl shadow-sm">
          {symbol}
        </div>
        <div>
          <h3 className="text-lg font-bold">{zodiacInfo.name}</h3>
          <p className="text-xs opacity-70">
            {zodiacInfo.englishName} · {zodiacInfo.date}
          </p>
        </div>
      </div>

      {/* 基本信息 */}
      <div className="flex gap-3 mb-4">
        <span className="px-2 py-0.5 bg-white/50 rounded text-xs font-medium">
          ♨ {zodiacInfo.element}象星座
        </span>
        <span className="px-2 py-0.5 bg-white/50 rounded text-xs font-medium">
          守护星：{zodiacInfo.ruler}
        </span>
      </div>

      {/* 关键词 */}
      <div className="mb-4">
        <p className="text-xs font-semibold mb-1.5 opacity-60">性格关键词</p>
        <div className="flex flex-wrap gap-1.5">
          {zodiacInfo.keywords?.map((kw: string, i: number) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-white/60 rounded text-xs"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* 优点/缺点 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs font-semibold mb-1 opacity-60">✨ 优点</p>
          <ul className="space-y-0.5">
            {zodiacInfo.strengths?.slice(0, 3).map((s: string, i: number) => (
              <li key={i} className="text-xs">
                ✓ {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold mb-1 opacity-60">⚠ 缺点</p>
          <ul className="space-y-0.5">
            {zodiacInfo.weaknesses?.slice(0, 3).map((w: string, i: number) => (
              <li key={i} className="text-xs">
                ✗ {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 性格简述 */}
      <p className="text-sm leading-relaxed opacity-80">
        {zodiacInfo.personality}
      </p>
    </div>
  );
}
