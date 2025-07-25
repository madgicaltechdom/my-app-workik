import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';
import { theme } from './src/theme';

// IMPORTANT: Import Firebase config first to ensure initialization
// This fixes the "Empty input string" error by ensuring Firebase is properly initialized
// before any components try to use it (especially UserProvider)
import './src/services/firebaseConfig';
import UserProvider from '@/contexts/UserContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/localization/i18n';
import { ProfileProvider } from '@/features/profile/contexts/ProfileContext';
import { AppNavigator } from './src/navigation';

export default function App(): React.JSX.Element {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <ProfileProvider>
            <SafeAreaProvider>
              <AppNavigator />
            </SafeAreaProvider>
          </ProfileProvider>
        </UserProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
