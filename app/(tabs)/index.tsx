import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/contexts/AppContext';
import { Colors, FontSizes, Spacing } from '../../src/utils/theme';
import GradeSelector from '../../src/components/GradeSelector';
import { DictationType } from '../../src/types';

const dictationTypes = [
  { key: 'character' as DictationType, label: '单字听写', description: '练习单个汉字' },
  { key: 'word' as DictationType, label: '词语听写', description: '练习词语拼写' },
  { key: 'sentence' as DictationType, label: '句子听写', description: '练习完整句子' },
];

export default function DictationHome() {
  const router = useRouter();
  const { state, startSession } = useApp();
  const { darkMode } = state.settings;
  const theme = darkMode ? Colors.dark : Colors.light;

  const [selectedType, setSelectedType] = useState<DictationType>('character');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  const handleStartDictation = () => {
    startSession(selectedType, selectedGrade || undefined);

    const params = new URLSearchParams();
    params.set('type', selectedType);
    if (selectedGrade) {
      params.set('grade', selectedGrade.toString());
    }
    router.push(`/dictation?${params.toString()}`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primary }]}>汉字听写</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          选择听写类型和年级，开始练习吧！
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>听写类型</Text>
        <View style={styles.typeGrid}>
          {dictationTypes.map((type) => (
            <TouchableOpacity
              key={type.key}
              onPress={() => setSelectedType(type.key)}
              style={[
                styles.typeCard,
                {
                  backgroundColor: selectedType === type.key ? theme.primary : theme.surface,
                  borderColor: theme.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.typeLabel,
                  { color: selectedType === type.key ? '#FFFFFF' : theme.primary },
                ]}
              >
                {type.label}
              </Text>
              <Text
                style={[
                  styles.typeDesc,
                  { color: selectedType === type.key ? '#FFFFFF99' : theme.textSecondary },
                ]}
              >
                {type.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <GradeSelector
        selectedGrade={selectedGrade}
        onSelectGrade={setSelectedGrade}
        darkMode={darkMode}
      />

      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: theme.primary }]}
        onPress={handleStartDictation}
      >
        <Text style={styles.startButtonText}>开始听写</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.customButton, { borderColor: theme.primary }]}
        onPress={() => router.push('/custom-dictation')}
      >
        <Text style={[styles.customButtonText, { color: theme.primary }]}>📝 自定义听写</Text>
        <Text style={[styles.customButtonDesc, { color: theme.textSecondary }]}>输入想要听写的内容</Text>
      </TouchableOpacity>

      {state.history.length > 0 && (
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>最近统计</Text>
          <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {state.history.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                总练习次数
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.success }]}>
                {state.wrongAnswers.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                错字数
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.xxlarge,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.medium,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  typeLabel: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  typeDesc: {
    fontSize: FontSizes.small,
    textAlign: 'center',
  },
  startButton: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.large,
    fontWeight: 'bold',
  },
  customButton: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  customButtonText: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  customButtonDesc: {
    fontSize: FontSizes.small,
  },
  statsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.lg,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.xxlarge,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: FontSizes.small,
    marginTop: Spacing.xs,
  },
});
