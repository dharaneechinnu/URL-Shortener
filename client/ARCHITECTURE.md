# URL Shortener - React Native Frontend

Production-ready React Native mobile app for URL shortening built with TypeScript and Expo Router.

## 📁 Project Structure

```
app/
├── _layout.tsx                    # Root navigation (Auth/App switcher)
├── (auth)/                        # Authentication stack
│   ├── index.tsx                 # Auth stack wrapper
│   ├── login.tsx                 # Login screen
│   └── register.tsx              # Registration screen
├── (tab)/                         # Main app stack with tabs
│   ├── index.tsx                 # Tab navigator
│   ├── home.tsx                  # Create shortened URLs
│   └── myLinks.tsx               # View and manage links
├── components/                    # Reusable components
│   └── AppButton.tsx             # Custom button component
├── constants/                     # App configuration
│   └── config.ts                 # API endpoints and routes
├── utils/                         # Helper utilities
│   ├── storage.ts                # AsyncStorage helpers
│   └── types.ts                  # TypeScript type definitions
└── hooks/                         # Custom React hooks (future)

App.tsx                            # Entry point (providers setup)
```

## 🎯 Features Implemented

### Navigation Flow
- **Root Layout** (`_layout.tsx`): Determines auth vs app stack based on authentication state
- **Auth Stack**: Login and Register screens with form validation
- **App Stack**: Tab-based navigation for Home and My Links screens

### Screens

#### Auth Screens
- **LoginScreen** (`login.tsx`)
  - Username/password input with validation
  - Error display and field-level validation
  - Loading state during submission
  - Link to registration screen

- **RegisterScreen** (`register.tsx`)
  - Username, email, password, and confirm password inputs
  - Comprehensive form validation
  - Password matching validation
  - Loading state handling
  - Link back to login screen

#### App Screens
- **HomeScreen** (`home.tsx`)
  - URL input with validation
  - Optional custom alias field
  - How-it-works info section
  - Ready for API integration

- **MyLinksScreen** (`myLinks.tsx`)
  - List of user's shortened URLs
  - Link statistics (clicks, creation date)
  - Link actions: Copy, Enable/Disable, Delete
  - Pull-to-refresh functionality
  - Empty state UI

### Components
- **AppButton**: Reusable button with variants (primary/secondary), sizes (small/medium/large), and loading states

### Utilities
- **storage.ts**: AsyncStorage helpers for auth tokens, user data, and app state
- **types.ts**: TypeScript interfaces for User, Auth responses, and API data
- **config.ts**: Centralized configuration for API endpoints and routes

## 🔐 Authentication Flow

1. App starts and checks for valid auth token
2. If no token → Show auth stack (Login/Register)
3. If token exists → Show app stack (Home/My Links)
4. Login/Register screens have navigation between them
5. TODO: Implement actual backend API calls

## 🎨 Design System

### Colors
- Primary: `#007AFF` (iOS Blue)
- Error: `#FF3B30` (iOS Red)
- Background: `#F9F9F9`, `#FFF` (White)
- Text: `#000` (Black), `#666` (Gray), `#999` (Light Gray)

### Components
- Border Radius: 8px (standard), 12px (cards)
- Padding: 16px (horizontal), 12px (vertical)
- Min Height: 44px (touch targets)

## 📋 TODO: Backend Integration

### Login/Register
```
// In (auth)/login.tsx and (auth)/register.tsx
- Replace alert() with actual API calls
- Store tokens using storage.ts helpers
- Update root auth state on success
- Handle error responses with proper validation
```

### Home Screen
```
// In (tab)/home.tsx
- Call /links/shorten/ endpoint to create shortened URLs
- Handle response with shortened URL display
- Add copy-to-clipboard functionality
```

### My Links Screen
```
// In (tab)/myLinks.tsx
- Fetch /links/ endpoint for user's URLs
- Implement delete functionality
- Implement enable/disable functionality
- Implement copy link functionality
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- React Native/Expo CLI
- TypeScript

### Installation
```bash
cd client
npm install
```

### Development
```bash
npm start              # Start Expo dev server
npm run android        # Run on Android
npm run ios           # Run on iOS
npm run web           # Run on web
```

### Linting
```bash
npm run lint          # ESLint check
```

## 📦 Dependencies

### Core
- `react` (19.1.0)
- `react-native` (0.81.5)
- `expo` (~54.0.32)
- `expo-router` (~6.0.22) - File-based routing

### Navigation
- `@react-navigation/native` (~7.1.8)
- `@react-navigation/bottom-tabs` (~7.4.0)
- `react-native-screens` (~4.16.0)
- `react-native-gesture-handler` (~2.28.0)
- `react-native-reanimated` (~4.1.1)
- `react-native-safe-area-context` (~5.6.0)

### Storage
- `@react-native-async-storage/async-storage` - Local storage
- `expo-secure-store` - Secure token storage

### API
- `axios` - HTTP client

### UI/UX
- `expo-haptics` - Haptic feedback
- `@expo/vector-icons` - Icon library

### TypeScript & Dev
- `typescript` (~5.9.2)
- `@types/react` (~19.1.0)

## 🔄 State Management (Future)

Current implementation uses local React state. For production, consider:
- Context API with useReducer
- Zustand (lightweight)
- Redux Toolkit (full-featured)

## 🧪 Testing (Future)

- Jest for unit tests
- React Testing Library for component tests
- E2E testing with Detox

## 📝 Backend API Reference

### Accounts (Auth)
- `POST /accounts/register/` - Register new user
- `POST /accounts/login/` - Login user
- `POST /accounts/token/refresh/` - Refresh auth token

### Links
- `GET /links/` - Get user's links
- `POST /links/shorten/` - Create shortened URL
- `DELETE /links/{id}/` - Delete link
- `PATCH /links/{id}/` - Update link (enable/disable)

## 📄 License

Proprietary - Victopia Labs

## 🤝 Contributing

This is a production template. Follow coding standards and create feature branches.

---

**Status**: ✅ Foundation Complete - Ready for Feature Development
