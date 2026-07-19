import createMiddleware from 'next-intl/middleware';

/**
 * 国际化中间件
 *
 * 功能：
 * 1. 自动检测用户浏览器语言，重定向到对应语言版本
 * 2. 所有路由自动添加语言前缀（/zh-CN/xxx, /en/xxx）
 * 3. SEO 友好——每种语言有独立的 URL 路径
 *
 * localeDetection: true
 *   - 用户首次访问 / 时，根据 Accept-Language 自动跳转
 *   - 中文浏览器 → /zh-CN/...
 *   - 英文浏览器 → /en/...（未来支持时生效）
 *   - 俄语浏览器 → /ru/...（未来支持时生效）
 *   - 无法识别 → 默认中文
 *
 * matcher 排除了静态资源路径（_next, 图片等）
 */
export default createMiddleware({
  // 支持的语言列表（顺序不重要，会按优先级匹配）
  locales: ['zh-CN', 'en', 'ru', 'es', 'ko'],
  // 默认语言
  defaultLocale: 'zh-CN',
  // 自动检测浏览器语言
  localeDetection: true,
  // URL 始终显示语言前缀（/zh-CN/dream 而非 /dream）
  localePrefix: 'always',
});

export const config = {
  // 匹配所有路由，排除静态资源和 API 路径
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
