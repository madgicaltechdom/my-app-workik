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

## 🛠 Feature Development Guide

### 🎯 Feature Implementation Template

Use this template when implementing new features to maintain consistency with the project's architecture and best practices:

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
