import { getTranslations } from 'next-intl/server';
import BaziForm from '@/components/BaziForm';

/**
 * 八字排盘页面
 *
 * 用户输入出生信息后，自动计算命盘并展示结果。
 * 所有计算在浏览器端完成，无需 API 调用。
 */
export default async function BaziPage() {
  const t = await getTranslations('bazi');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      {/* 表单 + 结果 */}
      <BaziForm />
    </div>
  );
}
