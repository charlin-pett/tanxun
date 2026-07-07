import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/**
 * 语言布局组件
 *
 * 职责：
 * 1. 用 NextIntlClientProvider 包裹子组件，提供国际化上下文
 * 2. 渲染全局 UI 框架（导航栏 + 页脚）
 * 3. 根据当前 locale 加载对应语言的消息
 *
 * 每个语言版本的页面都共享此布局：
 * /zh-CN/... → 中文布局
 * /en/...    → 英文布局（未来）
 * /ru/...    → 俄语布局（未来）
 */
interface LocaleLayoutProps {
  children: ReactNode;
}

export default async function LocaleLayout({ children }: LocaleLayoutProps) {
  // 获取当前语言和消息（服务端组件用法）
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* 导航栏 */}
      <Header />

      {/* 主内容区 */}
      <main className="flex-1">{children}</main>

      {/* 页脚 */}
      <Footer />
    </NextIntlClientProvider>
  );
}
