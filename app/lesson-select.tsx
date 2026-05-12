import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import GradeSelector from '../src/components/GradeSelector';
import { getLessonsByGrade } from '../src/data/wordDatabase';
import type { Lesson } from '../src/types';

export default function LessonSelectPage() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLessons = useCallback(async (grade: number) => {
    setIsLoading(true);
    const gradeLessons = getLessonsByGrade(grade);
    setLessons(gradeLessons);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadLessons(selectedGrade);
  }, [selectedGrade, loadLessons]);

  const handleGradeSelect = useCallback((grade: number | null) => {
    if (grade !== null) {
      setSelectedGrade(grade);
    }
  }, []);

  const handleLessonSelect = useCallback((lesson: Lesson) => {
    router.push({
      pathname: '/dictation',
      params: {
        grade: selectedGrade.toString(),
        mode: 'character',
        lessonId: lesson.id,
      },
    });
  }, [router, selectedGrade]);

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>选择课文</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <GradeSelector
          selectedGrade={selectedGrade}
          onSelectGrade={handleGradeSelect}
        />
        
        <Text style={styles.sectionTitle}>
          {selectedGrade}年级 - 课文列表
        </Text>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B0000" />
          </View>
        ) : (
          <ScrollView style={styles.lessonList}>
            {lessons.map((lesson, index) => renderLessonItem(lesson, index))}
          </ScrollView>
        )}
      </View>
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
  backBtn: {
    padding: 4,
  },
  backText: {
    color: '#FFF8E7',
    fontSize: 16,
  },
  headerTitle: {
    color: '#FFF8E7',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  content: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
