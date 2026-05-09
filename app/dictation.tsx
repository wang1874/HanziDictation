import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../src/contexts/AppContext';
import { useSpeech } from '../src/hooks/useSpeech';
import { Colors, FontSizes, Spacing } from '../src/utils/theme';
import WordCard from '../src/components/WordCard';
import DrawingCanvas from '../src/components/DrawingCanvas';
import { getRandomWords, getRandomSentences, getSentences } from '../src/data/wordDatabase';
import { Word, DictationType, DictationResult } from '../src/types';

export default function DictationScreen() {
  const { type, grade } = useLocalSearchParams<{ type: string; grade?: string }>();
  const router = useRouter();
  const { state, submitAnswer, endSession } = useApp();
  const { speak, stop } = useSpeech();
  const { darkMode, speechRate } = state.settings;
  const theme = darkMode ? Colors.dark : Colors.light;

  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [results, setResults] = useState<DictationResult[]>([]);
  const [inputMode, setInputMode] = useState<'text' | 'draw'>('text');

  const currentWord = words[currentIndex];
  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0;

  useEffect(() => {
    loadWords();
  }, []);

  useEffect(() => {
    if (currentWord) {
      speakCurrentWord();
    }
  }, [currentIndex, currentWord]);

  const loadWords = () => {
    const dictType = type as DictationType || 'character';
    const gradeNum = grade ? parseInt(grade) : undefined;

    if (dictType === 'sentence') {
      const sentences = getRandomSentences(10, gradeNum);
      setWords(sentences.map((s, i) => ({
        id: `sentence-${i}`,
        text: s.text,
        type: 'sentence',
        grade: s.grade,
      })));
    } else {
      const wordList = getRandomWords(10, gradeNum).map(w => ({
        ...w,
        type: dictType as DictationType,
      }));
      setWords(wordList);
    }
  };

  const speakCurrentWord = useCallback(() => {
    if (currentWord) {
      stop();
      setTimeout(() => {
        speak(currentWord.text);
      }, 500);
    }
  }, [currentWord, speak, stop]);

  const handleSubmit = () => {
    if (!currentWord || !userAnswer.trim()) {
      Alert.alert('提示', '请输入您的答案');
      return;
    }

    const correct = userAnswer.trim() === currentWord.text;
    setIsCorrect(correct);
    setShowResult(true);

    const result: DictationResult = {
      word: currentWord,
      userAnswer: userAnswer.trim(),
      isCorrect: correct,
      timestamp: Date.now(),
    };

    submitAnswer(currentWord, userAnswer.trim());
    setResults(prev => [...prev, result]);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setShowResult(false);
      setIsCorrect(false);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    endSession();
    Alert.alert(
      '听写完成',
      `你完成了 ${words.length} 道题，正确 ${results.filter(r => r.isCorrect).length} 道`,
      [
        {
          text: '查看结果',
          onPress: () => router.replace('/(tabs)'),
        },
      ]
    );
  };

  const handleSkip = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setShowResult(false);
    } else {
      handleFinish();
    }
  };

  const handleHandwritingSubmit = (text: string) => {
    setUserAnswer(text);
    handleSubmit();
  };

  if (!currentWord) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.border },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: theme.primary },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {currentIndex + 1} / {words.length}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.speakSection}>
          <TouchableOpacity
            style={[styles.speakButton, { backgroundColor: theme.primary }]}
            onPress={speakCurrentWord}
          >
            <Text style={styles.speakButtonText}>🔊 播放</Text>
          </TouchableOpacity>
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            点击播放按钮听写发音
          </Text>
        </View>

        <View style={styles.cardContainer}>
          {showResult && (
            <WordCard
              text={currentWord.text}
              isCorrect={isCorrect}
              showResult={true}
              darkMode={darkMode}
            />
          )}
        </View>

        {showResult && !isCorrect && (
          <View style={[styles.answerCompare, { backgroundColor: theme.error + '15' }]}>
            <Text style={[styles.compareLabel, { color: theme.error }]}>正确答案:</Text>
            <Text style={[styles.correctAnswer, { color: theme.error }]}>
              {currentWord.text}
            </Text>
          </View>
        )}

        {!showResult && (
          <>
            <View style={styles.inputModeToggle}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor: inputMode === 'text' ? theme.primary : theme.surface,
                    borderColor: theme.primary,
                  },
                ]}
                onPress={() => setInputMode('text')}
              >
                <Text
                  style={[
                    styles.toggleText,
                    { color: inputMode === 'text' ? '#FFFFFF' : theme.primary },
                  ]}
                >
                  文字输入
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor: inputMode === 'draw' ? theme.primary : theme.surface,
                    borderColor: theme.primary,
                  },
                ]}
                onPress={() => setInputMode('draw')}
              >
                <Text
                  style={[
                    styles.toggleText,
                    { color: inputMode === 'draw' ? '#FFFFFF' : theme.primary },
                  ]}
                >
                  手写输入
                </Text>
              </TouchableOpacity>
            </View>

            {inputMode === 'text' ? (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.surface,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  value={userAnswer}
                  onChangeText={setUserAnswer}
                  placeholder="请输入答案"
                  placeholderTextColor={theme.textSecondary}
                  autoFocus
                  onSubmitEditing={handleSubmit}
                />
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: theme.accent }]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>提交</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.drawContainer}>
                <DrawingCanvas
                  onTextRecognized={handleHandwritingSubmit}
                  darkMode={darkMode}
                />
                <Text style={[styles.drawHint, { color: theme.textSecondary }]}>
                  在上方画布书写汉字，然后点击"识别提交"
                </Text>
              </View>
            )}
          </>
        )}

        {showResult && (
          <View style={styles.resultActions}>
            <TouchableOpacity
              style={[styles.skipButton, { borderColor: theme.primary }]}
              onPress={handleSkip}
            >
              <Text style={[styles.skipButtonText, { color: theme.primary }]}>
                {currentIndex < words.length - 1 ? '下一题' : '完成'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.md,
    paddingTop: Spacing.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: FontSizes.small,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.large,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  speakSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  speakButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  speakButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.large,
    fontWeight: '600',
  },
  hint: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.small,
  },
  cardContainer: {
    marginVertical: Spacing.lg,
    alignItems: 'center',
  },
  answerCompare: {
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing.md,
    width: '100%',
  },
  compareLabel: {
    fontSize: FontSizes.small,
    marginBottom: Spacing.xs,
  },
  correctAnswer: {
    fontSize: FontSizes.xxlarge,
    fontWeight: 'bold',
  },
  inputModeToggle: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  toggleButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  toggleText: {
    fontSize: FontSizes.medium,
    fontWeight: '500',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.large,
  },
  submitButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.large,
    fontWeight: '600',
  },
  drawContainer: {
    width: '100%',
    alignItems: 'center',
  },
  drawHint: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.small,
    textAlign: 'center',
  },
  resultActions: {
    marginTop: Spacing.lg,
    width: '100%',
  },
  skipButton: {
    paddingVertical: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: FontSizes.large,
    fontWeight: '600',
  },
});
