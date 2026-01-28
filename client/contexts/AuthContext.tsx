/**
 * AuthContext
 * Global authentication state management
 * Handles user login/logout and authentication token management
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthToken, saveAuthToken, clearAuthData } from '../utils/storage';

/**
 * Auth Context Type
 */
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

/**
 * Create Auth Context with default values
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 * Wraps the app and provides authentication state to all screens
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  /**
   * Check if user is already logged in (token exists)
   */
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = await getAuthToken();
      
      if (token) {
        // TODO: Validate token with backend if needed
        setIsAuthenticated(true);
        // Load user data from storage if available
        // You can add this later: const userData = await getUserData();
        // setUser(userData);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user - save token and update state
   */
  const login = async (token: string, userData: any) => {
    try {
      setIsLoading(true);
      await saveAuthToken(token);
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
    finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user - clear token and reset state
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      await clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
    finally {
      setIsLoading(false);
    }
  };

  /**
   * Check auth status on app start
   */
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use Auth Context
 * Usage: const { isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}
