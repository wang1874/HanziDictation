import { audioCache } from './audioCacheService';

const CHAT_API_URL = 'https://ark.cn-beijing.volces.com/api/v3';
const TTS_API_URL = 'https://openspeech.bytedance.com/api/v1/tts';
const DEFAULT_MODEL = 'doubao-seed-2-0-code-preview-260215';
const TTS_ACCESS_TOKEN = 'zPkdziOzNxMFoslkYxMa28wDZE6v';
const TTS_CLUSTER_ID = 'volcano_tts';

interface DoubaoConfig {
  apiKey?: string;
  model?: string;
}

interface DictationItem {
  word: string;
  speechText: string;
  audioPath?: string;
  audioBuffers?: ArrayBuffer[];
}

interface BatchDictationResult {
  intro: string;
  items: DictationItem[];
  ending: string;
}

let config: DoubaoConfig = {
  apiKey: 'ark-abd3279c-50fd-42df-a8c7-d4967781b463-f3a3a',
  model: DEFAULT_MODEL,
};

export function configureDoubao(newConfig: DoubaoConfig) {
  config = { ...config, ...newConfig };
}

export async function generateBatchDictation(
  words: string[],
  mode: 'single' | 'phrase',
  grade?: number
): Promise<BatchDictationResult | null> {
  console.log('[豆包API] 开始批量生成听写内容');
  console.log('[豆包API] 听写模式:', mode);
  console.log('[豆包API] 生字词数量:', words.length);

  try {
    const intro = '小朋友们，准备好了吗？让我们开始听写吧！';
    const ending = '今天的听写就到这里，写完记得再检查一遍哦！你们真棒！';

    const items: DictationItem[] = [];

    if (mode === 'single') {
      for (const word of words) {
        const speechText = await generateSingleWordSpeech(word);
        items.push({ word, speechText });
      }
    } else {
      for (const word of words) {
        const speechText = await generateDictationExample(word, grade);
        items.push({ word, speechText });
      }
    }

    return {
      intro,
      items,
      ending,
    };
  } catch (error: any) {
    console.error('[豆包API] 批量生成失败:', error.message || error);
    return null;
  }
}

async function generateSingleWordSpeech(word: string): Promise<string> {
  if (!config.apiKey) {
    console.log('[豆包API] 未配置API Key，使用本地多组词格式');
    return getLocalMultiGroupFormat(word);
  }

  try {
    const prompt = buildSingleWordPrompt(word);
    console.log('[豆包API] 生成单字播报内容:', word);

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
            content: '你是一个专业的小学语文老师。请为听写的生字生成2-3个常见的组词，每个组词用逗号分隔。格式：字，词1的词，词2的词，词3的词。例子：国，国家的人民，中国的祖国。确保每个组词都以这个字开头。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 100,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      
      if (content && content.includes('，')) {
        console.log('[豆包API] 豆包生成多组词格式:', content);
        return content;
      }
    }
  } catch (error: any) {
    console.error('[豆包API] 生成多组词失败:', error.message || error);
  }

  console.log('[豆包API] 使用本地多组词格式:', word);
  return getLocalMultiGroupFormat(word);
}

function buildSingleWordPrompt(word: string): string {
  return `请为汉字"${word}"生成2-3个常见的组词，格式：${word}，词1的词，词2的词，词3的词。每个组词都要以"${word}"开头。`;
}

function getLocalMultiGroupFormat(word: string): string {
  const multiGroupMap: Record<string, string> = {
    '天': '天，天空的天，天气的天',
    '地': '地，地面的地，土地的地',
    '人': '人，人们的人，人数的人',
    '爸': '爸，爸爸的爸',
    '妈': '妈，妈妈的妈',
    '国': '国，国家的国，祖国的国',
    '家': '家，家人的家，国家的家',
    '学': '学，学习的学，学校的学',
    '校': '校，学校的校',
    '生': '生，学生的生，生活的生活',
    '书': '书，书本的书',
    '本': '本，本子的本',
    '字': '字，生字的字',
    '文': '文，语文的文，文化的文',
    '语': '语，语文的语',
    '数': '数，数学的数',
    '日': '日，日子的日，太阳的日',
    '月': '月，月亮的月，月份的月',
    '水': '水，水果的水',
    '火': '火，火苗的火',
    '山': '山，高山的山',
    '石': '石，石头的石',
    '大': '大，大小的大，大家的大',
    '小': '小，大小的小',
    '中': '中，中国的中',
    '口': '口，门口的口',
    '手': '手，手心的手',
    '心': '心，心的心',
    '上': '上，上下的上',
    '下': '下，上下的下',
  };

  if (multiGroupMap[word]) {
    return multiGroupMap[word];
  }

  return `${word}，${word}字怎么写`;
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
            content: '你是一个专业的小学语文老师。请为学生生成适合听写的例句。格式要求：词，例句。例子：学校，我们的学校很美丽。',
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
        console.log('[豆包API] 使用豆包生成例句:', aiExample);
        return aiExample;
      }
    }
  } catch (error: any) {
    console.error('[豆包API] Chat API调用失败:', error.message || error);
  }

  console.log('[豆包API] 使用本地例句:', word);
  return getLocalFallbackExample(word);
}

function buildPrompt(word: string, grade?: number): string {
  const gradeText = grade ? `适合${grade}年级学生` : '';
  return `请为词语"${word}"${gradeText}生成一个简单的听写例句。格式：${word}，简单句。`;
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
  
  return `${word}，这个词怎么写`;
}

export async function synthesizeSpeech(text: string): Promise<ArrayBuffer | null> {
  const hasCache = await audioCache.hasCache(text);
  if (hasCache) {
    console.log('[豆包TTS] 使用缓存音频:', text);
    const cachePath = await audioCache.getAudio(text);
    if (cachePath) {
      try {
        const base64 = await (await fetch(`data:audio/mp3;base64,${await fetch(cachePath).then(r => r.text())}`)).text();
        const response = await fetch(cachePath);
        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();
        return buffer;
      } catch (error) {
        console.error('[豆包TTS] 读取缓存失败:', error);
      }
    }
  }

  if (!TTS_ACCESS_TOKEN) {
    console.log('[豆包TTS] 未配置Access Token，无法使用豆包TTS');
    return null;
  }

  try {
    console.log('[豆包TTS] 调用TTS API，输入:', text);
    
    const response = await fetch(TTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TTS_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        app: {
          cluster: TTS_CLUSTER_ID,
        },
        user: {
          uid: 'user001',
        },
        audio: {
          voice_type: 'BV001',
          encoding: 'mp3',
          speed_ratio: 1.0,
          volume_ratio: 1.0,
          pitch_ratio: 1.0,
        },
        request: {
          reqid: `req-${Date.now()}`,
          text: text,
          operation: 'query',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[豆包TTS] TTS请求失败:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    
    if (data.code === 3000 && data.data && typeof data.data === 'string') {
      const base64Data = data.data;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const buffer = byteArray.buffer;
      
      console.log('[豆包TTS] 合成成功，保存到缓存');
      await audioCache.saveAudio(text, buffer);
      
      return buffer;
    } else {
      console.error('[豆包TTS] 响应错误:', data.code, data.message);
      return null;
    }
  } catch (error: any) {
    console.error('[豆包TTS] TTS失败:', error.message || error);
    return null;
  }
}

export async function synthesizeAndCache(text: string): Promise<string | null> {
  const buffer = await synthesizeSpeech(text);
  if (buffer) {
    const cachePath = await audioCache.saveAudio(text, buffer);
    return cachePath;
  }
  return null;
}

export function getCurrentConfig() {
  return {
    hasApiKey: !!config.apiKey,
    apiKey: config.apiKey,
    model: config.model,
    ttsAccessToken: TTS_ACCESS_TOKEN,
    ttsClusterId: TTS_CLUSTER_ID,
    chatUrl: CHAT_API_URL,
    ttsUrl: TTS_API_URL,
  };
}

export { audioCache };

export default {
  configureDoubao,
  generateDictationExample,
  generateBatchDictation,
  synthesizeSpeech,
  synthesizeAndCache,
  audioCache,
  getCurrentConfig,
};
