import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from '../src/contexts/AppContext';
import { Colors } from '../src/utils/theme';

function RootLayoutContent() {
  const { state } = useApp();
  const { darkMode } = state.settings;
  const theme = darkMode ? Colors.dark : Colors.light;

  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="dictation"
          options={{
            title: '听写练习',
            headerBackTitle: '返回',
          }}
        />
        <Stack.Screen
          name="practice"
          options={{
            title: '练习模式',
            headerBackTitle: '返回',
          }}
        />
        <Stack.Screen
          name="debug"
          options={{
            title: '豆包API调试',
            headerBackTitle: '返回',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutContent />
    </AppProvider>
  );
}
