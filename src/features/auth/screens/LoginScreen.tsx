import React, { useReducer, useCallback } from 'react';
import { KeyboardAvoidingView, Platform, useWindowDimensions, TouchableOpacity, useColorScheme } from 'react-native';
import { useTheme } from 'styled-components/native';
import {
  Container,
  Title,
  StyledInput,
  StyledErrorMessage,
  StyledButton,
  Footer,
  FooterText,
  FooterLink,
} from './LoginScreen.styles';
import { authService } from '../../../services/authService';
import { t, SupportedLocale } from '../../../localization';
import type { StackNavigationProp } from '@react-navigation/stack';

interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string;
}

type LoginAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

function loginReducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}


type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

interface LoginScreenProps {
  readonly navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
}

export function LoginScreen({ navigation }: LoginScreenProps) {
  // For demo, default to 'en'. In a real app, use device/setting.
  const locale: SupportedLocale = 'en';
  const [{ email, password, isLoading, error }, dispatch] = useReducer(loginReducer, {
    email: '',
    password: '',
    isLoading: false,
    error: '',
  });
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  useTheme();

  const handleLogin = useCallback(async () => {
    dispatch({ type: 'SET_ERROR', payload: '' });
    const sanitizedEmail = email.trim();
    const sanitizedPassword = password.trim();
    // Basic validation
    if (!sanitizedEmail || !sanitizedPassword) {
      dispatch({ type: 'SET_ERROR', payload: t(locale, 'login.bothRequired') });
      return;
    }
    // Optional: Add regex for email validation if needed
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await authService.login(sanitizedEmail, sanitizedPassword);
      // Navigation handled by auth observer
    } catch (err: any) {
      switch (err.code) {
        case 'auth/invalid-email':
          dispatch({ type: 'SET_ERROR', payload: t(locale, 'login.invalidEmail') });
          break;
        case 'auth/user-not-found':
          dispatch({ type: 'SET_ERROR', payload: t(locale, 'login.userNotFound') });
          break;
        case 'auth/wrong-password':
          dispatch({ type: 'SET_ERROR', payload: t(locale, 'login.wrongPassword') });
          break;
        default:
          dispatch({ type: 'SET_ERROR', payload: t(locale, 'login.loginFailed') });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [email, password]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Container $width={width} $colorScheme={colorScheme}>
        <Title accessibilityRole="header" accessibilityLabel={t(locale, 'login.loginScreenTitle')}>
          {t(locale, 'login.title')}
        </Title>
        <StyledInput
          placeholder={t(locale, 'login.emailPlaceholder')}
          value={email}
          onChangeText={text => dispatch({ type: 'SET_EMAIL', payload: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          accessible
          accessibilityLabel={t(locale, 'login.emailPlaceholder')}
          error={error}
          testID="login-email-input"
        />
        <StyledInput
          placeholder={t(locale, 'login.passwordPlaceholder')}
          value={password}
          onChangeText={text => dispatch({ type: 'SET_PASSWORD', payload: text })}
          secureTextEntry
          accessible
          accessibilityLabel={t(locale, 'login.passwordPlaceholder')}
          error={error}
          testID="login-password-input"
        />
        <StyledErrorMessage message={error} testID="login-error-message" />
        <StyledButton
          title={t(locale, 'login.loginButton')}
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          textStyle={{ fontWeight: 'bold' }}
          testID="login-submit-button"
        />
        <Footer>
          <FooterText>{t(locale, 'login.signupPrompt')}</FooterText>
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            accessibilityRole="button"
            accessibilityLabel={t(locale, 'login.goToSignup')}
            testID="login-signup-link"
          >
            <FooterLink>{t(locale, 'login.signupLink')}</FooterLink>
          </TouchableOpacity>
        </Footer>
      </Container>
    </KeyboardAvoidingView>
  );
}



export default LoginScreen;
