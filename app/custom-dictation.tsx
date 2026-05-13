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
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSpeech } from '../src/hooks/useSpeech';

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
  '壮': 'zhuàng', '观': 'guān', '摇': 'yáo', '篮': 'lán', '惨': 'cǎn',
  '不': 'bù', '忍': 'rěn', '睹': 'dǔ', '贡': 'gòng', '献': 'xiàn',
  '和': 'hé', '蔼': 'ǎi', '可': 'kě', '亲': 'qīn', '例': 'lì',
  '如': 'rú', '根': 'gēn', '基': 'jī', '慷': 'kāng', '慨': 'kǎi',
  '莲': 'lián', '蓬': 'péng', '酱': 'jiàng', '油': 'yóu', '领': 'lǐng',
  '袖': 'xiù', '节': 'jié', '制': 'zhì', '谚': 'yàn', '语': 'yǔ',
  '巢': 'cháo', '苇': 'wěi', '罗': 'luó', '眠': 'mián', '霸': 'bà',
  '占': 'zhàn', '丽': 'lì', '快': 'kuài', '明': 'míng', '老': 'lǎo',
  '朋': 'péng', '友': 'yǒu', '同': 'tóng',
};

export default function CustomDictationPage() {
  const { speak, stop } = useSpeech();
  const [inputText, setInputText] = useState('');
  const [words, setWords] = useState<CustomWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [examples, setExamples] = useState<Map<number, string>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

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
    const separators = /[,，、\s。．]+/;
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
    const shuffled = [...parsedWords].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setIsStarted(true);
    setCurrentIndex(0);
    setKnownCount(0);
    setExamples(new Map());
  }, [inputText, parseWords]);

  const loadExample = useCallback(async (index: number) => {
    if (!examples.has(index) && words[index]) {
      const { generateDictationExample } = await import('../src/services/doubaoService');
      const word = words[index];
      const example = await generateDictationExample(word.text);
      setExamples(prev => new Map(prev).set(index, example));
    }
  }, [examples, words]);

  const speakCurrentWord = useCallback(async () => {
    if (words.length > 0 && currentIndex < words.length) {
      setIsSpeaking(true);
      await loadExample(currentIndex);
      const example = examples.get(currentIndex) || words[currentIndex].text;
      speak(example);
      setTimeout(() => setIsSpeaking(false), 1000);
    }
  }, [words, currentIndex, examples, loadExample, speak]);

  const handlePreviewWord = useCallback(async (word: string, index: number) => {
    setSpeakingIndex(index);
    speak(word);
    setTimeout(() => setSpeakingIndex(null), 1500);
  }, [speak]);

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

  useEffect(() => {
    if (isStarted && words.length > 0) {
      loadExample(currentIndex);
      speakCurrentWord();
    }
    return () => {
      stop();
    };
  }, [currentIndex, words, isStarted, loadExample, speakCurrentWord]);

  const parsedWords = parseWords(inputText);

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
              numberOfLines={4}
              textAlignVertical="top"
            />

            {parsedWords.length > 0 && (
              <View style={styles.cardsSection}>
                <Text style={styles.cardsLabel}>拼音卡片：</Text>
                <ScrollView style={styles.cardsScroll} showsVerticalScrollIndicator={true}>
                  <View style={styles.cardsGrid}>
                    {parsedWords.map((word, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.wordCard,
                          speakingIndex === index && styles.wordCardSpeaking
                        ]}
                        onPress={() => handlePreviewWord(word.text, index)}
                      >
                        <Text style={styles.wordCardPinyin}>{word.pinyin}</Text>
                        <Text style={styles.wordCardText}>{word.text}</Text>
                        <Text style={styles.speakerIcon}>
                          {speakingIndex === index ? '🔊' : '🔈'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B0000" />
          <Text style={styles.loadingText}>正在生成例句...</Text>
        </View>
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
        {examples.get(currentIndex) && (
          <Text style={styles.exampleText}>{examples.get(currentIndex)}</Text>
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
        <TouchableOpacity style={styles.showResultBtn} onPress={() => setShowResult(true)}>
          <Text style={styles.showResultBtnText}>显示答案</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleNext}>
          <Text style={styles.navButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      {showResult && (
        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>正确答案</Text>
          <Text style={styles.resultPinyin}>{currentWord.pinyin}</Text>
          <Text style={styles.resultCharacter}>{currentWord.text}</Text>
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
    minHeight: 120,
    color: '#333',
  },
  cardsSection: {
    marginTop: 16,
    flex: 1,
  },
  cardsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cardsScroll: {
    flex: 1,
    maxHeight: 300,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 12,
  },
  wordCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B0000',
    padding: 8,
  },
  wordCardSpeaking: {
    backgroundColor: '#FFE4C4',
    borderColor: '#FF4500',
  },
  wordCardPinyin: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  wordCardText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B0000',
    textAlign: 'center',
  },
  speakerIcon: {
    marginTop: 4,
    fontSize: 16,
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
  resultPinyin: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  resultCharacter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 16,
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
