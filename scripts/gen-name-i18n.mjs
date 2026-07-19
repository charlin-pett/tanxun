import { readFileSync, writeFileSync } from 'fs';

const d = JSON.parse(readFileSync('D:\\探寻\\scripts\\name-fortune-translations.json', 'utf-8'));

// Original Chinese fortune 81 descriptions
const ZH_FORTUNE_81 = [
  '太极之数，万物开泰，生发无穷，利禄亨通。',
  '混沌未定，进退保守，志望难达。',
  '三才之数，天地人和，大事大业，繁荣昌隆。',
  '破败之数，进退维谷，非有毅力，难望成功。',
  '五行之数，阴阳和合，名利双收，一门兴隆。',
  '六爻之数，天德地祥，福庆吉昌，万事亨通。',
  '七政之数，刚毅果断，排除万难，必获成功。',
  '八卦之数，努力发达，贯彻志望，可期成功。',
  '大成之数，虽抱奇才，有才无命，利去功空。',
  '终结之数，雪暗飘零，偶或有成，回顾茫然。',
  '万物更新，调顺发达，稳健着实，必得繁荣。',
  '薄弱无力，孤立无援，外祥内苦，谋事难成。',
  '才艺多能，智谋奇略，处事严谨，必获大功。',
  '破兆之数，沦落天涯，失意烦闷，非有缘者。',
  '福寿之数，福寿拱照，立身兴家，慈祥有德。',
  '厚重之数，逢凶化吉，贵人得助，一门隆兴。',
  '刚强之数，权威刚强，突破万难，必获成功。',
  '铁镜重磨，有志竟成，内外有助，功成名就。',
  '风云蔽月，辛苦重来，虽有智谋，挫折难免。',
  '非业破运，万事不成，进退两难，一生不安。',
  '明月中天，光风霁月，万物确立，官运亨通。',
  '秋草逢霜，怀才不遇，忧愁怨苦，事不如意。',
  '旭日东升，名显四方，渐次进展，终成大业。',
  '家门余庆，金钱丰盈，白手成家，财源广进。',
  '资性英敏，刚毅果断，才能奇特，自成大业。',
  '变怪之数，波澜起伏，英雄豪杰，临难不屈。',
  '欲望无止，自我心强，多受诽谤，尚可成功。',
  '遭难之数，豪杰气概，四海漂泊，终世浮躁。',
  '智谋优秀，财力归集，成就大业，名闻海内。',
  '绝处逢生，吉凶难分，若凶则惨，若吉则兴。',
  '智勇得志，博得名利，统领众人，繁荣富贵。',
  '侥幸多望，贵人得助，财帛丰裕，繁荣至上。',
  '旭日东升，鸾凤相会，名闻天下，隆昌至极。',
  '破家亡身，见识短浅，辛苦遭难，灾祸至极。',
  '温和平安，学智兼备，文雅发展，成就非凡。',
  '波澜重叠，常陷穷困，动不如静，有才无命。',
  '权威显达，热诚忠信，宜着雅量，终身荣富。',
  '薄弱平凡，有志难伸，虽有才艺，难望成功。',
  '富贵荣华，财帛丰盈，光明坦途，指日可期。',
  '智谋胆力，冒险投机，沉浮不定，退守方安。',
  '德望高大，事事如意，富贵荣誉，财源亨通。',
  '寒蝉在柳，博识多能，精通世情，专心可成。',
  '散财破产，雨夜之花，外表繁荣，内里空虚。',
  '破家亡身，暗藏惨淡，事不如意，乱世怪杰。',
  '新生泰运，顺风扬帆，智谋经纬，富贵繁荣。',
  '坎坷不平，艰难重重，若无耐心，难望有成。',
  '开花结果，权威显达，享福终身，名利双收。',
  '古松立鹤，德智兼备，出身清贵，安享福禄。',
  '吉凶难分，得宽则吉，得隘则凶。初吉终乱。',
  '一成一败，吉凶互见，先得庇荫，后遭惨淡。',
  '盛衰交加，一荣一枯，一心一德，可保成功。',
  '卓识达眼，先见之明，智谋超群，名利双收。',
  '外祥内苦，先吉后凶，外观幸福，内多障碍。',
  '石上栽花，多难悲运，难望成功，素行缺德。',
  '善恶兼半，外美内恶，先吉后凶，悲叹一生。',
  '浪里行舟，历尽艰辛，四周障害，晚景渐佳。',
  '日照春松，寒雪青松，时来运转，繁荣吉祥。',
  '半凶半吉，浮沉多端，祸福无常，大成大败。',
  '云遮半月，内里波澜，千辛万苦，难达心愿。',
  '黑暗无光，心迷意乱，出尔反尔，难定方针。',
  '名利双收，修炼积蓄，繁花似锦，名闻天下。',
  '基础虚弱，困难重重，徒劳无功，衰败悲伤。',
  '舟归平浦，万物化育，繁荣之象，富贵荣达。',
  '骨肉分离，一生浮沉，难得安泰，孤独悲运。',
  '巨流归海，富贵长寿，天长地久，事事如意。',
  '进退失据，内外不和，艰难不堪，损伤灾祸。',
  '天赋幸运，四通八达，万事如意，富贵繁昌。',
  '深思熟虑，智谋周全，兴家立业，富贵荣华。',
  '动摇不安，常陷逆境，灾害交至，难得平安。',
  '残菊逢霜，惨淡忧愁，晚景凄凉，非有运者。',
  '石上栽花，外观幸福，内里辛劳，难得实益。',
  '先甘后苦，万难忍受，晚景悲运，身心疲劳。',
  '志高力微，盛衰交加，若能谨慎，可保安泰。',
  '残花经霜，智谋不足，贪功图利，终至失败。',
  '守则可安，进则失败，宜守不宜攻，平稳是福。',
  '倾覆离散，内外不合，骨肉分离，一生多难。',
  '半吉半凶，先吉后凶，获福者少，受祸者多。',
  '晚景凄凉，先得后失，无智无谋，晚境悲惨。',
  '云头望月，身疲力尽，前途暗淡，急流勇退。',
  '吉星入度，一生平安，早也辉煌，晚也辉煌。',
  '最极之数，万物归根，还本归元，繁荣发达。',
];

const ZH_FORTUNE_LABELS = [
  '大吉','凶','大吉','凶','大吉','大吉','大吉','大吉','凶','凶',
  '大吉','凶','大吉','凶','大吉','大吉','大吉','大吉','凶','凶',
  '大吉','凶','大吉','大吉','大吉','凶','凶','凶','大吉','凶',
  '大吉','大吉','大吉','凶','大吉','凶','大吉','凶','大吉','凶',
  '大吉','凶','凶','凶','大吉','凶','大吉','大吉','凶','凶',
  '凶','大吉','凶','凶','凶','凶','大吉','凶','凶','凶',
  '大吉','凶','大吉','凶','大吉','凶','大吉','大吉','凶','凶',
  '凶','凶','大吉','凶','大吉','凶','大吉','凶','凶','凶',
  '大吉',
];

const ZH_ELEMENT_PERSONALITY = {
  '木': '仁慈善良，富有创造力，个性温和包容。如同大树，沉稳生长，为他人提供荫蔽。做事有耐心，重视积累。',
  '火': '热情奔放，充满活力，具有领袖气质。行动力强，敢于表现自我。但需注意控制脾气，避免急躁误事。',
  '土': '稳重踏实，诚实可靠，有责任感。如同大地，承载万物。做事脚踏实地，值得信赖。',
  '金': '刚毅果断，正义感强，追求完美。做事有原则，不畏艰难。但需注意有时过于刚硬。',
  '水': '智慧深邃，灵活变通，适应力强。善于思考，富有洞察力。如同流水，懂得迂回前进。',
};

const ZH_THREE_TALENTS = {
  perfect: '三才配置极佳，天地人三格五行相生，形成良性循环，运势亨通，诸事顺遂。',
  same: '三才五行一致，力量集中，在某一方面有突出表现，但需注意单一五行过旺带来的偏颇。',
  overcome: '三才相克，天地人三格五行相战，运势多有波折，需注意人际和健康。宜以柔克刚，避免强求。',
  over1: '天格克人格，早年运势受家族因素影响较大。但人格生地格，中年后运势渐好。',
  over2: '人格克地格，中年运势强但需注意家庭和晚年。天格生人格，早年有长辈贵人相助。',
  neutral: '三才配置一般，有生有克，运势起伏正常，努力可改运。',
};

const ZH_NUMBER_MEANINGS = {
  '1_expression': '天生的领导者，独立自主，具有开创精神。适合创业、管理、领导岗位。',
  '1_personality': '给人果断、自信、有魄力的第一印象。',
  '1_heartDesire': '内心深处渴望独立和掌控，想要成为人生的主导者。',
  '2_expression': '天生的协调者，温柔敏感，善于合作。适合外交、咨询、教育领域。',
  '2_personality': '给人温和、友善、好相处的印象。',
  '2_heartDesire': '内心渴望和谐与陪伴，重视关系和情感连接。',
  '3_expression': '天生的创造者，表达能力强，乐观开朗。适合艺术、娱乐、传媒行业。',
  '3_personality': '给人风趣、外向、有魅力的印象。',
  '3_heartDesire': '内心渴望表达和被看见，想要通过创造力影响世界。',
  '4_expression': '天生的建设者，务实稳重，勤奋坚持。适合工程、财务、行政工作。',
  '4_personality': '给人可靠、踏实、值得信赖的印象。',
  '4_heartDesire': '内心渴望稳定和安全，追求有序和可控的生活。',
  '5_expression': '天生的自由者，热爱冒险，适应力强。适合旅行、销售、媒体行业。',
  '5_personality': '给人活泼、多变、有趣的第一印象。',
  '5_heartDesire': '内心渴望自由和变化，害怕被束缚。',
  '6_expression': '天生的守护者，有爱心，责任感强。适合医疗、教育、公益事业。',
  '6_personality': '给人温暖、体贴、有担当的印象。',
  '6_heartDesire': '内心渴望爱与被爱，追求家庭的温暖和和谐。',
  '7_expression': '天生的思想者，善于分析，有灵性。适合科研、哲学、神秘学。',
  '7_personality': '给人沉静、睿智、深不可测的印象。',
  '7_heartDesire': '内心渴望真理和智慧，追求深层次的理解。',
  '8_expression': '天生的掌权者，有商业头脑，追求成功。适合商业、金融、管理领域。',
  '8_personality': '给人强大、有权威、成功的印象。',
  '8_heartDesire': '内心渴望成就和认可，追求物质与精神的双重丰盛。',
  '9_expression': '天生的人道主义者，慈悲为怀，胸怀天下。适合慈善、艺术、社会服务。',
  '9_personality': '给人博爱、理想主义、有格局的印象。',
  '9_heartDesire': '内心渴望奉献和完成，追求更高层次的人生意义。',
  '11_expression': '具有极高的灵性和直觉力，是启发他人的灯塔。适合精神领袖、艺术家。',
  '11_personality': '给人充满魅力、有启发性、超凡脱俗的印象。',
  '11_heartDesire': '内心渴望照亮他人，传递灵性的真理。',
  '22_expression': '大师建造者，能将宏大的梦想转化为现实。适合大型项目、建筑、社会改造。',
  '22_personality': '给人能力超群、胸怀大志的印象。',
  '22_heartDesire': '内心渴望建设一个更美好的世界。',
  '33_expression': '大师导师，拥有无条件的爱与服务精神。适合教育、疗愈、精神指导。',
  '33_personality': '给人温暖包容、充满爱意的印象。',
  '33_heartDesire': '内心渴望以爱服务和提升全人类。',
};

// Escape for TS string
function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

const lines = [];

lines.push('// Auto-generated name fortune i18n data');
lines.push('// Do not edit manually — generated by translate-name-fortune.mjs');
lines.push('');
lines.push('export const FORTUNE_LABEL_I18N: Record<string, Record<string, string>> = {');
lines.push('  "zh-CN": { "大吉":"大吉", "吉":"吉", "中吉":"中吉", "半吉":"半吉", "中平":"中平", "凶":"凶", "大凶":"大凶" },');
for (const [lang, data] of Object.entries(d)) {
  lines.push(`  "${lang}": {`);
  for (const [k, v] of Object.entries(data.fortuneLabels)) {
    lines.push(`    "${k}": "${esc(v)}",`);
  }
  lines.push('  },');
}
lines.push('};');
lines.push('');

// Fortune 81 descriptions (1-indexed)
lines.push('export const FORTUNE_81_DESC_I18N: Record<string, Record<number, string>> = {');
lines.push('  "zh-CN": {');
for (let i = 0; i < ZH_FORTUNE_81.length; i++) {
  lines.push(`    ${i + 1}: "${esc(ZH_FORTUNE_81[i])}",`);
}
lines.push('  },');
for (const [lang, data] of Object.entries(d)) {
  lines.push(`  "${lang}": {`);
  for (let i = 0; i < data.fortune81desc.length; i++) {
    lines.push(`    ${i + 1}: "${esc(data.fortune81desc[i])}",`);
  }
  lines.push('  },');
}
lines.push('};');
lines.push('');

// Fortune labels by number (1-indexed)
lines.push('export const FORTUNE_LABEL_BY_NUMBER: Record<number, string> = {');
for (let i = 0; i < ZH_FORTUNE_LABELS.length; i++) {
  lines.push(`  ${i + 1}: "${ZH_FORTUNE_LABELS[i]}",`);
}
lines.push('};');
lines.push('');

// Element personality
lines.push('export const ELEMENT_PERSONALITY_I18N: Record<string, Record<string, string>> = {');
lines.push('  "zh-CN": {');
for (const [k, v] of Object.entries(ZH_ELEMENT_PERSONALITY)) {
  lines.push(`    "${k}": "${esc(v)}",`);
}
lines.push('  },');
for (const [lang, data] of Object.entries(d)) {
  lines.push(`  "${lang}": {`);
  for (const [k, v] of Object.entries(data.elementPersonality)) {
    lines.push(`    "${k}": "${esc(v)}",`);
  }
  lines.push('  },');
}
lines.push('};');
lines.push('');

// Three talents descriptions
lines.push('export const THREE_TALENTS_I18N: Record<string, Record<string, string>> = {');
lines.push('  "zh-CN": {');
for (const [k, v] of Object.entries(ZH_THREE_TALENTS)) {
  lines.push(`    "${k}": "${esc(v)}",`);
}
lines.push('  },');
for (const [lang, data] of Object.entries(d)) {
  lines.push(`  "${lang}": {`);
  for (const [k, v] of Object.entries(data.threeTalents)) {
    lines.push(`    "${k}": "${esc(v)}",`);
  }
  lines.push('  },');
}
lines.push('};');
lines.push('');

// Number meanings
lines.push('export const NUMBER_MEANINGS_I18N: Record<string, Record<string, string>> = {');
lines.push('  "zh-CN": {');
for (const [k, v] of Object.entries(ZH_NUMBER_MEANINGS)) {
  lines.push(`    "${k}": "${esc(v)}",`);
}
lines.push('  },');
for (const [lang, data] of Object.entries(d)) {
  lines.push(`  "${lang}": {`);
  for (const [k, v] of Object.entries(data.numberMeanings)) {
    lines.push(`    "${k}": "${esc(v)}",`);
  }
  lines.push('  },');
}
lines.push('};');
lines.push('');

// Element name translations
lines.push('export const ELEMENT_NAME_I18N: Record<string, Record<string, string>> = {');
lines.push('  "zh-CN": { "木":"木", "火":"火", "土":"土", "金":"金", "水":"水" },');
lines.push('  "en": { "木":"Wood", "火":"Fire", "土":"Earth", "金":"Metal", "水":"Water" },');
lines.push('  "ru": { "木":"Дерево", "火":"Огонь", "土":"Земля", "金":"Металл", "水":"Вода" },');
lines.push('  "es": { "木":"Madera", "火":"Fuego", "土":"Tierra", "金":"Metal", "水":"Agua" },');
lines.push('  "ko": { "木":"목", "火":"화", "土":"토", "金":"금", "水":"수" },');
lines.push('};');

const outPath = 'D:\\探寻\\src\\data\\name-fortune\\i18n.ts';
writeFileSync(outPath, lines.join('\n'), 'utf-8');
console.log(`Written ${lines.length} lines to ${outPath}`);
