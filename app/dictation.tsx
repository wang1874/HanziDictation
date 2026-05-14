import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSpeech } from '../src/hooks/useSpeech';
import { Word } from '../src/types';
import { generateBatchDictation, audioCache } from '../src/services/doubaoService';
import { Audio } from 'expo-av';
import { pinyinMap } from '../src/utils/pinyinMap';
import * as FileSystem from 'expo-file-system';

type DictationMode = 'single' | 'phrase';

interface AudioItem {
  word: string;
  speechText: string;
  audioPath?: string;
}

const DING_SOUND_URI = 'https://www.soundjay.com/buttons/sounds/ding-odon-1.mp3';

export default function DictationPage() {
  const { grade, mode, lessonId } = useLocalSearchParams<{
    grade: string;
    mode: string;
    lessonId?: string;
  }>();
  const { speakOnce, stop, currentSource } = useSpeech();

  const [dictationMode, setDictationMode] = useState<DictationMode>('single');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [knownWords, setKnownWords] = useState(0);
  const [dictationItems, setDictationItems] = useState<Word[]>([]);
  const [audioItems, setAudioItems] = useState<AudioItem[]>([]);
  const [introAudioPath, setIntroAudioPath] = useState<string>('');
  const [endingAudioPath, setEndingAudioPath] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [dictationStarted, setDictationStarted] = useState(false);
  const [dictationFinished, setDictationFinished] = useState(false);
  
  const dingSoundRef = useRef<Audio.Sound | null>(null);
  const isPlayingRef = useRef(false);

  const playLocalAudio = useCallback(async (audioPath: string) => {
    try {
      if (dingSoundRef.current) {
        await dingSoundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioPath },
        { shouldPlay: true }
      );
      dingSoundRef.current = sound;
      
      return new Promise<void>((resolve) => {
        sound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.didJustFinish) {
            sound.unloadAsync();
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('[音频] 播放失败:', error);
      return;
    }
  }, []);

  const playDingSound = useCallback(async () => {
    try {
      if (dingSoundRef.current) {
        await dingSoundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: DING_SOUND_URI },
        { shouldPlay: true }
      );
      dingSoundRef.current = sound;
      await sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('播放提示音失败:', error);
      speakOnce('叮');
    }
  }, [speakOnce]);

  const synthesizeAndCache = useCallback(async (text: string): Promise<string | null> => {
    console.log('[听写] 合成并缓存:', text);
    const { synthesizeSpeech } = await import('../src/services/doubaoService');
    const buffer = await synthesizeSpeech(text);
    
    if (buffer) {
      const path = await audioCache.saveAudio(text, buffer);
      return path;
    }
    return null;
  }, []);

  const preloadAllAudio = useCallback(async (items: AudioItem[], intro: string, ending: string) => {
    setIsLoadingAudio(true);
    console.log('[听写] 开始预加载所有音频...');
    
    const newItems: AudioItem[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      console.log(`[听写] 处理第 ${i + 1}/${items.length} 项:`, item.word);
      
      const audioPath = await synthesizeAndCache(item.speechText);
      newItems.push({ ...item, audioPath: audioPath || undefined });
    }
    
    console.log('[听写] 合成开场白:', intro);
    const introPath = await synthesizeAndCache(intro);
    setIntroAudioPath(introPath || '');
    
    console.log('[听写] 合成结局语:', ending);
    const endingPath = await synthesizeAndCache(ending);
    setEndingAudioPath(endingPath || '');
    
    setAudioItems(newItems);
    setIsLoadingAudio(false);
    console.log('[听写] 音频预加载完成！');
  }, [synthesizeAndCache]);

  const playIntro = useCallback(async () => {
    console.log('[听写] 播放开场白');
    if (introAudioPath) {
      await playLocalAudio(introAudioPath);
    } else {
      await speakOnce('小朋友们，准备好了吗？让我们开始听写吧！');
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }, [introAudioPath, playLocalAudio, speakOnce]);

  const playItem = useCallback(async (item: AudioItem) => {
    console.log('[听写] 播放:', item.speechText);
    
    await playDingSound();
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (item.audioPath) {
      await playLocalAudio(item.audioPath);
    } else {
      await speakOnce(item.speechText);
    }
  }, [playDingSound, playLocalAudio, speakOnce]);

  const playEnding = useCallback(async () => {
    console.log('[听写] 播放结局语');
    if (endingAudioPath) {
      await playLocalAudio(endingAudioPath);
    } else {
      await speakOnce('今天的听写就到这里，写完记得再检查一遍哦！你们真棒！');
    }
  }, [endingAudioPath, playLocalAudio, speakOnce]);

  const playCurrentItem = useCallback(async () => {
    if (audioItems.length > 0 && currentIndex < audioItems.length) {
      setIsSpeaking(true);
      await playItem(audioItems[currentIndex]);
      setIsSpeaking(false);
    }
  }, [audioItems, currentIndex, playItem]);

  useEffect(() => {
    const loadData = async () => {
      const gradeNum = parseInt(grade || '3', 10);
      const modeValue = mode || 'single';
      setDictationMode(modeValue as DictationMode);
      
      let data: Word[] = [];
      const { getWordsByGrade, getWordsByLesson } = await import('../src/data/wordDatabase');
      
      if (lessonId) {
        data = getWordsByLesson(lessonId);
      } else if (modeValue === 'phrase') {
        data = getWordsByGrade(gradeNum).filter(w => w.type === 'word');
      } else {
        data = getWordsByGrade(gradeNum).filter(w => w.type === 'character');
      }
      
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(10, shuffled.length));
      setDictationItems(selected);
      
      const { generateBatchDictation } = await import('../src/services/doubaoService');
      const result = await generateBatchDictation(
        selected.map(w => w.text),
        modeValue as DictationMode,
        gradeNum
      );
      
      if (result) {
        await preloadAllAudio(result.items, result.intro, result.ending);
      }
      
      setIsLoading(false);
    };
    
    loadData();
    
    return () => {
      stop();
      if (dingSoundRef.current) {
        dingSoundRef.current.unloadAsync();
      }
    };
  }, [grade, mode, lessonId, preloadAllAudio, stop]);

  const startDictation = useCallback(async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    
    setDictationStarted(true);
    await playIntro();
    await new Promise(resolve => setTimeout(resolve, 800));
    await playCurrentItem();
    
    isPlayingRef.current = false;
  }, [playIntro, playCurrentItem]);

  const handleReSpeak = useCallback(async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsSpeaking(true);
    await playCurrentItem();
    setIsSpeaking(false);
    isPlayingRef.current = false;
  }, [playCurrentItem]);

  const handleNext = useCallback(() => {
    setShowResult(false);
    if (currentIndex < audioItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setDictationFinished(true);
      playEnding();
    }
  }, [currentIndex, audioItems.length, playEnding]);

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

  const getModeLabel = () => {
    return dictationMode === 'single' ? '单字听写' : '词语听写';
  };

  const getVoiceLabel = () => {
    if (currentSource === 'doubao') {
      return <Text style={styles.doubaoVoiceTag}>🎙️ 豆包语音</Text>;
    }
    return <Text style={styles.systemVoiceTag}>📢 系统语音</Text>;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B0000" />
          <Text style={styles.loadingText}>正在准备听写内容...</Text>
          {isLoadingAudio && (
            <Text style={styles.loadingSubText}>正在合成语音，请稍候</Text>
          )}
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

  const currentWord = dictationItems[currentIndex];
  const currentAudio = audioItems[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{grade}年级 {getModeLabel()}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressBar}>
        <Text style={styles.progressText}>
          第 {currentIndex + 1} / {audioItems.length} 题
        </Text>
        {getVoiceLabel()}
      </View>

      {!dictationStarted ? (
        <View style={styles.startSection}>
          <Text style={styles.startTitle}>🎯 听写准备</Text>
          <Text style={styles.startInfo}>本次听写共 {audioItems.length} 个内容</Text>
          <Text style={styles.startInfo}>
            模式：{dictationMode === 'single' ? '单字听写（多组词格式）' : '词语听写（造句模式）'}
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={startDictation}
            disabled={isLoadingAudio}
          >
            <Text style={styles.startButtonText}>
              {isLoadingAudio ? '🔄 准备中...' : '🎤 开始听写'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : dictationFinished ? (
        <View style={styles.finishSection}>
          <Text style={styles.finishTitle}>🎉 听写完成</Text>
          <Text style={styles.finishInfo}>
            你掌握了 {knownWords} / {audioItems.length} 个内容
          </Text>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => router.back()}
          >
            <Text style={styles.returnButtonText}>返回</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
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
            {currentAudio && (
              <Text style={styles.exampleText}>{currentAudio.speechText}</Text>
            )}
          </View>

          <View style={styles.navButtons}>
            <TouchableOpacity
              style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
              onPress={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              <Text style={styles.navButtonText}>◀</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.showResultBtn} onPress={handleShowResult}>
              <Text style={styles.showResultBtnText}>显示答案</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={handleNext}>
              <Text style={styles.navButtonText}>▶</Text>
            </TouchableOpacity>
          </View>

          {showResult && currentWord && (
            <ScrollView style={styles.resultSection}>
              <Text style={styles.resultLabel}>正确答案</Text>
              <Text style={styles.resultCharacter}>{currentWord.text}</Text>
              <Text style={styles.resultPinyin}>{pinyinMap[currentWord.text] || currentWord.pinyin}</Text>
              <View style={styles.resultActions}>
                <TouchableOpacity style={styles.correctButton} onPress={handleCorrect}>
                  <Text style={styles.correctText}>✓ 认识了</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.wrongButton} onPress={handleWrong}>
                  <Text style={styles.wrongText}>✗ 不认识</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </>
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
    fontSize: 18,
    color: '#8B0000',
    fontWeight: 'bold',
  },
  loadingSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
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
    fontWeight: 'bold',
    color: '#8B0000',
  },
  doubaoVoiceTag: {
    fontSize: 12,
    color: '#FF4500',
    fontWeight: 'bold',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    overflow: 'hidden',
  },
  systemVoiceTag: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    overflow: 'hidden',
  },
  startSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  startTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 20,
  },
  startInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: '#8B0000',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 20,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  finishSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  finishTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  finishInfo: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  returnButton: {
    backgroundColor: '#8B0000',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  returnButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    borderWidth: 2,
    borderColor: '#8B0000',
    maxHeight: 250,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultCharacter: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#8B0000',
    textAlign: 'center',
  },
  resultPinyin: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
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
