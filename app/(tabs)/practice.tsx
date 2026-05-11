import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import WordCard from '../../src/components/WordCard';
import GradeSelector from '../../src/components/GradeSelector';
import { getWordsByGrade } from '../../src/data/wordDatabase';
import { useSpeech } from '../../src/hooks/useSpeech';

export default function PracticePage() {
  const { speak } = useSpeech();
  const [selectedGrade, setSelectedGrade] = useState<number>(1);

  const handleGradeSelect = (grade: number | null) => {
    if (grade !== null) {
      setSelectedGrade(grade);
    }
  };

  const handleSpeak = (text: string) => {
    speak(text);
  };

  const words = getWordsByGrade(selectedGrade);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>自由练习</Text>
        <Text style={styles.headerSubtitle}>选择一个年级开始练习</Text>
      </View>

      <View style={styles.gradeSection}>
        <GradeSelector
          selectedGrade={selectedGrade}
          onSelectGrade={handleGradeSelect}
        />
      </View>

      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {selectedGrade}年级 共 {words.length} 个内容
        </Text>
      </View>

      <ScrollView style={styles.wordList}>
        <View style={styles.wordGrid}>
          {words.slice(0, 30).map((word, index) => (
            <WordCard
              key={`${word.id}-${index}`}
              word={word}
              onSpeak={handleSpeak}
            />
          ))}
        </View>
        {words.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>该年级暂无内容</Text>
          </View>
        )}
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
    padding: 20,
    backgroundColor: '#8B0000',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF8E7',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFE4C4',
  },
  gradeSection: {
    padding: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0D5C7',
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
});
