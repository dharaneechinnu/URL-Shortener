/**
 * Application Configuration
 * Central place for all app constants and configuration
 */

import { getAuthToken } from '../utils/storage';

export const APP_CONFIG = {
  APP_NAME: 'URL Shortener',
  VERSION: '1.0.0',
  // Use localhost for development (works for web)
  // For Android emulator use: 10.0.2.2:8000
  // For physical device use: Your_Machine_IP:8000
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.5:8000/api',
  REQUEST_TIMEOUT: 30000,
};

export const AUTH_CONFIG = {
  REGISTER_ENDPOINT: '/accounts/register/',
  LOGIN_ENDPOINT: '/accounts/login/',
  REFRESH_TOKEN_ENDPOINT: '/accounts/token/refresh/',
};

export const ROUTES = {
  // Auth stack
  LOGIN: 'login',
  REGISTER: 'register',
  // App stack
  HOME: 'home',
  MY_LINKS: 'myLinks',
};

/**
 * API Helper: Automatically includes Authorization header with token
 * Makes authenticated API calls simple and consistent
 */
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const apiBase = APP_CONFIG.API_BASE_URL.replace(/\/$/, '');
  const url = `${apiBase}${endpoint}`;
  
  // Get the auth token
  const token = await getAuthToken();
  console.log(`📡 API Call: ${options.method || 'GET'} ${url}`);
  
  // Prepare headers with proper typing
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add existing headers if provided
  if (options.headers && typeof options.headers === 'object') {
    const existingHeaders = options.headers as Record<string, string>;
    Object.assign(headers, existingHeaders);
  }
  
  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log(`✅ Auth: Bearer ${token.substring(0, 15)}...`);
  } else {
    console.log(`⚠️ No token found - request will be unauthenticated`);
  }
  
  console.log(`📦 Headers:`, { Authorization: headers['Authorization'] ? 'SET' : 'NONE', ContentType: headers['Content-Type'] });
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    console.log(`📊 Response: ${response.status} ${response.statusText}`);
    
    // Log response body for debugging
    if (!response.ok) {
      const text = await response.text();
      console.warn(`❌ API Error Body: ${text}`);
      // Return response as-is, let caller handle it
      return response;
    }
    
    return response;
  } catch (error) {
    console.error(`🔥 Fetch Error:`, error);
    throw error;
  }
}
