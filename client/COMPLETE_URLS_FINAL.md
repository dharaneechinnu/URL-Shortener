# 🔌 COMPLETE URL REFERENCE - FINALIZED

## ✅ ALL URLs Are Now Aligned!

Backend and frontend are now **perfectly synchronized**.

---

## 🚀 Frontend URLs (What the App Calls)

### Base Configuration
```typescript
// File: client/constants/config.ts

API_BASE_URL: 'http://192.168.1.100:8000/api'

AUTH_CONFIG = {
  REGISTER_ENDPOINT: '/accounts/register/',
  LOGIN_ENDPOINT: '/accounts/login/',
  REFRESH_TOKEN_ENDPOINT: '/accounts/token/refresh/',
}
```

### Complete Frontend URLs

```
1. REGISTER
   POST http://192.168.1.100:8000/api/accounts/register/
   
2. LOGIN
   POST http://192.168.1.100:8000/api/accounts/login/
   
3. REFRESH TOKEN
   POST http://192.168.1.100:8000/api/accounts/token/refresh/
```

---

## 🛠️ Backend Django URLs (What Handles Requests)

### File: url_shortener/urls.py
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/links/', include('links.urls')),
]
```

### Backend Endpoints

```
BASE URL: http://localhost:8000/api/

ACCOUNTS:
├─ /accounts/register/         → POST (create user)
├─ /accounts/login/            → POST (get tokens + user)
├─ /accounts/token/            → POST (JWT tokens only)
├─ /accounts/token/refresh/    → POST (refresh access)
└─ /accounts/token/verify/     → POST (verify token)

LINKS:
├─ /links/                      → GET (list user's links)
├─ /links/shorten/             → POST (create short link)
├─ /links/{id}/                → GET (link details)
├─ /links/{id}/                → PUT (update link)
└─ /links/{id}/                → DELETE (delete link)
```

---

## 📡 Request/Response Examples

### 1. Register Endpoint
```
REQUEST:
POST http://192.168.1.100:8000/api/accounts/register/
Content-Type: application/json

{
  "username": "alice",
  "email": "alice@example.com",
  "password": "SecurePass123"
}

RESPONSE (201 Created):
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "date_joined": "2026-01-28T16:26:12Z"
}
```

### 2. Login Endpoint
```
REQUEST:
POST http://192.168.1.100:8000/api/accounts/login/
Content-Type: application/json

{
  "username": "alice",
  "password": "SecurePass123"
}

RESPONSE (200 OK):
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "alice",
    "email": "alice@example.com",
    "date_joined": "2026-01-28T16:26:12Z"
  }
}
```

### 3. Refresh Token Endpoint
```
REQUEST:
POST http://192.168.1.100:8000/api/accounts/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}

RESPONSE (200 OK):
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 4. URL Shortening (Protected)
```
REQUEST:
POST http://192.168.1.100:8000/api/links/shorten/
Content-Type: application/json
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

{
  "original_url": "https://www.example.com/very/long/url",
  "custom_alias": "ex"
}

RESPONSE (201 Created):
{
  "id": 1,
  "original_url": "https://www.example.com/very/long/url",
  "short_url": "http://localhost:8000/ex",
  "custom_alias": "ex",
  "clicks": 0,
  "created_at": "2026-01-28T16:26:12Z"
}
```

---

## 🔐 Authentication Flow with URLs

```
STEP 1: User Registration
  ├─ App: POST /api/accounts/register/
  ├─ Backend: Creates user in database
  └─ Response: User data

STEP 2: User Login
  ├─ App: POST /api/accounts/login/
  ├─ Backend: Validates & generates JWT
  └─ Response: { access_token, refresh_token, user_data }

STEP 3: Save Token
  ├─ App: Store in AsyncStorage
  └─ Ready for next requests

STEP 4: Make Protected Request
  ├─ App: POST /api/links/shorten/
  ├─ Headers: Authorization: Bearer <access_token>
  └─ Backend: Validates token & processes request

STEP 5: Token Expires
  ├─ App: POST /api/accounts/token/refresh/
  ├─ Body: { refresh_token }
  └─ Response: New { access_token }
```

---

## 📊 Complete URL Map

### From Frontend Perspective

```
┌─────────────────────────────────────────────────────────┐
│ React Native App                                        │
│ (client/)                                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ const BASE_URL = 'http://192.168.1.100:8000/api'       │
│                                                         │
│ Register:                                               │
│   POST ${BASE_URL}/accounts/register/                   │
│                                                         │
│ Login:                                                  │
│   POST ${BASE_URL}/accounts/login/                      │
│                                                         │
│ Refresh Token:                                          │
│   POST ${BASE_URL}/accounts/token/refresh/             │
│                                                         │
│ Shorten URL:                                            │
│   POST ${BASE_URL}/links/shorten/                       │
│                                                         │
│ Get User Links:                                         │
│   GET ${BASE_URL}/links/                                │
│                                                         │
└────────────────────────┬────────────────────────────────┘
                         │
                    HTTP Request
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Django Backend                                          │
│ (url_shortener/)                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ URL Pattern: path('api/accounts/', include(...))        │
│ URL Pattern: path('api/links/', include(...))           │
│                                                         │
│ Endpoints:                                              │
│   /api/accounts/register/   → views.Registerview       │
│   /api/accounts/login/      → views.login_view         │
│   /api/accounts/token/      → SimpleJWT                │
│   /api/accounts/token/refresh/ → SimpleJWT             │
│   /api/links/               → links.views              │
│   /api/links/shorten/       → links.views              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Changes Made

### Backend Updates
1. ✅ Updated `url_shortener/urls.py` - Added `/api/` prefix
2. ✅ Updated `accounts/views.py` - Added custom login view
3. ✅ Updated `accounts/serializers.py` - Added login & user serializers
4. ✅ Updated `accounts/urls.py` - Added login endpoint

### Frontend Updates
1. ✅ Updated `constants/config.ts` - Correct endpoints configured

---

## 🧪 Test These URLs

### Test 1: Register
```bash
curl -X POST http://192.168.1.100:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Test 2: Login
```bash
curl -X POST http://192.168.1.100:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123"
  }'
```

### Test 3: Refresh Token
```bash
curl -X POST http://192.168.1.100:8000/api/accounts/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "YOUR_REFRESH_TOKEN"
  }'
```

---

## 📝 Summary Table

| Operation | Method | Frontend URL | Backend Handler |
|-----------|--------|-------------|-----------------|
| Register | POST | `/api/accounts/register/` | `Registerview` |
| Login | POST | `/api/accounts/login/` | `login_view` |
| Refresh | POST | `/api/accounts/token/refresh/` | SimpleJWT |
| Get Links | GET | `/api/links/` | Links ViewSet |
| Shorten | POST | `/api/links/shorten/` | Links ViewSet |

---

## 🎯 Ready to Test!

All URLs are now configured correctly. Both frontend and backend are synchronized.

**Next Step:** Restart both servers
```bash
# Terminal 1: Backend
python manage.py runserver

# Terminal 2: Frontend
npm start

# Then test the complete flow!
```

---

**Complete URL reference finalized!** ✅
