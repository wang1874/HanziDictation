import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, FontSizes, Spacing } from '../../src/utils/theme';

export default function HomePage() {
  const theme = Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={styles.title}>汉字听写</Text>
        <Text style={styles.subtitle}>选择听写方式开始训练</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.mainCard, { backgroundColor: '#FFF8E7', borderColor: theme.primary }]}
          onPress={() => router.push('/lesson-select')}
        >
          <View style={styles.mainIcon}>
            <Text style={styles.mainEmoji}>📚</Text>
          </View>
          <View style={styles.mainContent}>
            <Text style={[styles.mainTitle, { color: theme.primary }]}>课文听写</Text>
            <Text style={[styles.mainDesc, { color: theme.textSecondary }]}>
              选择年级和课文，听写该课的生字和词语
            </Text>
          </View>
          <Text style={styles.mainArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainCard, { backgroundColor: theme.surface, borderColor: theme.primary }]}
          onPress={() => router.push('/custom-dictation')}
        >
          <View style={styles.mainIcon}>
            <Text style={styles.mainEmoji}>✏️</Text>
          </View>
          <View style={styles.mainContent}>
            <Text style={[styles.mainTitle, { color: theme.primary }]}>自定义听写</Text>
            <Text style={[styles.mainDesc, { color: theme.textSecondary }]}>
              输入想听写的内容，系统自动生成例句并播放
            </Text>
          </View>
          <Text style={styles.mainArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainCard, { backgroundColor: '#FFF8E7', borderColor: theme.primary, opacity: 0.7 }]}
          onPress={() => router.push('/debug')}
        >
          <View style={styles.mainIcon}>
            <Text style={styles.mainEmoji}>🔧</Text>
          </View>
          <View style={styles.mainContent}>
            <Text style={[styles.mainTitle, { color: theme.primary }]}>API调试</Text>
            <Text style={[styles.mainDesc, { color: theme.textSecondary }]}>
              测试豆包API是否正常工作
            </Text>
          </View>
          <Text style={styles.mainArrow}>→</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  mainCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: Spacing.lg,
    backgroundColor: '#FFF',
  },
  mainIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B0000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  mainEmoji: {
    fontSize: 32,
  },
  mainContent: {
    flex: 1,
  },
  mainTitle: {
    fontSize: FontSizes.xlarge,
    fontWeight: 'bold',
  },
  mainDesc: {
    fontSize: FontSizes.medium,
    marginTop: 4,
  },
  mainArrow: {
    fontSize: 24,
    color: '#8B0000',
    fontWeight: 'bold',
  },
});
