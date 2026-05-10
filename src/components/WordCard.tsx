import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontSizes, Spacing } from '../utils/theme';
import { Word } from '../types';

interface WordCardProps {
  word: Word;
  isCorrect?: boolean;
  showResult?: boolean;
  onSpeak?: (text: string) => void;
  onPress?: () => void;
  darkMode?: boolean;
}

export function WordCard({ word, isCorrect, showResult = false, onSpeak, onPress, darkMode = false }: WordCardProps) {
  const theme = darkMode ? Colors.dark : Colors.light;

  const handlePress = () => {
    if (onSpeak) {
      onSpeak(word.text);
    }
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!onSpeak && !onPress}
      style={[
        styles.container,
        {
          backgroundColor: showResult
            ? isCorrect
              ? theme.success + '20'
              : theme.error + '20'
            : theme.surface,
          borderColor: showResult
            ? isCorrect
              ? theme.success
              : theme.error
            : theme.border,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: theme.text,
            fontSize: FontSizes.huge,
          },
        ]}
      >
        {word.text}
      </Text>
      {word.pinyin && (
        <Text style={[styles.pinyin, { color: theme.textSecondary }]}>
          {word.pinyin}
        </Text>
      )}
      {showResult && (
        <Text
          style={[
            styles.resultText,
            {
              color: isCorrect ? theme.success : theme.error,
            },
          ]}
        >
          {isCorrect ? '正确' : '错误'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    minHeight: 100,
    margin: 4,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pinyin: {
    fontSize: FontSizes.small,
    marginTop: 4,
  },
  resultText: {
    fontSize: FontSizes.medium,
    marginTop: Spacing.sm,
    fontWeight: '600',
  },
});

export default WordCard;
