import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useApp } from '../../src/contexts/AppContext';
import { useSpeech } from '../../src/hooks/useSpeech';
import { Colors, FontSizes, Spacing } from '../../src/utils/theme';
import { Word } from '../../src/types';

export default function WrongAnswersScreen() {
  const { state, clearWrongAnswers } = useApp();
  const { speak } = useSpeech();
  const { darkMode } = state.settings;
  const theme = darkMode ? Colors.dark : Colors.light;

  const handleSpeak = (text: string) => {
    speak(text);
  };

  const handleClearAll = () => {
    Alert.alert(
      '清空错题本',
      '确定要清空所有错题记录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '清空',
          style: 'destructive',
          onPress: clearWrongAnswers,
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Word }) => (
    <View style={[styles.wordCard, { backgroundColor: theme.surface }]}>
      <TouchableOpacity
        style={styles.wordContent}
        onPress={() => handleSpeak(item.text)}
      >
        <Text style={[styles.wordText, { color: theme.primary }]}>{item.text}</Text>
        <Text style={[styles.speakHint, { color: theme.textSecondary }]}>点击朗读</Text>
      </TouchableOpacity>
      {item.grade && (
        <View style={[styles.gradeBadge, { backgroundColor: theme.primary + '20' }]}>
          <Text style={[styles.gradeText, { color: theme.primary }]}>
            {item.grade}年级
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.primary }]}>错题本</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            共 {state.wrongAnswers.length} 个待复习汉字
          </Text>
        </View>
        {state.wrongAnswers.length > 0 && (
          <TouchableOpacity
            style={[styles.clearButton, { borderColor: theme.error }]}
            onPress={handleClearAll}
          >
            <Text style={[styles.clearButtonText, { color: theme.error }]}>清空</Text>
          </TouchableOpacity>
        )}
      </View>

      {state.wrongAnswers.length > 0 ? (
        <FlatList
          data={state.wrongAnswers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎉</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>太棒了！</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            暂无错题，继续保持！
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxlarge,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: FontSizes.medium,
    marginTop: Spacing.xs,
  },
  clearButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  clearButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: '500',
  },
  listContent: {
    padding: Spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  wordCard: {
    width: '48%',
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  wordContent: {
    alignItems: 'center',
  },
  wordText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  speakHint: {
    fontSize: FontSizes.small,
    marginTop: Spacing.xs,
  },
  gradeBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gradeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSizes.xxlarge,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSizes.large,
    textAlign: 'center',
  },
});
