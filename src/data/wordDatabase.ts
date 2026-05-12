import { Word, Lesson } from '../types';

// 生成唯一ID的辅助函数
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// 创建Word对象的辅助函数
function createWord(
  text: string,
  pinyin: string,
  type: 'character' | 'word' = 'character',
  grade?: number
): Word {
  return {
    id: generateId(),
    text,
    pinyin,
    type,
    grade,
  };
}

// 创建多个Word的辅助函数
function createWords(grade: number, words: [string, string][]): Word[] {
  return words.map(([text, pinyin]) => 
    createWord(text, pinyin, text.length === 1 ? 'character' : 'word', grade)
  );
}

// ============ 一年级上册 ============
export const grade1Lessons: Lesson[] = [
  // 第一单元 开学啦
  {
    id: '1-1-1',
    title: '天地人',
    grade: 1,
    unit: 1,
    words: createWords(1, [
      ['天', 'tiān'], ['地', 'dì'], ['人', 'rén'], ['你', 'nǐ'], ['我', 'wǒ'], ['他', 'tā']
    ]),
  },
  {
    id: '1-1-2',
    title: '金木水火土',
    grade: 1,
    unit: 1,
    words: createWords(1, [
      ['一', 'yī'], ['二', 'èr'], ['三', 'sān'], ['四', 'sì'], ['五', 'wǔ'],
      ['上', 'shàng'], ['下', 'xià'], ['金', 'jīn'], ['木', 'mù'], ['水', 'shuǐ'],
      ['火', 'huǒ'], ['土', 'tǔ']
    ]),
  },
  {
    id: '1-1-3',
    title: '口耳目',
    grade: 1,
    unit: 1,
    words: createWords(1, [
      ['口', 'kǒu'], ['耳', 'ěr'], ['目', 'mù'], ['手', 'shǒu'], ['足', 'zú'],
      ['舌', 'shé'], ['牙', 'yá'], ['心', 'xīn']
    ]),
  },
  {
    id: '1-1-4',
    title: '日月水火',
    grade: 1,
    unit: 1,
    words: createWords(1, [
      ['日', 'rì'], ['月', 'yuè'], ['水', 'shuǐ'], ['火', 'huǒ'], ['山', 'shān'],
      ['石', 'shí'], ['田', 'tián'], ['禾', 'hé']
    ]),
  },
  {
    id: '1-1-5',
    title: '对韵歌',
    grade: 1,
    unit: 1,
    words: createWords(1, [
      ['云', 'yún'], ['雨', 'yǔ'], ['风', 'fēng'], ['花', 'huā'], ['鸟', 'niǎo'],
      ['虫', 'chóng'], ['鱼', 'yú']
    ]),
  },
  
  // 第二单元 识字加油站
  {
    id: '1-2-1',
    title: '秋天',
    grade: 1,
    unit: 2,
    words: createWords(1, [
      ['秋', 'qiū'], ['气', 'qì'], ['树', 'shù'], ['叶', 'yè'], ['片', 'piàn'],
      ['大', 'dà'], ['飞', 'fēi'], ['会', 'huì'], ['个', 'gè'], ['了', 'le']
    ]),
  },
  {
    id: '1-2-2',
    title: '小小的船',
    grade: 1,
    unit: 2,
    words: createWords(1, [
      ['小', 'xiǎo'], ['船', 'chuán'], ['月', 'yuè'], ['儿', 'ér'], ['里', 'lǐ'],
      ['头', 'tóu'], ['看', 'kàn'], ['见', 'jiàn'], ['闪', 'shǎn'], ['星', 'xīng']
    ]),
  },
  {
    id: '1-2-3',
    title: '江南',
    grade: 1,
    unit: 2,
    words: createWords(1, [
      ['江', 'jiāng'], ['南', 'nán'], ['可', 'kě'], ['采', 'cǎi'], ['莲', 'lián'],
      ['鱼', 'yú'], ['东', 'dōng'], ['西', 'xī'], ['北', 'běi']
    ]),
  },
  {
    id: '1-2-4',
    title: '四季',
    grade: 1,
    unit: 2,
    words: createWords(1, [
      ['四', 'sì'], ['季', 'jì'], ['春', 'chūn'], ['夏', 'xià'], ['秋', 'qiū'],
      ['冬', 'dōng'], ['是', 'shì'], ['天', 'tiān'], ['地', 'dì'], ['人', 'rén']
    ]),
  },
  
  // 第三单元
  {
    id: '1-3-1',
    title: '画',
    grade: 1,
    unit: 3,
    words: createWords(1, [
      ['画', 'huà'], ['远', 'yuǎn'], ['近', 'jìn'], ['听', 'tīng'], ['声', 'shēng'],
      ['去', 'qù'], ['还', 'hái'], ['来', 'lái'], ['山', 'shān'], ['色', 'sè']
    ]),
  },
  {
    id: '1-3-2',
    title: '大小多少',
    grade: 1,
    unit: 3,
    words: createWords(1, [
      ['多', 'duō'], ['少', 'shǎo'], ['黄', 'huáng'], ['牛', 'niú'], ['只', 'zhī'],
      ['猫', 'māo'], ['鸭', 'yā'], ['大', 'dà'], ['小', 'xiǎo'], ['边', 'biān']
    ]),
  },
  {
    id: '1-3-3',
    title: '小书包',
    grade: 1,
    unit: 3,
    words: createWords(1, [
      ['书', 'shū'], ['包', 'bāo'], ['尺', 'chǐ'], ['本', 'běn'], ['笔', 'bǐ'],
      ['刀', 'dāo'], ['早', 'zǎo'], ['校', 'xiào'], ['学', 'xué'], ['生', 'shēng']
    ]),
  },
  {
    id: '1-3-4',
    title: '日月明',
    grade: 1,
    unit: 3,
    words: createWords(1, [
      ['明', 'míng'], ['力', 'lì'], ['土', 'tǔ'], ['森', 'sēn'], ['林', 'lín'],
      ['心', 'xīn'], ['从', 'cóng'], ['众', 'zhòng']
    ]),
  },
  
  // 第四单元
  {
    id: '1-4-1',
    title: '升国旗',
    grade: 1,
    unit: 4,
    words: createWords(1, [
      ['升', 'shēng'], ['国', 'guó'], ['旗', 'qí'], ['中', 'zhōng'], ['红', 'hóng'],
      ['歌', 'gē'], ['立', 'lì'], ['正', 'zhèng'], ['向', 'xiàng'], ['敬', 'jìng']
    ]),
  },
  {
    id: '1-4-2',
    title: '悯农',
    grade: 1,
    unit: 4,
    words: createWords(1, [
      ['农', 'nóng'], ['午', 'wǔ'], ['汗', 'hàn'], ['滴', 'dī'], ['禾', 'hé'],
      ['粒', 'lì'], ['辛', 'xīn'], ['苦', 'kǔ']
    ]),
  },
  {
    id: '1-4-3',
    title: '影子',
    grade: 1,
    unit: 4,
    words: createWords(1, [
      ['影', 'yǐng'], ['前', 'qián'], ['后', 'hòu'], ['左', 'zuǒ'], ['右', 'yòu'],
      ['跟', 'gēn'], ['着', 'zhe'], ['它', 'tā'], ['朋', 'péng'], ['友', 'yǒu']
    ]),
  },
  {
    id: '1-4-4',
    title: '比尾巴',
    grade: 1,
    unit: 4,
    words: createWords(1, [
      ['比', 'bǐ'], ['尾', 'wěi'], ['巴', 'bā'], ['谁', 'shuí'], ['长', 'cháng'],
      ['短', 'duǎn'], ['公', 'gōng'], ['鸡', 'jī'], ['鸭', 'yā'], ['鸟', 'niǎo']
    ]),
  },
];

// ============ 一年级下册 ============
export const grade1bLessons: Lesson[] = [
  // 第一单元
  {
    id: '1b-1-1',
    title: '识字1：春夏秋冬',
    grade: 1,
    unit: 1,
    words: createWords(1, [
      ['春', 'chūn'], ['夏', 'xià'], ['秋', 'qiū'], ['冬', 'dōng'], ['风', 'fēng'],
      ['雨', 'yǔ'], ['雪', 'xuě'], ['霜', 'shuāng'], ['花', 'huā'], ['鸟', 'niǎo']
    ]),
  },
  {
    id: '1b-1-2',
    title: '识字2：姓氏歌',
    grade: 1,
    unit: 1,
    words: createWords(1, [
      ['姓', 'xìng'], ['李', 'lǐ'], ['张', 'zhāng'], ['古', 'gǔ'], ['吴', 'wú'],
      ['赵', 'zhào'], ['钱', 'qián'], ['孙', 'sūn'], ['周', 'zhōu'], ['王', 'wáng']
    ]),
  },
  {
    id: '1b-1-3',
    title: '识字3：小青蛙',
    grade: 1,
    unit: 1,
    words: createWords(1, [
      ['青', 'qīng'], ['清', 'qīng'], ['气', 'qì'], ['晴', 'qíng'], ['情', 'qíng'],
      ['请', 'qǐng'], ['生', 'shēng'], ['字', 'zì'], ['眼', 'yǎn'], ['睛', 'jīng']
    ]),
  },
  {
    id: '1b-1-4',
    title: '识字4：猜字谜',
    grade: 1,
    unit: 1,
    words: createWords(1, [
      ['字', 'zì'], ['左', 'zuǒ'], ['右', 'yòu'], ['红', 'hóng'], ['时', 'shí'],
      ['动', 'dòng'], ['万', 'wàn'], ['云', 'yún'], ['雨', 'yǔ'], ['水', 'shuǐ']
    ]),
  },
  
  // 第二单元
  {
    id: '1b-2-1',
    title: '吃水不忘挖井人',
    grade: 1,
    unit: 2,
    words: createWords(1, [
      ['吃', 'chī'], ['井', 'jǐng'], ['村', 'cūn'], ['叫', 'jiào'], ['毛', 'máo'],
      ['主', 'zhǔ'], ['席', 'xí'], ['乡', 'xiāng'], ['亲', 'qīn'], ['战', 'zhàn']
    ]),
  },
  {
    id: '1b-2-2',
    title: '我多想去看看',
    grade: 1,
    unit: 2,
    words: createWords(1, [
      ['想', 'xiǎng'], ['告', 'gào'], ['诉', 'sù'], ['路', 'lù'], ['安', 'ān'],
      ['京', 'jīng'], ['门', 'mén'], ['广', 'guǎng'], ['观', 'guān'], ['壮', 'zhuàng']
    ]),
  },
  {
    id: '1b-2-3',
    title: '一个接一个',
    grade: 1,
    unit: 2,
    words: createWords(1, [
      ['接', 'jiē'], ['觉', 'jué'], ['再', 'zài'], ['各', 'gè'], ['种', 'zhǒng'],
      ['样', 'yàng'], ['伙', 'huǒ'], ['伴', 'bàn'], ['过', 'guò'], ['去', 'qù']
    ]),
  },
  {
    id: '1b-2-4',
    title: '四个太阳',
    grade: 1,
    unit: 2,
    words: createWords(1, [
      ['太', 'tài'], ['阳', 'yáng'], ['道', 'dào'], ['送', 'sòng'], ['忙', 'máng'],
      ['尝', 'cháng'], ['香', 'xiāng'], ['甜', 'tián'], ['温', 'wēn'], ['暖', 'nuǎn']
    ]),
  },
];

// ============ 二年级上册 ============
export const grade2Lessons: Lesson[] = [
  // 第一单元
  {
    id: '2-1-1',
    title: '小蝌蚪找妈妈',
    grade: 2,
    unit: 1,
    words: createWords(2, [
      ['两', 'liǎng'], ['哪', 'nǎ'], ['宽', 'kuān'], ['顶', 'dǐng'], ['眼', 'yǎn'],
      ['睛', 'jīng'], ['肚', 'dù'], ['皮', 'pí'], ['孩', 'hái'], ['子', 'zi'],
      ['跳', 'tiào']
    ]),
  },
  {
    id: '2-1-2',
    title: '我是什么',
    grade: 2,
    unit: 1,
    words: createWords(2, [
      ['变', 'biàn'], ['极', 'jí'], ['片', 'piàn'], ['傍', 'bàng'], ['晚', 'wǎn'],
      ['海', 'hǎi'], ['洋', 'yáng'], ['作', 'zuò'], ['业', 'yè'], ['给', 'gěi'],
      ['带', 'dài']
    ]),
  },
  {
    id: '2-1-3',
    title: '植物妈妈有办法',
    grade: 2,
    unit: 1,
    words: createWords(2, [
      ['法', 'fǎ'], ['如', 'rú'], ['脚', 'jiǎo'], ['它', 'tā'], ['娃', 'wá'],
      ['她', 'tā'], ['毛', 'máo'], ['更', 'gèng'], ['知', 'zhī'], ['识', 'shí']
    ]),
  },
  {
    id: '2-1-4',
    title: '古诗二首',
    grade: 2,
    unit: 1,
    words: createWords(2, [
      ['楼', 'lóu'], ['依', 'yī'], ['尽', 'jìn'], ['黄', 'huáng'], ['层', 'céng'],
      ['照', 'zhào'], ['香', 'xiāng'], ['炉', 'lú'], ['烟', 'yān'], ['挂', 'guà'],
      ['川', 'chuān']
    ]),
  },
  
  // 第二单元
  {
    id: '2-2-1',
    title: '黄山奇石',
    grade: 2,
    unit: 2,
    words: createWords(2, [
      ['南', 'nán'], ['部', 'bù'], ['景', 'jǐng'], ['秀', 'xiù'], ['尤', 'yóu'],
      ['其', 'qí'], ['区', 'qū'], ['巨', 'jù'], ['位', 'wèi'], ['每', 'měi'],
      ['升', 'shēng']
    ]),
  },
  {
    id: '2-2-2',
    title: '日月潭',
    grade: 2,
    unit: 2,
    words: createWords(2, [
      ['名', 'míng'], ['胜', 'shèng'], ['迹', 'jì'], ['央', 'yāng'], ['丽', 'lì'],
      ['华', 'huá'], ['隐', 'yǐn'], ['约', 'yuē'], ['纱', 'shā'], ['展', 'zhǎn'],
      ['现', 'xiàn']
    ]),
  },
  {
    id: '2-2-3',
    title: '葡萄沟',
    grade: 2,
    unit: 2,
    words: createWords(2, [
      ['份', 'fèn'], ['坡', 'pō'], ['梯', 'tī'], ['客', 'kè'], ['收', 'shōu'],
      ['城', 'chéng'], ['市', 'shì'], ['留', 'liú'], ['钉', 'dīng'], ['利', 'lì'],
      ['用', 'yòng']
    ]),
  },
  
  // 第三单元
  {
    id: '2-3-1',
    title: '坐井观天',
    grade: 2,
    unit: 3,
    words: createWords(2, [
      ['井', 'jǐng'], ['观', 'guān'], ['沿', 'yán'], ['答', 'dá'], ['渴', 'kě'],
      ['喝', 'hē'], ['话', 'huà'], ['际', 'jì'], ['弄', 'nòng'], ['错', 'cuò']
    ]),
  },
  {
    id: '2-3-2',
    title: '寒号鸟',
    grade: 2,
    unit: 3,
    words: createWords(2, [
      ['号', 'háo'], ['堵', 'dǔ'], ['缝', 'fèng'], ['当', 'dāng'], ['鹊', 'què'],
      ['朗', 'lǎng'], ['衔', 'xián'], ['劝', 'quàn'], ['趁', 'chèn'], ['将', 'jiāng']
    ]),
  },
  {
    id: '2-3-3',
    title: '我要的是葫芦',
    grade: 2,
    unit: 3,
    words: createWords(2, [
      ['葫', 'hú'], ['芦', 'lú'], ['藤', 'téng'], ['谢', 'xiè'], ['蚜', 'yá'],
      ['啊', 'a'], ['盯', 'dīng'], ['赛', 'sài'], ['怪', 'guài'], ['慢', 'màn']
    ]),
  },
  
  // 第四单元
  {
    id: '2-4-1',
    title: '大禹治水',
    grade: 2,
    unit: 4,
    words: createWords(2, [
      ['洪', 'hóng'], ['灾', 'zāi'], ['难', 'nán'], ['道', 'dào'], ['认', 'rèn'],
      ['被', 'bèi'], ['业', 'yè'], ['产', 'chǎn'], ['农', 'nóng'], ['民', 'mín']
    ]),
  },
  {
    id: '2-4-2',
    title: '朱德的扁担',
    grade: 2,
    unit: 4,
    words: createWords(2, [
      ['扁', 'biǎn'], ['担', 'dàn'], ['志', 'zhì'], ['伍', 'wǔ'], ['师', 'shī'],
      ['军', 'jūn'], ['战', 'zhàn'], ['士', 'shì'], ['忘', 'wàng'], ['泼', 'pō']
    ]),
  },
  {
    id: '2-4-3',
    title: '难忘的泼水节',
    grade: 2,
    unit: 4,
    words: createWords(2, [
      ['泼', 'pō'], ['族', 'zú'], ['民', 'mín'], ['度', 'dù'], ['敲', 'qiāo'],
      ['龙', 'lóng'], ['驶', 'shǐ'], ['容', 'róng'], ['踩', 'cǎi'], ['铺', 'pū']
    ]),
  },
  {
    id: '2-4-4',
    title: '古诗二首',
    grade: 2,
    unit: 4,
    words: createWords(2, [
      ['危', 'wēi'], ['敢', 'gǎn'], ['惊', 'jīng'], ['阴', 'yīn'], ['似', 'sì'],
      ['苍', 'cāng'], ['茫', 'máng'], ['野', 'yě'], ['盖', 'gài'], ['见', 'xiàn']
    ]),
  },
];

// ============ 二年级下册 ============
export const grade2bLessons: Lesson[] = [
  {
    id: '2b-1-1',
    title: '古诗二首',
    grade: 2,
    unit: 1,
    words: createWords(2, [
      ['村', 'cūn'], ['居', 'jū'], ['童', 'tóng'], ['碧', 'bì'], ['妆', 'zhuāng'],
      ['绿', 'lǜ'], ['丝', 'sī'], ['绦', 'tāo'], ['剪', 'jiǎn'], ['纸', 'zhǐ'],
      ['鸢', 'yuān']
    ]),
  },
  {
    id: '2b-1-2',
    title: '找春天',
    grade: 2,
    unit: 1,
    words: createWords(2, [
      ['姑', 'gū'], ['娘', 'niáng'], ['吐', 'tǔ'], ['柳', 'liǔ'], ['荡', 'dàng'],
      ['桃', 'táo'], ['杏', 'xìng'], ['鲜', 'xiān'], ['邮', 'yóu'], ['递', 'dì']
    ]),
  },
  {
    id: '2b-1-3',
    title: '开满鲜花的小路',
    grade: 2,
    unit: 1,
    words: createWords(2, [
      ['鲜', 'xiān'], ['邮', 'yóu'], ['递', 'dì'], ['员', 'yuán'], ['原', 'yuán'],
      ['叔', 'shū'], ['局', 'jú'], ['堆', 'duī'], ['破', 'pò'], ['礼', 'lǐ']
    ]),
  },
  {
    id: '2b-1-4',
    title: '邓小平爷爷植树',
    grade: 2,
    unit: 1,
    words: createWords(2, [
      ['邓', 'dèng'], ['植', 'zhí'], ['格', 'gé'], ['引', 'yǐn'], ['注', 'zhù'],
      ['满', 'mǎn'], ['息', 'xī'], ['扶', 'fú'], ['选', 'xuǎn'], ['茁', 'zhuó']
    ]),
  },
];

// ============ 三年级上册 ============
export const grade3Lessons: Lesson[] = [
  {
    id: '3-1-1',
    title: '大青树下的小学',
    grade: 3,
    unit: 1,
    words: createWords(3, [
      ['晨', 'chén'], ['绒', 'róng'], ['球', 'qiú'], ['汉', 'hàn'], ['艳', 'yàn'],
      ['服', 'fú'], ['装', 'zhuāng'], ['扮', 'bàn'], ['静', 'jìng'], ['停', 'tíng']
    ]),
  },
  {
    id: '3-1-2',
    title: '花的学校',
    grade: 3,
    unit: 1,
    words: createWords(3, [
      ['落', 'luò'], ['荒', 'huāng'], ['笛', 'dí'], ['舞', 'wǔ'], ['狂', 'kuáng'],
      ['罚', 'fá'], ['假', 'jià'], ['互', 'hù'], ['所', 'suǒ'], ['够', 'gòu']
    ]),
  },
  {
    id: '3-1-3',
    title: '不懂就要问',
    grade: 3,
    unit: 1,
    words: createWords(3, [
      ['背', 'bèi'], ['例', 'lì'], ['圈', 'quān'], ['段', 'duàn'], ['练', 'liàn'],
      ['糊', 'hú'], ['涂', 'tú'], ['呆', 'dāi'], ['戒', 'jiè'], ['厉', 'lì']
    ]),
  },
  {
    id: '3-2-1',
    title: '古诗三首',
    grade: 3,
    unit: 2,
    words: createWords(3, [
      ['寒', 'hán'], ['径', 'jìng'], ['斜', 'xié'], ['霜', 'shuāng'], ['赠', 'zèng'],
      ['刘', 'liú'], ['盖', 'gài'], ['菊', 'jú'], ['残', 'cán'], ['君', 'jūn']
    ]),
  },
  {
    id: '3-2-2',
    title: '铺满金色巴掌的水泥道',
    grade: 3,
    unit: 2,
    words: createWords(3, [
      ['铺', 'pū'], ['泥', 'ní'], ['晶', 'jīng'], ['院', 'yuàn'], ['墙', 'qiáng'],
      ['印', 'yìn'], ['排', 'pái'], ['列', 'liè'], ['规', 'guī'], ['则', 'zé']
    ]),
  },
  {
    id: '3-2-3',
    title: '秋天的雨',
    grade: 3,
    unit: 2,
    words: createWords(3, [
      ['盒', 'hé'], ['颜', 'yán'], ['料', 'liào'], ['票', 'piào'], ['飘', 'piāo'],
      ['争', 'zhēng'], ['仙', 'xiān'], ['闻', 'wén'], ['梨', 'lí'], ['勾', 'gōu']
    ]),
  },
  {
    id: '3-2-4',
    title: '听听，秋的声音',
    grade: 3,
    unit: 2,
    words: createWords(3, [
      ['抖', 'dǒu'], ['蟋', 'xī'], ['蟀', 'shuài'], ['振', 'zhèn'], ['韵', 'yùn'],
      ['掠', 'lüè'], ['吟', 'yín'], ['辽', 'liáo'], ['阔', 'kuò'], ['裹', 'guǒ']
    ]),
  },
  {
    id: '3-3-1',
    title: '去年的树',
    grade: 3,
    unit: 3,
    words: createWords(3, [
      ['剩', 'shèng'], ['伐', 'fá'], ['煤', 'méi'], ['油', 'yóu'], ['灯', 'dēng'],
      ['接', 'jiē'], ['切', 'qiē'], ['切', 'qiè'], ['燃', 'rán']
    ]),
  },
  {
    id: '3-3-2',
    title: '那一定会很好',
    grade: 3,
    unit: 3,
    words: createWords(3, [
      ['缩', 'suō'], ['努', 'nǔ'], ['茎', 'jīng'], ['推', 'tuī'], ['吱', 'zhī'],
      ['拆', 'chāi'], ['旧', 'jiù']
    ]),
  },
  {
    id: '3-3-3',
    title: '在牛肚子里旅行',
    grade: 3,
    unit: 3,
    words: createWords(3, [
      ['旅', 'lǚ'], ['咱', 'zán'], ['偷', 'tōu'], ['答', 'dā'], ['应', 'yìng'],
      ['救', 'jiù'], ['命', 'mìng'], ['胃', 'wèi'], ['管', 'guǎn'], ['刚', 'gāng']
    ]),
  },
  {
    id: '3-4-1',
    title: '富饶的西沙群岛',
    grade: 3,
    unit: 4,
    words: createWords(3, [
      ['富', 'fù'], ['饶', 'ráo'], ['优', 'yōu'], ['瑰', 'guī'], ['丽', 'lì'],
      ['参', 'shēn'], ['虾', 'xiā'], ['武', 'wǔ'], ['威', 'wēi'], ['挺', 'tǐng']
    ]),
  },
  {
    id: '3-4-2',
    title: '海滨小城',
    grade: 3,
    unit: 4,
    words: createWords(3, [
      ['滨', 'bīn'], ['鸥', 'ōu'], ['胳', 'gē'], ['膊', 'bó'], ['臂', 'bì'],
      ['除', 'chú'], ['帆', 'fān'], ['船', 'chuán'], ['躺', 'tǎng'], ['靠', 'kào']
    ]),
  },
  {
    id: '3-4-3',
    title: '美丽的小兴安岭',
    grade: 3,
    unit: 4,
    words: createWords(3, [
      ['兴', 'xīng'], ['安', 'ān'], ['岭', 'lǐng'], ['融', 'róng'], ['汇', 'huì'],
      ['欣', 'xīn'], ['赏', 'shǎng'], ['乳', 'rǔ'], ['浸', 'jìn'], ['梢', 'shāo']
    ]),
  },
];

// ============ 三年级下册 ============
export const grade3bLessons: Lesson[] = [
  {
    id: '3b-1-1',
    title: '古诗三首',
    grade: 3,
    unit: 1,
    words: createWords(3, [
      ['融', 'róng'], ['燕', 'yàn'], ['鸳', 'yuān'], ['鸯', 'yāng'], ['惠', 'huì'],
      ['崇', 'chóng'], ['豚', 'tún'], ['减', 'jiǎn'], ['梅', 'méi'], ['泛', 'fàn']
    ]),
  },
  {
    id: '3b-1-2',
    title: '燕子',
    grade: 3,
    unit: 1,
    words: createWords(3, [
      ['燕', 'yàn'], ['聚', 'jù'], ['拢', 'lǒng'], ['形', 'xíng'], ['掠', 'lüè'],
      ['偶', 'ǒu'], ['尔', 'ěr'], ['沾', 'zhān'], ['倦', 'juàn'], ['闲', 'xián']
    ]),
  },
  {
    id: '3b-1-3',
    title: '荷花',
    grade: 3,
    unit: 1,
    words: createWords(3, [
      ['瓣', 'bàn'], ['蓬', 'péng'], ['胀', 'zhàng'], ['裂', 'liè'], ['姿', 'zī'],
      ['势', 'shì'], ['仿', 'fǎng'], ['佛', 'fú'], ['随', 'suí'], ['蹈', 'dǎo']
    ]),
  },
  {
    id: '3b-2-1',
    title: '守株待兔',
    grade: 3,
    unit: 2,
    words: createWords(3, [
      ['守', 'shǒu'], ['株', 'zhū'], ['待', 'dài'], ['宋', 'sòng'], ['耕', 'gēng'],
      ['触', 'chù'], ['颈', 'jǐng'], ['释', 'shì'], ['其', 'qí']
    ]),
  },
  {
    id: '3b-2-2',
    title: '陶罐和铁罐',
    grade: 3,
    unit: 2,
    words: createWords(3, [
      ['陶', 'táo'], ['罐', 'guàn'], ['骄', 'jiāo'], ['傲', 'ào'], ['谦', 'qiān'],
      ['虚', 'xū'], ['懦', 'nuò'], ['弱', 'ruò'], ['耻', 'chǐ'], ['逝', 'shì']
    ]),
  },
  {
    id: '3b-2-3',
    title: '鹿角和鹿腿',
    grade: 3,
    unit: 2,
    words: createWords(3, [
      ['鹿', 'lù'], ['塘', 'táng'], ['映', 'yìng'], ['欣', 'xīn'], ['赏', 'shǎng'],
      ['匀', 'yún'], ['称', 'chèn'], ['致', 'zhì'], ['配', 'pèi'], ['传', 'chuán']
    ]),
  },
];

// ============ 四年级上册 ============
export const grade4Lessons: Lesson[] = [
  {
    id: '4-1-1',
    title: '观潮',
    grade: 4,
    unit: 1,
    words: createWords(4, [
      ['潮', 'cháo'], ['据', 'jù'], ['堤', 'dī'], ['阔', 'kuò'], ['笼', 'lóng'],
      ['罩', 'zhào'], ['盼', 'pàn'], ['滚', 'gǔn'], ['顿', 'dùn'], ['逐', 'zhú']
    ]),
  },
  {
    id: '4-1-2',
    title: '走月亮',
    grade: 4,
    unit: 1,
    words: createWords(4, [
      ['鹅', 'é'], ['卵', 'luǎn'], ['俗', 'sú'], ['跃', 'yuè'], ['穗', 'suì'],
      ['镀', 'dù'], ['埂', 'gěng'], ['烁', 'shuò'], ['淘', 'táo'], ['牵', 'qiān']
    ]),
  },
  {
    id: '4-2-1',
    title: '现代诗二首',
    grade: 4,
    unit: 2,
    words: createWords(4, [
      ['巢', 'cháo'], ['苇', 'wěi'], ['罗', 'luó'], ['眠', 'mián'], ['霸', 'bà'],
      ['占', 'zhàn'], ['倦', 'juàn'], ['偷', 'tōu'], ['驮', 'tuó'], ['翅', 'chì']
    ]),
  },
  {
    id: '4-2-2',
    title: '花牛歌',
    grade: 4,
    unit: 2,
    words: createWords(4, [
      ['罗', 'luó'], ['眠', 'mián'], ['霸', 'bà'], ['占', 'zhàn'], ['倦', 'juàn']
    ]),
  },
  {
    id: '4-3-1',
    title: '一个豆荚里的五粒豆',
    grade: 4,
    unit: 3,
    words: createWords(4, [
      ['荚', 'jiá'], ['按', 'àn'], ['适', 'shì'], ['恐', 'kǒng'], ['僵', 'jiāng'],
      ['硬', 'yìng'], ['预', 'yù'], ['揭', 'jiē'], ['啪', 'pā'], ['苔', 'tái']
    ]),
  },
  {
    id: '4-3-2',
    title: '夜间飞行的秘密',
    grade: 4,
    unit: 3,
    words: createWords(4, [
      ['蝙', 'biān'], ['蝠', 'fú'], ['即', 'jí'], ['锐', 'ruì'], ['系', 'jì'],
      ['蝇', 'yíng'], ['证', 'zhèng'], ['障', 'zhàng'], ['碍', 'ài'], ['荧', 'yíng']
    ]),
  },
  {
    id: '4-4-1',
    title: '古诗三首',
    grade: 4,
    unit: 4,
    words: createWords(4, [
      ['暮', 'mù'], ['吟', 'yín'], ['题', 'tí'], ['峰', 'fēng'], ['庐', 'lú'],
      ['缘', 'yuán'], ['降', 'jiàng'], ['费', 'fèi'], ['阁', 'gé'], ['骚', 'sāo']
    ]),
  },
  {
    id: '4-4-2',
    title: '爬山虎的脚',
    grade: 4,
    unit: 4,
    words: createWords(4, [
      ['虎', 'hǔ'], ['操', 'cāo'], ['占', 'zhàn'], ['嫩', 'nèn'], ['顺', 'shùn'],
      ['均', 'jūn'], ['匀', 'yún'], ['叠', 'dié'], ['隙', 'xì'], ['柄', 'bǐng']
    ]),
  },
];

// ============ 四年级下册 ============
export const grade4bLessons: Lesson[] = [
  {
    id: '4b-1-1',
    title: '四时田园杂兴',
    grade: 4,
    unit: 1,
    words: createWords(4, [
      ['杂', 'zá'], ['兴', 'xìng'], ['篱', 'lí'], ['蔬', 'shū'], ['稀', 'xī'],
      ['蜓', 'tíng'], ['蝶', 'dié']
    ]),
  },
  {
    id: '4b-1-2',
    title: '宿新市徐公店',
    grade: 4,
    unit: 1,
    words: createWords(4, [
      ['宿', 'sù'], ['徐', 'xú'], ['篱', 'lí'], ['疏', 'shū'], ['稀', 'xī'],
      ['蜓', 'tíng'], ['蝶', 'dié']
    ]),
  },
  {
    id: '4b-1-3',
    title: '乡下人家',
    grade: 4,
    unit: 1,
    words: createWords(4, [
      ['构', 'gòu'], ['冠', 'guān'], ['朴', 'pǔ'], ['素', 'sù'], ['率', 'shuài'],
      ['倘', 'tǎng'], ['附', 'fù'], ['捣', 'dǎo'], ['绘', 'huì'], ['谐', 'xié']
    ]),
  },
  {
    id: '4b-2-1',
    title: '天窗',
    grade: 4,
    unit: 2,
    words: createWords(4, [
      ['慰', 'wèi'], ['藉', 'jiè'], ['卜', 'bǔ'], ['锐', 'ruì'], ['滩', 'tān'],
      ['帐', 'zhàng'], ['烁', 'shuò'], ['蝙', 'biān'], ['蝠', 'fú'], ['霸', 'bà']
    ]),
  },
  {
    id: '4b-3-1',
    title: '古诗三首',
    grade: 4,
    unit: 3,
    words: createWords(4, [
      ['冰', 'bīng'], ['壶', 'hú'], ['玉', 'yù'], ['盘', 'pán'], ['单', 'dān'],
      ['骑', 'qí'], ['满', 'mǎn'], ['乾', 'qián'], ['坤', 'kūn']
    ]),
  },
  {
    id: '4b-3-2',
    title: '小英雄雨来',
    grade: 4,
    unit: 3,
    words: createWords(4, [
      ['晋', 'jìn'], ['絮', 'xù'], ['扭', 'niǔ'], ['姥', 'lǎo'], ['吧', 'bā'],
      ['塞', 'sāi'], ['哇', 'wā'], ['栓', 'shuān'], ['捆', 'kǔn'], ['绑', 'bǎng']
    ]),
  },
];

// ============ 五年级上册 ============
export const grade5Lessons: Lesson[] = [
  {
    id: '5-1-1',
    title: '白鹭',
    grade: 5,
    unit: 1,
    words: createWords(5, [
      ['宜', 'yí'], ['鹤', 'hè'], ['嫌', 'xián'], ['朱', 'zhū'], ['嵌', 'qiàn'],
      ['框', 'kuàng'], ['匣', 'xiá'], ['哨', 'shào'], ['恩', 'ēn'], ['韵', 'yùn']
    ]),
  },
  {
    id: '5-1-2',
    title: '落花生',
    grade: 5,
    unit: 1,
    words: createWords(5, [
      ['亩', 'mǔ'], ['播', 'bō'], ['浇', 'jiāo'], ['吩', 'fēn'], ['咐', 'fù'],
      ['亭', 'tíng'], ['榨', 'zhà'], ['慕', 'mù'], ['矮', 'ǎi']
    ]),
  },
  {
    id: '5-1-3',
    title: '桂花雨',
    grade: 5,
    unit: 1,
    words: createWords(5, [
      ['箩', 'luó'], ['婆', 'pó'], ['糕', 'gāo'], ['饼', 'bǐng'], ['浸', 'jìn'],
      ['缠', 'chán'], ['茶', 'chá'], ['捡', 'jiǎn'], ['尤', 'yóu']
    ]),
  },
  {
    id: '5-2-1',
    title: '牛郎织女',
    grade: 5,
    unit: 2,
    words: createWords(5, [
      ['郎', 'láng'], ['嫂', 'sǎo'], ['恳', 'kěn'], ['筛', 'shāi'], ['梭', 'suō'],
      ['监狱', 'jiān yù'], ['酿', 'niàng'], ['瞌', 'kē'], ['落', 'luò'], ['罪', 'zuì']
    ]),
  },
  {
    id: '5-3-1',
    title: '古诗三首',
    grade: 5,
    unit: 3,
    words: createWords(5, [
      ['祭', 'jì'], ['乃', 'nǎi'], ['熏', 'xūn'], ['杭', 'háng'], ['亥', 'hài'],
      ['恃', 'shì'], ['哀', 'āi'], ['拘', 'jū']
    ]),
  },
  {
    id: '5-3-2',
    title: '少年中国说',
    grade: 5,
    unit: 3,
    words: createWords(5, [
      ['泻', 'xiè'], ['潜', 'qián'], ['鳞', 'lín'], ['胎', 'tāi'], ['履', 'lǚ'],
      ['皇', 'huáng'], ['纵', 'zòng'], ['有', 'yǒu'], ['作', 'zuò'], ['其', 'qí']
    ]),
  },
  {
    id: '5-4-1',
    title: '圆明园的毁灭',
    grade: 5,
    unit: 4,
    words: createWords(5, [
      ['毁', 'huǐ'], ['估', 'gū'], ['拱', 'gǒng'], ['辉', 'huī'], ['煌', 'huáng'],
      ['殿', 'diàn'], ['陵', 'líng'], ['览', 'lǎn'], ['境', 'jìng'], ['宏', 'hóng']
    ]),
  },
];

// ============ 五年级下册 ============
export const grade5bLessons: Lesson[] = [
  {
    id: '5b-1-1',
    title: '古诗三首',
    grade: 5,
    unit: 1,
    words: createWords(5, [
      ['昼', 'zhòu'], ['耘', 'yún'], ['供', 'gòng'], ['稚', 'zhì'], ['漪', 'yī'],
      ['陂', 'bēi'], ['衔', 'xián'], ['浸', 'jìn'], ['寒', 'hán'], ['漪', 'yī']
    ]),
  },
  {
    id: '5b-1-2',
    title: '祖父的园子',
    grade: 5,
    unit: 1,
    words: createWords(5, [
      ['蚱', 'zhà'], ['啃', 'kěn'], ['樱', 'yīng'], ['蚌', 'bàng'], ['割', 'gē'],
      ['嘟', 'dū'], ['倭', 'wō'], ['逛', 'guàng']
    ]),
  },
  {
    id: '5b-2-1',
    title: '草船借箭',
    grade: 5,
    unit: 2,
    words: createWords(5, [
      ['妒', 'dù'], ['忌', 'jì'], ['督', 'dū'], ['幔', 'màn'], ['私', 'sī'],
      ['寨', 'zhài'], ['擂', 'léi'], ['呐', 'nà'], ['弩', 'nǔ'], ['丞', 'chéng']
    ]),
  },
  {
    id: '5b-2-2',
    title: '景阳冈',
    grade: 5,
    unit: 2,
    words: createWords(5, [
      ['杖', 'zhàng'], ['限', 'xiàn'], ['胯', 'kuà'], ['霹', 'pī'], ['雳', 'lì'],
      ['咆', 'páo'], ['哮', 'xiào'], ['锤', 'chuí'], ['膛', 'táng'], ['泄', 'xiè']
    ]),
  },
];

// ============ 六年级上册 ============
export const grade6Lessons: Lesson[] = [
  {
    id: '6-1-1',
    title: '北京的春节',
    grade: 6,
    unit: 1,
    words: createWords(6, [
      ['蒜', 'suàn'], ['醋', 'cù'], ['饺', 'jiǎo'], ['摊', 'tān'], ['拌', 'bàn'],
      ['眨', 'zhǎ'], ['宵', 'xiāo'], ['燃', 'rán'], ['贩', 'fàn'], ['彼', 'bǐ']
    ]),
  },
  {
    id: '6-1-2',
    title: '腊八粥',
    grade: 6,
    unit: 1,
    words: createWords(6, [
      ['腊', 'là'], ['粥', 'zhōu'], ['腻', 'nì'], ['咽', 'yàn'], ['匙', 'chí'],
      ['搅', 'jiǎo'], ['稠', 'chóu'], ['肿', 'zhǒng'], ['熬', 'áo'], ['褐', 'hè']
    ]),
  },
  {
    id: '6-2-1',
    title: '古诗三首',
    grade: 6,
    unit: 2,
    words: createWords(6, [
      ['寒', 'hán'], ['食', 'shí'], ['御', 'yù'], ['柳', 'liǔ'], ['暮', 'mù'],
      ['汉', 'hàn'], ['宫', 'gōng'], ['侯', 'hóu'], ['章', 'zhāng'], ['盈', 'yíng']
    ]),
  },
  {
    id: '6-2-2',
    title: '藏戏',
    grade: 6,
    unit: 2,
    words: createWords(6, [
      ['僧', 'sēng'], ['脱', 'tuō'], ['缰', 'jiāng'], ['敦', 'dūn'], ['敦', 'dūn'],
      ['獠', 'liáo'], ['钹', 'bó'], ['演绎', 'yǎn yì']
    ]),
  },
  {
    id: '6-3-1',
    title: '古诗三首',
    grade: 6,
    unit: 3,
    words: createWords(6, [
      ['络', 'luò'], ['锤', 'chuí'], ['凿', 'záo'], ['焚', 'fén'], ['碎', 'suì'],
      ['磨', 'mó'], ['击', 'jī'], ['尔', 'ěr'], ['炎', 'yán'], ['留', 'liú']
    ]),
  },
  {
    id: '6-3-2',
    title: '十六年前的回忆',
    grade: 6,
    unit: 3,
    words: createWords(6, [
      ['阀', 'fá'], ['避', 'bì'], ['僻', 'pì'], ['瞅', 'chǒu'], ['靴', 'xuē'],
      ['魔', 'mó'], ['刑', 'xíng'], ['袍', 'páo'], ['执', 'zhí'], ['啃', 'kěn']
    ]),
  },
  {
    id: '6-4-1',
    title: '为人民服务',
    grade: 6,
    unit: 4,
    words: createWords(6, [
      ['革', 'gé'], ['牺', 'xī'], ['牲', 'shēng'], ['彻', 'chè'], ['迁', 'qiān'],
      ['迫', 'pò'], ['批', 'pī'], ['鼎', 'dǐng'], ['炊', 'chuī']
    ]),
  },
];

// ============ 六年级下册 ============
export const grade6bLessons: Lesson[] = [
  {
    id: '6b-1-1',
    title: '北京的春节',
    grade: 6,
    unit: 1,
    words: createWords(6, [
      ['醋', 'cù'], ['饺', 'jiǎo'], ['摊', 'tān'], ['拌', 'bàn'], ['擦', 'cā'],
      ['眨', 'zhǎ'], ['宵', 'xiāo'], ['燃', 'rán'], ['贩', 'fàn'], ['骆', 'luò']
    ]),
  },
  {
    id: '6b-2-1',
    title: '鲁滨孙漂流记',
    grade: 6,
    unit: 2,
    words: createWords(6, [
      ['惧', 'jù'], ['凄', 'qī'], ['寞', 'mò'], ['宴', 'yàn'], ['霉', 'méi'],
      ['籍', 'jí'], ['聊', 'liáo'], ['乏', 'fá'], ['栅', 'zhà'], ['控', 'kòng']
    ]),
  },
  {
    id: '6b-3-1',
    title: '匆匆',
    grade: 6,
    unit: 3,
    words: createWords(6, [
      ['藏', 'cáng'], ['挪', 'nuó'], ['徘', 'pái'], ['徊', 'huái'], ['蒸', 'zhēng'],
      ['融', 'róng'], ['裸', 'luǒ'], ['伶', 'líng'], ['俐', 'lì'], ['跨', 'kuà']
    ]),
  },
];

// 获取某年级的所有课程
export function getLessonsByGrade(grade: number): Lesson[] {
  switch (grade) {
    case 1:
      return [...grade1Lessons, ...grade1bLessons];
    case 2:
      return [...grade2Lessons, ...grade2bLessons];
    case 3:
      return [...grade3Lessons, ...grade3bLessons];
    case 4:
      return [...grade4Lessons, ...grade4bLessons];
    case 5:
      return [...grade5Lessons, ...grade5bLessons];
    case 6:
      return [...grade6Lessons, ...grade6bLessons];
    default:
      return [];
  }
}

// 获取某课的所有词语
export function getWordsByLesson(lessonId: string): Word[] {
  const allLessons = [
    ...grade1Lessons, ...grade1bLessons,
    ...grade2Lessons, ...grade2bLessons,
    ...grade3Lessons, ...grade3bLessons,
    ...grade4Lessons, ...grade4bLessons,
    ...grade5Lessons, ...grade5bLessons,
    ...grade6Lessons, ...grade6bLessons,
  ];
  const lesson = allLessons.find(l => l.id === lessonId);
  return lesson ? lesson.words : [];
}

// 获取某年级的所有词语
export function getWordsByGrade(grade: number): Word[] {
  const lessons = getLessonsByGrade(grade);
  return lessons.flatMap(lesson => lesson.words);
}

// 获取所有词语
export function getAllWords(): Word[] {
  return [
    ...getWordsByGrade(1),
    ...getWordsByGrade(2),
    ...getWordsByGrade(3),
    ...getWordsByGrade(4),
    ...getWordsByGrade(5),
    ...getWordsByGrade(6),
  ];
}

// 获取例句（现在调用豆包API）
export async function getSentenceForWord(word: Word): Promise<string> {
  const { generateDictationExample } = await import('../services/doubaoService');
  return generateDictationExample(word.text, word.grade);
}

export default {
  getLessonsByGrade,
  getWordsByLesson,
  getWordsByGrade,
  getAllWords,
  getSentenceForWord,
};
