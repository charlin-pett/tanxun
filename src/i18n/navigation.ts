/**
 * 导航工具函数
 *
 * 封装 next-intl 的导航 API，用于组件中：
 * - 编程式跳转时保持当前语言
 * - Link 组件自动添加语言前缀
 * - usePathname 获取当前路径（不含语言前缀）
 */
import { createNavigation } from 'next-intl/navigation';

/**
 * 支持的语言列表
 * 必须与 middleware.ts 中的 locales 配置保持一致
 */
export const locales = ['zh-CN', 'en', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'zh-CN';

/**
 * 创建导航工具
 *
 * 导出以下函数供全项目使用：
 * - Link        — 智能 Link 组件，自动添加语言前缀
 * - redirect    — 服务端重定向（保持语言）
 * - usePathname — 获取当前路径（不含语言前缀）
 * - useRouter   — 编程式导航（保持语言）
 * - getPathname — 根据语言和路径获取本地化路径
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({
    locales,
    localePrefix: 'always',
  });
