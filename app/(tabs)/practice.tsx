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
import GradeSelector from '../../src/components/GradeSelector';
import { getLessonsByGrade } from '../../src/data/wordDatabase';
import type { Lesson } from '../../src/types';
import { useSpeech } from '../../src/hooks/useSpeech';

export default function PracticePage() {
  const { speak } = useSpeech();
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [examples, setExamples] = useState<Map<string, string>>(new Map());
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLessons = useCallback(async (grade: number) => {
    setIsLoading(true);
    const { getLessonsByGrade } = await import('../../src/data/wordDatabase');
    const gradeLessons = getLessonsByGrade(grade);
    setLessons(gradeLessons);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadLessons(selectedGrade);
  }, [selectedGrade, loadLessons]);

  const handleGradeSelect = useCallback((grade: number | null) => {
    if (grade !== null) {
      setSelectedGrade(grade);
      setSelectedLesson(null);
    }
  }, []);

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
          <GradeSelector
            selectedGrade={selectedGrade}
            onSelectGrade={handleGradeSelect}
          />
          
          <Text style={styles.sectionTitle}>
            {selectedGrade}年级 - 选择课文
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
  },
  wordCardSpeaking: {
    backgroundColor: '#FFE4C4',
    borderColor: '#FF4500',
  },
  wordText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  speakIndicator: {
    marginTop: 8,
  },
  speakIcon: {
    fontSize: 20,
  },
});
