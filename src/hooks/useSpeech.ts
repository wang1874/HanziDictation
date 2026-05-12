import * as Speech from 'expo-speech';
import { useCallback, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { synthesizeSpeech } from '../services/doubaoService';

export const useSpeech = () => {
  const repeatCountRef = useRef(2);
  const [currentSource, setCurrentSource] = useState<'doubao' | 'system'>('system');
  
  const setRepeatCount = useCallback((count: number) => {
    repeatCountRef.current = count;
  }, []);

  const playAudioBuffer = useCallback(async (audioBuffer: ArrayBuffer): Promise<void> => {
    try {
      const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
      const uri = URL.createObjectURL(blob);
      
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      
      await new Promise((resolve) => {
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            sound.unloadAsync();
            URL.revokeObjectURL(uri);
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('播放音频失败:', error);
      throw error;
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    const count = repeatCountRef.current;
    
    for (let i = 0; i < count; i++) {
      let useDoubao = false;
      
      try {
        const audioBuffer = await synthesizeSpeech(text);
        if (audioBuffer) {
          await playAudioBuffer(audioBuffer);
          useDoubao = true;
        }
      } catch (error) {
        console.log('豆包TTS失败，尝试系统语音:', error);
      }
      
      if (useDoubao) {
        setCurrentSource('doubao');
      } else {
        console.log('使用系统语音播放:', text);
        if (await Speech.isSpeakingAsync()) {
          await Speech.stop();
        }
        Speech.speak(text, {
          language: 'zh-CN',
          pitch: 1.0,
          rate: 0.7,
          volume: 1.0,
        });
        setCurrentSource('system');
      }
      
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 2500));
      }
    }
  }, [playAudioBuffer]);

  const speakOnce = useCallback(async (text: string) => {
    let useDoubao = false;
    
    try {
      const audioBuffer = await synthesizeSpeech(text);
      if (audioBuffer) {
        await playAudioBuffer(audioBuffer);
        useDoubao = true;
      }
    } catch (error) {
      console.log('豆包TTS失败，尝试系统语音:', error);
    }
    
    if (useDoubao) {
      setCurrentSource('doubao');
    } else {
      console.log('使用系统语音播放:', text);
      if (await Speech.isSpeakingAsync()) {
        await Speech.stop();
      }
      Speech.speak(text, {
        language: 'zh-CN',
        pitch: 1.0,
        rate: 0.75,
      });
      setCurrentSource('system');
    }
  }, [playAudioBuffer]);

  const stop = useCallback(async () => {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Stop speech error:', error);
    }
  }, []);

  return { speak, speakOnce, stop, setRepeatCount, currentSource };
};
