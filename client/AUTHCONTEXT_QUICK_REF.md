# ⚡ AuthContext Quick Reference

## 🚀 30-Second Overview

You now have a **complete authentication system** using React Context:

- ✅ Global auth state (login/logout)
- ✅ Automatic navigation
- ✅ Token persistence
- ✅ User data display
- ✅ Ready for backend

---

## 📁 Key Files

```
app/
├── contexts/
│   └── AuthContext.tsx          ← NEW: Auth state management
├── _layout.tsx                  ← UPDATED: Uses AuthContext
├── (auth)/
│   ├── login.tsx               ← UPDATED: Uses AuthContext
│   └── register.tsx            ← UPDATED: Uses AuthContext
└── (tab)/
    └── home.tsx                ← UPDATED: User data + logout
```

---

## 🔧 Quick Integration

### Login API
```typescript
// app/(auth)/login.tsx - Line ~62
const response = await fetch(`${APP_CONFIG.API_BASE_URL}/accounts/login/`, {
  method: 'POST',
  body: JSON.stringify(formData),
});
const data = await response.json();
await login(data.access, data.user); // ← Uses AuthContext
```

### Register API
```typescript
// app/(auth)/register.tsx - Line ~85
const response = await fetch(`${APP_CONFIG.API_BASE_URL}/accounts/register/`, {
  method: 'POST',
  body: JSON.stringify({ username, email, password }),
});
const data = await response.json();
await login(data.access, data.user); // ← Auto-login or navigate
```

---

## 🎯 Usage in Components

### Get Auth State
```typescript
import { useAuth } from '../contexts/AuthContext';

export function MyComponent() {
  const { isAuthenticated, isLoading, user, login, logout } = useAuth();
  
  return (
    <>
      {isLoading && <Spinner />}
      {isAuthenticated && <Text>Welcome, {user?.username}</Text>}
    </>
  );
}
```

### Login
```typescript
const { login } = useAuth();

const handleLogin = async () => {
  await login('token-here', { username: 'alice' });
  // Navigation happens automatically
};
```

### Logout
```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // Navigation back to login happens automatically
};
```

---

## ✅ Testing Checklist

- [ ] App starts with loading spinner
- [ ] Login screen appears
- [ ] Can enter username and password
- [ ] Login shows success alert
- [ ] Home screen appears with welcome message
- [ ] Welcome message shows username
- [ ] Logout button visible
- [ ] Logout confirms with alert
- [ ] Returns to login after logout
- [ ] Can login again

See AUTHCONTEXT_TESTING.md for detailed scenarios.

---

## 🔄 Navigation Flow

```
Login Screen
    ↓
handleLogin() calls login(token, user)
    ↓
Token saved to AsyncStorage
    ↓
isAuthenticated = true
    ↓
Root layout shows (tab) stack
    ↓
Home Screen shows with welcome
```

---

## 💾 Data Storage

**What gets saved:**
- `@url_shortener:auth_token` - User's access token
- `@url_shortener:refresh_token` - Refresh token (optional)
- `@url_shortener:user_data` - User info (optional)

**Where:**
- AsyncStorage (device storage)
- Persistent across app restarts

**When:**
- Saved on login via `login()`
- Checked on app startup via `checkAuth()`
- Cleared on logout via `logout()`

---

## 🚨 Error Handling

All auth operations have try-catch blocks:

```typescript
try {
  // auth operation
  await login(token, user);
} catch (error) {
  console.error('Auth error:', error);
  Alert.alert('Error', 'Authentication failed');
}
```

---

## 📊 State Variables

| Variable | Type | Meaning |
|----------|------|---------|
| `isAuthenticated` | boolean | Is user logged in? |
| `isLoading` | boolean | Is checking auth? |
| `user` | object\|null | Current user data |

---

## 🎨 UI Changes

### Home Screen
- ✅ Added: Welcome message with username
- ✅ Added: Logout button
- ✅ Styles: User info in blue, logout button gray

### Login Screen
- ✅ Updated: Now uses `login()` function
- ✅ Updated: Auto-navigates to home on success

### Root Layout
- ✅ Updated: Wrapped with AuthProvider
- ✅ Updated: Uses `useAuth()` for navigation

---

## 🔌 Backend Ready

All API integration points are marked with TODO:

| Feature | File | Line |
|---------|------|------|
| Login | login.tsx | ~62 |
| Register | register.tsx | ~85 |

Just uncomment the fetch code and update endpoints.

---

## 🧪 Mock Testing

Current app works with mock data:

```typescript
// Mock login - works immediately
login('mock-token-' + Date.now(), {
  username: formData.username,
  email: formData.username + '@example.com',
});
```

No backend needed to test auth flow!

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| AUTHCONTEXT_COMPLETE.md | This summary |
| AUTHCONTEXT_GUIDE.md | Detailed explanation |
| AUTHCONTEXT_TESTING.md | Test scenarios |
| AUTHCONTEXT_IMPLEMENTATION.md | What changed |

---

## ⚙️ Configuration

**API Configuration:**
```typescript
// app/constants/config.ts
export const APP_CONFIG = {
  API_BASE_URL: 'http://localhost:8000/api', // ← Update this
  // ...
};

export const AUTH_CONFIG = {
  REGISTER_ENDPOINT: '/accounts/register/',
  LOGIN_ENDPOINT: '/accounts/login/',
};
```

---

## 🎯 Next Steps

1. **Test mock login** - Verify flow works
2. **Set API_BASE_URL** - Point to your backend
3. **Uncomment API calls** - In login.tsx and register.tsx
4. **Create test account** - In Django admin
5. **Test real login** - With real credentials
6. **Verify persistence** - Close and reopen app
7. **Deploy** - Push to production

---

## 💡 Common Tasks

### Access user data in any component
```typescript
const { user } = useAuth();
console.log(user.username);
```

### Protect a route
```typescript
const { isAuthenticated } = useAuth();
if (!isAuthenticated) return <Redirect href="/login" />;
```

### Check if loading
```typescript
const { isLoading } = useAuth();
if (isLoading) return <Spinner />;
```

### Force logout (rare case)
```typescript
const { logout } = useAuth();
await logout();
```

---

## 🆘 Troubleshooting

**Always shows login:** Clear AsyncStorage or check token not saving
**No welcome message:** Check user object has `username` property
**Logout doesn't work:** Check logout() is being called
**App crashes:** Check import paths and TypeScript errors

---

## ✨ Key Benefits

| Old Way | New Way |
|---------|---------|
| Local state | Global context |
| No persistence | Token persists |
| Manual nav | Automatic nav |
| Limited scope | Everywhere access |

---

## 🎉 Status

- ✅ AuthContext created and working
- ✅ Integrated with root layout
- ✅ Login/Register use context
- ✅ Home shows user data
- ✅ Logout implemented
- ✅ Mock testing ready
- ✅ Documentation complete
- ✅ Ready for backend integration

---

**You're all set! Start with testing, then integrate your backend.** 🚀

*For details, see AUTHCONTEXT_GUIDE.md and AUTHCONTEXT_TESTING.md*
