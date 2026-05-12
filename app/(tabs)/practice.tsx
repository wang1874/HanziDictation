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
import { getLessonsByGrade, Lesson } from '../../src/data/wordDatabase';
import { useSpeech } from '../../src/hooks/useSpeech';

export default function PracticePage() {
  const { speak } = useSpeech();
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [examples, setExamples] = useState<Map<string, string>>(new Map());
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  const handleGradeSelect = (grade: number | null) => {
    if (grade !== null) {
      setSelectedGrade(grade);
      setSelectedLesson(null);
    }
  };

  const lessons = getLessonsByGrade(selectedGrade);

  const loadExample = useCallback(async (wordText: string, grade?: number) => {
    if (!examples.has(wordText)) {
      const { generateDictationExample } = await import('../../src/services/doubaoService');
      const example = await generateDictationExample(wordText, grade);
      setExamples(prev => new Map(prev).set(wordText, example));
    }
  }, [examples]);

  const handleSpeak = useCallback(async (wordText: string, grade?: number) => {
    if (isSpeaking === wordText) return;
    
    setIsSpeaking(wordText);
    await loadExample(wordText, grade);
    const example = examples.get(wordText) || wordText;
    speak(example);
    
    setTimeout(() => setIsSpeaking(null), 1000);
  }, [examples, loadExample, speak, isSpeaking]);

  if (!selectedLesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>课文练习</Text>
          <Text style={styles.headerSubtitle}>选择年级和课文开始练习</Text>
        </View>

        <View style={styles.gradeSection}>
          <Text style={styles.sectionLabel}>选择年级</Text>
          <GradeSelector
            selectedGrade={selectedGrade}
            onSelectGrade={handleGradeSelect}
          />
        </View>

        <ScrollView style={styles.lessonList}>
          <Text style={styles.sectionLabel}>选择课文</Text>
          {lessons.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>该年级暂无课文</Text>
            </View>
          ) : (
            lessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonItem}
                onPress={() => setSelectedLesson(lesson)}
              >
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonUnit}>第{lesson.unit}单元</Text>
                </View>
                <View style={styles.lessonWordCount}>
                  <Text style={styles.lessonWordCountText}>{lesson.words.length}个</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedLesson(null)}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedLesson.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {selectedGrade}年级 · 共 {selectedLesson.words.length} 个内容
        </Text>
      </View>

      <ScrollView style={styles.wordList}>
        <View style={styles.wordGrid}>
          {selectedLesson.words.map((word, index) => (
            <TouchableOpacity
              key={`${word.id}-${index}`}
              style={[styles.wordCard, isSpeaking === word.text && styles.wordCardActive]}
              onPress={() => handleSpeak(word.text, selectedGrade)}
              disabled={isSpeaking !== null && isSpeaking !== word.text}
              activeOpacity={0.7}
            >
              <Text style={[styles.wordText, isSpeaking === word.text && styles.wordTextActive]}>{word.text}</Text>
              {word.pinyin && (
                <Text style={[styles.pinyinText, isSpeaking === word.text && styles.pinyinTextActive]}>{word.pinyin}</Text>
              )}
              {isSpeaking === word.text && (
                <View style={styles.speakingIndicator}>
                  <ActivityIndicator size="small" color="#FFF8E7" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    color: '#FFF8E7',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF8E7',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFE4C4',
    marginTop: 4,
  },
  placeholder: {
    width: 50,
  },
  gradeSection: {
    padding: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0D5C7',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  lessonList: {
    flex: 1,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D5C7',
    backgroundColor: '#FFF',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  lessonUnit: {
    fontSize: 14,
    color: '#666',
  },
  lessonWordCount: {
    backgroundColor: '#8B0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  lessonWordCountText: {
    color: '#FFF8E7',
    fontWeight: 'bold',
  },
  statsBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF8E7',
  },
  statsText: {
    fontSize: 14,
    color: '#8B0000',
    fontWeight: 'bold',
  },
  wordList: {
    flex: 1,
  },
  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  wordCard: {
    width: '47%',
    margin: '1.5%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  wordCardActive: {
    backgroundColor: '#8B0000',
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  wordTextActive: {
    color: '#FFF8E7',
  },
  pinyinText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  pinyinTextActive: {
    color: '#FFE4C4',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  speakingIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
