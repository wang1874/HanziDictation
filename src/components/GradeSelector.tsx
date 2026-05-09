import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontSizes, Spacing } from '../utils/theme';

interface GradeSelectorProps {
  selectedGrade: number | null;
  onSelectGrade: (grade: number | null) => void;
  darkMode?: boolean;
}

const grades = [
  { value: null, label: '全部' },
  { value: 1, label: '一年级' },
  { value: 2, label: '二年级' },
  { value: 3, label: '三年级' },
  { value: 4, label: '四年级' },
  { value: 5, label: '五年级' },
  { value: 6, label: '六年级' },
];

export function GradeSelector({ selectedGrade, onSelectGrade, darkMode = false }: GradeSelectorProps) {
  const theme = darkMode ? Colors.dark : Colors.light;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>选择年级</Text>
      <View style={styles.grid}>
        {grades.map((grade) => (
          <TouchableOpacity
            key={grade.label}
            onPress={() => onSelectGrade(grade.value)}
            style={[
              styles.button,
              {
                backgroundColor: selectedGrade === grade.value ? theme.primary : theme.surface,
                borderColor: theme.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: selectedGrade === grade.value ? '#FFFFFF' : theme.primary,
                },
              ]}
            >
              {grade.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  button: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1.5,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FontSizes.medium,
    fontWeight: '500',
  },
});

export default GradeSelector;
