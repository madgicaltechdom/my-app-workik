# StorageApp

A modern React Native application for user authentication, profile management, and settings, built with Firebase and comprehensive form validation. The project showcases enterprise-grade best practices including TypeScript, modular architecture, styled-components, offline support, and comprehensive end-to-end testing with Maestro.

> **Latest Updates**: Complete Profile UI modernization with Firebase Firestore integration, comprehensive i18n support, offline caching, and enhanced Maestro test coverage.

## Overview

StorageApp is a cross-platform mobile app that allows users to:
- Sign up, log in, and reset their password
- View and update their profile
- Manage app settings
- Experience persistent authentication using Firebase Auth and AsyncStorage

## ✨ Recent Refactoring (TypeScript Migration & Style Separation)

This app has been comprehensively refactored to follow modern React Native best practices:

### 🎯 **Architecture Improvements**
- **Complete TypeScript Migration**: All components, screens, hooks, and services migrated from JavaScript to TypeScript with strict type safety
- **Modular Component Structure**: Components organized with separated logic, styles, and types
- **Style File Separation**: Styled-components extracted to dedicated `.styles.ts` files
- **Enhanced Theme System**: Modular theme with colors, typography, spacing, and dark mode support

### 🏗️ **Component Structure Pattern**
```
src/components/common/ComponentName/
├── ComponentName.tsx        # Main component logic
├── ComponentName.styles.ts  # Styled-components with theme integration
├── ComponentName.types.ts   # TypeScript interfaces
└── index.ts                # Clean exports
```

### 🎨 **Styling Standards**
- **Reusable Components**: Use `styled-components/native` for consistent theming
- **Screen Components**: Use React Native `StyleSheet` for performance
- **Theme Integration**: All components support light/dark mode automatically
- **Responsive Design**: Components adapt to different screen sizes

### ♿ **Accessibility & UX**
- **ARIA Compliance**: Proper roles, labels, and live regions
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Support**: Comprehensive accessibility labels and hints
- **Form Validation**: Real-time validation with user-friendly error messages

### 🧪 **Testing Integration**
- **Maestro Test Alignment**: All test cases updated for refactored components
- **TestID Consistency**: Standardized test identifiers across components
- **Accessibility Testing**: Tests verify ARIA compliance and screen reader support

## Features

### 🔐 **Authentication System**
- Email/password login with enhanced validation and error handling
- User registration with comprehensive form validation
- Password reset functionality with Firebase Auth integration
- Persistent authentication using AsyncStorage
- Secure token management and automatic session refresh

### 👤 **Profile Management** *(Recently Enhanced)*
- **Modern Profile UI**: Completely redesigned with contemporary styling
- **Firebase Firestore Integration**: Custom profile fields (bio, phone, date of birth)
- **Real-time Data Sync**: Seamless merging of Firebase Auth and Firestore data
- **Offline Support**: Comprehensive caching with AsyncStorage fallback
- **Form Validation**: Real-time validation with user-friendly error messages
- **i18n Support**: Fully internationalized with proper translation keys

### ⚙️ **Settings & Preferences**
- App preferences management with scrollable interface
- Dark mode support with automatic theme switching
- User preference persistence

### 🌐 **Internationalization**
- Multi-language support with react-i18next
- Structured translation files with feature-based organization
- Dynamic language switching

### 🧪 **Testing & Quality Assurance**
- **Comprehensive Maestro Tests**: Full profile editing flow coverage
- **Accessibility Testing**: ARIA compliance and screen reader support
- **Error Handling Tests**: Validation and edge case coverage
- **Performance Testing**: Loading states and offline scenarios

### ♿ **Accessibility & UX**
- Full ARIA compliance with proper roles and labels
- Keyboard navigation support
- Screen reader compatibility
- Loading states and user feedback
- Responsive design patterns

## Project Structure

```
my-app/
├── src/
│   ├── components/common/           # Reusable UI components with modular structure
│   │   ├── Button/                  # Button component with styles, types, logic
│   │   ├── Input/                   # Input component with validation & accessibility
│   │   ├── ErrorMessage/            # Error display with multiple variants
│   │   ├── LoadingOverlay/          # Loading states with multiple variants
│   │   └── index.ts                 # Clean component exports
│   ├── features/                    # Feature modules (auth, profile, home, settings)
│   │   ├── auth/screens/            # Authentication screens (TypeScript)
│   │   ├── profile/                 # Profile management with context
│   │   ├── home/screens/            # Home dashboard (TypeScript)
│   │   └── settings/screens/        # Settings management (TypeScript)
│   ├── hooks/                       # Custom React hooks (TypeScript)
│   ├── localization/                # i18n configuration and language files
│   ├── navigation/                  # Typed navigation (App, Auth, Tab navigators)
│   ├── services/                    # Firebase config, auth service, secure storage
│   ├── theme/                       # Modular theme system
│   │   ├── colors.ts               # Color tokens with light/dark variants
│   │   ├── typography.ts           # Font families, sizes, and text styles
│   │   ├── spacing.ts              # Spacing scale, shadows, and layout tokens
│   │   └── index.ts                # Main theme export with utilities
│   ├── types/                       # Shared TypeScript interfaces
│   └── utils/                       # Validation utilities and helpers
├── .maestro/                        # Maestro E2E test flows and element selectors
│   ├── elements/auth.js            # Page Object Model for test elements
│   ├── tests/auth/                 # Authentication flow tests
│   └── tests/profile/              # Profile editing and management tests
├── assets/                          # Images and static assets
├── App.tsx                         # App entry point (TypeScript)
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Project dependencies and scripts
└── README.md                       # Project documentation
```

## Setup

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd my-app
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Install required native modules:**
   - For persistent auth, ensure `@react-native-async-storage/async-storage` is installed.
   - For Maestro testing, install Maestro CLI: https://maestro.mobile.dev/getting-started/installation

4. **Configure Firebase:**
   - Update `src/services/firebaseConfig.js` with your Firebase project credentials if needed.

## Running the App

- **Start Metro and launch the app:**
  ```sh
  npm start
  # or
  yarn start
  ```
- **Run on Android/iOS:**
  ```sh
  npm run android
  npm run ios
  ```

## Running Maestro Tests

1. **Start an Android emulator or iOS simulator.**
2. **Run Maestro tests:**
   ```sh
   # Authentication Tests
   maestro test .maestro/tests/auth/login_positive.yaml
   maestro test .maestro/tests/auth/login_validation.yaml
   maestro test .maestro/tests/auth/forgot_password.yaml
   
   # Profile Management Tests (Recently Added)
   maestro test .maestro/tests/profile/edit_profile.yaml
   ```
   Or run all tests in the `.maestro/tests/` directory.

- **Comprehensive Test Coverage:**
  - **Authentication Flow**: Login, signup, password reset with validation
  - **Profile Management**: Complete profile editing with all fields
  - **Data Persistence**: Verify profile data saves and loads correctly
  - **Error Handling**: Invalid input validation and error recovery
  - **Accessibility**: ARIA compliance and screen reader support
  - **Loading States**: Async operations and user feedback
  - **Navigation**: Screen transitions and back navigation
  - **Offline Support**: Cached data fallback scenarios

## Development Guidelines

> **📋 Comprehensive Guidelines Available**: See [`DEVELOPMENT_GUIDELINES.md`](./DEVELOPMENT_GUIDELINES.md) for detailed best practices, patterns, and team standards based on this project's learnings.

### 🎯 **Quick Reference - Key Principles**

#### **React Native Styling (Critical)**
```typescript
// ❌ WRONG - Causes runtime errors
const StyledView = styled.View`
  padding: 16px;           // px units not supported
  margin: 0 auto;          // CSS shorthand not supported
`;

// ✅ CORRECT - Use specific properties
const StyledView = styled.View`
  padding-horizontal: 16;
  padding-vertical: 16;
  align-self: center;
`;
```

#### **Firebase Integration**
```typescript
// ✅ CRITICAL: Import Firebase config FIRST
import './src/services/firebaseConfig'; // Must be first!
import { UserProvider } from './src/contexts/UserContext';
```

#### **Theme Integration**
```typescript
// ✅ Always verify theme properties exist
background-color: ${({ theme }) => theme.colors.primary}; // Valid
font-size: ${({ theme }) => theme.fontSizes.md};          // Valid

// ❌ These cause "Empty input string" errors
background-color: ${({ theme }) => theme.colors.surface}; // Doesn't exist
font-size: ${({ theme }) => theme.fontSizes.xxl};        // Doesn't exist
```

#### **Testing & Accessibility**
- Include `testID` props for all interactive elements
- Use consistent naming: `input-{fieldName}`, `{action}-button`
- Add accessibility labels and roles
- Follow Page Object Model pattern in Maestro tests

## Technologies Used

### **Core Technologies**
- **React Native** (with TypeScript) - Cross-platform mobile development
- **Expo** (managed workflow) - Development platform and toolchain
- **TypeScript** - Type safety and enhanced developer experience

### **Backend & Data**
- **Firebase Authentication** - User authentication and session management
- **Firebase Firestore** - NoSQL database for custom profile data
- **AsyncStorage** - Local storage for caching and offline support

### **UI & Styling**
- **styled-components/native** - Component styling with theme integration
- **React Navigation** (v6) - Typed navigation with smooth transitions
- **React Native Safe Area Context** - Safe area management
- **Custom Theme System** - Modular theme with dark mode support

### **Internationalization & Accessibility**
- **react-i18next** - Comprehensive internationalization support
- **ARIA Compliance** - Full accessibility with screen reader support
- **Keyboard Navigation** - Complete keyboard accessibility

### **Testing & Quality**
- **Maestro** - End-to-end UI testing with comprehensive coverage
- **Page Object Model** - Structured test organization
- **Accessibility Testing** - Automated ARIA compliance verification

### **Development Tools**
- **ESLint & Prettier** - Code formatting and linting
- **Metro** - JavaScript bundler for React Native
- **Flipper** - Debugging and development tools

## Refactoring Prompt for AI Assistants

When working on this codebase, follow these established patterns:

### **Component Creation Pattern:**
```typescript
// 1. Create component folder structure
ComponentName/
├── ComponentName.tsx
├── ComponentName.styles.ts
├── ComponentName.types.ts
└── index.ts

// 2. Use TypeScript interfaces
export interface ComponentNameProps {
  // Define all props with proper types
}

// 3. Use styled-components for reusable components
const StyledComponent = styled(View)<StyledProps>`
  // Theme-based styling
`;

// 4. Include accessibility and i18n
accessibilityRole="button"
accessibilityLabel={t('component.label')}
```

### **Key Principles:**
- **TypeScript First**: All new code must be TypeScript with proper interfaces
- **Modular Architecture**: Separate logic, styles, and types into different files
- **Theme Integration**: Use the modular theme system for all styling
- **Accessibility**: Include ARIA properties and keyboard navigation
- **Testing**: Add testIDs and update Maestro tests accordingly
- **Performance**: Use useMemo, useCallback, and proper memoization
- **Security**: Sanitize all user inputs and handle errors gracefully

## Contributing
Pull requests are welcome! Please follow the established TypeScript and architectural patterns. For major changes, open an issue first to discuss the proposed changes.

## License
[MIT](LICENSE)