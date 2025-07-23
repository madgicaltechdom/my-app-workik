# StorageApp

A React Native application for user authentication, profile management, and settings, built with Firebase and robust form validation. The project uses modern best practices, including TypeScript, modular architecture, styled-components, and end-to-end testing with Maestro.

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
- **Authentication:** Email/password login, signup, and password reset with enhanced validation
- **Profile:** View and edit user profile details with real-time validation
- **Settings:** Manage app preferences with dark mode support
- **Localization:** Multi-language support with react-i18next
- **Validation:** Shared, robust validation utilities with input sanitization
- **Testing:** Comprehensive end-to-end UI tests with Maestro
- **Accessibility:** Full ARIA compliance and screen reader support
- **Dark Mode:** System-wide dark mode with automatic theme switching

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
│   └── tests/auth/                 # Authentication flow tests
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
   maestro test .maestro/tests/auth/login_positive.yaml
   maestro test .maestro/tests/auth/login_validation.yaml
   maestro test .maestro/tests/auth/forgot_password.yaml
   ```
   Or run all tests in the `.maestro/tests/auth/` directory.

- **Test Coverage:**
  - Login validation and error handling
  - Forgot password flow
  - Navigation between screens
  - Form state management
  - Accessibility compliance
  - Loading states and error recovery

## Development Guidelines

### 🎯 **TypeScript Best Practices**
- Use strict TypeScript configuration
- Define interfaces for all component props
- Leverage type inference where appropriate
- Use named exports consistently

### 🎨 **Styling Guidelines**
- **Reusable Components**: Use `styled-components/native` with theme props
- **Screen Components**: Use React Native `StyleSheet` for performance
- **Theme Usage**: Always use theme tokens instead of hardcoded values
- **Responsive Design**: Use `useWindowDimensions` for screen size adaptation

### ♿ **Accessibility Requirements**
- Include `accessibilityRole`, `accessibilityLabel`, and `accessibilityHint`
- Use `accessibilityLiveRegion` for dynamic content
- Ensure proper keyboard navigation
- Test with screen readers

### 🧪 **Testing Standards**
- Include `testID` props for all interactive elements
- Follow the Page Object Model pattern in Maestro tests
- Test both positive and negative user flows
- Verify accessibility features in tests

## Technologies Used
- **React Native** (with TypeScript)
- **Expo** (managed workflow)
- **Firebase** (Auth, Firestore)
- **AsyncStorage** (persistent auth)
- **styled-components/native** (theming and component styling)
- **React Navigation** (typed navigation)
- **react-i18next** (internationalization)
- **Maestro** (end-to-end UI testing)
- **React Native Safe Area Context** (safe area management)

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