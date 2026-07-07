import { Link } from '@/i18n/navigation';
import type { Hexagram } from '@/types/hexagram';

/**
 * 六十四卦网格组件
 *
 * 将全部 64 卦以 8x8 网格形式展示。
 * 每个网格项包含：卦符、卦序、卦名
 *
 * props:
 *   hexagrams - 全部卦象数据数组
 */
interface HexagramGridProps {
  hexagrams: Hexagram[];
}

export default function HexagramGrid({ hexagrams }: HexagramGridProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
      {hexagrams.map((hex) => (
        <Link
          key={hex.number}
          href={`/hexagram/${hex.number}`}
          className="group flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200
                     hover:border-amber-400 hover:shadow-md transition-all duration-200"
        >
          {/* 卦符 */}
          <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
            {hex.symbol}
          </span>
          {/* 卦序 */}
          <span className="text-xs text-gray-400 mb-0.5">
            {String(hex.number).padStart(2, '0')}
          </span>
          {/* 卦名 */}
          <span className="text-sm font-medium text-gray-700 group-hover:text-amber-800 transition-colors">
            {hex.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
