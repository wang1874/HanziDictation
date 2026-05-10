import * as Speech from 'expo-speech';
import { useCallback } from 'react';

export const useSpeech = () => {
  const speak = useCallback(async (text: string) => {
    try {
      if (await Speech.isSpeakingAsync()) {
        await Speech.stop();
      }
      
      Speech.speak(text, {
        language: 'zh-CN',
        pitch: 1.0,
        rate: 0.85,
        onError: (error) => {
          console.error('Speech error:', error);
        },
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

  return { speak, stop };
};
