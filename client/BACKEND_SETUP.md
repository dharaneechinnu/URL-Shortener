# 🔌 Backend Integration Guide

## ✅ Backend Connection Implemented

Your login and register screens are now **fully connected to the Django backend** at localhost:8000.

---

## 📋 What Changed

### Login Screen (`app/(auth)/login.tsx`)
- ✅ Connects to: `POST /accounts/login/`
- ✅ Sends: `{ username, password }`
- ✅ Expects: `{ access, user }`
- ✅ Automatically logs in and navigates to home

### Register Screen (`app/(auth)/register.tsx`)
- ✅ Connects to: `POST /accounts/register/`
- ✅ Sends: `{ username, email, password }`
- ✅ Shows success message and navigates back to login

### API Configuration (`constants/config.ts`)
```typescript
API_BASE_URL: 'http://192.168.1.100:8000/api'
```

---

## 🚀 How to Test

### Step 1: Django Backend Running
```bash
# Terminal 1: Start Django server
cd url_shortener
python manage.py runserver
```
**You should see:**
```
Starting development server at http://127.0.0.1:8000/
```

### Step 2: Get Your Machine IP
```powershell
# In PowerShell or Terminal
ipconfig
# Find IPv4 Address (usually like 192.168.x.x)
```

### Step 3: Update Client Config (if needed)
If your IP is different, update in [constants/config.ts](constants/config.ts):
```typescript
API_BASE_URL: 'http://YOUR_IP_HERE:8000/api'
```

### Step 4: Start React Native App
```bash
# Terminal 2: Start frontend
cd client
npm start
```

### Step 5: Test Registration
1. Click "Sign Up"
2. Create account with username, email, password
3. Should see "Account created!" message
4. Navigate back to login

### Step 6: Test Login
1. Enter the credentials you just created
2. Should log in successfully
3. Should see home screen with tabs

---

## 🔌 API Endpoints Expected

Your Django backend should have these endpoints:

### 1. Register Endpoint
```
POST /api/accounts/register/
Content-Type: application/json

Request Body:
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123"
}

Response (201 Created):
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "created_at": "2026-01-28T16:26:12Z",
  "updated_at": "2026-01-28T16:26:12Z"
}
```

### 2. Login Endpoint
```
POST /api/accounts/login/
Content-Type: application/json

Request Body:
{
  "username": "alice",
  "password": "password123"
}

Response (200 OK):
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "alice",
    "email": "alice@example.com",
    "created_at": "2026-01-28T16:26:12Z",
    "updated_at": "2026-01-28T16:26:12Z"
  }
}
```

---

## ⚙️ Django Backend Setup

Make sure your Django API returns the correct responses:

### Register View (accounts/views.py)
```python
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    # Validate and create user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    
    return Response(UserSerializer(user).data, status=201)
```

### Login View (accounts/views.py)
```python
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if not user:
        return Response(
            {'detail': 'Invalid credentials'},
            status=401
        )
    
    # Generate JWT tokens
    refresh = RefreshToken.from_user(user)
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': UserSerializer(user).data
    })
```

---

## 🔒 Token Persistence

The access token is automatically:
- ✅ Saved to AsyncStorage after login
- ✅ Retrieved on app startup
- ✅ Used for authenticated requests
- ✅ Cleared on logout

---

## 📱 Using the Token in Other Requests

For API calls that need authentication (like shortening URLs), use:

```typescript
import { getAuthToken } from '../utils/storage';

const token = await getAuthToken();
const response = await fetch('http://192.168.1.100:8000/api/links/shorten/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,  // ← Add this
  },
  body: JSON.stringify({
    original_url: 'https://example.com',
    custom_alias: 'ex'
  }),
});
```

---

## ✨ Error Handling

The app now handles:
- ❌ Invalid credentials
- ❌ Server connection errors
- ❌ User already exists
- ❌ Invalid email format
- ❌ Backend errors (shows error message)

---

## 🐛 Troubleshooting

### "Could not connect to server"
**Problem:** App can't reach backend
- Check Django is running
- Check IP address in config.ts matches your machine
- Check firewall isn't blocking port 8000
- Use `ipconfig` to verify IP

### "Invalid credentials"
**Problem:** Username or password wrong
- Check you created the account
- Check spelling
- Try registering new account

### Token-related errors
**Problem:** 401 Unauthorized on protected routes
- Token might be expired
- Try logging out and logging back in
- Check backend returns valid JWT token

---

## 📝 Configuration Reference

File: [constants/config.ts](constants/config.ts)
```typescript
API_BASE_URL: 'http://192.168.1.100:8000/api'
AUTH_CONFIG.REGISTER_ENDPOINT: '/accounts/register/'
AUTH_CONFIG.LOGIN_ENDPOINT: '/accounts/login/'
```

---

## 🎯 Next Steps

1. ✅ Test registration with backend
2. ✅ Test login with backend
3. ✅ Verify token is saved
4. ✅ Integrate URL shortening endpoints
5. ✅ Deploy!

---

## 📊 Data Flow

```
User enters credentials
        ↓
Submit form
        ↓
Validate locally
        ↓
Send to Django API
        ↓
Django validates & creates/authenticates user
        ↓
Django returns token + user data
        ↓
App saves token to AsyncStorage
        ↓
AuthContext updates state
        ↓
Auto-navigates to home screen
```

---

**Backend integration complete! Test it now.** 🚀
