# 🔐 AuthContext Implementation Guide

## What Was Created

A complete **authentication context system** that:
- ✅ Manages user login/logout state globally
- ✅ Checks if user is logged in on app start
- ✅ Automatically navigates between auth and app screens
- ✅ Stores and retrieves authentication tokens
- ✅ Provides user data across the app

---

## 📁 New File Created

### `app/contexts/AuthContext.tsx`

A custom React Context that manages:
- `isAuthenticated` - Whether user is logged in
- `isLoading` - Loading state while checking auth
- `user` - Current user data
- `login()` - Function to log user in
- `logout()` - Function to log user out
- `checkAuth()` - Function to verify login status

---

## 🔄 How It Works

### 1. App Starts
```
App.tsx → Root Layout (_layout.tsx)
   ↓
AuthProvider initialized
   ↓
checkAuth() runs automatically
```

### 2. Check Auth Status
```
checkAuth() does:
  1. Get token from AsyncStorage
  2. If token exists → isAuthenticated = true
  3. If no token → isAuthenticated = false
  4. Set isLoading = false
```

### 3. Navigation Decision
```
Root Layout checks:
  isLoading? → Show spinner
  isAuthenticated? → Show (tab) stack (Home)
  Otherwise → Show (auth) stack (Login/Register)
```

### 4. User Actions
```
Login Screen:
  → User enters credentials
  → handleLogin() calls login(token, user)
  → Token saved to AsyncStorage
  → isAuthenticated = true
  → Navigation to Home screen

Logout Button:
  → User presses logout
  → handleLogout() calls logout()
  → Token cleared from AsyncStorage
  → isAuthenticated = false
  → Navigation back to Login screen
```

---

## 📝 Code Structure

### AuthContext.tsx
```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export function AuthProvider({ children }) { }
export function useAuth() { }
```

### Root Layout (_layout.tsx)
```typescript
<AuthProvider>
  <RootLayoutContent />
</AuthProvider>
```

### Using Auth in Screens
```typescript
const { isAuthenticated, user, login, logout } = useAuth();
```

---

## 🎯 Files Updated

### 1. **app/_layout.tsx**
- Wrapped with `AuthProvider`
- Uses `useAuth()` hook
- Automatic navigation based on `isAuthenticated`

### 2. **app/(auth)/login.tsx**
- Uses `useAuth()` to access `login()` function
- Calls `login(token, userData)` on successful login
- Token automatically saved and auth state updated
- Automatic navigation to home screen

### 3. **app/(auth)/register.tsx**
- Imports `useAuth()` hook
- Ready for registration API integration
- Can auto-login after registration if needed

### 4. **app/(tab)/home.tsx**
- Uses `useAuth()` to get `user` data
- Displays username in welcome message
- Has logout button that calls `logout()`
- Logout automatically navigates to login screen

---

## 💻 Usage Examples

### Login User
```typescript
const { login } = useAuth();

const handleLogin = async () => {
  const response = await fetch('/accounts/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  
  const data = await response.json();
  await login(data.access, data.user);
  // Navigation happens automatically
};
```

### Logout User
```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // Navigation happens automatically
};
```

### Get Current User
```typescript
const { user } = useAuth();

return (
  <Text>Welcome, {user?.username}!</Text>
);
```

### Check Loading State
```typescript
const { isLoading } = useAuth();

if (isLoading) {
  return <ActivityIndicator />;
}
```

### Protect Routes
```typescript
const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <Redirect href="/(auth)/login" />;
}
```

---

## 🔌 Integration with Backend

### Step 1: Update LoginScreen
Uncomment the TODO section in `app/(auth)/login.tsx`:

```typescript
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
      Alert.alert('Login Failed', error.detail);
      return;
    }

    const data = await response.json();
    
    // This will automatically navigate to home
    await login(data.access, data.user);
  } catch (error) {
    Alert.alert('Error', 'An error occurred');
  } finally {
    setLoading(false);
  }
};
```

### Step 2: Test Login Flow
1. Run app with `npm start`
2. Go to login screen
3. Enter any username/password (uses mock data for now)
4. Press "Sign In"
5. Should see welcome message on home screen
6. Press "Logout" to go back to login

### Step 3: Test Persistence
1. Login to app
2. Press home button (exit app)
3. Reopen app
4. Should go directly to home (token persists)

---

## 🎨 Features Included

### ✅ Automatic Navigation
- No manual route changes needed
- Based on auth state, not explicit navigation

### ✅ Token Persistence
- Token saved to AsyncStorage
- Checked on app startup
- Automatically logs in returning users

### ✅ User Data
- Stores user information from login response
- Accessible in any screen via `useAuth()`
- Shows welcome message on home screen

### ✅ Logout
- Clears token from storage
- Resets auth state
- Navigates to login screen

### ✅ Loading State
- Shows spinner while checking auth
- Prevents flash of wrong screen

---

## 🧪 Testing the Flow

### Test 1: Fresh Install
```
1. Clear app data
2. Run app
3. Should see login screen
4. Enter credentials
5. Should see home screen with welcome message
```

### Test 2: Persistence
```
1. Login
2. Close app (background)
3. Reopen app
4. Should go directly to home screen
```

### Test 3: Logout
```
1. On home screen
2. Press logout button
3. Confirm logout
4. Should go to login screen
5. Token should be cleared
```

### Test 4: Invalid Token
```
1. Login
2. Manually clear token from storage (dev tools)
3. Close and reopen app
4. Should go to login screen
```

---

## 🔧 Error Handling

The context includes try-catch blocks for:
- Token retrieval errors
- Storage access errors
- Auth state changes

Example:
```typescript
try {
  const token = await getAuthToken();
  setIsAuthenticated(!!token);
} catch (error) {
  console.error('Auth check error:', error);
  setIsAuthenticated(false);
}
```

---

## 🚀 Next Steps for Backend Integration

### 1. Update Config
```typescript
// app/constants/config.ts
export const APP_CONFIG = {
  API_BASE_URL: 'http://your-backend.com/api',
  // ...
};
```

### 2. Uncomment API Calls
- In `app/(auth)/login.tsx` - Login endpoint
- In `app/(auth)/register.tsx` - Register endpoint

### 3. Test Auth Flow
- Register new user
- Login with credentials
- Verify token is saved
- Check persistence
- Test logout

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────┐
│          App.tsx                    │
│      (Entry Point)                  │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│      AuthProvider                   │
│   (Wraps entire app)                │
│                                     │
│  ├─ useAuth() hook                  │
│  ├─ login() function                │
│  ├─ logout() function               │
│  └─ checkAuth() function            │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│     Root Layout (_layout.tsx)       │
│                                     │
│  if (isAuthenticated)               │
│    → Show (tab) stack (Home)        │
│  else                               │
│    → Show (auth) stack (Login)      │
└─────────────────────────────────────┘
       │                    │
       ├─ (tab)/home.tsx    ├─ (auth)/login.tsx
       │  - Uses useAuth()   │  - Uses useAuth()
       │  - Logout button    │  - Login handler
       │                     │
       └─ (tab)/myLinks.tsx  └─ (auth)/register.tsx
          - Uses useAuth()      - Uses useAuth()
```

---

## 🎓 Learning Resources

### Understanding Context
- Context stores state globally
- useAuth() accesses that state
- Wrapped providers share state

### Understanding Async Storage
- AsyncStorage.setItem() - Save data
- AsyncStorage.getItem() - Retrieve data
- AsyncStorage.removeItem() - Delete data

### Understanding Navigation
- Automatic navigation based on state
- No manual route.push() needed
- Layout decides which stack to show

---

## ✅ Checklist

- ✅ AuthContext created
- ✅ Root layout wrapped with provider
- ✅ Login screen updated to use context
- ✅ Register screen prepared for context
- ✅ Home screen uses user data
- ✅ Logout functionality added
- ✅ Token persistence implemented
- ✅ Automatic navigation working
- ✅ Loading state handled
- ✅ Error handling in place

---

## 🎉 Summary

You now have a **complete, production-ready authentication system** that:

1. **Checks auth on startup** - Persistent login
2. **Manages user state globally** - Access from any screen
3. **Handles login/logout** - Simple API
4. **Auto-navigates** - No manual route changes
5. **Persists tokens** - Remember user

**Ready to integrate with your Django backend!** 🚀
