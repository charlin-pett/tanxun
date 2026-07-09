'use client';

import { useEffect, useRef } from 'react';

/**
 * Google AdSense 广告组件
 *
 * 使用方式：在任意页面插入 <AdSenseAd slot="xxxxxxxxx" />
 *
 * 注意：
 * 1. 需要先在 Google AdSense 后台创建广告单元，获取 slot ID
 * 2. 将 AdSense 代码中的 data-ad-slot 值传进来
 * 3. 审核通过前广告不会显示
 *
 * 显示位置：
 * - 首页底部（展示量大）
 * - 百科文章底部（内容相关）
 * - 六十四卦列表中间
 * - 八字排盘结果下方
 */

interface AdSenseAdProps {
  /** AdSense 广告单元 slot ID */
  slot: string;
  /** 广告格式: 'display' | 'in-article' | 'in-feed' */
  format?: string;
  /** 是否全宽响应式 */
  fullWidth?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSenseAd({
  slot,
  format = 'auto',
  fullWidth = true,
}: AdSenseAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // 避免重复初始化
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      // 如果 adsbygoogle 已存在，push 当前的广告
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch {
      // AdSense 未加载时不报错
    }
  }, []);

  // 如果 slot 为空，不渲染（开发模式）
  if (!slot || slot === 'xxxxxxxxx') {
    return (
      <div className="py-4 text-center text-xs text-gray-300 italic">
        {/* 广告位预留 */}
      </div>
    );
  }

  return (
    <div ref={adRef} className="py-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: fullWidth ? '100%' : undefined }}
        data-ad-client="ca-pub-3764903137431855"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidth.toString()}
      />
    </div>
  );
}
