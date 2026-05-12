import { Word } from '../types';

export interface Lesson {
  id: string;
  title: string;
  grade: number;
  unit: number;
  words: Word[];
}

export const grade1Lessons: Lesson[] = [
  {
    id: '1-1-1',
    title: '天地人',
    grade: 1,
    unit: 1,
    words: [
      { id: '1-1-1-1', text: '天', pinyin: 'tiān', example: '天，天空的天', type: 'character', grade: 1 },
      { id: '1-1-1-2', text: '地', pinyin: 'dì', example: '地，大地的地', type: 'character', grade: 1 },
      { id: '1-1-1-3', text: '人', pinyin: 'rén', example: '人，人们的人', type: 'character', grade: 1 },
      { id: '1-1-1-4', text: '你', pinyin: 'nǐ', example: '你，你好的你', type: 'character', grade: 1 },
      { id: '1-1-1-5', text: '我', pinyin: 'wǒ', example: '我，我的我', type: 'character', grade: 1 },
      { id: '1-1-1-6', text: '他', pinyin: 'tā', example: '他，他们的他', type: 'character', grade: 1 },
    ],
  },
  {
    id: '1-1-2',
    title: '金木水火土',
    grade: 1,
    unit: 1,
    words: [
      { id: '1-1-2-1', text: '金', pinyin: 'jīn', example: '金，金色的金', type: 'character', grade: 1 },
      { id: '1-1-2-2', text: '木', pinyin: 'mù', example: '木，木头的木', type: 'character', grade: 1 },
      { id: '1-1-2-3', text: '水', pinyin: 'shuǐ', example: '水，河水的水', type: 'character', grade: 1 },
      { id: '1-1-2-4', text: '火', pinyin: 'huǒ', example: '火，火焰的火', type: 'character', grade: 1 },
      { id: '1-1-2-5', text: '土', pinyin: 'tǔ', example: '土，土地的土', type: 'character', grade: 1 },
    ],
  },
  {
    id: '1-2-1',
    title: '口耳目',
    grade: 1,
    unit: 2,
    words: [
      { id: '1-2-1-1', text: '口', pinyin: 'kǒu', example: '口，人口的口', type: 'character', grade: 1 },
      { id: '1-2-1-2', text: '耳', pinyin: 'ěr', example: '耳，耳朵的耳', type: 'character', grade: 1 },
      { id: '1-2-1-3', text: '目', pinyin: 'mù', example: '目，目光的目', type: 'character', grade: 1 },
      { id: '1-2-1-4', text: '手', pinyin: 'shǒu', example: '手，双手的手', type: 'character', grade: 1 },
      { id: '1-2-1-5', text: '足', pinyin: 'zú', example: '足，手足的足', type: 'character', grade: 1 },
      { id: '1-2-1-6', text: '站', pinyin: 'zhàn', example: '站，站立的站', type: 'character', grade: 1 },
      { id: '1-2-1-7', text: '坐', pinyin: 'zuò', example: '坐，坐下的坐', type: 'character', grade: 1 },
    ],
  },
  {
    id: '1-2-2',
    title: '日月水火',
    grade: 1,
    unit: 2,
    words: [
      { id: '1-2-2-1', text: '日', pinyin: 'rì', example: '日，日月的日', type: 'character', grade: 1 },
      { id: '1-2-2-2', text: '月', pinyin: 'yuè', example: '月，月亮的月', type: 'character', grade: 1 },
      { id: '1-2-2-3', text: '水', pinyin: 'shuǐ', example: '水，水流的水', type: 'character', grade: 1 },
      { id: '1-2-2-4', text: '火', pinyin: 'huǒ', example: '火，火苗的火', type: 'character', grade: 1 },
      { id: '1-2-2-5', text: '山', pinyin: 'shān', example: '山，高山的山', type: 'character', grade: 1 },
      { id: '1-2-2-6', text: '石', pinyin: 'shí', example: '石，石头的石', type: 'character', grade: 1 },
      { id: '1-2-2-7', text: '田', pinyin: 'tián', example: '田，田地的田', type: 'character', grade: 1 },
      { id: '1-2-2-8', text: '禾', pinyin: 'hé', example: '禾，禾苗的禾', type: 'character', grade: 1 },
    ],
  },
  {
    id: '1-3-1',
    title: '对韵歌',
    grade: 1,
    unit: 3,
    words: [
      { id: '1-3-1-1', text: '云', pinyin: 'yún', example: '云，白云的云', type: 'character', grade: 1 },
      { id: '1-3-1-2', text: '雨', pinyin: 'yǔ', example: '雨，下雨的雨', type: 'character', grade: 1 },
      { id: '1-3-1-3', text: '风', pinyin: 'fēng', example: '风，大风的风', type: 'character', grade: 1 },
      { id: '1-3-1-4', text: '花', pinyin: 'huā', example: '花，花朵的花', type: 'character', grade: 1 },
      { id: '1-3-1-5', text: '鸟', pinyin: 'niǎo', example: '鸟，小鸟的鸟', type: 'character', grade: 1 },
      { id: '1-3-1-6', text: '虫', pinyin: 'chóng', example: '虫，虫子的虫', type: 'character', grade: 1 },
    ],
  },
];

export const grade2Lessons: Lesson[] = [
  {
    id: '2-1-1',
    title: '小蝌蚪找妈妈',
    grade: 2,
    unit: 1,
    words: [
      { id: '2-1-1-1', text: '两', pinyin: 'liǎng', example: '两，两个的两', type: 'character', grade: 2 },
      { id: '2-1-1-2', text: '哪', pinyin: 'nǎ', example: '哪，哪里的哪', type: 'character', grade: 2 },
      { id: '2-1-1-3', text: '宽', pinyin: 'kuān', example: '宽，宽广的宽', type: 'character', grade: 2 },
      { id: '2-1-1-4', text: '顶', pinyin: 'dǐng', example: '顶，头顶的顶', type: 'character', grade: 2 },
      { id: '2-1-1-5', text: '眼', pinyin: 'yǎn', example: '眼，眼睛的眼', type: 'character', grade: 2 },
      { id: '2-1-1-6', text: '睛', pinyin: 'jīng', example: '睛，眼睛的睛', type: 'character', grade: 2 },
      { id: '2-1-1-7', text: '肚', pinyin: 'dù', example: '肚，肚子的肚', type: 'character', grade: 2 },
      { id: '2-1-1-8', text: '皮', pinyin: 'pí', example: '皮，皮肤的皮', type: 'character', grade: 2 },
      { id: '2-1-1-9', text: '孩', pinyin: 'hái', example: '孩，孩子的孩', type: 'character', grade: 2 },
      { id: '2-1-1-10', text: '跳', pinyin: 'tiào', example: '跳，跳高的跳', type: 'character', grade: 2 },
    ],
  },
  {
    id: '2-1-2',
    title: '我是什么',
    grade: 2,
    unit: 1,
    words: [
      { id: '2-1-2-1', text: '变', pinyin: 'biàn', example: '变，变化的变', type: 'character', grade: 2 },
      { id: '2-1-2-2', text: '极', pinyin: 'jí', example: '极，极端的极', type: 'character', grade: 2 },
      { id: '2-1-2-3', text: '片', pinyin: 'piàn', example: '片，一片的片', type: 'character', grade: 2 },
      { id: '2-1-2-4', text: '傍', pinyin: 'bàng', example: '傍，傍晚的傍', type: 'character', grade: 2 },
      { id: '2-1-2-5', text: '海', pinyin: 'hǎi', example: '海，大海的海', type: 'character', grade: 2 },
      { id: '2-1-2-6', text: '洋', pinyin: 'yáng', example: '洋，海洋的洋', type: 'character', grade: 2 },
      { id: '2-1-2-7', text: '作', pinyin: 'zuò', example: '作，作业的作', type: 'character', grade: 2 },
      { id: '2-1-2-8', text: '给', pinyin: 'gěi', example: '给，给予的给', type: 'character', grade: 2 },
      { id: '2-1-2-9', text: '带', pinyin: 'dài', example: '带，带领的带', type: 'character', grade: 2 },
      { id: '2-1-2-10', text: '当', pinyin: 'dāng', example: '当，当然的当', type: 'character', grade: 2 },
    ],
  },
  {
    id: '2-2-1',
    title: '植物妈妈有办法',
    grade: 2,
    unit: 2,
    words: [
      { id: '2-2-1-1', text: '法', pinyin: 'fǎ', example: '法，办法的法', type: 'character', grade: 2 },
      { id: '2-2-1-2', text: '如', pinyin: 'rú', example: '如，如果的如', type: 'character', grade: 2 },
      { id: '2-2-1-3', text: '脚', pinyin: 'jiǎo', example: '脚，脚步的脚', type: 'character', grade: 2 },
      { id: '2-2-1-4', text: '它', pinyin: 'tā', example: '它，它们的它', type: 'character', grade: 2 },
      { id: '2-2-1-5', text: '娃', pinyin: 'wá', example: '娃，娃娃的娃', type: 'character', grade: 2 },
      { id: '2-2-1-6', text: '她', pinyin: 'tā', example: '她，她们的她', type: 'character', grade: 2 },
      { id: '2-2-1-7', text: '毛', pinyin: 'máo', example: '毛，羽毛的毛', type: 'character', grade: 2 },
      { id: '2-2-1-8', text: '更', pinyin: 'gèng', example: '更，更好的更', type: 'character', grade: 2 },
      { id: '2-2-1-9', text: '知', pinyin: 'zhī', example: '知，知识的知', type: 'character', grade: 2 },
      { id: '2-2-1-10', text: '识', pinyin: 'shí', example: '识，认识的识', type: 'character', grade: 2 },
    ],
  },
  {
    id: '2-3-1',
    title: '曹冲称象',
    grade: 2,
    unit: 3,
    words: [
      { id: '2-3-1-1', text: '称', pinyin: 'chēng', example: '称，称重的称', type: 'character', grade: 2 },
      { id: '2-3-1-2', text: '象', pinyin: 'xiàng', example: '象，大象的象', type: 'character', grade: 2 },
      { id: '2-3-1-3', text: '官', pinyin: 'guān', example: '官，官员的官', type: 'character', grade: 2 },
      { id: '2-3-1-4', text: '柱', pinyin: 'zhù', example: '柱，柱子的柱', type: 'character', grade: 2 },
      { id: '2-3-1-5', text: '底', pinyin: 'dǐ', example: '底，底部的底', type: 'character', grade: 2 },
      { id: '2-3-1-6', text: '杆', pinyin: 'gān', example: '杆，旗杆的杆', type: 'character', grade: 2 },
      { id: '2-3-1-7', text: '秤', pinyin: 'chèng', example: '秤，秤砣的秤', type: 'character', grade: 2 },
      { id: '2-3-1-8', text: '做', pinyin: 'zuò', example: '做，做事的做', type: 'character', grade: 2 },
      { id: '2-3-1-9', text: '岁', pinyin: 'suì', example: '岁，岁数的岁', type: 'character', grade: 2 },
      { id: '2-3-1-10', text: '站', pinyin: 'zhàn', example: '站，站立的站', type: 'character', grade: 2 },
    ],
  },
];

export const grade3Lessons: Lesson[] = [
  {
    id: '3-1-1',
    title: '大青树下的小学',
    grade: 3,
    unit: 1,
    words: [
      { id: '3-1-1-1', text: '晨', pinyin: 'chén', example: '晨，早晨的晨', type: 'character', grade: 3 },
      { id: '3-1-1-2', text: '绒', pinyin: 'róng', example: '绒，绒毛的绒', type: 'character', grade: 3 },
      { id: '3-1-1-3', text: '球', pinyin: 'qiú', example: '球，皮球的球', type: 'character', grade: 3 },
      { id: '3-1-1-4', text: '汉', pinyin: 'hàn', example: '汉，汉族的汉', type: 'character', grade: 3 },
      { id: '3-1-1-5', text: '艳', pinyin: 'yàn', example: '艳，艳丽的艳', type: 'character', grade: 3 },
      { id: '3-1-1-6', text: '服', pinyin: 'fú', example: '服，衣服的服', type: 'character', grade: 3 },
      { id: '3-1-1-7', text: '装', pinyin: 'zhuāng', example: '装，服装的装', type: 'character', grade: 3 },
      { id: '3-1-1-8', text: '扮', pinyin: 'bàn', example: '扮，打扮的扮', type: 'character', grade: 3 },
      { id: '3-1-1-9', text: '读', pinyin: 'dú', example: '读，读书的读', type: 'character', grade: 3 },
      { id: '3-1-1-10', text: '静', pinyin: 'jìng', example: '静，安静的静', type: 'character', grade: 3 },
    ],
  },
  {
    id: '3-1-2',
    title: '花的学校',
    grade: 3,
    unit: 1,
    words: [
      { id: '3-1-2-1', text: '落', pinyin: 'luò', example: '落，落下的落', type: 'character', grade: 3 },
      { id: '3-1-2-2', text: '荒', pinyin: 'huāng', example: '荒，荒野的荒', type: 'character', grade: 3 },
      { id: '3-1-2-3', text: '笛', pinyin: 'dí', example: '笛，笛子的笛', type: 'character', grade: 3 },
      { id: '3-1-2-4', text: '舞', pinyin: 'wǔ', example: '舞，跳舞的舞', type: 'character', grade: 3 },
      { id: '3-1-2-5', text: '狂', pinyin: 'kuáng', example: '狂，狂欢的狂', type: 'character', grade: 3 },
      { id: '3-1-2-6', text: '罚', pinyin: 'fá', example: '罚，惩罚的罚', type: 'character', grade: 3 },
      { id: '3-1-2-7', text: '假', pinyin: 'jià', example: '假，放假的假', type: 'character', grade: 3 },
      { id: '3-1-2-8', text: '互', pinyin: 'hù', example: '互，互相的互', type: 'character', grade: 3 },
      { id: '3-1-2-9', text: '所', pinyin: 'suǒ', example: '所，所以的所', type: 'character', grade: 3 },
      { id: '3-1-2-10', text: '够', pinyin: 'gòu', example: '够，足够的够', type: 'character', grade: 3 },
    ],
  },
  {
    id: '3-2-1',
    title: '古诗三首',
    grade: 3,
    unit: 2,
    words: [
      { id: '3-2-1-1', text: '寒', pinyin: 'hán', example: '寒，寒冷的寒', type: 'character', grade: 3 },
      { id: '3-2-1-2', text: '径', pinyin: 'jìng', example: '径，小径的径', type: 'character', grade: 3 },
      { id: '3-2-1-3', text: '斜', pinyin: 'xié', example: '斜，倾斜的斜', type: 'character', grade: 3 },
      { id: '3-2-1-4', text: '赠', pinyin: 'zèng', example: '赠，赠送的赠', type: 'character', grade: 3 },
      { id: '3-2-1-5', text: '刘', pinyin: 'liú', example: '刘，姓刘的刘', type: 'character', grade: 3 },
      { id: '3-2-1-6', text: '残', pinyin: 'cán', example: '残，残阳的残', type: 'character', grade: 3 },
      { id: '3-2-1-7', text: '君', pinyin: 'jūn', example: '君，君子的君', type: 'character', grade: 3 },
      { id: '3-2-1-8', text: '橙', pinyin: 'chéng', example: '橙，橙子的橙', type: 'character', grade: 3 },
      { id: '3-2-1-9', text: '送', pinyin: 'sòng', example: '送，送别的送', type: 'character', grade: 3 },
      { id: '3-2-1-10', text: '挑', pinyin: 'tiāo', example: '挑，挑水的挑', type: 'character', grade: 3 },
    ],
  },
];

export const grade4Lessons: Lesson[] = [
  {
    id: '4-1-1',
    title: '观潮',
    grade: 4,
    unit: 1,
    words: [
      { id: '4-1-1-1', text: '潮', pinyin: 'cháo', example: '潮，潮水的潮', type: 'character', grade: 4 },
      { id: '4-1-1-2', text: '据', pinyin: 'jù', example: '据，根据的据', type: 'character', grade: 4 },
      { id: '4-1-1-3', text: '堤', pinyin: 'dī', example: '堤，堤坝的堤', type: 'character', grade: 4 },
      { id: '4-1-1-4', text: '阔', pinyin: 'kuò', example: '阔，宽阔的阔', type: 'character', grade: 4 },
      { id: '4-1-1-5', text: '笼', pinyin: 'lóng', example: '笼，笼罩的笼', type: 'character', grade: 4 },
      { id: '4-1-1-6', text: '罩', pinyin: 'zhào', example: '罩，罩住的罩', type: 'character', grade: 4 },
      { id: '4-1-1-7', text: '盼', pinyin: 'pàn', example: '盼，盼望的盼', type: 'character', grade: 4 },
      { id: '4-1-1-8', text: '滚', pinyin: 'gǔn', example: '滚，滚动的滚', type: 'character', grade: 4 },
      { id: '4-1-1-9', text: '顿', pinyin: 'dùn', example: '顿，顿时的顿', type: 'character', grade: 4 },
      { id: '4-1-1-10', text: '逐', pinyin: 'zhú', example: '逐，追逐的逐', type: 'character', grade: 4 },
    ],
  },
  {
    id: '4-1-2',
    title: '走月亮',
    grade: 4,
    unit: 1,
    words: [
      { id: '4-1-2-1', text: '牵', pinyin: 'qiān', example: '牵，牵手的牵', type: 'character', grade: 4 },
      { id: '4-1-2-2', text: '鹅', pinyin: 'é', example: '鹅，天鹅的鹅', type: 'character', grade: 4 },
      { id: '4-1-2-3', text: '卵', pinyin: 'luǎn', example: '卵，鸟卵的卵', type: 'character', grade: 4 },
      { id: '4-1-2-4', text: '俗', pinyin: 'sú', example: '俗，风俗的俗', type: 'character', grade: 4 },
      { id: '4-1-2-5', text: '跃', pinyin: 'yuè', example: '跃，跳跃的跃', type: 'character', grade: 4 },
      { id: '4-1-2-6', text: '穗', pinyin: 'suì', example: '穗，稻穗的穗', type: 'character', grade: 4 },
      { id: '4-1-2-7', text: '镀', pinyin: 'dù', example: '镀，镀金的镀', type: 'character', grade: 4 },
      { id: '4-1-2-8', text: '埂', pinyin: 'gěng', example: '埂，田埂的埂', type: 'character', grade: 4 },
      { id: '4-1-2-9', text: '烁', pinyin: 'shuò', example: '烁，闪烁的烁', type: 'character', grade: 4 },
      { id: '4-1-2-10', text: '眠', pinyin: 'mián', example: '眠，睡眠的眠', type: 'character', grade: 4 },
    ],
  },
];

export const grade5Lessons: Lesson[] = [
  {
    id: '5-1-1',
    title: '白鹭',
    grade: 5,
    unit: 1,
    words: [
      { id: '5-1-1-1', text: '鹭', pinyin: 'lù', example: '鹭，白鹭的鹭', type: 'character', grade: 5 },
      { id: '5-1-1-2', text: '嫌', pinyin: 'xián', example: '嫌，嫌弃的嫌', type: 'character', grade: 5 },
      { id: '5-1-1-3', text: '喙', pinyin: 'huì', example: '喙，鸟喙的喙', type: 'character', grade: 5 },
      { id: '5-1-1-4', text: '嵌', pinyin: 'qiàn', example: '嵌，镶嵌的嵌', type: 'character', grade: 5 },
      { id: '5-1-1-5', text: '匣', pinyin: 'xiá', example: '匣，匣子的匣', type: 'character', grade: 5 },
      { id: '5-1-1-6', text: '嗜', pinyin: 'shì', example: '嗜，嗜好的嗜', type: 'character', grade: 5 },
      { id: '5-1-1-7', text: '澄', pinyin: 'chéng', example: '澄，澄澈的澄', type: 'character', grade: 5 },
      { id: '5-1-1-8', text: '黛', pinyin: 'dài', example: '黛，黛色的黛', type: 'character', grade: 5 },
    ],
  },
  {
    id: '5-1-2',
    title: '落花生',
    grade: 5,
    unit: 1,
    words: [
      { id: '5-1-2-1', text: '亩', pinyin: 'mǔ', example: '亩，亩数的亩', type: 'character', grade: 5 },
      { id: '5-1-2-2', text: '吩', pinyin: 'fēn', example: '吩，吩咐的吩', type: 'character', grade: 5 },
      { id: '5-1-2-3', text: '咐', pinyin: 'fù', example: '咐，吩咐的咐', type: 'character', grade: 5 },
      { id: '5-1-2-4', text: '茅', pinyin: 'máo', example: '茅，茅草的茅', type: 'character', grade: 5 },
      { id: '5-1-2-5', text: '榨', pinyin: 'zhà', example: '榨，榨油的榨', type: 'character', grade: 5 },
      { id: '5-1-2-6', text: '榴', pinyin: 'liú', example: '榴，石榴的榴', type: 'character', grade: 5 },
    ],
  },
];

export const grade6Lessons: Lesson[] = [
  {
    id: '6-1-1',
    title: '草原',
    grade: 6,
    unit: 1,
    words: [
      { id: '6-1-1-1', text: '毯', pinyin: 'tǎn', example: '毯，地毯的毯', type: 'character', grade: 6 },
      { id: '6-1-1-2', text: '陈', pinyin: 'chén', example: '陈，陈列的陈', type: 'character', grade: 6 },
      { id: '6-1-1-3', text: '裳', pinyin: 'cháng', example: '裳，衣裳的裳', type: 'character', grade: 6 },
      { id: '6-1-1-4', text: '虹', pinyin: 'hóng', example: '虹，彩虹的虹', type: 'character', grade: 6 },
      { id: '6-1-1-5', text: '蹄', pinyin: 'tí', example: '蹄，马蹄的蹄', type: 'character', grade: 6 },
      { id: '6-1-1-6', text: '腐', pinyin: 'fǔ', example: '腐，腐败的腐', type: 'character', grade: 6 },
      { id: '6-1-1-7', text: '稍', pinyin: 'shāo', example: '稍，稍微的稍', type: 'character', grade: 6 },
      { id: '6-1-1-8', text: '微', pinyin: 'wēi', example: '微，微笑的微', type: 'character', grade: 6 },
    ],
  },
  {
    id: '6-1-2',
    title: '丁香结',
    grade: 6,
    unit: 1,
    words: [
      { id: '6-1-2-1', text: '缀', pinyin: 'zhuì', example: '缀，点缀的缀', type: 'character', grade: 6 },
      { id: '6-1-2-2', text: '幽', pinyin: 'yōu', example: '幽，幽静的幽', type: 'character', grade: 6 },
      { id: '6-1-2-3', text: '雅', pinyin: 'yǎ', example: '雅，优雅的雅', type: 'character', grade: 6 },
      { id: '6-1-2-4', text: '案', pinyin: 'àn', example: '案，案件的案', type: 'character', grade: 6 },
      { id: '6-1-2-5', text: '拙', pinyin: 'zhuō', example: '拙，笨拙的拙', type: 'character', grade: 6 },
      { id: '6-1-2-6', text: '薄', pinyin: 'bó', example: '薄，单薄的薄', type: 'character', grade: 6 },
    ],
  },
];

export const getLessonsByGrade = (grade: number): Lesson[] => {
  switch (grade) {
    case 1: return grade1Lessons;
    case 2: return grade2Lessons;
    case 3: return grade3Lessons;
    case 4: return grade4Lessons;
    case 5: return grade5Lessons;
    case 6: return grade6Lessons;
    default: return [...grade1Lessons, ...grade2Lessons];
  }
};

export const getWordsByLesson = (lessonId: string): Word[] => {
  const allLessons = [
    ...grade1Lessons,
    ...grade2Lessons,
    ...grade3Lessons,
    ...grade4Lessons,
    ...grade5Lessons,
    ...grade6Lessons,
  ];
  const lesson = allLessons.find(l => l.id === lessonId);
  return lesson ? lesson.words : [];
};

export const getWordsByGrade = (grade: number): Word[] => {
  const lessons = getLessonsByGrade(grade);
  return lessons.flatMap(l => l.words);
};

export const getAllWords = (): Word[] => {
  return [
    ...getWordsByGrade(1),
    ...getWordsByGrade(2),
    ...getWordsByGrade(3),
    ...getWordsByGrade(4),
    ...getWordsByGrade(5),
    ...getWordsByGrade(6),
  ];
};

export const getSentences = (grade?: number) => {
  const sentenceData: { text: string; pinyin: string; grade: number }[] = [
    { text: '我爱中国。', pinyin: 'wǒ ài zhōng guó', grade: 1 },
    { text: '我是小学生。', pinyin: 'wǒ shì xiǎo xué shēng', grade: 1 },
    { text: '我爱我的学校。', pinyin: 'wǒ ài wǒ de xué xiào', grade: 2 },
    { text: '春天来了，花儿开了。', pinyin: 'chūn tiān lái le, huā ér kāi le', grade: 3 },
    { text: '我们要好好学习，天天向上。', pinyin: 'wǒ men yào hǎo hǎo xué xí, tiān tiān xiàng shàng', grade: 4 },
    { text: '读书使人明智。', pinyin: 'dú shū shǐ rén míng zhì', grade: 5 },
    { text: '有志者事竟成。', pinyin: 'yǒu zhì zhě shì jìng chéng', grade: 6 },
    { text: '学习如逆水行舟，不进则退。', pinyin: 'xué xí rú nì shuǐ xíng zhōu, bú jìn zé tuì', grade: 6 },
    { text: '书山有路勤为径，学海无涯苦作舟。', pinyin: 'shū shān yǒu lù qín wéi jìng, xué hǎi wú yá kǔ zuò zhōu', grade: 6 },
    { text: '少年强则国强。', pinyin: 'shào nián qiáng zé guó qiáng', grade: 6 },
  ];
  
  if (grade) {
    return sentenceData.filter(s => s.grade === grade);
  }
  return sentenceData;
};

export const getRandomWords = (count: number, grade?: number): Word[] => {
  const words = grade ? getWordsByGrade(grade) : getAllWords();
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getRandomSentences = (count: number, grade?: number) => {
  const sentences = getSentences(grade);
  const shuffled = [...sentences].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
