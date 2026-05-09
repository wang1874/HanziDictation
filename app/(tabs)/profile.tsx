import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useApp } from '../../src/contexts/AppContext';
import { Colors, FontSizes, Spacing } from '../../src/utils/theme';

export default function ProfileScreen() {
  const { state, updateSettings, clearHistory } = useApp();
  const { darkMode, speechRate, fontSize } = state.settings;
  const theme = darkMode ? Colors.dark : Colors.light;

  const handleSpeechRateChange = (rate: number) => {
    updateSettings({ speechRate: rate });
  };

  const handleFontSizeChange = (size: number) => {
    updateSettings({ fontSize: size });
  };

  const handleDarkModeToggle = (value: boolean) => {
    updateSettings({ darkMode: value });
  };

  const handleClearHistory = () => {
    const { Alert } = require('react-native');
    Alert.alert(
      '清空历史',
      '确定要清空所有听写历史记录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '清空',
          style: 'destructive',
          onPress: clearHistory,
        },
      ]
    );
  };

  const getSpeechRateLabel = () => {
    if (speechRate <= 0.3) return '慢速';
    if (speechRate <= 0.5) return '正常';
    if (speechRate <= 0.7) return '快速';
    return '极速';
  };

  const getFontSizeLabel = () => {
    if (fontSize <= 18) return '小';
    if (fontSize <= 24) return '中';
    if (fontSize <= 30) return '大';
    return '特大';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primary }]}>设置</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          自定义您的学习体验
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>语音设置</Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>语速</Text>
            <Text style={[styles.settingValue, { color: theme.primary }]}>
              {getSpeechRateLabel()} ({speechRate.toFixed(1)})
            </Text>
          </View>
          <View style={styles.rateButtons}>
            {[0.3, 0.5, 0.7, 1.0].map((rate) => (
              <TouchableOpacity
                key={rate}
                style={[
                  styles.rateButton,
                  {
                    backgroundColor: speechRate === rate ? theme.primary : theme.background,
                    borderColor: theme.primary,
                  },
                ]}
                onPress={() => handleSpeechRateChange(rate)}
              >
                <Text
                  style={[
                    styles.rateButtonText,
                    { color: speechRate === rate ? '#FFFFFF' : theme.primary },
                  ]}
                >
                  {rate === 0.3 ? '慢' : rate === 0.5 ? '中' : rate === 0.7 ? '快' : '极快'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>显示设置</Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>字体大小</Text>
            <Text style={[styles.settingValue, { color: theme.primary }]}>
              {getFontSizeLabel()} ({fontSize}px)
            </Text>
          </View>
          <View style={styles.rateButtons}>
            {[18, 22, 26, 32].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.rateButton,
                  {
                    backgroundColor: fontSize === size ? theme.primary : theme.background,
                    borderColor: theme.primary,
                  },
                ]}
                onPress={() => handleFontSizeChange(size)}
              >
                <Text
                  style={[
                    styles.rateButtonText,
                    { color: fontSize === size ? '#FFFFFF' : theme.primary },
                  ]}
                >
                  {size === 18 ? '小' : size === 22 ? '中' : size === 26 ? '大' : '特大'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>主题设置</Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>夜间模式</Text>
              <Text style={[styles.settingValue, { color: theme.textSecondary }]}>
                {darkMode ? '已开启' : '已关闭'}
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>数据管理</Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <TouchableOpacity style={styles.actionRow} onPress={handleClearHistory}>
            <Text style={[styles.actionLabel, { color: theme.error }]}>清空历史记录</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.about}>
        <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
          汉字听写 v1.0.0
        </Text>
        <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
          帮助学生练习汉字听写
        </Text>
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
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  card: {
    padding: Spacing.md,
    borderRadius: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: FontSizes.medium,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: FontSizes.small,
    marginTop: Spacing.xs,
  },
  rateButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  rateButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  rateButtonText: {
    fontSize: FontSizes.small,
    fontWeight: '500',
  },
  actionRow: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: FontSizes.medium,
    fontWeight: '500',
  },
  about: {
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  aboutText: {
    fontSize: FontSizes.small,
    marginBottom: Spacing.xs,
  },
});
