'use client';

import Script from 'next/script';

/**
 * Google AdSense 脚本
 * 在网站每个页面的 <head> 中加载 AdSense
 */
export default function AdSenseScript() {
  return (
    <Script
      id="adsense-init"
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3764903137431855"
      crossOrigin="anonymous"
    />
  );
}
