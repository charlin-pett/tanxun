import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

/**
 * 字体配置
 * Geist Sans - 正文用
 * Geist Mono - 等宽字体（代码/数字用）
 */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * 根布局（最外层）
 *
 * 职责：
 * 1. 设置 HTML 基础属性（语言、字体变量）
 * 2. 不包含任何 UI 元素（由 locale 布局处理）
 * 3. 实现语言切换时 body 不变，只变 children
 */
export const metadata: Metadata = {
  title: '探寻 - 中华玄学文化平台',
  description: '周易·五行·八字·解梦 — 探索中华传统玄学智慧',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      // suppressHydrationWarning 防止 next-intl 切换 locale 时 hydration 警告
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
