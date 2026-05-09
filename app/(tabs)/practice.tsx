import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useApp } from '../../src/contexts/AppContext';
import { useSpeech } from '../../src/hooks/useSpeech';
import { Colors, FontSizes, Spacing } from '../../src/utils/theme';
import { getRandomWords, getAllWords } from '../../src/data/wordDatabase';
import { Word } from '../../src/types';

export default function PracticeScreen() {
  const { state } = useApp();
  const { speak } = useSpeech();
  const { darkMode } = state.settings;
  const theme = darkMode ? Colors.dark : Colors.light;

  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);

  useEffect(() => {
    loadNewWord();
  }, []);

  const loadNewWord = () => {
    const words = getRandomWords(1);
    setCurrentWord(words[0]);
    setShowAnswer(false);
    speak(words[0].text);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNext = () => {
    setLearnedCount(prev => prev + 1);
    loadNewWord();
  };

  const handleSpeak = () => {
    if (currentWord) {
      speak(currentWord.text);
    }
  };

  if (!currentWord) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primary }]}>自由练习</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          随时学习，重复练习
        </Text>
      </View>

      <View style={styles.statsBar}>
        <View style={[styles.statBadge, { backgroundColor: theme.surface }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>{learnedCount}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>已学习</Text>
        </View>
        <View style={[styles.statBadge, { backgroundColor: theme.surface }]}>
          <Text style={[styles.statNumber, { color: theme.accent }]}>
            {state.wrongAnswers.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>待复习</Text>
        </View>
      </View>

      <View style={styles.cardSection}>
        <View style={[styles.wordCard, { backgroundColor: theme.surface }]}>
          <TouchableOpacity style={styles.speakButton} onPress={handleSpeak}>
            <Text style={styles.speakIcon}>🔊</Text>
          </TouchableOpacity>

          {showAnswer ? (
            <Text style={[styles.wordText, { color: theme.primary }]}>
              {currentWord.text}
            </Text>
          ) : (
            <View style={styles.hiddenWord}>
              <Text style={[styles.questionMark, { color: theme.textSecondary }]}>？</Text>
              <Text style={[styles.tapHint, { color: theme.textSecondary }]}>
                点击下方按钮显示答案
              </Text>
            </View>
          )}

          {currentWord.grade && (
            <View style={[styles.gradeTag, { backgroundColor: theme.primary + '20' }]}>
              <Text style={[styles.gradeText, { color: theme.primary }]}>
                小学{currentWord.grade}年级
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          {!showAnswer ? (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={handleShowAnswer}
            >
              <Text style={styles.actionButtonText}>显示答案</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.success }]}
              onPress={handleNext}
            >
              <Text style={styles.actionButtonText}>下一个</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tips}>
        <Text style={[styles.tipsTitle, { color: theme.text }]}>学习小贴士</Text>
        <View style={[styles.tipCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            📖 多听多读，熟悉汉字的发音和书写
          </Text>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            ✍️ 对照答案，检查自己的书写是否正确
          </Text>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            🔄 重复练习，巩固记忆
          </Text>
        </View>
      </View>
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
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.medium,
  },
  loadingText: {
    fontSize: FontSizes.large,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  statBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  statNumber: {
    fontSize: FontSizes.xxlarge,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: FontSizes.small,
    marginTop: Spacing.xs,
  },
  cardSection: {
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  wordCard: {
    width: '100%',
    padding: Spacing.xl,
    borderRadius: 20,
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center',
  },
  speakButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    padding: Spacing.sm,
  },
  speakIcon: {
    fontSize: 32,
  },
  wordText: {
    fontSize: 72,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hiddenWord: {
    alignItems: 'center',
  },
  questionMark: {
    fontSize: 72,
    fontWeight: 'bold',
  },
  tapHint: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.medium,
  },
  gradeTag: {
    position: 'absolute',
    bottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  gradeText: {
    fontSize: FontSizes.small,
    fontWeight: '500',
  },
  actions: {
    marginTop: Spacing.lg,
    width: '100%',
  },
  actionButton: {
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.large,
    fontWeight: '600',
  },
  tips: {
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  tipsTitle: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  tipCard: {
    padding: Spacing.md,
    borderRadius: 12,
  },
  tipText: {
    fontSize: FontSizes.medium,
    marginBottom: Spacing.sm,
    lineHeight: 24,
  },
});
