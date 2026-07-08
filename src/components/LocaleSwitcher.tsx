'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, locales, type Locale } from '@/i18n/navigation';
import { useTransition } from 'react';

/**
 * 语言切换器组件
 *
 * 显示当前语言，点击后在下拉菜单中切换语言。
 * 切换时保持当前页面不变（仅改变语言前缀）。
 *
 * 工作流程：
 * 1. 用户选择目标语言
 * 2. useRouter().replace() 将 URL 前缀从 /zh-CN/... 改为 /en/...
 * 3. next-intl 自动重新加载对应语言包并重新渲染页面
 * 4. 用户停留在当前页面（如 /dream 还是 /dream），只是语言变了
 *
 * 语言显示格式：中文+英文名称（方便所有语言用户识别）
 */
export default function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  /**
   * 语言选项配置
   * label 同时显示中文和外文名，方便不同语言用户识别
   */
  const localeOptions: Record<Locale, { label: string; native: string }> = {
    'zh-CN': { label: '中文', native: '中文' },
    'en': { label: 'English', native: 'English' },
    'ru': { label: 'Русский', native: 'Русский' },
    'es': { label: 'Español', native: 'Español' },
  };

  /**
   * 切换语言
   * 使用 startTransition 包裹路由跳转以避免阻塞 UI
   */
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = e.target.value as Locale;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={handleChange}
        disabled={isPending}
        className="appearance-none bg-transparent border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
        aria-label={t('switchLang')}
      >
        {/* 所有语言选项都显示（后续语言加入后自动出现） */}
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeOptions[loc].label}
          </option>
        ))}
      </select>
      {/* 自定义下拉箭头 */}
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
