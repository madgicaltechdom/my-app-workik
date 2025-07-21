# StorageApp

A React Native application for user authentication, profile management, and settings, built with Firebase and robust form validation. The project uses modern best practices, including shared validation utilities, styled-components, and end-to-end testing with Maestro.

## Overview

StorageApp is a cross-platform mobile app that allows users to:
- Sign up, log in, and reset their password
- View and update their profile
- Manage app settings
- Experience persistent authentication using Firebase Auth and AsyncStorage

## Features
- **Authentication:** Email/password login, signup, and password reset
- **Profile:** View and edit user profile details
- **Settings:** Manage app preferences
- **Localization:** Multi-language support
- **Validation:** Shared, robust validation utilities for all forms
- **Testing:** End-to-end UI tests with Maestro

## Project Structure

```
my-app/
  ├── src/
  │   ├── components/common/      # Reusable UI components (Button, Input, ErrorMessage, etc.)
  │   ├── features/               # Feature modules (auth, profile, home, settings)
  │   ├── hooks/                  # Custom React hooks
  │   ├── localization/           # i18n and language files
  │   ├── navigation/             # App, tab, and stack navigators
  │   ├── services/               # Firebase config, auth service, secure storage
  │   ├── theme/                  # Theme and styled-components
  │   └── utils/validation.ts     # Shared validation utilities
  ├── .maestro/                   # Maestro E2E test flows and element selectors
  ├── assets/                     # Images and static assets
  ├── App.js                      # App entry point
  ├── package.json                # Project dependencies and scripts
  └── README.md                   # Project documentation
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
   maestro test .maestro/tests/auth/login_positive_test.yaml
   ```
   Or run all tests in the `.maestro/tests/auth/` directory.

- **Test IDs:**
  - All form fields and buttons use `testID` props for reliable test automation.
  - Maestro selectors in test flows map to these testIDs via the `id:` selector.

## Technologies Used
- **React Native** (with TypeScript and JavaScript)
- **Firebase** (Auth, Firestore)
- **AsyncStorage** (persistent auth)
- **styled-components** (theming and styles)
- **Maestro** (end-to-end UI testing)
- **i18n-js / react-i18next** (localization)

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE) 