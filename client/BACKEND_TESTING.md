# 🧪 Backend Connection Testing Guide

## ⚡ Quick Start

### 1. Get Your IP Address
```powershell
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
```

### 2. Update Client Config (if needed)
Edit [constants/config.ts](constants/config.ts):
```typescript
API_BASE_URL: 'http://YOUR_IP:8000/api'
```

### 3. Start Backend (Terminal 1)
```bash
cd url_shortener
python manage.py runserver
```

### 4. Start Frontend (Terminal 2)
```bash
cd client
npm start
```

### 5. Test!

---

## 📱 Test Scenario 1: Register New User

### Step 1: Open App
- You should see **Login Screen**

### Step 2: Click "Sign Up"
- Screen changes to **Register Screen**

### Step 3: Fill Form
```
Username: testuser123
Email: testuser@example.com
Password: Test@12345
Confirm: Test@12345
```

### Step 4: Click "Create Account"
**Expected:** 
- ✅ Loading spinner appears
- ✅ API call sent to backend
- ✅ Backend creates user
- ✅ Success alert appears
- ✅ Navigates back to login

### Step 5: Try with Existing Username
**Try:** Same username again
**Expected:**
- ❌ Error: "Username already exists" (or similar)
- ✅ Error message displayed
- ✅ Form stays open for retry

---

## 🔐 Test Scenario 2: Login

### Step 1: From Login Screen
```
Username: testuser123
Password: Test@12345
```

### Step 2: Click "Sign In"
**Expected:**
- ✅ Loading spinner appears
- ✅ API call sent to backend
- ✅ Backend validates credentials
- ✅ Returns JWT token
- ✅ Auto-navigates to **Home Screen**

### Step 3: Verify Login Success
- ✅ See tabs: "Shorten" and "My Links"
- ✅ Welcome message: "Welcome, testuser123!"
- ✅ Logout button visible

### Step 4: Test Invalid Password
```
Username: testuser123
Password: wrongpassword
```
**Expected:**
- ❌ Error alert: "Invalid credentials"
- ✅ Stay on login screen
- ✅ Form still has values

---

## 💾 Test Scenario 3: Token Persistence

### Step 1: Login Successfully
```
Username: testuser123
Password: Test@12345
```

### Step 2: Close App
- Close the app completely (swipe away)

### Step 3: Reopen App
**Expected:**
- ✅ **Automatic navigation to Home screen!**
- ✅ No login screen
- ✅ Same username displayed
- ✅ Token was retrieved from storage

### Step 4: Logout
- Click logout button
- Confirm logout

### Step 5: Reopen App
**Expected:**
- ✅ **Login screen appears**
- ✅ Token was cleared
- ✅ Not logged in anymore

---

## 🔌 Test Scenario 4: Connection Error

### Simulate No Backend
1. Stop Django server (CTRL+BREAK)
2. Try to login

**Expected:**
- ❌ Error alert: "Could not connect to server. Please check your connection."
- ✅ Graceful error handling
- ✅ Can retry

### Restart Backend
1. Run Django again
2. Try login again

**Expected:**
- ✅ Works normally

---

## 🐛 Debugging Tips

### Check Network Request
1. Open Django logs in terminal - should see:
```
[28/Jan/2026 16:30:12] "POST /api/accounts/login/ HTTP/1.1" 200
```

### Verify Token Format
When login succeeds, token should look like:
```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ...
```

### Check Backend Response Format
Backend must return:
```json
{
  "access": "token_string",
  "refresh": "token_string",
  "user": {
    "id": 1,
    "username": "testuser123",
    "email": "testuser@example.com"
  }
}
```

---

## ✅ All Tests Passing Means

| Test | Status | Means |
|------|--------|-------|
| Registration works | ✅ | Backend creates users |
| Login works | ✅ | Authentication working |
| Token persists | ✅ | Storage working |
| Error handling | ✅ | Graceful failures |
| Auto navigation | ✅ | Context integration perfect |

---

## 📊 Expected API Calls

### Registration
```
POST http://192.168.1.100:8000/api/accounts/register/ HTTP/1.1
Content-Type: application/json

{
  "username": "testuser123",
  "email": "testuser@example.com",
  "password": "Test@12345"
}

← Response 201 Created
{
  "id": 1,
  "username": "testuser123",
  "email": "testuser@example.com"
}
```

### Login
```
POST http://192.168.1.100:8000/api/accounts/login/ HTTP/1.1
Content-Type: application/json

{
  "username": "testuser123",
  "password": "Test@12345"
}

← Response 200 OK
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "testuser123",
    "email": "testuser@example.com"
  }
}
```

---

## 🎯 Success Indicators

✅ **Registration Test Passes:**
- Can create new user
- Gets success message
- Can log in with that user

✅ **Login Test Passes:**
- Can log in with valid credentials
- Gets JWT token
- Auto-navigates to home
- Username displayed

✅ **Persistence Test Passes:**
- Close/reopen app = still logged in
- After logout/reopen app = login screen

✅ **Error Test Passes:**
- Wrong password = error shown
- Invalid username = error shown
- No backend = error shown

---

## 📝 Test Results Template

Save this and fill it out:

```
Test Date: ___________
Tester: ___________

Register Test: PASS / FAIL
├─ Can create account: YES / NO
├─ Success message shows: YES / NO
└─ Can login with new account: YES / NO

Login Test: PASS / FAIL
├─ Valid credentials work: YES / NO
├─ Invalid credentials show error: YES / NO
├─ Auto-navigates to home: YES / NO
└─ Username displayed: YES / NO

Token Persistence: PASS / FAIL
├─ Close/reopen = still logged in: YES / NO
├─ Logout/reopen = login screen: YES / NO
└─ Token cleared on logout: YES / NO

Error Handling: PASS / FAIL
├─ Network error shows message: YES / NO
├─ Server error shows message: YES / NO
└─ Validation error shows message: YES / NO

Overall: PASS / FAIL ✅
```

---

## 🚀 Common Issues & Solutions

### Issue: "Could not connect to server"
**Solutions:**
1. Check IP address in config.ts
2. Run `ipconfig` and verify IP
3. Check Django is running
4. Check firewall isn't blocking 8000
5. Try different IP (maybe use 127.0.0.1 if on same machine)

### Issue: "Invalid credentials" immediately
**Solutions:**
1. Verify user exists (check Django admin)
2. Check spelling
3. Try creating new account first
4. Check password is correct

### Issue: App shows login screen but was logged in
**Solutions:**
1. Token might be expired
2. Try logging out explicitly
3. Close and reopen app
4. Clear app data and try again

### Issue: Can register but can't login
**Solutions:**
1. Check backend returns access token
2. Verify response format (must have access, refresh, user)
3. Check for errors in Django logs
4. Try with test account from Django admin

---

## ✨ When Everything Works

You should see:
```
Login Screen
    ↓ (click signup)
Register Screen
    ↓ (create account)
Success Alert → Back to Login
    ↓ (enter credentials)
Login Screen
    ↓ (click signin)
Loading...
    ↓ (backend processes)
Home Screen with Tabs ✅
    Welcome, testuser123!
```

---

**Ready to test?** Follow the Quick Start and run the scenarios! 🎉
