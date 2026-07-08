/**
 * 玄学百科数据加载工具
 *
 * 多语言支持：优先加载对应语言的数据，回退中文。
 * 所有数据文件在构建时静态导入。
 */
import type { KnowledgeCategory, Article } from '@/types/knowledge';

import yijingCN from '@/data/knowledge/zh-CN/yijing.json';
import wuxingCN from '@/data/knowledge/zh-CN/wuxing.json';
import ganzhiCN from '@/data/knowledge/zh-CN/ganzhi.json';
import qimenCN from '@/data/knowledge/zh-CN/qimen.json';
import fengshuiCN from '@/data/knowledge/zh-CN/fengshui.json';
import faceCN from '@/data/knowledge/zh-CN/face.json';

import yijingEN from '@/data/knowledge/en/yijing.json';
import wuxingEN from '@/data/knowledge/en/wuxing.json';
import ganzhiEN from '@/data/knowledge/en/ganzhi.json';
import qimenEN from '@/data/knowledge/en/qimen.json';
import fengshuiEN from '@/data/knowledge/en/fengshui.json';
import faceEN from '@/data/knowledge/en/face.json';

import yijingRU from '@/data/knowledge/ru/yijing.json';
import wuxingRU from '@/data/knowledge/ru/wuxing.json';
import ganzhiRU from '@/data/knowledge/ru/ganzhi.json';
import qimenRU from '@/data/knowledge/ru/qimen.json';
import fengshuiRU from '@/data/knowledge/ru/fengshui.json';
import faceRU from '@/data/knowledge/ru/face.json';

import yijingES from '@/data/knowledge/es/yijing.json';
import wuxingES from '@/data/knowledge/es/wuxing.json';
import ganzhiES from '@/data/knowledge/es/ganzhi.json';
import qimenES from '@/data/knowledge/es/qimen.json';
import fengshuiES from '@/data/knowledge/es/fengshui.json';
import faceES from '@/data/knowledge/es/face.json';

type DataMap = Record<string, Article[]>;

const DATA: Record<string, DataMap> = {
  'zh-CN': { yijing: yijingCN as Article[], wuxing: wuxingCN as Article[], ganzhi: ganzhiCN as Article[], qimen: qimenCN as Article[], fengshui: fengshuiCN as Article[], face: faceCN as Article[] },
  en: { yijing: yijingEN as Article[], wuxing: wuxingEN as Article[], ganzhi: ganzhiEN as Article[], qimen: qimenEN as Article[], fengshui: fengshuiEN as Article[], face: faceEN as Article[] },
  ru: { yijing: yijingRU as Article[], wuxing: wuxingRU as Article[], ganzhi: ganzhiRU as Article[], qimen: qimenRU as Article[], fengshui: fengshuiRU as Article[], face: faceRU as Article[] },
  es: { yijing: yijingES as Article[], wuxing: wuxingES as Article[], ganzhi: ganzhiES as Article[], qimen: qimenES as Article[], fengshui: fengshuiES as Article[], face: faceES as Article[] },
};

/** 获取分类名称和描述（按语言） */
const CATEGORY_NAMES: Record<string, Array<{ id: string; name: string; icon: string; description: string }>> = {
  'zh-CN': [
    { id: 'yijing', name: '周易', icon: '䷀', description: '群经之首，大道之源——易经的智慧' },
    { id: 'wuxing', name: '五行', icon: '♨', description: '金木水火土——宇宙的五种基本元素' },
    { id: 'ganzhi', name: '天干地支', icon: '干支', description: '十天干与十二地支——古老的时间坐标' },
    { id: 'qimen', name: '奇门遁甲', icon: '九宫', description: '帝王之学——最高深的预测术' },
    { id: 'fengshui', name: '风水', icon: '山水', description: '人与环境的和谐之道' },
    { id: 'face', name: '面相手相', icon: '面相', description: '掌中乾坤，面中命运' },
  ],
  en: [
    { id: 'yijing', name: 'I-Ching', icon: '䷀', description: 'The Book of Changes — the foundation of Chinese metaphysics' },
    { id: 'wuxing', name: 'Five Elements', icon: '♨', description: 'Wood, Fire, Earth, Metal, Water — the five forces' },
    { id: 'ganzhi', name: 'Stems & Branches', icon: '干支', description: 'The ancient time-keeping system of China' },
    { id: 'qimen', name: 'Qi Men Dun Jia', icon: '九宫', description: 'The Emperor\'s art — supreme divination' },
    { id: 'fengshui', name: 'Feng Shui', icon: '山水', description: 'The art of harmonious space' },
    { id: 'face', name: 'Face & Palm', icon: '面相', description: 'Reading destiny in the face and hands' },
  ],
  ru: [
    { id: 'yijing', name: 'И-Цзин', icon: '䷀', description: 'Книга Перемен — основа китайской метафизики' },
    { id: 'wuxing', name: 'Пять Элементов', icon: '♨', description: 'Дерево, Огонь, Земля, Металл, Вода' },
    { id: 'ganzhi', name: 'Стволы и Ветви', icon: '干支', description: 'Древняя система летоисчисления' },
    { id: 'qimen', name: 'Ци Мэнь', icon: '九宫', description: 'Искусство Императора' },
    { id: 'fengshui', name: 'Фэн-Шуй', icon: '山水', description: 'Гармония пространства' },
    { id: 'face', name: 'Физиогномика', icon: '面相', description: 'Судьба на лице и ладони' },
  ],
  es: [
    { id: 'yijing', name: 'I-Ching', icon: '䷀', description: 'El Clásico de los Cambios' },
    { id: 'wuxing', name: 'Cinco Elementos', icon: '♨', description: 'Madera, Fuego, Tierra, Metal, Agua' },
    { id: 'ganzhi', name: 'Troncos y Ramas', icon: '干支', description: 'El antiguo sistema de cronometraje' },
    { id: 'qimen', name: 'Qi Men', icon: '九宫', description: 'El arte del Emperador' },
    { id: 'fengshui', name: 'Feng Shui', icon: '山水', description: 'El arte de la armonía espacial' },
    { id: 'face', name: 'Rostro y Mano', icon: '面相', description: 'Lectura del destino en el rostro' },
  ],
};

export function getKnowledgeCategories(locale: string = 'zh-CN') {
  return CATEGORY_NAMES[locale] || CATEGORY_NAMES['zh-CN'];
}

function getData(locale: string = 'zh-CN'): DataMap {
  return DATA[locale] || DATA['zh-CN'];
}

export async function getAllCategories(locale: string = 'zh-CN'): Promise<KnowledgeCategory[]> {
  const data = getData(locale);
  return getKnowledgeCategories(locale).map(m => ({ ...m, articles: data[m.id] || [] }));
}

export async function getArticlesByCategory(categoryId: string, locale: string = 'zh-CN'): Promise<Article[]> {
  return getData(locale)[categoryId] || [];
}

export async function getArticle(categoryId: string, articleId: string, locale: string = 'zh-CN') {
  const articles = getData(locale)[categoryId] || [];
  const article = articles.find(a => a.id === articleId);
  if (!article) return null;
  const category = getKnowledgeCategories(locale).find(c => c.id === categoryId);
  if (!category) return null;
  return { article, category };
}
