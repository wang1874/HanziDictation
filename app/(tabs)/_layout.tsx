import React from 'react';
import { Tabs } from 'expo-router';
import { useApp } from '../../src/contexts/AppContext';
import { Colors } from '../../src/utils/theme';

function TabBarIcon({ name, color }: { name: string; color: string }) {
  const icons: { [key: string]: string } = {
    '听写': '📝',
    '练习': '📖',
    '错题本': '❌',
    '我的': '👤',
  };

  return (
    <React.Fragment>
      {React.createElement(
        require('react-native').Text,
        { style: { fontSize: 24 } },
        icons[name] || '📄'
      )}
    </React.Fragment>
  );
}

export default function TabLayout() {
  const { state } = useApp();
  const { darkMode } = state.settings;
  const theme = darkMode ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '听写',
          tabBarIcon: ({ color }) => <TabBarIcon name="听写" color={color} />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: '练习',
          tabBarIcon: ({ color }) => <TabBarIcon name="练习" color={color} />,
        }}
      />
      <Tabs.Screen
        name="wrong"
        options={{
          title: '错题本',
          tabBarIcon: ({ color }) => <TabBarIcon name="错题本" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => <TabBarIcon name="我的" color={color} />,
        }}
      />
    </Tabs>
  );
}
