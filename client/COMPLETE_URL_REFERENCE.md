# 🔌 Complete URL Configuration

## ❌ CURRENT ISSUE FOUND

Your frontend is configured to call:
```
http://192.168.1.100:8000/api/accounts/login/
http://192.168.1.100:8000/api/accounts/register/
```

But Django URLs are:
```
http://192.168.1.100:8000/Auth/token/
http://192.168.1.100:8000/Auth/token/refresh/
http://192.168.1.100:8000/Auth/register/
```

**These don't match!** ❌

---

## ✅ SOLUTION: Fix Django URLs

**Update Django to match frontend expectations:**

### Option 1: Update Django URLs (Recommended)

Edit `url_shortener/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Add /api/ prefix for consistency
    path('api/accounts/', include('accounts.urls')),
    path('api/links/', include('links.urls')),
]
```

Then endpoints become:
- `/api/accounts/register/` ✅
- `/api/accounts/login/` → Needs to be `/api/accounts/token/` (JWT)
- `/api/accounts/token/refresh/` ✅

### Option 2: Update Frontend URLs (Alternative)

Edit `client/constants/config.ts`:

```typescript
export const APP_CONFIG = {
  API_BASE_URL: 'http://192.168.1.100:8000',
};

export const AUTH_CONFIG = {
  REGISTER_ENDPOINT: '/Auth/register/',
  LOGIN_ENDPOINT: '/Auth/token/',
  REFRESH_TOKEN_ENDPOINT: '/Auth/token/refresh/',
};
```

---

## 🔑 Django Endpoints Explained

### 1. Register
```
POST http://192.168.1.100:8000/Auth/register/
Body: {
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123"
}

Response 201:
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "created_at": "2026-01-28T16:26:12Z"
}
```

### 2. Login (JWT Token)
```
POST http://192.168.1.100:8000/Auth/token/
Body: {
  "username": "alice",
  "password": "password123"
}

Response 200:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 3. Refresh Token
```
POST http://192.168.1.100:8000/Auth/token/refresh/
Body: {
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response 200:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## 🎯 Recommended: Use Option 1

### Step 1: Update Django URLs

File: `url_shortener/url_shortener/urls.py`

Replace:
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('Auth/',include('accounts.urls')),
    path('',include('links.urls')),
]
```

With:
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/links/', include('links.urls')),
]
```

### Step 2: Update Frontend Config

File: `client/constants/config.ts`

```typescript
export const AUTH_CONFIG = {
  REGISTER_ENDPOINT: '/accounts/register/',
  LOGIN_ENDPOINT: '/accounts/token/',  // ← Changed
  REFRESH_TOKEN_ENDPOINT: '/accounts/token/refresh/',
};
```

### Step 3: Update Frontend Login Code

File: `client/app/(auth)/login.tsx`

The `/accounts/login/` endpoint doesn't exist! Use `/accounts/token/` instead:

Find:
```typescript
`${APP_CONFIG.API_BASE_URL}${AUTH_CONFIG.LOGIN_ENDPOINT}`
```

It now correctly points to `/accounts/token/`

But you need to handle the response format difference:
- Current code expects: `{ access, user }`
- Django returns: `{ access, refresh }`

Need to fetch user separately or modify backend.

---

## 📊 Complete URL Reference

### After Implementing Option 1:

```
FRONTEND MAKES:
├─ POST http://192.168.1.100:8000/api/accounts/register/
│   └─ Create new user
│
├─ POST http://192.168.1.100:8000/api/accounts/token/
│   └─ Get JWT tokens
│
├─ POST http://192.168.1.100:8000/api/accounts/token/refresh/
│   └─ Refresh access token
│
└─ POST http://192.168.1.100:8000/api/links/shorten/
    └─ Create shortened URL

BACKEND RECEIVES AT:
├─ /api/accounts/register/  ← Registerview
├─ /api/accounts/token/     ← TokenObtainPairView (Django SimpleJWT)
├─ /api/accounts/token/refresh/  ← TokenRefreshView (Django SimpleJWT)
└─ /api/links/shorten/      ← Links endpoints
```

---

## ⚠️ Important Notes

1. **JWT Token Endpoint** - Django SimpleJWT uses `/token/` not `/login/`
2. **Response Format** - SimpleJWT returns `{access, refresh}` not `{access, refresh, user}`
3. **User Data** - Need to either:
   - Fetch user separately after login
   - Modify backend to include user in token response
   - Create custom login endpoint

---

## 🚀 Quick Fix (5 minutes)

1. Update Django `urls.py` to add `/api/` prefix
2. Update frontend `config.ts` to use `/accounts/token/` for login
3. Update frontend `login.tsx` to handle JWT response (access + refresh, no user)
4. Restart both servers

---

**Need clarification? Check the detailed endpoint documentation above!** ✅
