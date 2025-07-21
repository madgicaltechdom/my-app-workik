
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';
import theme from './src/theme/theme';
import AppNavigator from './src/navigation/AppNavigator';
import './src/localization/i18n';


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
