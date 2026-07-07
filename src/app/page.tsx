import { redirect } from 'next/navigation';

/**
 * 根页面
 *
 * 访问 / 时自动重定向到默认语言版本：
 * / → /zh-CN/
 *
 * 如果中间件启用了 localeDetection，会根据浏览器语言
 * 自动跳转到对应语言版本，不会走到这里。
 * 此页面作为兜底。
 */
export default function RootPage() {
  redirect('/zh-CN');
}
