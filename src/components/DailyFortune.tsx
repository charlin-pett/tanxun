'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import hexData from '@/data/hexagrams/zh-CN.json';

/** 每日一签组件
 *
 * 每天随机显示一卦，用 localStorage 记住今日卦象。
 * 同一日期在不同语言下显示同一卦。
 */
export default function DailyFortune() {
  const locale = useLocale();
  const [todayHex, setTodayHex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // 获取今天的日期字符串（用于 localStorage 键和随机种子）
  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }, []);

  // 根据日期确定今日卦序（确定性随机）
  const todayNumber = useMemo(() => {
    // 用日期作为种子，确保同一天同一卦
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = ((hash << 5) - hash) + todayStr.charCodeAt(i);
      hash |= 0;
    }
    return ((Math.abs(hash) % 64) + 1) as number;
  }, [todayStr]);

  // 加载今日卦象
  useEffect(() => {
    const stored = localStorage.getItem('tanxun_daily');
    if (stored === todayStr) {
      // 今日已抽过，从存储读取
      const storedNum = localStorage.getItem('tanxun_daily_num');
      if (storedNum) setTodayHex(parseInt(storedNum));
      else setTodayHex(todayNumber);
    } else {
      // 新的一天，更新
      localStorage.setItem('tanxun_daily', todayStr);
      localStorage.setItem('tanxun_daily_num', String(todayNumber));
      setTodayHex(todayNumber);
    }
  }, [todayStr, todayNumber]);

  // 获取卦象数据
  const hex = useMemo(() => {
    if (!todayHex) return null;
    const data = (hexData as Record<string, any>)[String(todayHex)];
    if (!data) return null;
    return data;
  }, [todayHex]);

  // 多语言翻译
  const TXT: Record<string, any> = {
    'zh-CN': { title: '今日运势', desc: '每日一卦 · 指引今日方向', share: '复制分享', copied: '已复制！', viewMore: '查看卦象详解', noFortune: '今日运势尚未生成，请稍后再来', shareText: (n: number, name: string) => `我今日抽到了「${name}卦」！来看看你的运势→` },
    en: { title: 'Daily Fortune', desc: 'One hexagram a day · Guide your path', share: 'Share', copied: 'Copied!', viewMore: 'View hexagram details', noFortune: 'Today\'s fortune not yet generated.', shareText: (n: number, name: string) => `I drew «${name}» today! Check your fortune →` },
    ru: { title: 'Гороскоп дня', desc: 'Одна гексаграмма в день', share: 'Поделиться', copied: 'Скопировано!', viewMore: 'Подробнее', noFortune: 'Сегодняшний прогноз ещё не готов.', shareText: (n: number, name: string) => `Сегодня я получил «${name}»! Узнай свою судьбу →` },
    es: { title: 'Horóscopo del día', desc: 'Un hexagrama al día', share: 'Compartir', copied: '¡Copiado!', viewMore: 'Ver hexagrama', noFortune: 'Horóscopo de hoy no disponible.', shareText: (n: number, name: string) => `¡Hoy saqué «${name}»! Mira tu fortuna →` },
  };
  const t = TXT[locale] || TXT['zh-CN'];

  const handleShare = async () => {
    const url = `${window.location.origin}/${locale}/hexagram/${todayHex}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!hex || !todayHex) {
    return (
      <section className="w-full py-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 animate-pulse flex items-center justify-center">
              <span className="text-2xl">☯</span>
            </div>
            <p className="text-gray-400 italic">{t.noFortune}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-gradient-to-b from-amber-50/50 to-white">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl border border-amber-200 shadow-md overflow-hidden">
          {/* 头部 */}
          <div className="p-5 bg-gradient-to-r from-amber-700 to-amber-600 text-white text-center">
            <p className="text-xs uppercase tracking-widest opacity-80">{t.desc}</p>
            <h2 className="text-xl font-bold mt-1">{t.title}</h2>
          </div>

          {/* 卦象展示 */}
          <div className="p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
              <span className="text-5xl">{hex.symbol}</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {hex.name}
            </h3>
            <p className="text-sm text-amber-700 font-classic mb-4">
              {hex.fullName}
            </p>

            {/* 卦辞 */}
            <div className="bg-amber-50/50 rounded-xl p-4 mb-5">
              <p className="text-sm text-gray-700 font-classic leading-relaxed">
                {hex.judgment}
              </p>
            </div>

            {/* 按钮组 */}
            <div className="flex gap-3 justify-center">
              <Link
                href={`/hexagram/${todayHex}`}
                className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {t.viewMore}
              </Link>
              <button
                onClick={handleShare}
                className="px-5 py-2.5 bg-white border border-amber-300 hover:bg-amber-50 text-amber-700 text-sm font-medium rounded-lg transition-colors"
              >
                {copied ? t.copied : t.share}
              </button>
            </div>
          </div>

          {/* 脚注 */}
          <div className="px-8 pb-5 text-center">
            <p className="text-xs text-gray-400">
              {locale === 'zh-CN' ? `第${todayHex}卦 · ${todayStr}` : `Hexagram ${todayHex} · ${todayStr}`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
