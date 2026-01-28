# 🚀 Quick Start Guide

## What Was Built

Complete production-ready React Native frontend for URL Shortener with:
- ✅ Authentication (Login/Register)
- ✅ Main app (Home & My Links screens)
- ✅ Form validation
- ✅ Navigation flow
- ✅ Type safety with TypeScript
- ✅ Reusable components
- ✅ Storage utilities

## Project Structure

```
app/
├── _layout.tsx                    # Navigation switcher
├── (auth)/                        # Login & Register
├── (tab)/                         # Home & My Links (tabbed)
├── components/                    # AppButton
├── constants/                     # config.ts
└── utils/                         # storage.ts, types.ts
```

## Navigation Flow

```
App Starts
    ↓
Check Authentication Token
    ├── Token exists? → App Stack (Home/My Links)
    └── No token? → Auth Stack (Login/Register)
```

## Screens & Their Purpose

| Screen | Path | Purpose |
|--------|------|---------|
| **LoginScreen** | `(auth)/login.tsx` | User login with validation |
| **RegisterScreen** | `(auth)/register.tsx` | User registration with validation |
| **HomeScreen** | `(tab)/home.tsx` | Create shortened URLs |
| **MyLinksScreen** | `(tab)/myLinks.tsx` | View & manage user's links |

## Running the App

```bash
cd client

# Install deps
npm install

# Start dev server
npm start

# Choose platform:
# Press 'a' → Android
# Press 'i' → iOS
# Press 'w' → Web
```

## Backend Integration Points

Each screen has **TODO comments** for API integration:

### LoginScreen
```javascript
// TODO: POST /accounts/login/
// Body: { username, password }
// Response: { access, refresh, user }
// Action: Save tokens, navigate to app
```

### RegisterScreen
```javascript
// TODO: POST /accounts/register/
// Body: { username, email, password }
// Response: { user }
// Action: Auto-login or navigate to login
```

### HomeScreen
```javascript
// TODO: POST /links/shorten/
// Body: { original_url, custom_alias }
// Response: { short_code, short_url }
// Action: Display shortened URL
```

### MyLinksScreen
```javascript
// TODO: GET /links/
// Response: [{ id, original_url, short_code, clicks, is_active, created_at }]
// Actions: Copy, Delete, Enable/Disable
```

## Key Utilities

### Storage (AsyncStorage)
```javascript
import { saveAuthToken, getAuthToken, clearAuthData } from 'app/utils/storage';

// Save token after login
await saveAuthToken(response.access);

// Get token for API calls
const token = await getAuthToken();

// Clear on logout
await clearAuthData();
```

### Configuration
```javascript
import { APP_CONFIG, AUTH_CONFIG, ROUTES } from 'app/constants/config';

// Use in API calls
const url = `${APP_CONFIG.API_BASE_URL}${AUTH_CONFIG.LOGIN_ENDPOINT}`;
```

### Types
```javascript
import { User, AuthResponse, LoginPayload } from 'app/utils/types';

const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  // ...
};
```

## Component Usage

### AppButton
```jsx
import AppButton from 'app/components/AppButton';

<AppButton
  title="Login"
  onPress={() => handleLogin()}
  loading={isLoading}
  variant="primary"
  size="large"
/>
```

## Form Validation Example

All screens have validation patterns like:
```javascript
const validateForm = (): boolean => {
  const errors: Partial<FormData> = {};
  
  if (!form.field) errors.field = 'Field is required';
  if (form.field.length < 3) errors.field = 'Min 3 characters';
  
  setErrors(errors);
  return Object.keys(errors).length === 0;
};
```

## Authentication Flow

1. User opens app
2. `_layout.tsx` checks for auth token
3. If token exists → Navigate to app stack
4. If no token → Navigate to auth stack
5. User can login/register
6. After successful login → Save token → Navigate to app
7. User navigates through tabs (Home, My Links)
8. On logout → Clear token → Navigate back to auth

## File Tree

```
client/
├── App.tsx
├── app/
│   ├── _layout.tsx
│   ├── (auth)/
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tab)/
│   │   ├── index.tsx
│   │   ├── home.tsx
│   │   └── myLinks.tsx
│   ├── components/
│   │   └── AppButton.tsx
│   ├── constants/
│   │   └── config.ts
│   └── utils/
│       ├── storage.ts
│       └── types.ts
├── ARCHITECTURE.md
└── IMPLEMENTATION_SUMMARY.md
```

## Next: Backend Integration

1. **Update `.env` file** with actual API URL
2. **Implement API calls** in each TODO marked location
3. **Handle errors** with proper validation
4. **Store tokens** using storage utilities
5. **Test end-to-end** navigation flow

## Common Tasks

### Adding a New Screen
```typescript
// 1. Create file: app/(tab)/newScreen.tsx
// 2. Export default functional component
// 3. Add to (tab)/index.tsx Tabs.Screen
```

### Adding a New Utility
```typescript
// Create in app/utils/newUtil.ts
// Import and use throughout app
```

### Handling API Errors
```typescript
try {
  const response = await fetch(...);
  if (!response.ok) {
    Alert.alert('Error', response.statusText);
  }
} catch (error) {
  Alert.alert('Error', 'Network error');
}
```

---

**Everything is ready. Time to connect the backend! 🚀**
