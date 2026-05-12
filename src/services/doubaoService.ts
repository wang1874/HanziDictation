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

export async function generateDictationExample(word: string, grade?: number): Promise<string> {
  if (FALLBACK_SENTENCES[word]) {
    return FALLBACK_SENTENCES[word];
  }

  if (!config.apiKey) {
    return `${word}，请写出${word}`;
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
      if (aiExample && aiExample.includes('，')) {
        const parts = aiExample.split('，');
        if (parts.length >= 2) {
          return `${word}，${parts[1]}`;
        }
      }
    }
  } catch (error) {
    console.error('豆包API调用失败:', error);
  }

  return `${word}，请写出${word}`;
}

function buildPrompt(word: string, grade?: number): string {
  const gradeText = grade ? `适合${grade}年级学生` : '';
  if (word.length === 1) {
    return `请为汉字"${word}"${gradeText}生成一个简单的听写例句。格式：${word}，简单句。`;
  } else {
    return `请为词语"${word}"${gradeText}生成一个简单的听写例句。格式：${word}，简单句。`;
  }
}

export async function synthesizeSpeech(text: string): Promise<ArrayBuffer | null> {
  if (!config.apiKey) {
    console.log('未配置API Key');
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/audio/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: 'Doubao-TTS-2.0',
        input: text,
        voice: 'zh_female_qingxin',
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      console.error(`TTS请求失败: ${response.status}`);
      return null;
    }

    const blob = await response.blob();
    return blob.arrayBuffer();
  } catch (error) {
    console.error('豆包TTS失败:', error);
    return null;
  }
}

export default {
  configureDoubao,
  generateDictationExample,
  synthesizeSpeech,
};
