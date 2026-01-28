/**
 * Root Index Route
 * This file exists for Expo Router but the actual routing is handled by _layout.tsx
 * Users are automatically directed to either (auth) or (tab) stacks based on AuthContext
 */

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/" />;
}
