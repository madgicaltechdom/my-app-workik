import React, { useReducer, useCallback } from 'react';
import { KeyboardAvoidingView, Platform, useWindowDimensions, TouchableOpacity, useColorScheme, View } from 'react-native';
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
import { useTranslation } from '../../../localization';
import type { StackNavigationProp } from '@react-navigation/stack';
import { validateEmail, sanitizeInput } from '../../../utils/validation';

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
  const { t } = useTranslation();
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
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    if (!sanitizedEmail || !sanitizedPassword) {
      dispatch({ type: 'SET_ERROR', payload: t('login.bothRequired') });
      return;
    }
    if (!validateEmail(sanitizedEmail)) {
      dispatch({ type: 'SET_ERROR', payload: t('login.invalidEmail') });
      return;
    }
    // Optionally: Add password validation here if you want to enforce rules
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await authService.login(sanitizedEmail, sanitizedPassword);
      // Navigation handled by auth observer
    } catch (err: any) {
      switch (err.code) {
        case 'auth/invalid-email':
          dispatch({ type: 'SET_ERROR', payload: t('login.invalidEmail') });
          break;
        case 'auth/user-not-found':
          dispatch({ type: 'SET_ERROR', payload: t('login.userNotFound') });
          break;
        case 'auth/wrong-password':
          dispatch({ type: 'SET_ERROR', payload: t('login.wrongPassword') });
          break;
        default:
          dispatch({ type: 'SET_ERROR', payload: t('login.loginFailed') });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [email, password]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="login-screen"
    >
      <Container $width={width} $colorScheme={colorScheme}>
        <Title 
          accessibilityRole="header" 
          accessibilityLabel={t('login.loginScreenTitle')}
          testID="login-title">
          {t('login.title')}
        </Title>
        <View testID="email-input-container">
          <StyledInput
            placeholder={t('login.emailPlaceholder')}
            value={email}
            onChangeText={text => dispatch({ type: 'SET_EMAIL', payload: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            accessible
            accessibilityLabel={t('login.emailPlaceholder')}
            error={error}
            testID="email-input"
          />
        </View>
        <View testID="password-input-container">
          <StyledInput
            placeholder={t('login.passwordPlaceholder')}
            value={password}
            onChangeText={text => dispatch({ type: 'SET_PASSWORD', payload: text })}
            secureTextEntry
            accessible
            accessibilityLabel={t('login.passwordPlaceholder')}
            error={error}
            testID="password-input"
          />
        </View>
        <StyledErrorMessage message={error} testID="login-error-message" />
        <StyledButton
          title={t('login.loginButton')}
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          textStyle={{ fontWeight: 'bold' }}
          testID="login-button"
        />
        <Footer>
          <FooterText>{t('login.signupPrompt')}</FooterText>
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            accessibilityRole="button"
            accessibilityLabel={t('login.goToSignup')}
            testID="login-signup-link"
          >
            <FooterLink>{t('login.signupLink')}</FooterLink>
          </TouchableOpacity>
        </Footer>
      </Container>
    </KeyboardAvoidingView>
  );
}



export default LoginScreen;
