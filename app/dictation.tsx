import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSpeech } from '../src/hooks/useSpeech';

type DictationMode = 'character' | 'word' | 'sentence';

export default function DictationPage() {
  const { grade, mode, lessonId } = useLocalSearchParams<{
    grade: string;
    mode: string;
    lessonId?: string;
  }>();
  const { speak, stop, setRepeatCount } = useSpeech();

  const [dictationMode, setDictationMode] = useState<DictationMode>('character');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [knownWords, setKnownWords] = useState(0);
  const [repeatCount] = useState(2);
  const [dictationItems, setDictationItems] = useState<{
    text: string;
    pinyin: string;
    example: string;
  }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const gradeNum = parseInt(grade || '3', 10);
      const modeValue = mode || 'character';
      setDictationMode(modeValue as DictationMode);
      setRepeatCount(repeatCount);
      
      let data: { text: string; pinyin: string; example: string }[] = [];
      
      const { getWordsByGrade, getWordsByLesson, getSentences } = await import('../src/data/wordDatabase');
      
      if (modeValue === 'sentence') {
        const sentences = getSentences(gradeNum);
        data = sentences.map((s) => ({
          text: s.text,
          pinyin: s.pinyin,
          example: s.text,
        }));
      } else if (lessonId) {
        const words = getWordsByLesson(lessonId);
        data = words.map((w) => ({
          text: w.text,
          pinyin: w.pinyin || '',
          example: w.example || w.text,
        }));
      } else if (modeValue === 'word') {
        const words = getWordsByGrade(gradeNum).filter(w => w.type === 'word');
        data = words.map((w) => ({
          text: w.text,
          pinyin: w.pinyin || '',
          example: w.example || w.text,
        }));
      } else {
        const words = getWordsByGrade(gradeNum).filter(w => w.type === 'character');
        data = words.map((w) => ({
          text: w.text,
          pinyin: w.pinyin || '',
          example: w.example || w.text,
        }));
      }
      
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setDictationItems(shuffled);
    };
    
    loadData();
  }, [grade, mode, lessonId, repeatCount, setRepeatCount]);

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

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setShowResult(false);
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

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

  const getModeLabel = () => {
    switch (dictationMode) {
      case 'character': return '单字听写';
      case 'word': return '词语听写';
      case 'sentence': return '句子听写';
      default: return '听写';
    }
  };

  if (dictationItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>暂无听写内容</Text>
      </SafeAreaView>
    );
  }

  const currentItem = dictationItems[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{grade}年级{getModeLabel()}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressBar}>
        <Text style={styles.progressText}>
          第 {currentIndex + 1} / {dictationItems.length} 题
        </Text>
      </View>

      <View style={styles.speakSection}>
        <TouchableOpacity style={styles.speakButton} onPress={handleReSpeak}>
          <Text style={styles.speakButtonText}>🔊 再听一遍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navButtons}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Text style={[styles.navButtonText, currentIndex === 0 && styles.navButtonTextDisabled]}>
            ◀
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.showResultBtn} onPress={handleShowResult}>
          <Text style={styles.showResultBtnText}>显示答案</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleNext}>
          <Text style={styles.navButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      {showResult && (
        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>正确答案</Text>
          <Text style={styles.resultCharacter}>{currentItem.text}</Text>
          <Text style={styles.resultPinyin}>{currentItem.pinyin}</Text>
          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.correctButton} onPress={handleCorrect}>
              <Text style={styles.correctText}>✓ 认识了</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.wrongButton} onPress={handleWrong}>
              <Text style={styles.wrongText}>✗ 不认识</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5E6',
  },
  header: {
    padding: 16,
    backgroundColor: '#8B0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
  },
  backText: {
    color: '#FFF8E7',
    fontSize: 16,
  },
  headerTitle: {
    color: '#FFF8E7',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  progressBar: {
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
  },
  progressText: {
    fontSize: 16,
    color: '#8B0000',
    fontWeight: 'bold',
  },
  speakSection: {
    padding: 16,
  },
  speakButton: {
    backgroundColor: '#FFE4C4',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  speakButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  navButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  showResultBtn: {
    flex: 1,
    backgroundColor: '#8B0000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  showResultBtnText: {
    fontSize: 16,
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
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resultCharacter: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  resultPinyin: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
    marginBottom: 16,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  correctButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  correctText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  wrongButton: {
    flex: 1,
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  wrongText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  emptyText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    color: '#666',
  },
});
