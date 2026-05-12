import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSpeech } from '../src/hooks/useSpeech';
import { Word } from '../src/types';

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
  const [dictationItems, setDictationItems] = useState<Word[]>([]);
  const [examples, setExamples] = useState<Map<number, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const gradeNum = parseInt(grade || '3', 10);
      const modeValue = mode || 'character';
      setDictationMode(modeValue as DictationMode);
      setRepeatCount(repeatCount);
      
      let data: Word[] = [];
      
      const { getWordsByGrade, getWordsByLesson } = await import('../src/data/wordDatabase');
      
      if (lessonId) {
        data = getWordsByLesson(lessonId);
      } else if (modeValue === 'word') {
        data = getWordsByGrade(gradeNum).filter(w => w.type === 'word');
      } else if (modeValue === 'character') {
        data = getWordsByGrade(gradeNum).filter(w => w.type === 'character');
      } else {
        // 句子模式暂时用词代替
        data = getWordsByGrade(gradeNum);
      }
      
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setDictationItems(shuffled);
      setIsLoading(false);
    };
    
    loadData();
  }, [grade, mode, lessonId, repeatCount, setRepeatCount]);

  const loadExampleForCurrentItem = useCallback(async () => {
    if (dictationItems.length > 0 && currentIndex < dictationItems.length) {
      if (!examples.has(currentIndex)) {
        const { generateDictationExample } = await import('../src/services/doubaoService');
        const word = dictationItems[currentIndex];
        const example = await generateDictationExample(word.text, word.grade);
        setExamples(prev => new Map(prev).set(currentIndex, example));
      }
    }
  }, [dictationItems, currentIndex, examples]);

  const speakCurrentItem = useCallback(async () => {
    if (dictationItems.length > 0 && currentIndex < dictationItems.length) {
      setIsSpeaking(true);
      await loadExampleForCurrentItem();
      const example = examples.get(currentIndex) || dictationItems[currentIndex].text;
      speak(example);
      setTimeout(() => setIsSpeaking(false), 1000);
    }
  }, [dictationItems, currentIndex, examples, loadExampleForCurrentItem, speak]);

  useEffect(() => {
    if (dictationItems.length > 0) {
      loadExampleForCurrentItem();
      speakCurrentItem();
    }
    return () => {
      stop();
    };
  }, [currentIndex, dictationItems, loadExampleForCurrentItem, speakCurrentItem]);

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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B0000" />
          <Text style={styles.loadingText}>正在加载...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (dictationItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>暂无听写内容</Text>
      </SafeAreaView>
    );
  }

  const currentItem = dictationItems[currentIndex];
  const currentExample = examples.get(currentIndex);

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
        <TouchableOpacity 
          style={[styles.speakButton, isSpeaking && styles.speakButtonActive]} 
          onPress={handleReSpeak}
          disabled={isSpeaking}
        >
          <Text style={styles.speakButtonText}>
            {isSpeaking ? '🔊 正在播放...' : '🔊 再听一遍'}
          </Text>
        </TouchableOpacity>
        {currentExample && (
          <Text style={styles.exampleText}>{currentExample}</Text>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8B0000',
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
  speakButtonActive: {
    backgroundColor: '#FFDAB9',
    opacity: 0.8,
  },
  speakButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  exampleText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
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
