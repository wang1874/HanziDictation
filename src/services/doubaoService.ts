const CHAT_API_URL = 'https://ark.cn-beijing.volces.com/api/v3';
const TTS_API_URL = 'https://openspeech.bytedance.net/api/text2speech';
const DEFAULT_MODEL = 'Doubao-Seed-2.0-Code';
const TTS_APP_ID = '3740050812';

interface DoubaoConfig {
  apiKey?: string;
  model?: string;
}

let config: DoubaoConfig = {
  apiKey: 'ark-abd3279c-50fd-42df-a8c7-d4967781b463-f3a3a',
  model: DEFAULT_MODEL,
};

export function configureDoubao(newConfig: DoubaoConfig) {
  config = { ...config, ...newConfig };
}

export async function generateDictationExample(word: string, grade?: number): Promise<string> {
  if (!config.apiKey) {
    console.log('[豆包API] 未配置API Key，使用本地例句');
    return getLocalFallbackExample(word);
  }

  try {
    const prompt = buildPrompt(word, grade);
    console.log('[豆包API] 开始调用Chat API，输入:', word);
    console.log('[豆包API] 模型:', config.model);
    console.log('[豆包API] API Key前10位:', config.apiKey?.substring(0, 10) + '...');
    
    const response = await fetch(`${CHAT_API_URL}/chat/completions`, {
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

    console.log('[豆包API] HTTP状态码:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('[豆包API] Chat API响应:', JSON.stringify(data));
      
      const aiExample = data.choices?.[0]?.message?.content?.trim();
      if (aiExample && aiExample.includes('，')) {
        const parts = aiExample.split('，');
        if (parts.length >= 2) {
          console.log('[豆包API] 使用豆包生成例句:', aiExample);
          return aiExample;
        }
      } else {
        console.log('[豆包API] 响应格式不正确:', aiExample);
      }
    } else {
      const errorText = await response.text();
      console.error('[豆包API] Chat API响应失败:', response.status);
      console.error('[豆包API] 错误详情:', errorText);
    }
  } catch (error: any) {
    console.error('[豆包API] Chat API调用失败:', error.message || error);
    if (error.stack) {
      console.error('[豆包API] 错误堆栈:', error.stack);
    }
  }

  console.log('[豆包API] 豆包不可用，使用本地例句:', word);
  return getLocalFallbackExample(word);
}

function buildPrompt(word: string, grade?: number): string {
  const gradeText = grade ? `适合${grade}年级学生` : '';
  if (word.length === 1) {
    return `请为汉字"${word}"${gradeText}生成一个简单的听写例句。格式：${word}，简单句。`;
  } else {
    return `请为词语"${word}"${gradeText}生成一个简单的听写例句。格式：${word}，简单句。`;
  }
}

function getLocalFallbackExample(word: string): string {
  const FALLBACK_SENTENCES: Record<string, string> = {
    '天': '天，今天天气很好',
    '地': '地，草地上有小花',
    '人': '人，我们都是好人',
    '爸': '爸，爸爸去上班',
    '妈': '妈，妈妈在做饭',
    '国': '国，祖国山河美',
    '家': '家，我爱我的家',
    '学': '学，我们去学校',
    '饺': '饺，饺子很好吃',
    '燃': '燃，火苗在燃烧',
    '和蔼可亲': '和蔼可亲，老师很和蔼可亲',
    '例如': '例如，举个例子',
    '灿烂': '灿烂，阳光很灿烂',
    '美丽': '美丽，花朵真美丽',
    '快乐': '快乐，大家很快乐',
    '温暖': '温暖，春风很温暖',
    '希望': '希望，心中有希望',
    '努力': '努力，学习要努力',
    '坚持': '坚持，坚持就胜利',
    '领袖': '领袖，伟大的领袖',
    '学校': '学校，我们的学校',
    '学习': '学习，好好学习',
    '老师': '老师，尊敬老师',
    '学生': '学生，我是学生',
    '教室': '教室，安静的教室',
  };

  if (FALLBACK_SENTENCES[word]) {
    return FALLBACK_SENTENCES[word];
  }
  
  if (word.length === 1) {
    return `${word}，${word}字怎么写`;
  } else {
    return `${word}，这个词怎么写`;
  }
}

export async function synthesizeSpeech(text: string): Promise<ArrayBuffer | null> {
  if (!config.apiKey) {
    console.log('[豆包TTS] 未配置API Key，无法使用豆包TTS');
    return null;
  }

  try {
    console.log('[豆包TTS] 开始调用TTS API，输入:', text);
    console.log('[豆包TTS] API地址:', TTS_API_URL);
    console.log('[豆包TTS] APP ID:', TTS_APP_ID);
    console.log('[豆包TTS] API Key前10位:', config.apiKey?.substring(0, 10) + '...');
    
    const response = await fetch(TTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'X-Tts-Appid': TTS_APP_ID,
      },
      body: JSON.stringify({
        text: text,
        voice_type: 'zh_female_qingxin',
        codec: 'mp3',
        rate: 0.8,
      }),
    });

    console.log('[豆包TTS] HTTP状态码:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[豆包TTS] TTS请求失败:', response.status);
      console.error('[豆包TTS] 错误详情:', errorText);
      return null;
    }

    const blob = await response.blob();
    console.log('[豆包TTS] 合成成功，音频大小:', blob.size, 'bytes');
    return blob.arrayBuffer();
  } catch (error: any) {
    console.error('[豆包TTS] TTS失败:', error.message || error);
    if (error.stack) {
      console.error('[豆包TTS] 错误堆栈:', error.stack);
    }
    return null;
  }
}

export function getCurrentConfig() {
  return {
    hasApiKey: !!config.apiKey,
    apiKey: config.apiKey,
    model: config.model,
    ttsAppId: TTS_APP_ID,
    chatUrl: CHAT_API_URL,
    ttsUrl: TTS_API_URL,
  };
}

export default {
  configureDoubao,
  generateDictationExample,
  synthesizeSpeech,
  getCurrentConfig,
};
