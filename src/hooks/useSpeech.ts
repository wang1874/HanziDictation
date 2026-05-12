import * as Speech from 'expo-speech';
import { useCallback, useRef } from 'react';
import { speakWithDoubao } from '../services/doubaoService';

export const useSpeech = () => {
  const repeatCountRef = useRef(2);
  const useDoubaoTTS = useRef(true);
  
  const setRepeatCount = useCallback((count: number) => {
    repeatCountRef.current = count;
  }, []);

  const speak = useCallback(async (text: string) => {
    try {
      const count = repeatCountRef.current;
      for (let i = 0; i < count; i++) {
        if (useDoubaoTTS.current) {
          try {
            await speakWithDoubao(text);
            await new Promise(resolve => setTimeout(resolve, 2500));
            continue;
          } catch (error) {
            console.log('豆包TTS失败，使用系统语音:', error);
          }
        }
        
        if (await Speech.isSpeakingAsync()) {
          await Speech.stop();
        }
        Speech.speak(text, {
          language: 'zh-CN',
          pitch: 1.0,
          rate: 0.7,
          volume: 1.0,
        });
        await new Promise(resolve => setTimeout(resolve, 2500));
      }
    } catch (error) {
      console.error('Speech error:', error);
    }
  }, []);

  const speakOnce = useCallback(async (text: string) => {
    try {
      if (useDoubaoTTS.current) {
        try {
          await speakWithDoubao(text);
          return;
        } catch (error) {
          console.log('豆包TTS失败，使用系统语音:', error);
        }
      }
      
      if (await Speech.isSpeakingAsync()) {
        await Speech.stop();
      }
      
      Speech.speak(text, {
        language: 'zh-CN',
        pitch: 1.0,
        rate: 0.75,
      });
    } catch (error) {
      console.error('Speech error:', error);
    }
  }, []);

  const stop = useCallback(async () => {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Stop speech error:', error);
    }
  }, []);

  return { speak, speakOnce, stop, setRepeatCount };
};
