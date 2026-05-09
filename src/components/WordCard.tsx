import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontSizes, Spacing } from '../utils/theme';

interface WordCardProps {
  text: string;
  isCorrect?: boolean;
  showResult?: boolean;
  onPress?: () => void;
  darkMode?: boolean;
}

export function WordCard({ text, isCorrect, showResult = false, onPress, darkMode = false }: WordCardProps) {
  const theme = darkMode ? Colors.dark : Colors.light;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
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
        {text}
      </Text>
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
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    minHeight: 120,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultText: {
    fontSize: FontSizes.medium,
    marginTop: Spacing.sm,
    fontWeight: '600',
  },
});

export default WordCard;
