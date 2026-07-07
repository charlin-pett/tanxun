import { getTranslations } from 'next-intl/server';
import { getAllHexagrams } from '@/lib/hexagram';
import HexagramGrid from '@/components/HexagramGrid';

/**
 * 六十四卦列表页面
 *
 * 显示全部 64 卦的网格视图，每卦展示：
 * - 卦符（Unicode 字符）
 * - 卦名
 * - 卦序
 *
 * 点击任一卦象跳转到详情页
 */
export default async function HexagramPage() {
  // 获取翻译文本
  const t = await getTranslations('hexagram');

  // 加载全部六十四卦数据（服务端渲染）
  const hexagrams = await getAllHexagrams();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600">{t('subtitle')}</p>
      </div>

      {/* 六十四卦网格 */}
      <HexagramGrid hexagrams={hexagrams} />
    </div>
  );
}
