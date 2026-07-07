import { getRequestConfig } from 'next-intl/server';

/**
 * 国际化请求配置
 *
 * 核心逻辑：
 * - 根据 URL 中的 locale 参数加载对应语言的 messages 文件
 * - 如果目标语言的某个 key 不存在，回退到中文（zh-CN）
 * - 这样加新语言时可以先只翻译一部分，其余显示中文
 *
 * messages/ 目录下每个 JSON 文件对应一种语言：
 *   zh-CN.json  - 中文（基准语言）
 *   en.json     - 英文（后续添加）
 *   ru.json     - 俄语（后续添加）
 */
export default getRequestConfig(async ({ locale: rawLocale }) => {
  // locale 从 URL 参数获取，可能为 undefined，兜底为 'zh-CN'
  const locale = rawLocale ?? 'zh-CN';
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'Asia/Shanghai',
  };
});
