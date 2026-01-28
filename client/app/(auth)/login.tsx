/**
 * LoginScreen
 * User login screen component
 * Uses AuthContext for authentication
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import AppButton from '../components/AppButton';
import { useAuth } from '../../contexts/AuthContext';
import { APP_CONFIG, AUTH_CONFIG } from '../../constants/config';

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleLogin = async () => {
  console.log("🔐 Login started");
  console.log("📤 Form Data:", formData);

  if (!validateForm()) {
    console.warn("❌ Form validation failed");
    return;
  }

  setLoading(true);

  try {
    const url = `${APP_CONFIG.API_BASE_URL}${AUTH_CONFIG.LOGIN_ENDPOINT}`;
    console.log("🌐 Request URL:", url);

    const payload = JSON.stringify(formData);
    console.log("📦 Payload:", payload);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });

    console.log("📡 Response Status:", response.status);
    console.log("📡 Response OK:", response.ok);

    const rawText = await response.text();
    console.log("📝 Raw Response:", rawText);

    let data: any = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch (e) {
      console.error("⚠️ JSON Parse Error:", e);
    }

    console.log("📥 Parsed Data:", data);

    if (!response.ok) {
      const errorMsg = data?.detail || data?.message || "Invalid credentials";
      console.warn("🚫 Login Failed:", errorMsg);
      Alert.alert('Login Failed', errorMsg);
      return;
    }

    console.log("✅ Login Success");
    console.log("🔑 Access Token:", data.access);
    console.log("👤 User:", data.user);

    // Save token and user data
    await login(data.access, data.user);
    console.log("💾 Token saved, user logged in");

    // Force navigation to app tabs immediately
    try {
      router.replace('/(tab)');
    } catch (navErr) {
      console.warn('Navigation after login failed:', navErr);
    }

  } catch (error) {
    console.error("🔥 Network / Runtime Error:", error);
    Alert.alert('Error', 'An error occurred during login');
  } finally {
    console.log("⏹️ Login flow finished");
    setLoading(false);
  }
};


  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

        </View>

        <View style={styles.form}>
          {/* Username Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              placeholder="Enter your username"
              placeholderTextColor="#999"
              value={formData.username}
              onChangeText={value => handleInputChange('username', value)}
              editable={!loading}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={formData.password}
              onChangeText={value => handleInputChange('password', value)}
              secureTextEntry
              editable={!loading}
              autoCapitalize="none"
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Login Button */}
          <AppButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            variant="primary"
            size="large"
            style={styles.loginButton}
          />
        </View>

        {/* Register Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <Text style={styles.registerLink}>Sign Up</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#F9F9F9',
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  loginButton: {
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});
