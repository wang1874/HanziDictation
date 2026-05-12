import * as Speech from 'expo-speech';
import { useCallback, useRef, useState } from 'react';
import { speakWithDoubao } from '../services/doubaoService';

export const useSpeech = () => {
  const repeatCountRef = useRef(2);
  const [voiceSource, setVoiceSource] = useState<'doubao' | 'system'>('system');
  
  const setRepeatCount = useCallback((count: number) => {
    repeatCountRef.current = count;
  }, []);

  const getVoiceSource = useCallback(() => voiceSource, [voiceSource]);

  const speak = useCallback(async (text: string): Promise<'doubao' | 'system'> => {
    try {
      let source: 'doubao' | 'system' = 'system';
      const count = repeatCountRef.current;
      
      for (let i = 0; i < count; i++) {
        let success = false;
        
        try {
          await speakWithDoubao(text);
          success = true;
          source = 'doubao';
          setVoiceSource('doubao');
        } catch (error) {
          console.log('豆包TTS不可用，切换到系统语音:', error);
        }
        
        if (!success) {
          if (await Speech.isSpeakingAsync()) {
            await Speech.stop();
          }
          Speech.speak(text, {
            language: 'zh-CN',
            pitch: 1.0,
            rate: 0.7,
            volume: 1.0,
          });
          source = 'system';
          setVoiceSource('system');
        }
        
        await new Promise(resolve => setTimeout(resolve, 2500));
      }
      
      return source;
    } catch (error) {
      console.error('Speech error:', error);
      return 'system';
    }
  }, []);

  const speakOnce = useCallback(async (text: string): Promise<'doubao' | 'system'> => {
    try {
      let source: 'doubao' | 'system' = 'system';
      let success = false;
      
      try {
        await speakWithDoubao(text);
        success = true;
        source = 'doubao';
        setVoiceSource('doubao');
      } catch (error) {
        console.log('豆包TTS不可用，切换到系统语音:', error);
      }
      
      if (!success) {
        if (await Speech.isSpeakingAsync()) {
          await Speech.stop();
        }
        
        Speech.speak(text, {
          language: 'zh-CN',
          pitch: 1.0,
          rate: 0.75,
        });
        source = 'system';
        setVoiceSource('system');
      }
      
      return source;
    } catch (error) {
      console.error('Speech error:', error);
      return 'system';
    }
  }, []);

  const stop = useCallback(async () => {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Stop speech error:', error);
    }
  }, []);

  return { speak, speakOnce, stop, setRepeatCount, getVoiceSource, voiceSource };
};