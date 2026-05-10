import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, FontSizes, Spacing } from '../src/utils/theme';
import GradeSelector from '../src/components/GradeSelector';

export default function HomePage() {
  const [selectedGrade, setSelectedGrade] = useState<number>(3);
  const theme = Colors.light;

  const handleGradeSelect = (grade: number | null) => {
    if (grade !== null) {
      setSelectedGrade(grade);
    }
  };

  const handleDictation = (mode: string) => {
    router.push({
      pathname: '/dictation',
      params: { grade: selectedGrade.toString(), mode },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={styles.title}>汉字听写</Text>
        <Text style={styles.subtitle}>选择年级开始听写训练</Text>
      </View>

      <View style={styles.gradeSection}>
        <GradeSelector
          selectedGrade={selectedGrade}
          onSelectGrade={handleGradeSelect}
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 听写模式</Text>
          
          <TouchableOpacity
            style={[styles.dictationCard, { backgroundColor: theme.surface, borderColor: theme.primary }]}
            onPress={() => handleDictation('character')}
          >
            <View style={styles.cardIcon}>
              <Text style={styles.cardEmoji}>字</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: theme.primary }]}>单字听写</Text>
              <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                练习单个汉字的听写
              </Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dictationCard, { backgroundColor: theme.surface, borderColor: theme.primary }]}
            onPress={() => handleDictation('word')}
          >
            <View style={styles.cardIcon}>
              <Text style={styles.cardEmoji}>词</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: theme.primary }]}>词语听写</Text>
              <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                练习词语的听写
              </Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dictationCard, { backgroundColor: theme.surface, borderColor: theme.primary }]}
            onPress={() => handleDictation('sentence')}
          >
            <View style={styles.cardIcon}>
              <Text style={styles.cardEmoji}>句</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: theme.primary }]}>句子听写</Text>
              <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                练习完整句子的听写
              </Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ 其他功能</Text>
          
          <TouchableOpacity
            style={[styles.featureCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/custom-dictation')}
          >
            <Text style={styles.featureEmoji}>📝</Text>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.text }]}>自定义听写</Text>
              <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
                输入想听写的内容
              </Text>
            </View>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF8E7',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSizes.medium,
    color: '#FFE4C4',
  },
  gradeSection: {
    padding: Spacing.md,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0D5C7',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: Spacing.md,
  },
  dictationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: Spacing.md,
    backgroundColor: '#FFF',
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B0000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  cardEmoji: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
  },
  cardDesc: {
    fontSize: FontSizes.small,
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    color: '#8B0000',
    fontWeight: 'bold',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.md,
    backgroundColor: '#FFF',
  },
  featureEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
  featureDesc: {
    fontSize: FontSizes.small,
    marginTop: 2,
  },
});
