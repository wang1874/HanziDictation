import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSpeech } from '../src/hooks/useSpeech';
import DrawingCanvas from '../src/components/DrawingCanvas';

type DictationMode = 'handwriting' | 'text';

interface CustomWord {
  text: string;
  pinyin: string;
}

const pinyinMap: Record<string, string> = {
  '一': 'yī', '二': 'èr', '三': 'sān', '四': 'sì', '五': 'wǔ',
  '六': 'liù', '七': 'qī', '八': 'bā', '九': 'jiǔ', '十': 'shí',
  '爸': 'bà', '妈': 'mā', '爷': 'yé', '奶': 'nǎi', '哥': 'gē',
  '姐': 'jiě', '弟': 'dì', '妹': 'mèi', '土': 'tǔ', '地': 'dì',
  '国': 'guó', '民': 'mín', '学': 'xué', '校': 'xiào', '师': 'shī',
  '生': 'shēng', '本': 'běn', '书': 'shū', '字': 'zì', '文': 'wén',
  '语': 'yǔ', '数': 'shù', '音': 'yīn', '乐': 'lè', '美': 'měi',
  '天': 'tiān', '上': 'shàng', '下': 'xià', '大': 'dà', '小': 'xiǎo',
  '人': 'rén', '中': 'zhōng', '口': 'kǒu', '手': 'shǒu', '日': 'rì',
  '月': 'yuè', '水': 'shuǐ', '火': 'huǒ', '山': 'shān', '石': 'shí',
  '田': 'tián', '禾': 'hé', '云': 'yún', '风': 'fēng', '雨': 'yǔ',
  '春': 'chūn', '夏': 'xià', '秋': 'qiū', '冬': 'dōng', '花': 'huā',
  '草': 'cǎo', '树': 'shù', '林': 'lín', '森': 'sēn', '鸟': 'niǎo',
  '虫': 'chóng', '鱼': 'yú', '马': 'mǎ', '牛': 'niú', '羊': 'yáng',
  '猪': 'zhū', '狗': 'gǒu', '猫': 'māo', '兔': 'tù', '飞': 'fēi',
  '跑': 'pǎo', '跳': 'tiào', '游': 'yóu', '走': 'zǒu', '来': 'lái',
  '去': 'qù', '看': 'kàn', '听': 'tīng', '说': 'shuō', '读': 'dú',
};

export default function CustomDictationPage() {
  const { speak, stop } = useSpeech();
  const [inputText, setInputText] = useState('');
  const [words, setWords] = useState<CustomWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<DictationMode>('handwriting');
  const [showResult, setShowResult] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const getPinyin = (text: string): string => {
    let pinyin = '';
    for (const char of text) {
      if (pinyinMap[char]) {
        pinyin += pinyinMap[char] + ' ';
      } else {
        pinyin += char + ' ';
      }
    }
    return pinyin.trim();
  };

  const parseWords = useCallback((text: string): CustomWord[] => {
    const separators = /[,，、\s]+/;
    return text
      .split(separators)
      .map((w) => w.trim())
      .filter((w) => w.length > 0)
      .map((w) => ({
        text: w,
        pinyin: getPinyin(w),
      }));
  }, []);

  const handleStartDictation = useCallback(() => {
    const parsedWords = parseWords(inputText);
    if (parsedWords.length === 0) {
      Alert.alert('提示', '请输入要听写的内容');
      return;
    }
    if (parsedWords.length < 2) {
      Alert.alert('提示', '请至少输入2个词语');
      return;
    }
    setWords(parsedWords);
    setIsStarted(true);
    setCurrentIndex(0);
    setKnownCount(0);
  }, [inputText, parseWords]);

  const speakCurrentWord = useCallback(() => {
    if (words.length > 0 && currentIndex < words.length) {
      speak(words[currentIndex].text);
    }
  }, [words, currentIndex, speak]);

  useEffect(() => {
    if (isStarted && words.length > 0) {
      speakCurrentWord();
    }
    return () => {
      stop();
    };
  }, [currentIndex, words, isStarted]);

  const handleNext = useCallback(() => {
    setShowResult(false);
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert(
        '听写完成',
        `本次听写结束！你掌握了 ${knownCount} / ${words.length} 个词语`,
        [{ text: '返回', onPress: () => router.back() }]
      );
    }
  }, [currentIndex, words.length, knownCount]);

  const handleCorrect = useCallback(() => {
    setKnownCount((prev) => prev + 1);
    handleNext();
  }, [handleNext]);

  const handleWrong = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const handleReSpeak = useCallback(() => {
    speakCurrentWord();
  }, [speakCurrentWord]);

  const handleBack = useCallback(() => {
    stop();
    router.back();
  }, [stop]);

  if (!isStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backButton}>← 返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>自定义听写</Text>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>输入要听写的词语</Text>
            <Text style={styles.inputHint}>多个词语请用逗号（,）或顿号（、）隔开</Text>
            <TextInput
              style={styles.textInput}
              placeholder="例如：学校、学习、老师、学生、教室"
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <View style={styles.previewSection}>
              <Text style={styles.previewLabel}>预览：</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text style={styles.previewText}>
                  {parseWords(inputText).map(w => w.text).join(' | ') || '暂无内容'}
                </Text>
              </ScrollView>
            </View>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartDictation}
          >
            <Text style={styles.startButtonText}>开始听写</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>自定义听写</Text>
        <Text style={styles.progress}>{currentIndex + 1}/{words.length}</Text>
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
      </View>

      {mode === 'handwriting' && (
        <View style={styles.canvasSection}>
          <DrawingCanvas onTextRecognized={() => {}} />
        </View>
      )}

      <View style={styles.actionButtons}>
        {!showResult ? (
          <TouchableOpacity style={styles.showResultButton} onPress={() => setShowResult(true)}>
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
          <Text style={styles.resultCharacter}>{currentWord.text}</Text>
          <Text style={styles.resultPinyin}>{currentWord.pinyin}</Text>
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
    padding: 16,
    backgroundColor: '#8B0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    color: '#FFF8E7',
    fontSize: 16,
  },
  headerTitle: {
    color: '#FFF8E7',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progress: {
    color: '#FFE4C4',
    fontSize: 14,
  },
  placeholder: {
    width: 60,
  },
  inputContainer: {
    flex: 1,
    padding: 16,
  },
  inputSection: {
    flex: 1,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 8,
  },
  inputHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#8B0000',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 150,
    color: '#333',
  },
  previewSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0D5C7',
  },
  previewLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 16,
    color: '#8B0000',
  },
  startButton: {
    backgroundColor: '#8B0000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  speakButton: {
    backgroundColor: '#FFE4C4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  speakButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B0000',
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
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  resultPinyin: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
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
});
