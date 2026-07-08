import { getTranslations } from 'next-intl/server';
import DreamInput from '@/components/DreamInput';

/**
 * 梦境解译页面
 *
 * 用户输入梦境 → 实时分类 → AI 解梦 → 展示结果 + 卦象推荐
 */
export default async function DreamPage() {
  const t = await getTranslations('dream');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600">{t('subtitle')}</p>
      </div>

      {/* 解梦输入 + 结果 */}
      <DreamInput />
    </div>
  );
}
