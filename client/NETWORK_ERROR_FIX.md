# 🔧 Network Error Fix - Complete Guide

## ❌ Error You Got
```
ERROR Login error: [TypeError: Network request failed]
```

---

## ✅ What I Fixed

### 1. Django Settings
- ✅ Set `ALLOWED_HOSTS = ['*']` to accept requests from any origin
- ✅ `CORS_ALLOW_ALL_ORIGINS = True` already enabled
- ✅ Database connectivity verified

### 2. Frontend Configuration
- ✅ Added detailed error logging
- ✅ Better error messages showing the URL being called
- ✅ Console logs to debug connection issues
- ✅ Proper timeout handling

### 3. Error Messages Improved
- ✅ Shows which URL failed to connect
- ✅ Distinguishes network errors from server errors
- ✅ Clear instructions in error message

---

## 🚀 How to Test Now

### Step 1: Check Backend Running
```bash
# In url_shortener directory
python manage.py runserver
```

**You should see:**
```
Starting development server at http://127.0.0.1:8000/
System check identified no issues (0 silenced).
```

### Step 2: Start Frontend
```bash
# In client directory  
npm start
```

### Step 3: Check Console Logs
When you try to login, look at the console output:

**Good signs:**
```
🔌 Attempting login...
📍 URL: http://localhost:8000/api/accounts/login/
📤 Sending: { username: "alice", password: "***" }
📥 Response Status: 200
✅ Login successful!
👤 User: alice
```

**Bad signs:**
```
❌ Login error: [TypeError: Network request failed]
```

---

## 🔍 Debugging the Network Error

The error "Network request failed" happens when:

1. **Backend not running** ❌
   - Fix: Start Django `python manage.py runserver`

2. **Wrong URL** ❌
   - Check: `http://localhost:8000/api/accounts/login/`
   - Should show in console logs

3. **Firewall blocking** ❌
   - Fix: Check Windows Firewall allows port 8000
   - Fix: Disable antivirus temporarily if blocking

4. **CORS issues** ❌
   - Fixed: CORS enabled in Django
   - Headers added: Accept, Content-Type

5. **Database not connected** ❌
   - Fix: Check PostgreSQL is running
   - Fix: Verify credentials in settings.py

---

## 🎯 Complete Setup Checklist

### Backend (Django)

- [ ] PostgreSQL is running
  ```bash
  # Check if Postgres service is running
  # Windows: Services app or pgAdmin
  ```

- [ ] Backend is running
  ```bash
  cd url_shortener
  python manage.py runserver
  ```

- [ ] Settings updated
  - [ ] `ALLOWED_HOSTS = ['*']`
  - [ ] `DEBUG = True`
  - [ ] `CORS_ALLOW_ALL_ORIGINS = True`

- [ ] Database configured
  ```python
  # settings.py
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.postgresql',
          'NAME': 'url_shortener',
          'USER': 'postgres',
          'PASSWORD': 'your_password',
          'HOST': 'localhost',
      }
  }
  ```

- [ ] Migrations run
  ```bash
  python manage.py migrate
  ```

### Frontend (React Native)

- [ ] Config updated
  ```typescript
  // constants/config.ts
  API_BASE_URL: 'http://localhost:8000/api'
  ```

- [ ] Error logging active
  ```
  Console should show:
  🔌 Attempting login...
  📍 URL: http://localhost:8000/api/accounts/login/
  ```

- [ ] App running
  ```bash
  npm start
  ```

---

## 📊 Testing Scenarios

### Scenario 1: Backend is Down
```
❌ Network request failed
```
**Fix:** Start Django server
```bash
python manage.py runserver
```

### Scenario 2: Wrong URL
```
❌ Network request failed
```
**Check console:** URL might be wrong
```typescript
// Look for: 📍 URL: ...
// Should be: http://localhost:8000/api/accounts/login/
```

### Scenario 3: Database Not Connected
```
❌ 500 Server Error
```
**Fix:** Ensure PostgreSQL is running and credentials are correct

### Scenario 4: Invalid Credentials
```
❌ Login Failed: Invalid credentials
```
**Fix:** Make sure user was registered first
- Click "Sign Up"
- Create account
- Then login

### Scenario 5: Success!
```
✅ Login successful!
👤 User: alice
```
**Result:** Auto-navigate to home screen

---

## 🔐 Console Output Reference

### Successful Login Flow
```
🔌 Attempting login...
📍 URL: http://localhost:8000/api/accounts/login/
📤 Sending: { username: "alice", password: "***" }
📥 Response Status: 200
✅ Login successful!
👤 User: alice
```

### Failed Registration
```
🔌 Attempting registration...
📍 URL: http://localhost:8000/api/accounts/register/
📤 Sending: { username: "alice", email: "alice@example.com", password: "***" }
📥 Response Status: 400
❌ Error response: { "username": ["A user with that username already exists."] }
```

### Network Error
```
❌ Login error: TypeError: Network request failed
📋 Error message: Network request failed
Error message shown to user: Network error - Check if backend is running at http://localhost:8000/api
```

---

## 🛠️ Quick Fix Commands

### For Backend Issues
```bash
# 1. Stop current server
# Press CTRL+C

# 2. Check if port 8000 is in use
# Windows: netstat -ano | findstr :8000

# 3. Kill process if needed
# Windows: taskkill /PID <PID> /F

# 4. Restart
python manage.py runserver
```

### For Database Issues
```bash
# 1. Check PostgreSQL
# Windows Services → PostgreSQL → Start

# 2. Verify connection
# In settings.py, check credentials

# 3. Run migrations
python manage.py migrate

# 4. Create test user (if needed)
python manage.py createsuperuser
```

### For Frontend Issues
```bash
# 1. Clear cache
npm cache clean --force

# 2. Reinstall dependencies
npm install

# 3. Clear app cache
# Restart Expo

# 4. Restart
npm start
```

---

## 📝 Important URLs Reference

```
Backend:
  Base: http://localhost:8000
  API: http://localhost:8000/api
  Login: POST http://localhost:8000/api/accounts/login/
  Register: POST http://localhost:8000/api/accounts/register/

Frontend:
  Config: client/constants/config.ts
  Login Screen: app/(auth)/login.tsx
  Register Screen: app/(auth)/register.tsx
```

---

## ✅ When You See This

### In Backend Console
```
[28/Jan/2026 16:26:12] "POST /api/accounts/login/ HTTP/1.1" 200 OK
```
✅ **Good!** Request was received and processed

### In Frontend Console
```
✅ Login successful!
👤 User: alice
```
✅ **Good!** Login worked, navigating to home

### In Browser Alert
```
"Account created! Please log in with your credentials."
```
✅ **Good!** Registration successful

---

## 🎯 What's Different Now

**Before:**
```typescript
// Generic error
Alert.alert('Error', 'Could not connect to server. Please check your connection.');
```

**After:**
```typescript
// Specific error with URL
Alert.alert(
  'Connection Error',
  'Network error - Check if backend is running at http://localhost:8000/api'
);
```

Plus console logs:
```
📍 URL: http://localhost:8000/api/accounts/login/
📤 Sending: { username: "alice", password: "***" }
📥 Response Status: 200
```

---

## 🚀 Test Now!

1. **Start Backend**
   ```bash
   python manage.py runserver
   ```

2. **Start Frontend**
   ```bash
   npm start
   ```

3. **Try Login**
   - Look at console logs
   - Check error messages
   - Both should show clear debugging info

4. **Check Logs**
   - Frontend: Expo console
   - Backend: Django terminal

---

**Network error should be fixed!** ✅

If still getting errors, check:
1. Backend is running ✓
2. PostgreSQL is running ✓
3. URL in config.ts is correct ✓
4. Firewall is not blocking ✓
5. Check console logs for details ✓
