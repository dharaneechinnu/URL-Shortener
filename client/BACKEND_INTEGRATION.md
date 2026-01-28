# 🔗 Backend Integration Guide

This guide shows exactly where and how to connect the frontend to your Django backend.

## Backend Summary

Your Django backend has:
- **Accounts App**: User registration and login
- **Links App**: URL shortening and management

---

## 1️⃣ Authentication Integration

### RegisterScreen (`app/(auth)/register.tsx`)

**Location**: Line ~77 (handleRegister function)

**Current**:
```typescript
// TODO: Implement actual registration API call
```

**Implement**:
```typescript
const handleRegister = async () => {
  if (!validateForm()) return;
  
  setLoading(true);
  try {
    const response = await fetch(
      `${APP_CONFIG.API_BASE_URL}${AUTH_CONFIG.REGISTER_ENDPOINT}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      Alert.alert('Registration Failed', error.detail || 'Please try again');
      return;
    }

    Alert.alert('Success', 'Account created! Please log in.', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  } catch (error) {
    Alert.alert('Error', 'An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

**Backend Endpoint**:
```
POST /accounts/register/
Body: {
  "username": "string",
  "email": "string@example.com",
  "password": "string"
}
Response: {
  "id": 1,
  "username": "string",
  "email": "string@example.com",
  "created_at": "2025-01-28T...",
  "updated_at": "2025-01-28T..."
}
```

---

### LoginScreen (`app/(auth)/login.tsx`)

**Location**: Line ~51 (handleLogin function)

**Current**:
```typescript
// TODO: Implement actual login API call
```

**Implement**:
```typescript
import { saveAuthToken, saveRefreshToken, saveUserData } from '../utils/storage';
import { useRouter } from 'expo-router';

const handleLogin = async () => {
  if (!validateForm()) return;
  
  setLoading(true);
  try {
    const response = await fetch(
      `${APP_CONFIG.API_BASE_URL}${AUTH_CONFIG.LOGIN_ENDPOINT}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      Alert.alert('Login Failed', error.detail || 'Invalid credentials');
      return;
    }

    const data = await response.json();
    
    // Save tokens
    await saveAuthToken(data.access);
    await saveRefreshToken(data.refresh);
    await saveUserData(data.user);
    
    // Navigation handled by root _layout.tsx
    Alert.alert('Success', 'Logged in successfully!');
  } catch (error) {
    Alert.alert('Error', 'An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

**Backend Endpoint**:
```
POST /accounts/login/
Body: {
  "username": "string",
  "password": "string"
}
Response: {
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string@example.com"
  }
}
```

---

### Root Layout (`app/_layout.tsx`)

**Location**: Line ~8-30 (useAuthState hook)

**Current** (uses temporary state):
```typescript
const useAuthState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Check if user token exists in storage and validate it
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return { isAuthenticated, isLoading };
};
```

**Implement**:
```typescript
import { getAuthToken } from './utils/storage';

const useAuthState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getAuthToken();
        if (token) {
          // Optional: Validate token with backend
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
};
```

---

## 2️⃣ Links Integration

### HomeScreen - Create Shortened URL (`app/(tab)/home.tsx`)

**Location**: Line ~59 (handleShorten function)

**Current**:
```typescript
// TODO: Implement actual API call to create shortened URL
```

**Implement**:
```typescript
import { getAuthToken } from '../../utils/storage';

const handleShorten = async () => {
  if (!validateForm()) return;
  
  setLoading(true);
  try {
    const token = await getAuthToken();
    
    const response = await fetch(
      `${APP_CONFIG.API_BASE_URL}/links/shorten/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          original_url: formData.originalUrl,
          custom_alias: formData.customAlias || null,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      Alert.alert('Error', error.detail || 'Failed to shorten URL');
      return;
    }

    const result = await response.json();
    
    Alert.alert('Success', `Short URL: ${result.short_url}`, [
      {
        text: 'Copy',
        onPress: () => {
          // Clipboard.setString(result.short_url);
          Alert.alert('Copied!', result.short_url);
        },
      },
      { text: 'OK' },
    ]);

    // Clear form
    setFormData({ originalUrl: '', customAlias: '' });
  } catch (error) {
    Alert.alert('Error', 'Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

**Backend Endpoint**:
```
POST /links/shorten/
Headers: Authorization: Bearer {token}
Body: {
  "original_url": "https://example.com/very/long/url",
  "custom_alias": "my-link" (optional, null for auto-generated)
}
Response: {
  "id": 1,
  "original_url": "https://example.com/very/long/url",
  "short_code": "abc123",
  "short_url": "https://short.url/abc123",
  "clicks": 0,
  "is_active": true,
  "created_at": "2025-01-28T..."
}
```

---

### MyLinksScreen - Fetch Links (`app/(tab)/myLinks.tsx`)

**Location**: Line ~33 (loadLinks function)

**Current**:
```typescript
// TODO: Implement actual API call to fetch user's links
```

**Implement**:
```typescript
import { getAuthToken } from '../../utils/storage';

const loadLinks = async () => {
  setLoading(true);
  try {
    const token = await getAuthToken();
    
    const response = await fetch(
      `${APP_CONFIG.API_BASE_URL}/links/`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch links');
    }

    const data = await response.json();
    setLinks(data); // or data.results if paginated
  } catch (error) {
    console.error('Load links error:', error);
    Alert.alert('Error', 'Failed to load links');
    setLinks([]);
  } finally {
    setLoading(false);
  }
};
```

**Backend Endpoint**:
```
GET /links/
Headers: Authorization: Bearer {token}
Response: [
  {
    "id": 1,
    "original_url": "https://example.com",
    "short_code": "abc123",
    "clicks": 5,
    "is_active": true,
    "created_at": "2025-01-28T..."
  },
  ...
]
```

---

### MyLinksScreen - Delete Link (`app/(tab)/myLinks.tsx`)

**Location**: Line ~71 (handleDeleteLink function)

**Current**:
```typescript
// TODO: Implement actual delete API call
```

**Implement**:
```typescript
const handleDeleteLink = (linkId: number) => {
  Alert.alert(
    'Delete Link',
    'Are you sure you want to delete this link?',
    [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const token = await getAuthToken();
            
            const response = await fetch(
              `${APP_CONFIG.API_BASE_URL}/links/${linkId}/`,
              {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error('Failed to delete');
            }

            setLinks(links.filter(l => l.id !== linkId));
            Alert.alert('Success', 'Link deleted');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete link');
          }
        },
        style: 'destructive',
      },
    ]
  );
};
```

**Backend Endpoint**:
```
DELETE /links/{id}/
Headers: Authorization: Bearer {token}
Response: Status 204 No Content
```

---

### MyLinksScreen - Toggle Link Status (`app/(tab)/myLinks.tsx`)

**Location**: Line ~89 (handleToggleActive function)

**Current**:
```typescript
// TODO: Implement actual API call to toggle link status
```

**Implement**:
```typescript
const handleToggleActive = async (link: ShortenedLink) => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(
      `${APP_CONFIG.API_BASE_URL}/links/${link.id}/`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_active: !link.is_active,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update');
    }

    setLinks(
      links.map(l =>
        l.id === link.id ? { ...l, is_active: !l.is_active } : l
      )
    );
    Alert.alert(
      'Success',
      `Link ${!link.is_active ? 'enabled' : 'disabled'}`
    );
  } catch (error) {
    Alert.alert('Error', 'Failed to update link status');
  }
};
```

**Backend Endpoint**:
```
PATCH /links/{id}/
Headers: Authorization: Bearer {token}
Body: {
  "is_active": true/false
}
Response: {
  "id": 1,
  "original_url": "...",
  "short_code": "...",
  "clicks": 5,
  "is_active": true/false,
  "created_at": "..."
}
```

---

## 3️⃣ Environment Setup

### Create `.env` file in `client/` directory

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000/api
```

Or for different environments:
```bash
# Development
EXPO_PUBLIC_API_URL=http://localhost:8000/api

# Staging
EXPO_PUBLIC_API_URL=https://staging-api.example.com/api

# Production
EXPO_PUBLIC_API_URL=https://api.example.com/api
```

---

## 4️⃣ Error Handling Best Practices

### Token Refresh on 401
```typescript
const fetchWithTokenRefresh = async (url: string, options: any) => {
  let response = await fetch(url, options);
  
  if (response.status === 401) {
    const refreshToken = await getRefreshToken();
    const refreshResponse = await fetch(
      `${APP_CONFIG.API_BASE_URL}${AUTH_CONFIG.REFRESH_TOKEN_ENDPOINT}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );
    
    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      await saveAuthToken(data.access);
      
      // Retry original request
      options.headers['Authorization'] = `Bearer ${data.access}`;
      response = await fetch(url, options);
    } else {
      // Token refresh failed - redirect to login
      await clearAuthData();
      // Navigate to auth
    }
  }
  
  return response;
};
```

---

## 5️⃣ Testing Checklist

- [ ] Register new user → Can login
- [ ] Login existing user → Navigate to app
- [ ] Create shortened URL → See short code
- [ ] View my links → List shows all links
- [ ] Delete link → Link removed from list
- [ ] Enable/disable link → Status updates
- [ ] Token refresh → Auto-refresh on 401
- [ ] Logout → Navigate back to auth

---

## 🎯 Integration Priority

1. **HIGH**: Login & Register (gate to entire app)
2. **HIGH**: Create shortened URL (core feature)
3. **MEDIUM**: Fetch links list
4. **MEDIUM**: Delete link
5. **LOW**: Toggle link status
6. **LOW**: Copy to clipboard

---

**All endpoints are ready to be implemented. Choose your priority and start integrating!** 🚀
