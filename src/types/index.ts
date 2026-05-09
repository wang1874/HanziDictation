export type DictationType = 'character' | 'word' | 'sentence';

export interface Word {
  id: string;
  text: string;
  pinyin?: string;
  type: DictationType;
  grade?: number;
}

export interface DictationResult {
  word: Word;
  userAnswer: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface DictationSession {
  id: string;
  type: DictationType;
  grade?: number;
  results: DictationResult[];
  startTime: number;
  endTime?: number;
}

export interface Settings {
  speechRate: number;
  fontSize: number;
  darkMode: boolean;
}

export interface AppState {
  currentSession: DictationSession | null;
  history: DictationSession[];
  wrongAnswers: Word[];
  settings: Settings;
}
