import { Audio } from 'expo-av';

const API_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3';
const DEFAULT_MODEL = 'ep-20241213164445-pk5jx';
const TTS_MODEL = 'Doubao-TTS-2.0';

interface DoubaoConfig {
  apiKey?: string;
  model?: string;
}

let config: DoubaoConfig = {
  apiKey: 'caedce2b76f5-4b8d-9544-5b4271c4e5a8',
  model: DEFAULT_MODEL,
};

export function configureDoubao(newConfig: DoubaoConfig) {
  config = { ...config, ...newConfig };
}

const SENTENCE_TEMPLATES = [
  '{word}，今天我们学习{word}',
  '{word}，{word}是一个生字',
  '{word}，{word}这个字很重要',
  '{word}，请写三遍{word}',
  '{word}，{word}字的拼音是',
  '{word}，{word}的意思是',
  '{word}，请读一下{word}',
  '{word}，{word}可以组词为',
  '{word}，{word}在课文中出现',
  '{word}，记住{word}的写法'
];

const WORD_SENTENCE_TEMPLATES = [
  '{word}，{word}是一个词语',
  '{word}，我们要掌握{word}',
  '{word}，{word}在文中的意思',
  '{word}，{word}的用法很特别',
  '{word}，{word}这个词很常用',
  '{word}，请用{word}造句',
  '{word}，{word}的近义词是',
  '{word}，{word}是本课生词',
  '{word}，{word}要认真记住',
  '{word}，{word}可以这样用'
];

const FALLBACK_SENTENCES: Record<string, string> = {
  '天': '天，今天的天气真好',
  '地': '地，地上有一只小蚂蚁',
  '人': '人，我们都是中国人',
  '你': '你，你好吗？',
  '我': '我，我是小学生',
  '他': '他，他是我的好朋友',
  '一': '一，一、二、三',
  '二': '二，二月二龙抬头',
  '三': '三，三是一个数字',
  '四': '四，四面都有山',
  '五': '五，五星红旗',
  '六': '六，六六大顺',
  '七': '七，一个星期有七天',
  '八': '八，八仙过海',
  '九': '九，九月九日重阳节',
  '十': '十，十全十美',
  '爸': '爸，爸爸爱我',
  '妈': '妈，妈妈很辛苦',
  '爷': '爷，爷爷在看报',
  '奶': '奶，奶奶在做饭',
  '哥': '哥，哥哥在上大学',
  '姐': '姐，姐姐很漂亮',
  '弟': '弟，弟弟在玩耍',
  '妹': '妹，妹妹在唱歌',
  '国': '国，我爱我的祖国',
  '家': '家，我们都有一个家',
  '学': '学，好好学习天天向上',
  '校': '校，我们的学校很美丽',
  '生': '生，生活很美好',
  '日': '日，日出东方红彤彤',
  '月': '月，月亮挂在天上',
  '水': '水，水是生命之源',
  '火': '火，我们要注意防火',
  '山': '山，大山很巍峨',
  '石': '石，石头很硬',
  '田': '田，田野很美丽',
  '禾': '禾，禾苗在成长',
  '花': '花，花园里有很多花',
  '草': '草，小草在生长',
  '树': '树，树很高大',
  '林': '林，树林很茂盛',
  '森': '森，森林里有很多动物',
  '春': '春，春天来了',
  '夏': '夏，夏天很热',
  '秋': '秋，秋天是丰收的季节',
  '冬': '冬，冬天会下雪',
  '鸟': '鸟，小鸟在树上唱歌',
  '虫': '虫，虫儿在地上爬',
  '鱼': '鱼，鱼在水里游',
  '马': '马，马儿在奔跑',
  '牛': '牛，牛在吃草',
  '羊': '羊，羊儿在山坡上',
  '狗': '狗，狗是人类的朋友',
  '猫': '猫，小猫在睡觉',
  '兔': '兔，兔子很可爱',
  '爱': '爱，我爱爸爸妈妈',
  '心': '心，我们要用心学习',
  '思': '思，我在思考问题',
  '想': '想，我想念奶奶',
  '知': '知，知识就是力量',
  '道': '道，道理要明白',
  '习': '习，练习很重要',
  '写': '写，写字要认真',
  '词': '词，词语要积累',
  '饺': '饺，我爱吃饺子',
  '燃': '燃，火焰在燃烧',
  '和蔼可亲': '和蔼可亲，张老师和蔼可亲',
  '例如': '例如，例如这个例子',
  '灿烂': '灿烂，阳光很灿烂',
  '美丽': '美丽，花园真美丽',
  '快乐': '快乐，我们很快乐',
  '高兴': '高兴，今天真高兴',
  '温暖': '温暖，春天很温暖',
  '希望': '希望，我们充满希望',
  '梦想': '梦想，我的梦想是',
  '努力': '努力，我们要努力学习',
  '认真': '认真，做作业要认真',
  '仔细': '仔细，观察要仔细',
  '坚持': '坚持，坚持就是胜利'
};

let audioCache = new Map<string, Audio.Sound>();

export async function generateDictationExample(
  word: string,
  grade?: number
): Promise<{ example: string; source: 'doubao' | 'fallback' }> {
  if (!config.apiKey) {
    console.log('未配置豆包API Key，使用本地例句');
    return { example: getFallbackExample(word), source: 'fallback' };
  }

  try {
    const prompt = buildPrompt(word, grade);
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的小学语文老师。请为学生生成适合听写的例句。格式要求：字/词，例句。例子：国，我们的国家很美丽。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 50,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const aiExample = data.choices?.[0]?.message?.content?.trim();
      if (aiExample && isValidExample(aiExample)) {
        return { example: formatExample(aiExample, word), source: 'doubao' };
      }
    }
  } catch (error) {
    console.error('豆包API调用失败，使用本地例句:', error);
  }

  return { example: getFallbackExample(word), source: 'fallback' };
}

function buildPrompt(word: string, grade?: number): string {
  const gradeText = grade ? `适合${grade}年级学生` : '';
  if (word.length === 1) {
    return `请为汉字"${word}"${gradeText}生成一个简单的听写例句。格式：${word}，简单句。例子：国，我们的祖国很伟大。`;
  } else {
    return `请为词语"${word}"${gradeText}生成一个简单的听写例句。格式：${word}，简单句。例子：学校，我们的学校很美丽。`;
  }
}

function isValidExample(example: string): boolean {
  return example.length > 2 && example.includes('，');
}

function formatExample(example: string, word: string): string {
  let cleaned = example.replace(/["""']/g, '').trim();
  
  if (cleaned.includes('，')) {
    const parts = cleaned.split('，');
    if (parts.length >= 2) {
      return `${word}，${parts[1]}`;
    }
  }
  
  if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    if (parts.length >= 2) {
      return `${word}，${parts[1]}`;
    }
  }
  
  return getFallbackExample(word);
}

function getFallbackExample(word: string): string {
  if (FALLBACK_SENTENCES[word]) {
    return FALLBACK_SENTENCES[word];
  }
  
  if (word.length === 1) {
    const template = SENTENCE_TEMPLATES[Math.floor(Math.random() * SENTENCE_TEMPLATES.length)];
    return template.replace(/{word}/g, word);
  } else {
    const template = WORD_SENTENCE_TEMPLATES[Math.floor(Math.random() * WORD_SENTENCE_TEMPLATES.length)];
    return template.replace(/{word}/g, word);
  }
}

export async function speakWithDoubao(text: string): Promise<void> {
  if (!config.apiKey) {
    console.log('未配置豆包API Key，使用系统语音');
    throw new Error('API Key未配置');
  }

  try {
    const cacheKey = `tts_${text}`;
    
    if (audioCache.has(cacheKey)) {
      const sound = audioCache.get(cacheKey);
      if (sound) {
        await sound.replayAsync();
        return;
      }
    }

    const response = await fetch(`${API_BASE_URL}/audio/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: TTS_MODEL,
        input: text,
        voice: 'zh_female_qingxin',
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      console.error(`TTS请求失败: ${response.status}`);
      throw new Error(`TTS请求失败: ${response.status}`);
    }

    const blob = await response.blob();
    const uri = URL.createObjectURL(blob);
    
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    
    audioCache.set(cacheKey, sound);
    
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });

  } catch (error) {
    console.error('豆包TTS失败，使用本地语音:', error);
    throw error;
  }
}

export function clearAudioCache() {
  audioCache.forEach((sound) => {
    sound.unloadAsync();
  });
  audioCache.clear();
}

export default {
  configureDoubao,
  generateDictationExample,
  speakWithDoubao,
  clearAudioCache,
};