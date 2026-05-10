import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useApp } from '../src/contexts/AppContext';
import { useSpeech } from '../src/hooks/useSpeech';
import DrawingCanvas from '../src/components/DrawingCanvas';
import { getWordsByGrade, getSentences } from '../src/data/wordDatabase';

type DictationMode = 'text' | 'handwriting';

export default function DictationPage() {
  const { grade, type } = useLocalSearchParams<{
    grade: string;
    type: string;
  }>();
  const { speak, stop } = useSpeech();

  const [mode, setMode] = useState<DictationMode>('handwriting');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [knownWords, setKnownWords] = useState<number>(0);
  const [dictationItems, setDictationItems] = useState<{
    text: string;
    pinyin: string;
    example?: string;
  }[]>([]);

  const getCurrentItems = useCallback(() => {
    const gradeNum = parseInt(grade || '3', 10);
    const typeValue = type || 'character';
    
    if (typeValue === 'sentence') {
      const sentences = getSentences(gradeNum);
      return sentences.map((s) => ({
        text: s.text,
        pinyin: s.pinyin,
      }));
    } else {
      const words = getWordsByGrade(gradeNum);
      return words.map((w) => ({
        text: w.text,
        pinyin: w.pinyin || '',
        example: w.example,
      }));
    }
  }, [grade, type]);

  useEffect(() => {
    const items = getCurrentItems();
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setDictationItems(shuffled);
  }, [getCurrentItems]);

  const speakCurrentItem = useCallback(() => {
    if (dictationItems.length > 0 && currentIndex < dictationItems.length) {
      const item = dictationItems[currentIndex];
      const toSpeak = item.example || item.text;
      speak(toSpeak);
    }
  }, [dictationItems, currentIndex, speak]);

  useEffect(() => {
    if (dictationItems.length > 0) {
      speakCurrentItem();
    }
    return () => {
      stop();
    };
  }, [currentIndex, dictationItems]);

  const handleNext = useCallback(() => {
    setShowResult(false);
    if (currentIndex < dictationItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert(
        '听写完成',
        `本次听写结束！你掌握了 ${knownWords} / ${dictationItems.length} 个内容`,
        [{ text: '返回', onPress: () => router.back() }]
      );
    }
  }, [currentIndex, dictationItems.length, knownWords]);

  const handleShowResult = useCallback(() => {
    setShowResult(true);
  }, []);

  const handleCorrect = useCallback(() => {
    setKnownWords((prev) => prev + 1);
    handleNext();
  }, [handleNext]);

  const handleWrong = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const handleReSpeak = useCallback(() => {
    speakCurrentItem();
  }, [speakCurrentItem]);

  if (dictationItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>暂无听写内容</Text>
      </SafeAreaView>
    );
  }

  const currentItem = dictationItems[currentIndex];
  const typeLabel = type === 'sentence' ? '句子' : type === 'word' ? '词语' : '单字';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {grade && type ? `${grade}年级${typeLabel}听写` : '听写练习'}
        </Text>
        <Text style={styles.progress}>
          第 {currentIndex + 1} / {dictationItems.length} 题
        </Text>
      </View>

      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'handwriting' && styles.modeButtonActive]}
          onPress={() => setMode('handwriting')}
        >
          <Text style={[styles.modeText, mode === 'handwriting' && styles.modeTextActive]}>
            纸上听写
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'text' && styles.modeButtonActive]}
          onPress={() => setMode('text')}
        >
          <Text style={[styles.modeText, mode === 'text' && styles.modeTextActive]}>
            文字输入
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.speakSection}>
        <TouchableOpacity style={styles.speakButton} onPress={handleReSpeak}>
          <Text style={styles.speakButtonText}>🔊 再听一遍</Text>
        </TouchableOpacity>
        {currentItem.example && (
          <Text style={styles.hintText}>提示：{currentItem.example}</Text>
        )}
      </View>

      {mode === 'handwriting' && (
        <View style={styles.canvasSection}>
          <DrawingCanvas onTextRecognized={() => {}} />
        </View>
      )}

      <View style={styles.actionButtons}>
        {!showResult ? (
          <TouchableOpacity style={styles.showResultButton} onPress={handleShowResult}>
            <Text style={styles.showResultText}>显示答案</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.correctButton} onPress={handleCorrect}>
              <Text style={styles.correctText}>✓ 认识了</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.wrongButton} onPress={handleWrong}>
              <Text style={styles.wrongText}>✗ 不认识</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {showResult && (
        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>正确答案：</Text>
          <Text style={styles.resultCharacter}>{currentItem.text}</Text>
          <Text style={styles.resultPinyin}>{currentItem.pinyin}</Text>
          {currentItem.example && (
            <Text style={styles.resultExample}>例句：{currentItem.example}</Text>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>下一个 →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5E6',
  },
  header: {
    padding: 20,
    backgroundColor: '#8B0000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF8E7',
    marginBottom: 8,
  },
  progress: {
    fontSize: 14,
    color: '#FFE4C4',
  },
  modeSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  modeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#8B0000',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#8B0000',
  },
  modeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  modeTextActive: {
    color: '#FFF',
  },
  speakSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  speakButton: {
    backgroundColor: '#FFE4C4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B0000',
    width: '100%',
  },
  speakButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  hintText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  canvasSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  showResultButton: {
    flex: 1,
    backgroundColor: '#8B0000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  showResultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  correctButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  correctText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  wrongButton: {
    flex: 1,
    backgroundColor: '#F44336',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  wrongText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  resultSection: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  resultCharacter: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 8,
  },
  resultPinyin: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  resultExample: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  nextButton: {
    backgroundColor: '#FFE4C4',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  emptyText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    color: '#666',
  },
});
