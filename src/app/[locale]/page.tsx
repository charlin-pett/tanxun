import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import FeatureCard from '@/components/FeatureCard';

/**
 * 首页组件（服务端渲染）
 *
 * 内容区域包含：
 * - Hero 区域（标题 + 副标题 + 描述）
 * - 四大功能卡片入口
 * - 每日运势区域
 *
 * 所有文本通过 useTranslations / getTranslations 从语言包读取
 */
export default async function HomePage() {
  // 服务端获取翻译函数
  const t = await getTranslations('home');

  return (
    <div className="flex flex-col items-center">
      {/* ===== Hero 区域 ===== */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-amber-700 font-serif mb-4">
            {t('hero.subtitle')}
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* ===== 功能卡片区域 ===== */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 梦境解译卡片 */}
          <FeatureCard
            title={t('features.dream.title')}
            description={t('features.dream.description')}
            href="/dream"
            icon="dream"
          />

          {/* 八字排盘卡片 */}
          <FeatureCard
            title={t('features.bazi.title')}
            description={t('features.bazi.description')}
            href="/bazi"
            icon="bazi"
          />

          {/* 周易卦象卡片 */}
          <FeatureCard
            title={t('features.hexagram.title')}
            description={t('features.hexagram.description')}
            href="/hexagram"
            icon="hexagram"
          />

          {/* 玄学百科卡片 */}
          <FeatureCard
            title={t('features.knowledge.title')}
            description={t('features.knowledge.description')}
            href="/knowledge"
            icon="knowledge"
          />
        </div>
      </section>

      {/* ===== 每日运势区域 ===== */}
      <section className="w-full bg-amber-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('dailyFortune.title')}
          </h2>
          <p className="text-gray-600 italic">
            {t('dailyFortune.description')}
          </p>
        </div>
      </section>
    </div>
  );
}
