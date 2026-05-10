import React, { useState, useCallback } from 'react';
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

type InputMode = 'paper' | 'handwriting';

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
  '爱': 'ài', '心': 'xīn', '思': 'sī', '想': 'xiǎng', '知': 'zhī',
  '道': 'dào', '习': 'xí', '写': 'xiě', '词': 'cí', '作': 'zuò',
  '堂': 'táng', '课': 'kè', '间': 'jiān', '时': 'shí', '年': 'nián',
  '期': 'qī', '气': 'qì', '温': 'wēn', '暖': 'nuǎn', '凉': 'liáng',
};

export default function CustomDictationPage() {
  const { speak, stop } = useSpeech();
  const [inputText, setInputText] = useState('');
  const [words, setWords] = useState<CustomWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputMode, setInputMode] = useState<InputMode>('paper');
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
    setInputMode('paper');
  }, [inputText, parseWords]);

  const speakCurrentWord = useCallback(() => {
    if (words.length > 0 && currentIndex < words.length) {
      const word = words[currentIndex];
      const toSpeak = `${word.text}，${word.text}`;
      speak(toSpeak);
    }
  }, [words, currentIndex, speak]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setShowResult(false);
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

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

  React.useEffect(() => {
    if (isStarted && words.length > 0) {
      speakCurrentWord();
    }
    return () => {
      stop();
    };
  }, [currentIndex, words, isStarted]);

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

      <View style={styles.inputModeBar}>
        <TouchableOpacity
          style={[styles.inputModeBtn, inputMode === 'paper' && styles.inputModeBtnActive]}
          onPress={() => setInputMode('paper')}
        >
          <Text style={[styles.inputModeText, inputMode === 'paper' && styles.inputModeTextActive]}>
            📝 纸上听写
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.inputModeBtn, inputMode === 'handwriting' && styles.inputModeBtnActive]}
          onPress={() => setInputMode('handwriting')}
        >
          <Text style={[styles.inputModeText, inputMode === 'handwriting' && styles.inputModeTextActive]}>
            ✍️ 屏幕手写
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.speakSection}>
        <TouchableOpacity style={styles.speakButton} onPress={handleReSpeak}>
          <Text style={styles.speakButtonText}>🔊 再听一遍</Text>
        </TouchableOpacity>
      </View>

      {inputMode === 'handwriting' && (
        <View style={styles.canvasSection}>
          <DrawingCanvas onTextRecognized={() => {}} />
        </View>
      )}

      <View style={styles.navButtons}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Text style={[styles.navButtonText, currentIndex === 0 && styles.navButtonTextDisabled]}>
            ← 上一个
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.showResultBtn} onPress={() => setShowResult(true)}>
          <Text style={styles.showResultBtnText}>显示答案</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleNext}>
          <Text style={styles.navButtonText}>下一个 →</Text>
        </TouchableOpacity>
      </View>

      {showResult && (
        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>正确答案</Text>
          <Text style={styles.resultCharacter}>{currentWord.text}</Text>
          <Text style={styles.resultPinyin}>{currentWord.pinyin}</Text>
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
  inputModeBar: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    backgroundColor: '#FFF',
  },
  inputModeBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FDF5E6',
    borderWidth: 2,
    borderColor: '#8B0000',
    alignItems: 'center',
  },
  inputModeBtnActive: {
    backgroundColor: '#8B0000',
  },
  inputModeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  inputModeTextActive: {
    color: '#FFF',
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
  canvasSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
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
    fontSize: 48,
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
});
