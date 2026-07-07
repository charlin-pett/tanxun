import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

/**
 * next-intl 插件配置
 * 指定国际化请求配置文件的路径
 */
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* 未来可在此添加更多配置项 */
};

export default withNextIntl(nextConfig);
