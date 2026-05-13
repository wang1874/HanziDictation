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
import { getLessonsByGrade } from '../src/data/wordDatabase';
import type { Lesson } from '../src/types';

export default function LessonSelectPage() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedSemester, setSelectedSemester] = useState<'上' | '下'>('上');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLessons = useCallback(async (grade: number) => {
    setIsLoading(true);
    const gradeLessons = getLessonsByGrade(grade);
    // 根据学期筛选课程
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

  React.useEffect(() => {
    loadLessons(selectedGrade);
  }, [selectedGrade, loadLessons]);

  const grades = [1, 2, 3, 4, 5, 6];

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
        {/* 年级选择 */}
        <View style={styles.gradeSection}>
          <Text style={styles.sectionLabel}>选择年级</Text>
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
          {selectedGrade}年级{selectedSemester}册 - 课文列表
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B0000" />
          </View>
        ) : (
          <ScrollView style={styles.lessonList}>
            {lessons.map((lesson, index) => renderLessonItem(lesson, index))}
            {lessons.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>该年级暂无课程</Text>
              </View>
            )}
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
  gradeSection: {
    marginBottom: 12,
  },
  sectionLabel: {
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
