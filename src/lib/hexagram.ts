import type { Hexagram } from '@/types/hexagram';

/**
 * 加载全部六十四卦数据
 *
 * 根据当前语言加载对应的 JSON 文件。
 * 目前仅有中文版（zh-CN.json），后续添加英文/俄语时
 * 只需在 data/hexagrams/ 下新增对应语言文件。
 *
 * @param locale - 语言代码，默认 'zh-CN'
 * @returns 所有卦象的数组（按卦序排列）
 */
export async function getAllHexagrams(
  locale: string = 'zh-CN'
): Promise<Hexagram[]> {
  const data = await loadData(locale);
  return Object.values(data).sort(
    (a: Hexagram, b: Hexagram) => a.number - b.number
  );
}

/**
 * 根据卦序获取单个卦象
 *
 * @param number - 卦序（1-64）
 * @param locale - 语言代码
 * @returns 卦象数据，未找到则返回 null
 */
export async function getHexagramByNumber(
  number: number,
  locale: string = 'zh-CN'
): Promise<Hexagram | null> {
  const data = await loadData(locale);
  const hex = data[number.toString()];
  return hex ?? null;
}

/**
 * 内部函数：加载原始 JSON 数据
 */
async function loadData(locale: string): Promise<Record<string, Hexagram>> {
  try {
    return (await import(`@/data/hexagrams/${locale}.json`)).default as Record<string, Hexagram>;
  } catch {
    // 如果目标语言文件不存在，回退到中文
    console.warn(
      `Hexagram data for "${locale}" not found, falling back to zh-CN`
    );
    return (await import('@/data/hexagrams/zh-CN.json')).default as Record<string, Hexagram>;
  }
}
