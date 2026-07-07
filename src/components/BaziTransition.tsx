'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * 八字排盘过渡动画组件
 *
 * 用户提交出生信息后，显示 5-6 秒的全屏过渡动画：
 *   阶段1 (0-1.5s)：太极旋转 + 八卦符号闪现
 *   阶段2 (1.5-3s)：五行文字轮转
 *   阶段3 (3-4.5s)：星座符号闪过
 *   阶段4 (4.5-5s+)：收尾淡出
 *
 * props:
 *   onComplete - 动画结束后回调
 *   duration   - 动画总时长（毫秒，默认5500）
 */

interface BaziTransitionProps {
  onComplete: () => void;
  duration?: number;
}

// ===== 动画用数据 =====

/** 八卦符号 */
const BA_GUA: string[] = ['䷀', '䷁', '䷂', '䷃', '䷄', '䷅', '䷆', '䷇'];

/** 五行文字 */
const WU_XING_CHARS: string[] = ['金', '木', '水', '火', '土'];

/** 五行对应颜色 */
const WU_XING_COLORS: string[] = [
  '#d4a017', // 金-金色
  '#2d7d2d', // 木-翠绿
  '#1a6b8a', // 水-深蓝
  '#c0392b', // 火-朱红
  '#8b5a2b', // 土-檀木
];

/** 星座符号 */
const ZODIAC_SYMBOLS: string[] = [
  '♈', '♉', '♊', '♋', '♌', '♍',
  '♎', '♏', '♐', '♑', '♒', '♓',
];

export default function BaziTransition({
  onComplete,
  duration = 5500,
}: BaziTransitionProps) {
  // 当前阶段：0=八卦, 1=五行, 2=星座, 3=收尾
  const [phase, setPhase] = useState(0);
  // 当前显示的符号索引（用于闪烁切换）
  const [symbolIdx, setSymbolIdx] = useState(0);
  // 进度百分比 (0-100)
  const [progress, setProgress] = useState(0);
  // 淡出动画
  const [fadeOut, setFadeOut] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const startTime = Date.now();
    const totalDuration = duration;

    // ===== 阶段切换逻辑 =====
    const phaseTimers: ReturnType<typeof setTimeout>[] = [];

    phaseTimers.push(
      setTimeout(() => setPhase(1), 1500),  // 1.5s → 五行
      setTimeout(() => setPhase(2), 3200),  // 3.2s → 星座
      setTimeout(() => setPhase(3), 4700),  // 4.7s → 收尾
      setTimeout(() => {
        // 收尾淡出
        setFadeOut(true);
        setTimeout(() => onComplete(), 600);
      }, 5000)
    );

    // ===== 符号闪烁切换 =====
    timerRef.current = setInterval(() => {
      setSymbolIdx((prev) => prev + 1);
    }, 180);

    // ===== 进度条 =====
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / totalDuration) * 100), 99);
      setProgress(pct);
    }, 50);

    return () => {
      phaseTimers.forEach((t) => clearTimeout(t));
      if (timerRef.current) clearInterval(timerRef.current);
      clearInterval(progressTimer);
    };
  }, [duration, onComplete]);

  // 根据阶段获取当前显示的符号
  const currentSymbol = (() => {
    const idx = symbolIdx;
    switch (phase) {
      case 0:
        return BA_GUA[idx % BA_GUA.length];
      case 1: {
        const wIdx = idx % WU_XING_CHARS.length;
        return (
          <span style={{ color: WU_XING_COLORS[wIdx] }}>
            {WU_XING_CHARS[wIdx]}
          </span>
        );
      }
      case 2:
        return ZODIAC_SYMBOLS[idx % ZODIAC_SYMBOLS.length];
      case 3:
        return '☯';
      default:
        return '☯';
    }
  })();

  // 每个阶段的背景颜色
  const bgColors = [
    'from-gray-900 via-amber-950 to-gray-900',   // 八卦阶段-深邃
    'from-amber-950 via-red-950 to-amber-950',     // 五行阶段-炽热
    'from-indigo-950 via-purple-950 to-indigo-950', // 星座阶段-星空
    'from-gray-900 to-gray-900',                   // 收尾
  ];

  // 每个阶段的状态文字
  const phaseTexts = [
    '天地初开 · 八卦轮转',
    '五行生克 · 万象更新',
    '星辰列阵 · 命理昭然',
    '推演完成 · 即将呈现',
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-gradient-to-br ${bgColors[phase]}
        transition-all duration-700
        ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
    >
      {/* ===== 符号展示区 ===== */}
      <div className="relative w-48 h-48 mb-8">
        {/* 外圈旋转环（八卦/五行阶段） */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-amber-500/30
            ${phase <= 1 ? 'animate-spin-slow' : 'opacity-0'}
            transition-opacity duration-500`}
          style={{ animationDuration: '8s' }}
        />

        {/* 内圈旋转环（星座阶段） */}
        <div
          className={`absolute inset-4 rounded-full border border-white/10
            ${phase === 2 ? 'animate-spin-slow' : 'opacity-0'}
            transition-opacity duration-500`}
          style={{ animationDuration: '12s', animationDirection: 'reverse' }}
        />

        {/* 中央大符号 */}
        <div
          className={`absolute inset-0 flex items-center justify-center
            transition-all duration-300
            ${phase === 1 ? 'animate-pulse' : ''}`}
        >
          {/* 太极图背景 */}
          <div
            className={`w-32 h-32 rounded-full bg-gradient-to-b from-amber-100 to-amber-50
              flex items-center justify-center shadow-2xl
              ${phase === 0 ? 'animate-spin-slow' : ''}
              transition-all duration-700`}
            style={
              phase === 0
                ? { animationDuration: '3s' }
                : {}
            }
          >
            <span
              className={`text-6xl transition-all duration-500
                ${phase === 2 ? 'text-5xl' : 'text-6xl'}
                ${phase === 2 ? 'animate-bounce' : ''}`}
            >
              {currentSymbol}
            </span>
          </div>
        </div>

        {/* 飘散的小符号（装饰） */}
        {Array.from({ length: 6 }).map((_, i) => {
          // 散步的小符号
          const smallSymbols =
            phase === 0
              ? BA_GUA
              : phase === 1
              ? WU_XING_CHARS
              : phase === 2
              ? ZODIAC_SYMBOLS
              : ['✦'];

          return (
            <div
              key={i}
              className={`absolute text-lg transition-all duration-1000
                ${phase <= 2 ? 'opacity-40' : 'opacity-0'}`}
              style={{
                top: `${20 + Math.sin(i * 1.2 + symbolIdx * 0.1) * 35}%`,
                left: `${20 + Math.cos(i * 1.2 + symbolIdx * 0.1) * 35}%`,
                color: phase === 1 ? WU_XING_COLORS[i % 5] : 'rgba(255,255,255,0.3)',
                transform: `rotate(${symbolIdx * 15 + i * 60}deg)`,
                fontSize: `${1 + Math.sin(i) * 0.3}rem`,
                transition: 'all 0.3s ease',
              }}
            >
              {smallSymbols[i % smallSymbols.length]}
            </div>
          );
        })}
      </div>

      {/* ===== 状态文字 ===== */}
      <p className="text-lg text-amber-200/80 font-classic mb-6 transition-all duration-500">
        {phaseTexts[phase]}
      </p>

      {/* ===== 进度条 ===== */}
      <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-white/30">
        正在为您推演命理…
      </p>
    </div>
  );
}
