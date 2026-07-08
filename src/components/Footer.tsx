import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('common');

  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 免责声明 */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800 text-center">
            ⚠️ {t('disclaimer')}
          </p>
        </div>

        {/* 底部链接 */}
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/privacy" className="text-sm text-gray-400 hover:text-amber-700 transition-colors">
            {t('privacy') || 'Privacy Policy'}
          </Link>
          <Link href="/about" className="text-sm text-gray-400 hover:text-amber-700 transition-colors">
            {t('about') || 'About'}
          </Link>
        </div>

        {/* 版权信息 */}
        <p className="text-sm text-gray-500 text-center">
          {t('copyright')}
        </p>
      </div>
    </footer>
  );
}
