const API_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3';
const DEFAULT_MODEL = 'ep-20241213164445-pk5jx';

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
];

const WORD_SENTENCE_TEMPLATES = [
  '{word}，{word}是一个词语',
  '{word}，我们要掌握{word}',
  '{word}，{word}在文中的意思',
];

const FALLBACK_SENTENCES: Record<string, string> = {
  '天': '天，今天的天气真好',
  '地': '地，地上有一只小蚂蚁',
  '人': '人，我们都是中国人',
  '爸': '爸，爸爸爱我',
  '妈': '妈，妈妈很辛苦',
  '国': '国，我爱我的祖国',
  '家': '家，我们都有一个家',
  '学': '学，好好学习天天向上',
  '饺': '饺，我爱吃饺子',
  '燃': '燃，火焰在燃烧',
  '和蔼可亲': '和蔼可亲，张老师和蔼可亲',
  '例如': '例如，例如这个例子',
  '灿烂': '灿烂，阳光很灿烂',
  '美丽': '美丽，花园真美丽',
  '快乐': '快乐，我们很快乐',
  '温暖': '温暖，春天很温暖',
  '希望': '希望，我们充满希望',
  '努力': '努力，我们要努力学习',
  '坚持': '坚持，坚持就是胜利',
};

export async function generateDictationExample(
  word: string,
  grade?: number
): Promise<string> {
  if (FALLBACK_SENTENCES[word]) {
    return FALLBACK_SENTENCES[word];
  }

  if (!config.apiKey) {
    return getFallbackExample(word);
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
            content: '你是一个专业的小学语文老师。请为学生生成适合听写的例句。格式要求：字/词，例句。例子：国，我们的祖国很伟大。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 50,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const aiExample = data.choices?.[0]?.message?.content?.trim();
      if (aiExample && isValidExample(aiExample)) {
        return formatExample(aiExample, word);
      }
    }
  } catch (error) {
    console.error('豆包API调用失败:', error);
  }

  return getFallbackExample(word);
}

function buildPrompt(word: string, grade?: number): string {
  const gradeText = grade ? `适合${grade}年级学生` : '';
  if (word.length === 1) {
    return `请为汉字"${word}"${gradeText}生成一个简单的听写例句。格式：${word}，简单句。`;
  } else {
    return `请为词语"${word}"${gradeText}生成一个简单的听写例句。格式：${word}，简单句。`;
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
  console.log('使用系统语音播放:', text);
  throw new Error('使用系统语音');
}

export function clearAudioCache() {
}

export default {
  configureDoubao,
  generateDictationExample,
  speakWithDoubao,
  clearAudioCache,
};
