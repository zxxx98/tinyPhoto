import { useColorScheme } from '@/hooks/useColorScheme';
import { Icon } from '@rneui/themed';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#439ce0' : '#2089dc',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#86939e' : '#5e6977',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#393e42' : '#e1e8ee',
          ...Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => (
            <Icon name="home" type="material" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="webdav"
        options={{
          title: 'WebDAV',
          tabBarIcon: ({ color }) => (
            <Icon name="cloud" type="material" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: '图库',
          tabBarIcon: ({ color }) => (
            <Icon name="photo-library" type="material" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
