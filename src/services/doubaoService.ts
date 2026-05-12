// 豆包API服务 - 智能生成例句
// 注意：你需要先获取豆包API密钥并配置

const API_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3'; // 豆包API地址
const DEFAULT_MODEL = 'ep-20241213164445-pk5jx'; // 使用合适的模型

export interface DoubaoConfig {
  apiKey?: string;
  model?: string;
}

let config: DoubaoConfig = {
  model: DEFAULT_MODEL,
};

/**
 * 配置豆包API
 */
export function configureDoubao(newConfig: DoubaoConfig) {
  config = { ...config, ...newConfig };
}

/**
 * 为汉字/词语生成听写例句
 * @param word 要听写的字/词
 * @param grade 年级（可选）
 * @returns 生成的例句，格式如 "字，词语的字"
 */
export async function generateDictationExample(
  word: string,
  grade?: number
): Promise<string> {
  try {
    // 如果没有配置API密钥，使用本地生成的简单例句作为备用
    if (!config.apiKey) {
      return generateLocalExample(word);
    }

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
            content: '你是一个小学语文老师，专门帮助学生进行汉字听写。请为给定的字或词生成适合听写的例句。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    const example = data.choices?.[0]?.message?.content?.trim();

    // 确保返回的格式符合要求
    return formatExample(example, word);
  } catch (error) {
    console.error('调用豆包API失败:', error);
    // API失败时使用本地备用方案
    return generateLocalExample(word);
  }
}

/**
 * 构建提示词
 */
function buildPrompt(word: string, grade?: number): string {
  const gradeInfo = grade ? `适合${grade}年级学生` : '';
  
  if (word.length === 1) {
    return `请为汉字"${word}"${gradeInfo}生成一个听写例句，格式严格为："${word}，词语的${word}"。例如："国，国家的国"。只返回例句本身，不要有其他内容。`;
  } else {
    return `请为词语"${word}"${gradeInfo}生成一个听写例句，格式严格为："${word}，包含这个词的短句"。例如："国家，我们的国家很美丽"。只返回例句本身，不要有其他内容。`;
  }
}

/**
 * 格式化例句，确保符合要求的格式
 */
function formatExample(example: string, word: string): string {
  // 清理多余的引号和空格
  let cleaned = example.replace(/[""]/g, '').trim();
  
  // 如果已经包含逗号，则直接返回
  if (cleaned.includes('，') || cleaned.includes(',')) {
    return cleaned.replace(/,/g, '，');
  }
  
  // 否则添加逗号和简单的说明
  if (word.length === 1) {
    return `${word}，${word}字的${word}`;
  } else {
    return `${word}，我们学习${word}`;
  }
}

/**
 * 本地备用方案：简单生成例句
 */
function generateLocalExample(word: string): string {
  if (word.length === 1) {
    // 单字
    const commonWords = [
      '的', '一', '是', '在', '不', '了', '有', '和', '人', '这',
      '中', '大', '为', '上', '个', '国', '我', '以', '要', '他',
    ];
    const randomWord = commonWords[Math.floor(Math.random() * commonWords.length)];
    return `${word}，${word}${randomWord}的${word}`;
  } else {
    // 词语
    return `${word}，我们喜欢${word}`;
  }
}

export default {
  configureDoubao,
  generateDictationExample,
};
