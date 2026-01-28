/**
 * Root Layout
 * Entry point for navigation - decides between auth and app stacks
 * Uses AuthContext to manage global authentication state
 */

import React from 'react';
import { Stack } from 'expo-router';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

/**
 * Root Layout Content
 * This component uses the Auth Context to determine which stack to show
 */
function RootLayoutContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      
      }}
    >
      {isAuthenticated ? (
        // User is logged in - show app stack (tabs)
        <Stack.Screen
          name="(tab)"
          options={{
            title: 'App',
          }}
        />
      ) : (
        // User is not logged in - show auth stack (login/register)
        <Stack.Screen
          name="(auth)"
          options={{
            title: 'Auth',
          }}
        />
      )}
    </Stack>
  );
}

/**
 * Root Layout with AuthProvider
 * Wraps the app with AuthProvider so all screens have access to auth context
 */
export default function RootLayout() {
  return (
    <>
    <StatusBar barStyle="dark-content" />
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
    </>
    
  );
}
