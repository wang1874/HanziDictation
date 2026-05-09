import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, DictationSession, Settings, Word } from '../types';

const STORAGE_KEY = '@hanzi_dictation_state';

const defaultSettings: Settings = {
  speechRate: 0.5,
  fontSize: 24,
  darkMode: false,
};

const initialState: AppState = {
  currentSession: null,
  history: [],
  wrongAnswers: [],
  settings: defaultSettings,
};

type Action =
  | { type: 'START_SESSION'; payload: DictationSession }
  | { type: 'END_SESSION' }
  | { type: 'ADD_RESULT'; payload: { word: Word; userAnswer: string; isCorrect: boolean } }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'CLEAR_WRONG_ANSWERS' };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'START_SESSION':
      return { ...state, currentSession: action.payload };

    case 'END_SESSION':
      if (state.currentSession) {
        const completedSession = {
          ...state.currentSession,
          endTime: Date.now(),
        };
        const newHistory = [completedSession, ...state.history].slice(0, 50);
        const wrongResults = completedSession.results.filter(r => !r.isCorrect);
        const newWrongAnswers = wrongResults.map(r => r.word);
        const mergedWrongAnswers = [...state.wrongAnswers, ...newWrongAnswers]
          .filter((w, index, self) => self.findIndex(x => x.id === w.id) === index)
          .slice(0, 100);

        return {
          ...state,
          currentSession: null,
          history: newHistory,
          wrongAnswers: mergedWrongAnswers,
        };
      }
      return state;

    case 'ADD_RESULT':
      if (state.currentSession) {
        const newResult = {
          word: action.payload.word,
          userAnswer: action.payload.userAnswer,
          isCorrect: action.payload.isCorrect,
          timestamp: Date.now(),
        };
        return {
          ...state,
          currentSession: {
            ...state.currentSession,
            results: [...state.currentSession.results, newResult],
          },
        };
      }
      return state;

    case 'LOAD_STATE':
      return { ...action.payload };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case 'CLEAR_HISTORY':
      return { ...state, history: [] };

    case 'CLEAR_WRONG_ANSWERS':
      return { ...state, wrongAnswers: [] };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  startSession: (type: DictationSession['type'], grade?: number) => void;
  submitAnswer: (word: Word, userAnswer: string) => void;
  endSession: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
  clearHistory: () => void;
  clearWrongAnswers: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const loadState = async () => {
    try {
      const savedState = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...parsed } });
      }
    } catch (error) {
      console.error('Failed to load state:', error);
    }
  };

  const saveState = async (stateToSave: AppState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  };

  const startSession = (type: DictationSession['type'], grade?: number) => {
    const session: DictationSession = {
      id: Date.now().toString(),
      type,
      grade,
      results: [],
      startTime: Date.now(),
    };
    dispatch({ type: 'START_SESSION', payload: session });
  };

  const submitAnswer = (word: Word, userAnswer: string) => {
    const isCorrect = word.text === userAnswer;
    dispatch({ type: 'ADD_RESULT', payload: { word, userAnswer, isCorrect } });
  };

  const endSession = () => {
    dispatch({ type: 'END_SESSION' });
  };

  const updateSettings = (settings: Partial<Settings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const clearHistory = () => {
    dispatch({ type: 'CLEAR_HISTORY' });
  };

  const clearWrongAnswers = () => {
    dispatch({ type: 'CLEAR_WRONG_ANSWERS' });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        startSession,
        submitAnswer,
        endSession,
        updateSettings,
        clearHistory,
        clearWrongAnswers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
