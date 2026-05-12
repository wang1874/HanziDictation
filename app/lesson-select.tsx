import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, FontSizes, Spacing } from '../src/utils/theme';
import GradeSelector from '../src/components/GradeSelector';
import { getLessonsByGrade, Lesson } from '../src/data/wordDatabase';

export default function LessonSelectPage() {
  const [selectedGrade, setSelectedGrade] = useState<number>(3);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const theme = Colors.light;

  const handleGradeSelect = (grade: number | null) => {
    if (grade !== null) {
      setSelectedGrade(grade);
      const gradeLessons = getLessonsByGrade(grade);
      setLessons(gradeLessons);
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    router.push({
      pathname: '/dictation',
      params: { grade: selectedGrade.toString(), mode: 'character', lessonId: lesson.id },
    });
  };

  // 初始化加载课程
  useEffect(() => {
    const gradeLessons = getLessonsByGrade(selectedGrade);
    setLessons(gradeLessons);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>课文听写</Text>
        <View style={styles.placeholder} />
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
            <Text style={styles.emptyText}>该年级暂无课文内容</Text>
          </View>
        ) : (
          lessons.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonItem}
              onPress={() => handleSelectLesson(lesson)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: '#8B0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    color: '#FFF8E7',
    fontSize: FontSizes.medium,
  },
  headerTitle: {
    fontSize: FontSizes.xlarge,
    fontWeight: 'bold',
    color: '#FFF8E7',
  },
  placeholder: {
    width: 60,
  },
  gradeSection: {
    padding: Spacing.md,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0D5C7',
  },
  sectionLabel: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  lessonList: {
    flex: 1,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D5C7',
    backgroundColor: '#FFF',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  lessonUnit: {
    fontSize: FontSizes.small,
    color: '#666',
  },
  lessonWordCount: {
    backgroundColor: '#8B0000',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  lessonWordCountText: {
    color: '#FFF8E7',
    fontWeight: 'bold',
    fontSize: FontSizes.small,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: FontSizes.medium,
    color: '#999',
  },
});
