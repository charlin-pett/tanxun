'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';

/**
 * 顶部导航栏
 *
 * 功能：
 * - 网站 Logo + 名称
 * - 主导航链接（首页、解梦、八字、百科）
 * - 语言切换器
 * - 移动端响应式（当前为简洁版，后续可加汉堡菜单）
 *
 * 当前高亮导航项通过 pathname 判断
 */
export default function Header() {
  // useTranslations('nav') 读取 messages/zh-CN.json 中 nav 下的内容
  const t = useTranslations('nav');
  const pathname = usePathname();

  // 导航菜单配置
  const navItems = [
    { href: '/', label: t('home') },
    { href: '/dream', label: t('dream') },
    { href: '/bazi', label: t('bazi') },
    { href: '/name', label: t('name') },
    { href: '/knowledge', label: t('knowledge') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo 区域 */}
        <Link href="/" className="flex items-center gap-2">
          {/* 太极图标（纯 CSS 绘制） */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-900 to-amber-700 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">探寻</span>
        </Link>

        {/* 导航链接 */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            // 判断是否为当前页面：匹配 /locale 或 /locale/item
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  isActive
                    ? 'text-amber-700 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 语言切换器 */}
        <LocaleSwitcher />
      </div>
    </header>
  );
}
