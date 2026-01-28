# ✅ AuthContext Testing Guide

## 🚀 How to Test the Auth System

### Prerequisites
```bash
cd client
npm start
```

Choose your platform (a for Android, i for iOS)

---

## 📱 Test Scenario 1: Fresh Install

**What it tests:** App startup with no previous login

**Steps:**
1. Start the app
2. You should see:
   - Loading spinner for ~1 second
   - Then login screen appears
   - Username field focused

**Expected:**
- ✅ Login screen loads
- ✅ No crashes
- ✅ Can see register link

---

## 📱 Test Scenario 2: Login Flow

**What it tests:** User login and navigation

**Steps:**
1. On login screen
2. Enter any username (e.g., "testuser")
3. Enter any password (e.g., "password123")
4. Press "Sign In"
5. Wait for success alert

**Expected:**
- ✅ Alert shows "Simulated login successful"
- ✅ Automatically navigates to home screen
- ✅ Welcome message shows: "Welcome, testuser!"
- ✅ Can see "My Links" tab

**What's happening:**
- Login handler calls `login(token, user)`
- AuthContext updates `isAuthenticated = true`
- Root layout detects this and shows (tab) stack
- HomeScreen displays user data

---

## 📱 Test Scenario 3: User Persistence

**What it tests:** Token persists across app restarts

**Steps:**
1. Login successfully (see home screen)
2. Close/minimize app (keep in background)
3. Clear app from background (close completely)
4. Reopen app

**Expected:**
- ✅ Shows loading spinner briefly
- ✅ Goes directly to home screen
- ✅ No login screen
- ✅ Sees welcome message again

**What's happening:**
- AuthContext's `checkAuth()` runs on startup
- Gets token from AsyncStorage
- Finds the token from login
- Sets `isAuthenticated = true`
- Shows home screen automatically

---

## 📱 Test Scenario 4: Logout Flow

**What it tests:** User logout and navigation

**Steps:**
1. On home screen
2. Scroll down to see logout button
3. Press "Logout" button
4. Confirm logout in alert

**Expected:**
- ✅ Alert confirms logout
- ✅ Returns to login screen
- ✅ All fields empty
- ✅ Can login again

**What's happening:**
- Logout handler calls `logout()`
- AuthContext clears token from storage
- Sets `isAuthenticated = false`
- Root layout detects this and shows (auth) stack
- Navigate back to login screen

---

## 📱 Test Scenario 5: Different Users

**What it tests:** Switching between users

**Steps:**
1. Login as "alice" with "password123"
2. See welcome message for alice
3. Press logout
4. Login as "bob" with "password456"
5. See welcome message for bob

**Expected:**
- ✅ Each user's name shown correctly
- ✅ No mixed data between users
- ✅ Smooth transitions

---

## 📝 Console Logging

Check the console for debug info:

```
✓ Login attempt with: { username: "testuser", password: "password123" }
✓ Logout successful
✓ Auth check on startup
```

---

## 🔧 Developer Tools Testing

### In Expo DevTools

**View AsyncStorage:**
```
1. Open Expo DevTools (shift+m)
2. Go to Storage tab
3. Look for @url_shortener:auth_token
4. Should contain token after login
```

**Clear Storage (to test startup):**
```
1. In DevTools, delete @url_shortener:auth_token
2. Close and reopen app
3. Should go to login screen
```

---

## ✅ Checklist: Things That Should Work

- [ ] App starts with loading spinner
- [ ] Login screen appears after loading
- [ ] Can type in username field
- [ ] Can type in password field
- [ ] Login button shows loading state
- [ ] Success alert appears
- [ ] Automatically goes to home screen
- [ ] Welcome message shows username
- [ ] Logout button visible
- [ ] Logout alert appears
- [ ] Goes back to login screen after logout
- [ ] Token persists after closing app
- [ ] App goes directly to home after restart
- [ ] Can login again after logout

---

## ❌ Troubleshooting

### Problem: Always shows login screen
**Solution:** Token may not be saving
- Check AsyncStorage helpers in `utils/storage.ts`
- Verify `saveAuthToken()` is being called
- Check browser console for errors

### Problem: App crashes on login
**Solution:** 
- Check that `login()` is being called correctly
- Verify user object has `username` property
- Check for TypeScript errors

### Problem: Welcome message doesn't show
**Solution:**
- Verify user data is passed to `login(token, userData)`
- Check that `userData.username` exists
- Look for errors in console

### Problem: Logout doesn't work
**Solution:**
- Verify logout button is rendered
- Check that `logout()` function exists
- Verify AsyncStorage is being cleared
- Check console for errors

---

## 🧪 Advanced Testing

### Test with Mock API Data

Add console logging to see the flow:

```typescript
const handleLogin = async () => {
  console.log('1. Form validation started');
  if (!validateForm()) {
    console.log('2. Form validation failed');
    return;
  }

  setLoading(true);
  console.log('3. Loading started');
  
  try {
    console.log('4. Calling login function');
    await login('mock-token-' + Date.now(), {
      username: formData.username,
      email: formData.username + '@example.com',
    });
    console.log('5. Login function completed');
  } catch (error) {
    console.log('6. Error in login:', error);
  } finally {
    setLoading(false);
    console.log('7. Loading finished');
  }
};
```

### Test with Real Backend

Once you have backend running:

1. Update `APP_CONFIG.API_BASE_URL` in `config.ts`
2. Uncomment the fetch code in login.tsx
3. Create test account via Django admin
4. Test with real credentials
5. Verify token is saved
6. Test persistence

---

## 📊 Expected User Flow

```
Start App
   ↓
Check token (loading spinner)
   ↓
No token found
   ↓
Show Login Screen
   ↓
User enters username/password
   ↓
Press Sign In
   ↓
Save token to storage
   ↓
Update auth state
   ↓
Show Home Screen (automatic)
   ↓
Welcome message displays
   ↓
User presses Logout
   ↓
Confirm logout
   ↓
Clear token from storage
   ↓
Update auth state
   ↓
Show Login Screen (automatic)
   ↓
User can login again
```

---

## ✨ What's Working Now

- ✅ **Context-based auth** - Global state management
- ✅ **Auto-login** - Token persists across restarts
- ✅ **Auto-logout** - Clear token and navigate
- ✅ **User data** - Display username on home
- ✅ **Automatic navigation** - No manual route changes
- ✅ **Loading states** - Spinner on startup
- ✅ **Error handling** - Graceful error management
- ✅ **Mock data** - Can test without backend
- ✅ **Ready for backend** - API integration ready

---

## 🎯 Next: Backend Integration

Once you verify everything works with mock data:

1. **Get backend running** (Django dev server)
2. **Update API_BASE_URL** in config.ts
3. **Uncomment fetch code** in login/register
4. **Create test account** in backend
5. **Test with real data**
6. **Verify token saves correctly**

---

## 💡 Tips

- **Use console.log()** to track auth flow
- **Test on both platforms** (iOS/Android)
- **Clear storage** to simulate fresh installs
- **Check DevTools** for storage contents
- **Test network** with backend disabled (should fail gracefully)

---

**Ready to test? Start with `npm start` and try Scenario 1!** 🚀
