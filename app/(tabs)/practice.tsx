import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getLessonsByGrade } from '../../src/data/wordDatabase';
import type { Lesson } from '../../src/types';
import { useSpeech } from '../../src/hooks/useSpeech';

const pinyinMap: Record<string, string> = {
  '一': 'yī', '二': 'èr', '三': 'sān', '四': 'sì', '五': 'wǔ',
  '六': 'liù', '七': 'qī', '八': 'bā', '九': 'jiǔ', '十': 'shí',
  '爸': 'bà', '妈': 'mā', '爷': 'yé', '奶': 'nǎi', '哥': 'gē',
  '姐': 'jiě', '弟': 'dì', '妹': 'mèi', '土': 'tǔ', '地': 'dì',
  '国': 'guó', '民': 'mín', '学': 'xué', '校': 'xiào', '师': 'shī',
  '生': 'shēng', '本': 'běn', '书': 'shū', '字': 'zì', '文': 'wén',
  '语': 'yǔ', '数': 'shù', '音': 'yīn', '乐': 'lè', '美': 'měi',
  '天': 'tiān', '上': 'shàng', '下': 'xià', '大': 'dà', '小': 'xiǎo',
  '人': 'rén', '中': 'zhōng', '口': 'kǒu', '手': 'shǒu', '日': 'rì',
  '月': 'yuè', '水': 'shuǐ', '火': 'huǒ', '山': 'shān', '石': 'shí',
  '田': 'tián', '禾': 'hé', '云': 'yún', '风': 'fēng', '雨': 'yǔ',
  '春': 'chūn', '夏': 'xià', '秋': 'qiū', '冬': 'dōng', '花': 'huā',
  '草': 'cǎo', '树': 'shù', '林': 'lín', '森': 'sēn', '鸟': 'niǎo',
  '虫': 'chóng', '鱼': 'yú', '马': 'mǎ', '牛': 'niú', '羊': 'yáng',
  '猪': 'zhū', '狗': 'gǒu', '猫': 'māo', '兔': 'tù', '飞': 'fēi',
  '跑': 'pǎo', '跳': 'tiào', '游': 'yóu', '走': 'zǒu', '来': 'lái',
  '去': 'qù', '看': 'kàn', '听': 'tīng', '说': 'shuō', '读': 'dú',
  '爱': 'ài', '心': 'xīn', '思': 'sī', '想': 'xiǎng', '知': 'zhī',
  '道': 'dào', '习': 'xí', '写': 'xiě', '词': 'cí', '作': 'zuò',
  '捉': 'zhuō', '条': 'tiáo', '爬': 'pá', '姐': 'jiě', '您': 'nín',
  '草': 'cǎo', '房': 'fáng',
};

const getPinyin = (text: string): string => {
  let pinyin = '';
  for (const char of text) {
    if (pinyinMap[char]) {
      pinyin += pinyinMap[char] + ' ';
    } else {
      pinyin += char + ' ';
    }
  }
  return pinyin.trim();
};

export default function PracticePage() {
  const { speak } = useSpeech();
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedSemester, setSelectedSemester] = useState<'上' | '下'>('上');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [examples, setExamples] = useState<Map<string, string>>(new Map());
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLessons = useCallback(async (grade: number) => {
    setIsLoading(true);
    const gradeLessons = getLessonsByGrade(grade);
    const filteredLessons = gradeLessons.filter(lesson => {
      if (selectedSemester === '上') {
        return !lesson.id.includes('b');
      } else {
        return lesson.id.includes('b');
      }
    });
    setLessons(filteredLessons);
    setIsLoading(false);
  }, [selectedSemester]);

  useEffect(() => {
    loadLessons(selectedGrade);
  }, [selectedGrade, loadLessons]);

  const grades = [1, 2, 3, 4, 5, 6];

  const handleLessonSelect = useCallback((lesson: Lesson) => {
    setSelectedLesson(lesson);
    setExamples(new Map());
  }, []);

  const handleSpeakWord = useCallback(async (word: string) => {
    setIsSpeaking(word);
    try {
      const { generateDictationExample } = await import('../../src/services/doubaoService');
      let example = examples.get(word);
      if (!example) {
        example = await generateDictationExample(word);
        setExamples(prev => new Map(prev).set(word, example!));
      }
      speak(example);
    } catch (error) {
      console.error('播放失败:', error);
      speak(word);
    }
    setTimeout(() => setIsSpeaking(null), 2000);
  }, [examples, speak]);

  const renderLessonItem = (lesson: Lesson, index: number) => (
    <TouchableOpacity
      key={lesson.id}
      style={styles.lessonItem}
      onPress={() => handleLessonSelect(lesson)}
    >
      <View style={styles.lessonIcon}>
        <Text style={styles.lessonIconText}>{index + 1}</Text>
      </View>
      <View style={styles.lessonInfo}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonMeta}>
          {lesson.words.length}个生字词
        </Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  const renderWordCard = (item: { text: string }, index: number) => (
    <TouchableOpacity
      key={`${item.text}-${index}`}
      style={[styles.wordCard, isSpeaking === item.text && styles.wordCardSpeaking]}
      onPress={() => handleSpeakWord(item.text)}
      disabled={isSpeaking !== null}
    >
      <Text style={styles.wordPinyin}>{getPinyin(item.text)}</Text>
      <Text style={styles.wordText}>{item.text}</Text>
      <View style={styles.speakIndicator}>
        <Text style={styles.speakIcon}>
          {isSpeaking === item.text ? '🔊' : '🔈'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📖 练习</Text>
      </View>

      {!selectedLesson && (
        <View style={styles.gradeSection}>
          {/* 年级选择 */}
          <View style={styles.gradeSelector}>
            <Text style={styles.gradeLabel}>选择年级</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.gradeScroll}
            >
              <View style={styles.gradeButtons}>
                {grades.map(grade => (
                  <TouchableOpacity
                    key={grade}
                    onPress={() => setSelectedGrade(grade)}
                    style={[
                      styles.gradeButton,
                      selectedGrade === grade && styles.gradeButtonSelected,
                    ]}
                  >
                    <Text style={[
                      styles.gradeButtonText,
                      selectedGrade === grade && styles.gradeButtonTextSelected,
                    ]}>
                      {grade}年级
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* 学期选择 */}
          <View style={styles.semesterSection}>
            <TouchableOpacity
              onPress={() => setSelectedSemester('上')}
              style={[
                styles.semesterButton,
                selectedSemester === '上' && styles.semesterButtonSelected,
              ]}
            >
              <Text style={[
                styles.semesterButtonText,
                selectedSemester === '上' && styles.semesterButtonTextSelected,
              ]}>
                上册
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedSemester('下')}
              style={[
                styles.semesterButton,
                selectedSemester === '下' && styles.semesterButtonSelected,
              ]}
            >
              <Text style={[
                styles.semesterButtonText,
                selectedSemester === '下' && styles.semesterButtonTextSelected,
              ]}>
                下册
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>
            {selectedGrade}年级{selectedSemester}册 - 选择课文
          </Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="#8B0000" />
          ) : (
            <ScrollView style={styles.lessonList}>
              {lessons.map((lesson, index) => renderLessonItem(lesson, index))}
            </ScrollView>
          )}
        </View>
      )}

      {selectedLesson && (
        <View style={styles.lessonContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedLesson(null)}
          >
            <Text style={styles.backButtonText}>← 返回课文列表</Text>
          </TouchableOpacity>

          <Text style={styles.currentLessonTitle}>{selectedLesson.title}</Text>
          <Text style={styles.wordCount}>
            共 {selectedLesson.words.length} 个生字词
          </Text>

          <Text style={styles.instruction}>
            点击卡片听发音
          </Text>

          <ScrollView style={styles.wordGrid}>
            <View style={styles.wordGridContainer}>
              {selectedLesson.words.map((item, index) => renderWordCard(item, index))}
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5E6',
  },
  header: {
    padding: 16,
    backgroundColor: '#8B0000',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF8E7',
  },
  gradeSection: {
    flex: 1,
    padding: 16,
  },
  gradeSelector: {
    marginBottom: 12,
  },
  gradeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  gradeScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  gradeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  gradeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  gradeButtonSelected: {
    backgroundColor: '#8B0000',
    borderColor: '#8B0000',
  },
  gradeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  gradeButtonTextSelected: {
    color: '#FFF',
  },
  semesterSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  semesterButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#8B0000',
    alignItems: 'center',
  },
  semesterButtonSelected: {
    backgroundColor: '#8B0000',
    borderColor: '#8B0000',
  },
  semesterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  semesterButtonTextSelected: {
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B0000',
    marginTop: 16,
    marginBottom: 12,
  },
  lessonList: {
    flex: 1,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  lessonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE4C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lessonMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  arrow: {
    fontSize: 24,
    color: '#8B0000',
  },
  lessonContent: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#8B0000',
    fontWeight: 'bold',
  },
  currentLessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B0000',
    textAlign: 'center',
    marginBottom: 8,
  },
  wordCount: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  instruction: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
  },
  wordGrid: {
    flex: 1,
  },
  wordGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  wordCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B0000',
    marginBottom: 12,
    padding: 8,
  },
  wordCardSpeaking: {
    backgroundColor: '#FFE4C4',
    borderColor: '#FF4500',
  },
  wordPinyin: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  wordText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B0000',
    textAlign: 'center',
  },
  speakIndicator: {
    marginTop: 8,
  },
  speakIcon: {
    fontSize: 20,
  },
});
