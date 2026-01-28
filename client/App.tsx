/**
 * Root App Component
 * Entry point for the React Native application
 * 
 * This component initializes the app with necessary providers and navigation
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootLayout from './app/_layout';

/**
 * Main App component
 * Sets up global providers and initializes the root layout
 */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RootLayout />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
