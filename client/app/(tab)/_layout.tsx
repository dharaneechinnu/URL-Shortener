/**
 * App Tab Stack Layout
 * Handles tab navigation for main app screens (home, myLinks)
 */

import React from 'react';
import { Alert, Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logout();
              try {
                router.replace('/(auth)');
              } catch (navErr) {
                console.warn('Navigation after logout failed:', navErr);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
              console.error('Logout error:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Shorten',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'link' : 'link-outline'}
              size={24}
              color={color}
            />
          ),
          headerTitle: 'URL Shortener',
          headerRight: () => (
            <Pressable
              onPress={handleLogout}
              style={{ marginRight: 16 }}
            >
              <MaterialCommunityIcons
                name="logout"
                size={24}
                color="#FF3B30"
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="myLinks"
        options={{
          title: 'My Links',
          tabBarLabel: 'My Links',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'list' : 'list-outline'}
              size={24}
              color={color}
            />
          ),
          headerTitle: 'My Shortened Links',
          headerRight: () => (
            <Pressable
              onPress={handleLogout}
              style={{ marginRight: 16 }}
            >
              <MaterialCommunityIcons
                name="logout"
                size={24}
                color="#FF3B30"
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          tabBarLabel: 'Login',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'list' : 'list-outline'}
              size={24}
              color={color}
            />
          ),
          headerTitle: 'My Shortened Links',
        }}
      />
    </Tabs>
  );
}
