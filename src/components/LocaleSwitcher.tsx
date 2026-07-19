'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, locales, type Locale } from '@/i18n/navigation';
import { useTransition, useState, useRef, useEffect } from 'react';

/** 国旗 Emoji + 语言名称 */
const LOCALE_FLAGS: Record<Locale, { flag: string; name: string }> = {
  'zh-CN': { flag: '🇨🇳', name: '中文' },
  'en': { flag: '🇬🇧', name: 'English' },
  'ru': { flag: '🇷🇺', name: 'Русский' },
  'es': { flag: '🇪🇸', name: 'Español' },
  'ko': { flag: '🇰🇷', name: '한국어' },
};

export default function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function switchLocale(nextLocale: Locale) {
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  const current = LOCALE_FLAGS[locale];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 当前语言按钮 - 更醒目的样式 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-300
                   rounded-lg text-sm font-medium text-amber-800
                   hover:bg-amber-100 active:bg-amber-200
                   transition-all duration-150 shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1
                   disabled:opacity-50"
        aria-label={t('switchLang')}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.name}</span>
        <svg
          className={`w-3.5 h-3.5 text-amber-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white border border-gray-200
                        rounded-xl shadow-lg py-1.5 z-50 animate-dropdown">
          {locales.map((loc) => {
            const opt = LOCALE_FLAGS[loc];
            const isActive = loc === locale;
            return (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                  ${isActive
                    ? 'bg-amber-50 text-amber-800 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <span className="text-lg leading-none">{opt.flag}</span>
                <span className="flex-1 text-left">{opt.name}</span>
                {isActive && (
                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
