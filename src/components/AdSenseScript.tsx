'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

/**
 * Google AdSense 脚本加载组件
 *
 * 审核通过后，将 NEXT_PUBLIC_ADSENSE_CLIENT_ID 添加到环境变量
 * 或者直接替换下方 data-ad-client 的值
 *
 * 环境变量：NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxx
 */
export default function AdSenseScript() {
  const pathname = usePathname();

  // 仅对非 API 路由加载
  if (pathname?.startsWith('/api')) return null;

  // 从环境变量获取 AdSense Client ID
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '';

  // 没配 ID 就不加载
  if (!clientId) return null;

  return (
    <Script
      id="adsense-init"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      onReady={() => {
        // AdSense 初始化完成
        console.log('AdSense loaded');
      }}
    />
  );
}
