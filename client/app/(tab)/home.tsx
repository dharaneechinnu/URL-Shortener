/**
 * HomeScreen
 * Main home screen for creating shortened URLs
 * Uses AuthContext for user information and logout
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
import AppButton from '../components/AppButton';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { APP_CONFIG, apiCall } from '../../constants/config';

interface ShortenFormData {
  originalUrl: string;
}

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<ShortenFormData>({
    originalUrl: '',
   
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ShortenFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ShortenFormData> = {};

    if (!formData.originalUrl.trim()) {
      newErrors.originalUrl = 'URL is required';
    } else {
      try {
        new URL(formData.originalUrl);
      } catch {
        newErrors.originalUrl = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleShorten = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await apiCall('/links/urls/create/', {
        method: 'POST',
        body: JSON.stringify({
          original_url: formData.originalUrl,
        }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {}

      if (!res.ok) {
        const msg = data?.detail || data?.message || 'Failed to create link';
        Alert.alert('Error', msg);
        return;
      }

      Alert.alert('Success', 'Short link created');
      setFormData({ originalUrl: '' });
      // Navigate to My Links to view new item
      try {
        router.push('/(tab)/myLinks');
      } catch (navErr) {
        console.warn('Navigation to myLinks failed:', navErr);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to shorten URL');
      console.error('Shorten URL error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ShortenFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.title}>Shorten Your URL</Text>
              {user && (
                <Text style={styles.userInfo}>
                  Welcome, {user.username}!
                </Text>
              )}
            </View>
            <Text style={styles.subtitle}>
              Create short, memorable links to share
            </Text>
          </View>

          <View style={styles.form}>
            {/* URL Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Original URL *</Text>
              <TextInput
                style={[styles.input, errors.originalUrl && styles.inputError]}
                placeholder="https://example.com/very/long/url"
                placeholderTextColor="#999"
                value={formData.originalUrl}
                onChangeText={value => handleInputChange('originalUrl', value)}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                multiline
              />
              {errors.originalUrl && (
                <Text style={styles.errorText}>{errors.originalUrl}</Text>
              )}
            </View>

          
            </View>

            {/* Shorten Button */}
            <AppButton
              title="Shorten URL"
              onPress={handleShorten}
              loading={loading}
              variant="primary"
              size="large"
              style={styles.shortenButton}
            />

          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>How it works:</Text>
            <Text style={styles.infoItem}>
              1. Paste your long URL above
            </Text>
            <Text style={styles.infoItem}>
              2. Optionally customize your short link
            </Text>
            <Text style={styles.infoItem}>
              3. Share your shortened URL
            </Text>
            <Text style={styles.infoItem}>
              4. Track clicks and analytics
            </Text>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 32,
  },
  headerTitleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  userInfo: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    marginBottom: 32,
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
    minHeight: 44,
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
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  shortenButton: {
    marginTop: 8,
  },
  logoutButton: {
    marginTop: 12,
  },
  infoSection: {
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 13,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
});
