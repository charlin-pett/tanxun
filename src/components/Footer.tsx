import { useTranslations } from 'next-intl';

/**
 * 页脚组件
 *
 * 包含：
 * - 版权声明
 * - 免责声明（法律责任提示）
 * - 网站名称
 *
 * 免责声明为必选项——所有玄学类网站都需要明确提示
 * "仅供文化参考"，规避法律风险
 */
export default function Footer() {
  // useTranslations('common') 读取通用文本
  const t = useTranslations('common');

  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 免责声明（突出显示） */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800 text-center">
            ⚠️ {t('disclaimer')}
          </p>
        </div>

        {/* 版权信息 */}
        <p className="text-sm text-gray-500 text-center">
          {t('copyright')}
        </p>
      </div>
    </footer>
  );
}
