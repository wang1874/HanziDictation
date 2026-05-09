import { useCallback } from 'react';
import * as Speech from 'expo-speech';
import { useApp } from '../contexts/AppContext';

export function useSpeech() {
  const { state } = useApp();
  const { speechRate } = state.settings;

  const speak = useCallback((text: string) => {
    Speech.stop();
    Speech.speak(text, {
      language: 'zh-CN',
      pitch: 1.0,
      rate: speechRate,
    });
  }, [speechRate]);

  const stop = useCallback(() => {
    Speech.stop();
  }, []);

  return { speak, stop };
}
