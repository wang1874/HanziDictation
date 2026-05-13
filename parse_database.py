#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
解析汉字听写数据库文件并生成TypeScript代码
"""

import re

# 拼音映射表
PINYIN_MAP = {
    '一': 'yī', '二': 'èr', '三': 'sān', '四': 'sì', '五': 'wǔ',
    '六': 'liù', '七': 'qī', '八': 'bā', '九': 'jiǔ', '十': 'shí',
    '百': 'bǎi', '千': 'qiān', '万': 'wàn', '上': 'shàng', '下': 'xià',
    '左': 'zuǒ', '右': 'yòu', '前': 'qián', '后': 'hòu', '里': 'lǐ',
    '外': 'wài', '中': 'zhōng', '间': 'jiān', '天': 'tiān', '地': 'dì',
    '人': 'rén', '你': 'nǐ', '我': 'wǒ', '他': 'tā', '她': 'tā',
    '它': 'tā', '们': 'men', '大': 'dà', '小': 'xiǎo', '多': 'duō',
    '少': 'shǎo', '高': 'gāo', '矮': 'ǎi', '长': 'cháng', '短': 'duǎn',
    '胖': 'pàng', '瘦': 'shòu', '老': 'lǎo', '日': 'rì', '月': 'yuè',
    '水': 'shuǐ', '火': 'huǒ', '山': 'shān', '石': 'shí', '田': 'tián',
    '土': 'tǔ', '木': 'mù', '林': 'lín', '森': 'sēn', '花': 'huā',
    '草': 'cǎo', '虫': 'chóng', '鱼': 'yú', '鸟': 'niǎo', '口': 'kǒu',
    '耳': 'ěr', '目': 'mù', '手': 'shǒu', '足': 'zú', '头': 'tóu',
    '发': 'fà', '脸': 'liǎn', '眼': 'yǎn', '睛': 'jīng', '爸': 'bà',
    '妈': 'mā', '哥': 'gē', '姐': 'jiě', '弟': 'dì', '妹': 'mèi',
    '儿': 'ér', '子': 'zi', '书': 'shū', '本': 'běn', '笔': 'bǐ',
    '纸': 'zhǐ', '桌': 'zhuō', '椅': 'yǐ', '门': 'mén', '窗': 'chuāng',
    '房': 'fáng', '屋': 'wū', '家': 'jiā', '校': 'xiào', '学': 'xué',
    '生': 'shēng', '春': 'chūn', '夏': 'xià', '秋': 'qiū', '冬': 'dōng',
    '风': 'fēng', '雨': 'yǔ', '雪': 'xuě', '云': 'yún', '红': 'hóng',
    '黄': 'huáng', '蓝': 'lán', '绿': 'lǜ', '白': 'bái', '黑': 'hēi',
    '是': 'shì', '有': 'yǒu', '无': 'wú', '在': 'zài', '去': 'qù',
    '来': 'lái', '走': 'zǒu', '看': 'kàn', '听': 'tīng', '说': 'shuō',
    '读': 'dú', '写': 'xiě', '吃': 'chī', '喝': 'hē', '睡': 'shuì',
    '想': 'xiǎng', '做': 'zuò', '工': 'gōng', '好': 'hǎo', '坏': 'huài',
    '美': 'měi', '新': 'xīn', '旧': 'jiù', '快': 'kuài', '慢': 'màn',
    '禾': 'hé', '了': 'le', '可': 'kě', '不': 'bù', '也': 'yě',
    '都': 'dōu', '就': 'jiù', '才': 'cái', '还': 'hái', '已': 'yǐ',
    '同': 'tóng', '友': 'yǒu', '伴': 'bàn', '伙': 'huǒ',
}

def get_pinyin(char):
    """获取汉字的拼音"""
    if char in PINYIN_MAP:
        return PINYIN_MAP[char]
    # 对于没有拼音的，先返回字符本身
    return char

def parse_file(file_path):
    """解析文件内容"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    grade_data = {}
    current_grade = None
    
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        grade_match = re.match(r'^([一二三四五六])年级([上下])册：$', line)
        if grade_match:
            grade_num = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6}[grade_match.group(1)]
            semester = grade_match.group(2)
            grade_key = f'{grade_num}_{semester}'
            current_grade = {'num': grade_num, 'semester': semester, 'lessons': []}
            grade_data[grade_key] = current_grade
            continue
            
        if current_grade and line.startswith('《') and '》' in line:
            title_match = re.match(r'^《(.*?)》：(.*)$', line)
            if title_match:
                title = title_match.group(1)
                chars_str = title_match.group(2).strip()
                
                chars = []
                if chars_str != '无' and '无（略读课文，无会写字）' not in chars_str:
                    chars = chars_str.split('、')
                
                current_grade['lessons'].append({
                    'title': title,
                    'chars': chars
                })
    
    return grade_data

def generate_typescript(grade_data):
    """生成TypeScript代码"""
    ts_code = []
    
    ts_code.append('import { Word, Lesson } from "../types";')
    ts_code.append('')
    ts_code.append('// 生成唯一ID的辅助函数')
    ts_code.append('function generateId(): string {')
    ts_code.append('  return Math.random().toString(36).substring(2, 15);')
    ts_code.append('}')
    ts_code.append('')
    ts_code.append('// 创建Word对象的辅助函数')
    ts_code.append('function createWord(')
    ts_code.append('  text: string,')
    ts_code.append('  pinyin: string,')
    ts_code.append("  type: 'character' | 'word' = 'character',")
    ts_code.append('  grade?: number')
    ts_code.append('): Word {')
    ts_code.append('  return {')
    ts_code.append('    id: generateId(),')
    ts_code.append('    text,')
    ts_code.append('    pinyin,')
    ts_code.append('    type,')
    ts_code.append('    grade,')
    ts_code.append('  };')
    ts_code.append('}')
    
    for grade_key, data in sorted(grade_data.items()):
        grade_num = data['num']
        semester = data['semester']
        lessons = data['lessons']
        
        var_name = f'grade{grade_num}{"b" if semester == "下" else ""}Lessons'
        ts_code.append('')
        ts_code.append(f'// ============ {grade_num}年级{semester}册 ============')
        ts_code.append(f'export const {var_name}: Lesson[] = [')
        
        for i, lesson in enumerate(lessons, 1):
            lesson_id = f'{grade_num}{"b" if semester == "下" else ""}-{i}'
            ts_code.append('  {')
            ts_code.append(f"    id: '{lesson_id}',")
            ts_code.append(f'    title: "{lesson["title"]}",')
            ts_code.append(f'    grade: {grade_num},')
            ts_code.append(f'    unit: {(i-1)//5 + 1},')
            
            if lesson['chars']:
                ts_code.append('    words: [')
                for char in lesson['chars']:
                    if char:
                        pinyin = get_pinyin(char)
                        ts_code.append(f"      createWord('{char}', '{pinyin}', 'character', {grade_num}),")
                ts_code.append('    ],')
            else:
                ts_code.append('    words: [],')
            
            ts_code.append('  },')
        
        ts_code.append('];')
    
    ts_code.append('')
    ts_code.append('// 获取某年级的所有课程')
    ts_code.append('export function getLessonsByGrade(grade: number): Lesson[] {')
    ts_code.append('  switch (grade) {')
    ts_code.append('    case 1:')
    ts_code.append('      return [...grade1Lessons, ...grade1bLessons];')
    ts_code.append('    case 2:')
    ts_code.append('      return [...grade2Lessons, ...grade2bLessons];')
    ts_code.append('    case 3:')
    ts_code.append('      return [...grade3Lessons, ...grade3bLessons];')
    ts_code.append('    case 4:')
    ts_code.append('      return [...grade4Lessons, ...grade4bLessons];')
    ts_code.append('    case 5:')
    ts_code.append('      return [...grade5Lessons, ...grade5bLessons];')
    ts_code.append('    case 6:')
    ts_code.append('      return [...grade6Lessons, ...grade6bLessons];')
    ts_code.append('    default:')
    ts_code.append('      return [];')
    ts_code.append('  }')
    ts_code.append('}')
    ts_code.append('')
    ts_code.append('// 获取某课的所有词语')
    ts_code.append('export function getWordsByLesson(lessonId: string): Word[] {')
    ts_code.append('  const allLessons = [')
    ts_code.append('    ...grade1Lessons, ...grade1bLessons,')
    ts_code.append('    ...grade2Lessons, ...grade2bLessons,')
    ts_code.append('    ...grade3Lessons, ...grade3bLessons,')
    ts_code.append('    ...grade4Lessons, ...grade4bLessons,')
    ts_code.append('    ...grade5Lessons, ...grade5bLessons,')
    ts_code.append('    ...grade6Lessons, ...grade6bLessons,')
    ts_code.append('  ];')
    ts_code.append('  const lesson = allLessons.find(l => l.id === lessonId);')
    ts_code.append('  return lesson ? lesson.words : [];')
    ts_code.append('}')
    ts_code.append('')
    ts_code.append('// 获取某年级的所有词语')
    ts_code.append('export function getWordsByGrade(grade: number): Word[] {')
    ts_code.append('  const lessons = getLessonsByGrade(grade);')
    ts_code.append('  return lessons.flatMap(lesson => lesson.words);')
    ts_code.append('}')
    ts_code.append('')
    ts_code.append('// 获取所有词语')
    ts_code.append('export function getAllWords(): Word[] {')
    ts_code.append('  return [')
    ts_code.append('    ...getWordsByGrade(1),')
    ts_code.append('    ...getWordsByGrade(2),')
    ts_code.append('    ...getWordsByGrade(3),')
    ts_code.append('    ...getWordsByGrade(4),')
    ts_code.append('    ...getWordsByGrade(5),')
    ts_code.append('    ...getWordsByGrade(6),')
    ts_code.append('  ];')
    ts_code.append('}')
    ts_code.append('')
    ts_code.append('// 获取例句（现在调用豆包API）')
    ts_code.append('export async function getSentenceForWord(word: Word): Promise<string> {')
    ts_code.append('  const { generateDictationExample } = await import("../services/doubaoService");')
    ts_code.append('  return generateDictationExample(word.text, word.grade);')
    ts_code.append('}')
    ts_code.append('')
    ts_code.append('export default {')
    ts_code.append('  getLessonsByGrade,')
    ts_code.append('  getWordsByLesson,')
    ts_code.append('  getWordsByGrade,')
    ts_code.append('  getAllWords,')
    ts_code.append('  getSentenceForWord,')
    ts_code.append('};')
    
    return '\n'.join(ts_code)

def main():
    file_path = 'deepseek_txt_20260513_2bb2cc.txt'
    grade_data = parse_file(file_path)
    
    ts_code = generate_typescript(grade_data)
    
    with open('src/data/wordDatabase.ts', 'w', encoding='utf-8') as f:
        f.write(ts_code)
    
    print('✅ wordDatabase.ts 已成功生成！')
    print(f'📊 解析结果：')
    for key, data in sorted(grade_data.items()):
        print(f'   {data["num"]}年级{data["semester"]}册: {len(data["lessons"])}课')

if __name__ == '__main__':
    main()
