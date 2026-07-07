import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

/**
 * 梦境解译页面（占位）
 *
 * TODO Phase 2: 实现完整的解梦功能
 * - 梦境输入框
 * - AI 解梦调用
 * - 解梦历史记录
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
        <p className="text-lg text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      {/* 输入区域（占位） */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {/* 文本输入框 */}
          <textarea
            className="w-full h-40 p-4 border border-gray-200 rounded-lg resize-none
                       text-gray-700 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder={t('placeholder')}
            disabled
          />
          {/* 提交按钮 */}
          <button
            className="mt-4 w-full py-3 bg-amber-700 text-white rounded-lg
                       font-medium opacity-50 cursor-not-allowed"
            disabled
          >
            {t('submit')}
          </button>
          {/* 占位提示 */}
          <p className="mt-4 text-sm text-gray-400 text-center italic">
            —— 功能开发中，敬请期待 ——
          </p>
        </div>
      </div>
    </div>
  );
}
