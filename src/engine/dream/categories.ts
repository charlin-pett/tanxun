/**
 * 梦境分类引擎
 *
 * 根据用户输入的梦境文本，自动识别其中的关键词并分类。
 * 分类标签可以让用户在 AI 解梦之前就看到初步的分析方向。
 *
 * 语言无关——所有关键词用英文存储，UI 层根据 locale 转文字。
 */

/** 梦境分类 */
export interface DreamCategory {
  id: string;
  /** 该分类下的中文/英文/俄文/西文关键词 */
  keywords: string[];
}

/** 梦境分类配置（含多语言关键词） */
export const DREAM_CATEGORIES: DreamCategory[] = [
  {
    id: 'animals',
    keywords: [
      '狗', 'cat', 'собака', 'perro',
      '猫', 'dog', 'кошка', 'gato',
      '蛇', 'snake', 'змея', 'serpiente',
      '鱼', 'fish', 'рыба', 'pez',
      '鸟', 'bird', 'птица', 'pájaro',
      '龙', 'dragon', 'дракон', 'dragón',
      '虎', 'tiger', 'тигр', 'tigre',
      '马', 'horse', 'лошадь', 'caballo',
      '猪', 'pig', 'свинья', 'cerdo',
      '牛', 'cow', 'корова', 'vaca',
      '羊', 'sheep', 'овца', 'oveja',
      '猴', 'monkey', 'обезьяна', 'mono',
      '鼠', 'rat', 'крыса', 'rata',
      '兔子', 'rabbit', 'кролик', 'conejo',
      '蝴蝶', 'butterfly', 'бабочка', 'mariposa',
      '蜘蛛', 'spider', 'паук', 'araña',
      '昆虫', 'insect', 'насекомое', 'insecto',
      '恐龙', 'dinosaur', 'динозавр', 'dinosaurio',
      '개', '고양이', '뱀', '물고기', '새', '용', '호랑이', '말', '돼지', '소', '양', '원숭이', '쥐', '토끼', '나비', '거미', '곤충', '공룡',
    ],
  },
  {
    id: 'nature',
    keywords: [
      '水', 'water', 'вода', 'agua',
      '火', 'fire', 'огонь', 'fuego',
      '洪水', 'flood', 'наводнение', 'inundación',
      '雨', 'rain', 'дождь', 'lluvia',
      '雪', 'snow', 'снег', 'nieve',
      '风', 'wind', 'ветер', 'viento',
      '雷', 'thunder', 'гром', 'trueno',
      '闪电', 'lightning', 'молния', 'relámpago',
      '地震', 'earthquake', 'землетрясение', 'terremoto',
      '山', 'mountain', 'гора', 'montaña',
      '海', 'sea', 'море', 'mar',
      '河流', 'river', 'река', 'río',
      '天空', 'sky', 'небо', 'cielo',
      '星星', 'star', 'звезда', 'estrella',
      '月亮', 'moon', 'луна', 'luna',
      '太阳', 'sun', 'солнце', 'sol',
      '云', 'cloud', 'облако', 'nube',
      '彩虹', 'rainbow', 'радуга', 'arcoíris',
      '물', '불', '홍수', '비', '눈', '바람', '천둥', '번개', '지진', '산', '바다', '강', '하늘', '별', '달', '태양', '구름', '무지개',
    ],
  },
  {
    id: 'people',
    keywords: [
      '母亲', 'mother', 'мать', 'madre',
      '父亲', 'father', 'отец', 'padre',
      '孩子', 'child', 'ребенок', 'niño',
      '婴儿', 'baby', 'младенец', 'bebé',
      '朋友', 'friend', 'друг', 'amigo',
      '陌生人', 'stranger', 'незнакомец', 'extraño',
      '死人', 'dead', 'мертвый', 'muerto',
      '鬼', 'ghost', 'призрак', 'fantasma',
      '老师', 'teacher', 'учитель', 'profesor',
      '领导', 'boss', 'начальник', 'jefe',
      '结婚', 'marry', 'жениться', 'casarse',
      '亲人', 'relative', 'родственник', 'familiar',
      '어머니', '아버지', '아이', '아기', '친구', '낯선사람', '죽은사람', '귀신', '선생님', '상사', '결혼', '친척',
    ],
  },
  {
    id: 'actions',
    keywords: [
      '飞', 'fly', 'летать', 'volar',
      '坠落', 'fall', 'падать', 'caer',
      '跑', 'run', 'бежать', 'correr',
      '追', 'chase', 'преследовать', 'perseguir',
      '逃', 'escape', 'убегать', 'escapar',
      '战斗', 'fight', 'драться', 'pelear',
      '杀人', 'kill', 'убивать', 'matar',
      '游泳', 'swim', 'плавать', 'nadar',
      '爬', 'climb', 'карабкаться', 'trepar',
      '开车', 'drive', 'водить', 'conducir',
      '迷路', 'lost', 'потеряться', 'perderse',
      '考试', 'exam', 'экзамен', 'examen',
      '迟到', 'late', 'опаздывать', 'tarde',
      '说话', 'talk', 'говорить', 'hablar',
      '哭泣', 'cry', 'плакать', 'llorar',
      '笑', 'laugh', 'смеяться', 'reír',
      '날다', '떨어지다', '달리다', '쫓다', '도망가다', '싸우다', '죽이다', '수영하다', '오르다', '운전하다', '길을잃다', '시험', '늦다', '말하다', '울다', '웃다',
    ],
  },
  {
    id: 'objects',
    keywords: [
      '房子', 'house', 'дом', 'casa',
      '车', 'car', 'машина', 'coche',
      '钱', 'money', 'деньги', 'dinero',
      '黄金', 'gold', 'золото', 'oro',
      '宝石', 'jewel', 'драгоценность', 'joya',
      '刀', 'knife', 'нож', 'cuchillo',
      '枪', 'gun', 'пистолет', 'pistola',
      '棺材', 'coffin', 'гроб', 'ataúd',
      '坟墓', 'tomb', 'могила', 'tumba',
      '花', 'flower', 'цветок', 'flor',
      '食物', 'food', 'еда', 'comida',
      '血', 'blood', 'кровь', 'sangre',
      '衣服', 'clothes', 'одежда', 'ropa',
      '门', 'door', 'дверь', 'puerta',
      '桥', 'bridge', 'мост', 'puente',
      '船', 'boat', 'лодка', 'barco',
      '집', '차', '돈', '금', '보석', '칼', '총', '관', '무덤', '꽃', '음식', '피', '옷', '문', '다리', '배',
    ],
  },
  {
    id: 'body',
    keywords: [
      '牙齿', 'tooth', 'зуб', 'diente',
      '头发', 'hair', 'волосы', 'pelo',
      '眼睛', 'eye', 'глаз', 'ojo',
      '手', 'hand', 'рука', 'mano',
      '脚', 'foot', 'нога', 'pie',
      '怀孕', 'pregnant', 'беременная', 'embarazada',
      '生病', 'sick', 'больной', 'enfermo',
      '死亡', 'death', 'смерть', 'muerte',
      '受伤', 'hurt', 'ранить', 'herir',
      '이빨', '머리카락', '눈', '손', '발', '임신', '아프다', '죽음', '다치다',
    ],
  },
  {
    id: 'places',
    keywords: [
      '学校', 'school', 'школа', 'escuela',
      '医院', 'hospital', 'больница', 'hospital',
      '厕所', 'toilet', 'туалет', 'baño',
      '监狱', 'prison', 'тюрьма', 'prisión',
      '寺庙', 'temple', 'храм', 'templo',
      '宫殿', 'palace', 'дворец', 'palacio',
      '森林', 'forest', 'лес', 'bosque',
      '沙漠', 'desert', 'пустыня', 'desierto',
      '岛屿', 'island', 'остров', 'isla',
      '城市', 'city', 'город', 'ciudad',
      '老家', 'hometown', 'родной', 'hogar',
      '학교', '병원', '화장실', '감옥', '절', '궁전', '숲', '사막', '섬', '도시', '고향',
    ],
  },
];

/**
 * 根据梦境文本识别关键分类
 *
 * @param text - 用户输入的梦境文本
 * @returns 匹配到的分类 ID 列表
 */
export function classifyDream(text: string): string[] {
  const matchedCategories: string[] = [];
  const lowerText = text.toLowerCase();

  for (const category of DREAM_CATEGORIES) {
    for (const keyword of category.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        matchedCategories.push(category.id);
        break; // 一个分类匹配到一个关键词就够了
      }
    }
  }

  return matchedCategories;
}

/**
 * 获取所有分类的中文标签
 */
export const CATEGORY_LABELS_CN: Record<string, string> = {
  animals: '动物',
  nature: '自然现象',
  people: '人物',
  actions: '行为动作',
  objects: '物品',
  body: '身体',
  places: '场所',
  other: '其他',
};

/**
 * 获取所有分类的英文标签
 */
export const CATEGORY_LABELS_EN: Record<string, string> = {
  animals: 'Animals',
  nature: 'Nature',
  people: 'People',
  actions: 'Actions',
  objects: 'Objects',
  body: 'Body',
  places: 'Places',
  other: 'Other',
};

/**
 * 获取所有分类的俄文标签
 */
export const CATEGORY_LABELS_RU: Record<string, string> = {
  animals: 'Животные',
  nature: 'Природа',
  people: 'Люди',
  actions: 'Действия',
  objects: 'Предметы',
  body: 'Тело',
  places: 'Места',
  other: 'Другое',
};

/**
 * 获取所有分类的西文标签
 */
export const CATEGORY_LABELS_ES: Record<string, string> = {
  animals: 'Animales',
  nature: 'Naturaleza',
  people: 'Personas',
  actions: 'Acciones',
  objects: 'Objetos',
  body: 'Cuerpo',
  places: 'Lugares',
  other: 'Otro',
};

export const CATEGORY_LABELS_KO: Record<string, string> = {
  animals: '동물',
  nature: '자연',
  people: '사람',
  actions: '행동',
  objects: '사물',
  body: '신체',
  places: '장소',
  other: '기타',
};
