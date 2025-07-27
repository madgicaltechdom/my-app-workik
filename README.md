# StorageApp

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.72.0-61dafb.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-49.0.0-000020.svg)](https://expo.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A modern React Native application for user authentication, profile management, and settings, built with Firebase and comprehensive form validation. The project showcases enterprise-grade best practices including TypeScript, modular architecture, styled-components, offline support, and comprehensive end-to-end testing with Maestro.

## 📑 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [🏗 Project Structure](#-project-structure)
- [🧪 Testing](#-testing)
  - [Unit & Integration Tests](#unit--integration-tests)
  - [E2E Tests with Maestro](#e2e-tests-with-maestro)
  - [Test Coverage](#test-coverage)
- [🛠 Feature Development Guide](#-feature-development-guide)
  - [🎯 Feature Implementation Template](#-feature-implementation-template)
    - [Project Context](#project-context)
    - [Feature Requirements](#feature-requirements)
    - [Implementation Details](#implementation-details)
      - [File Structure](#file-structure)
      - [Theme Integration](#theme-integration)
      - [Testing Requirements](#testing-requirements)
      - [Example Implementation](#example-implementation)
  - [Component Development](#component-development)
  - [State Management](#state-management)
  - [Testing Guidelines](#testing-guidelines)
- [🤝 Contributing](#-contributing)
  - [Code Style](#code-style)
- [🐛 Troubleshooting](#-troubleshooting)
  - [Common Issues](#common-issues)
- [🚀 Deployment](#-deployment)
  - [Android](#android)
  - [iOS](#ios)
- [📝 License](#-license)

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd my-app

# Install dependencies
npm install

# Start the development server
npm start
```

## 🏗 Project Structure

```
my-app/
├── src/
│   ├── components/common/           # Reusable UI components
│   │   ├── Button/                 # Button component with variants
│   │   ├── Input/                  # Form input with validation
│   │   └── ...
│   ├── features/                   # Feature modules
│   │   ├── auth/                   # Authentication
│   │   ├── profile/                # User profile
│   │   └── ...
│   ├── hooks/                      # Custom React hooks
│   ├── services/                   # API and business logic
│   └── theme/                      # Theme configuration
└── tests/                          # Test files
    ├── unit/                       # Unit tests
    └── e2e/                        # E2E test scenarios
```

## 🧪 Testing

### Unit & Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Testing Best Practices

#### 1. Test Structure

```typescript
describe('[ComponentName]', () => {
  // Setup mocks and test data
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: jest.fn((event, callback) => {
      if (event === 'focus') callback();
      return jest.fn();
    }),
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly', () => {
      // Test rendering
    });
  });
});
```

#### 2. Navigation Testing

For components using React Navigation, use this mock pattern:

```typescript
// Mock the navigation module
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  
  // Create a mock NavigationContainer with required methods
  const MockNavigationContainer = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
  };
  
  // Add required static properties
  MockNavigationContainer.router = {
    getStateForAction: jest.fn(),
    getActionForPathAndParams: jest.fn(),
    getPathAndParamsForState: jest.fn(),
    getActionCreators: jest.fn(() => ({})),
  };
  
  // Add getConstants method
  MockNavigationContainer.getConstants = () => ({
    linking: {},
    theme: {},
  });
  
  return {
    ...actualNav,
    useNavigation: () => mockNavigation,
    NavigationContainer: MockNavigationContainer,
  };
});
```

#### 3. Test Coverage Areas

For each screen, ensure you test:

1. **Basic Rendering**
   - Component renders without crashing
   - All essential UI elements are present
   - Proper display of static text and labels

2. **Navigation**
   - All navigation actions (buttons, links, etc.)
   - Correct navigation parameters
   - Back button behavior

3. **User Interactions**
   - All interactive elements (buttons, inputs, toggles)
   - State updates after interactions
   - Form validation
   - Loading and disabled states

4. **Data Display**
   - Dynamic data rendering
   - Edge cases (empty states, loading states, error states)
   - Data formatting (dates, numbers, etc.)

5. **Accessibility**
   - Proper accessibility labels and hints
   - Focus management
   - Screen reader compatibility

6. **Theming and Styling**
   - Theme colors and styles
   - Responsive behavior
   - Dark/light mode support

### E2E Tests with Maestro

```bash
# Install Maestro CLI (if not installed)
curl -Ls "https://get.maestro.mobile.dev" | bash

# Run all Maestro flows
maestro test .maestro/tests/

# Run specific test suite
maestro test .maestro/tests/auth/login_flow.yaml
```

### Test Coverage
We maintain a minimum of 80% test coverage. To check current coverage:

```bash
npm test -- --coverage
```

### Test Generation Prompt

For generating new test files, use the following prompt template:

```markdown
# React Native Screen Test Case Generation

## Component Information
- **Component Name**: [ComponentName]
- **File Path**: [path/to/ComponentName.tsx]
- **Description**: [Brief description of what the component does]

## Testing Requirements
1. Test Setup with proper mocks for navigation, context, and services
2. Test cases for rendering, navigation, user interactions, data display, accessibility, and theming
3. Proper TypeScript types for all test variables and functions
4. Comprehensive test coverage for both happy paths and error cases
5. Follow the project's existing testing patterns and conventions
```

### Example Test File

See these reference implementations for examples:
- `src/features/auth/screens/__tests__/LoginScreen.test.tsx`
- `src/features/auth/screens/__tests__/SignupScreen.test.tsx`
- `src/features/profile/screens/__tests__/ProfileScreen.test.tsx`

## 🛠 Feature Development Guide

### 🎯 Feature Implementation Template

Use this template when implementing new features to maintain consistency with the project's architecture and best practices:

You are a senior frontend engineer experienced in TypeScript, React Native, and modular app architecture of Expo.
I want you to help me scaffold a new feature implementation following a structured template.

Use the format below to describe the new feature implementation plan: 
```markdown
# [Feature Name] Implementation

## Project Context
[Briefly describe the feature and its purpose]

## Feature Requirements
1. Core functionality:
   - [List main functionality points]
   - [Include user stories if applicable]

2. Key screens:
   - [List all screens needed]

3. Data model:
   - [Describe the data structure]
   - [Include Firestore schema if applicable]

## Implementation Details

### File Structure
src/features/[feature-name]/
  ├── components/     # Reusable UI components
  ├── screens/        # Screen components
  ├── hooks/          # Custom hooks
  ├── services/       # API/services
  ├── types/          # TypeScript types
  ├── __tests__/      # Unit/Integration tests
  └── index.ts        # Public API exports

### Theme Integration
typescript
// Use these theme properties:
const styles = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  padding-horizontal: ${({ theme }) => theme.spacing.md};
  padding-vertical: ${({ theme }) => theme.spacing.sm};
`;

### Testing Requirements

1. **Unit Tests**: Test components, hooks, and utilities
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Add Maestro test flows

### Example Implementation
For reference, see these features:
- `src/features/auth/` - Authentication flows
- `src/features/profile/` - User profile management


### Component Development

1. **File Structure**
   
   ComponentName/
   ├── ComponentName.tsx        # Main component
   ├── ComponentName.styles.ts  # Styled components
   ├── ComponentName.test.tsx   # Tests
   └── index.ts                 # Exports

2. **Example Component**
   ```tsx
   // Button/Button.tsx
   import React from 'react';
   import { ButtonProps } from './Button.types';
   import * as S from './Button.styles';

   export const Button: React.FC<ButtonProps> = ({
     children,
     variant = 'primary',
     ...props
   }) => {
     return (
       <S.ButtonContainer variant={variant} {...props}>
         <S.ButtonText>{children}</S.ButtonText>
       </S.ButtonContainer>
     );
   };
   

### State Management

- Use React Context for global state
- Keep state as local as possible
- Use custom hooks for reusable state logic

### Testing Guidelines

1. **Test Structure**
   typescript
   describe('Button Component', () => {
     it('renders correctly', () => {
       const { getByText } = render(<Button>Test</Button>);
       expect(getByText('Test')).toBeTruthy();
     });
   });


2. **Test Coverage**
   - Test component rendering
   - Test user interactions
   - Test edge cases
   - Test error states
```
## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use meaningful variable names
- Add comments for complex logic
- Keep components small and focused

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear Metro cache
   npm start -- --reset-cache
   
   # Reinstall node_modules
   rm -rf node_modules
   npm install
   ```

2. **iOS Build Issues**
   ```bash
   cd ios
   pod install
   cd ..
   ```

## 🚀 Deployment

### Android
```bash
# Build APK
cd android
./gradlew assembleRelease

# Build AAB (Play Store)
./gradlew bundleRelease
```

### iOS
1. Open `ios/YourApp.xcworkspace` in Xcode
2. Select the target device
3. Click "Product" > "Archive"
4. Follow the prompts to upload to TestFlight

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by [Your Team Name]
</div>
