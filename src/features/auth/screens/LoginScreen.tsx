import React, { useReducer, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Input, Button, ErrorMessage, LoadingOverlay } from '@/components/common';
import { authService } from '@/services/authService';
import { validateEmail, validateRequired, sanitizeInput } from '@/utils/validation';
import { AuthStackParamList } from '@/types';

interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;
  errorMessage: string;
  hasAttemptedSubmit: boolean;
}

type LoginAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_ATTEMPTED_SUBMIT'; payload: boolean };

function loginReducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case 'SET_EMAIL':
      return {
        ...state,
        email: action.payload,
        errorMessage: state.hasAttemptedSubmit ? '' : state.errorMessage,
      };
    case 'SET_PASSWORD':
      return {
        ...state,
        password: action.payload,
        errorMessage: state.hasAttemptedSubmit ? '' : state.errorMessage,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        errorMessage: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        errorMessage: '',
      };
    case 'SET_ATTEMPTED_SUBMIT':
      return {
        ...state,
        hasAttemptedSubmit: action.payload,
      };
    default:
      return state;
  }
}

interface LoginScreenProps {
  navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
}

function LoginScreen({ navigation }: LoginScreenProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [state, dispatch] = useReducer(loginReducer, {
    email: '',
    password: '',
    isLoading: false,
    errorMessage: '',
    hasAttemptedSubmit: false,
  });

  const containerStyles = useMemo(() => [
    styles.container,
    isDark && styles.darkContainer,
  ], [isDark]);

  const contentStyles = useMemo(() => [
    styles.content,
    { maxWidth: Math.min(width * 0.9, 400) },
  ], [width]);

  const titleStyles = useMemo(() => [
    styles.title,
    isDark && styles.darkTitle,
  ], [isDark]);

  const footerTextStyles = useMemo(() => [
    styles.footerText,
    isDark && styles.darkFooterText,
  ], [isDark]);

  const footerLinkStyles = useMemo(() => [
    styles.footerLink,
    isDark && styles.darkFooterLink,
  ], [isDark]);

  const handleEmailChange = useCallback((email: string) => {
    const sanitizedEmail = sanitizeInput(email);
    dispatch({ type: 'SET_EMAIL', payload: sanitizedEmail });
  }, []);

  const handlePasswordChange = useCallback((password: string) => {
    dispatch({ type: 'SET_PASSWORD', payload: password });
  }, []);

  const validateForm = useCallback(() => {
    const emailValidation = validateEmail(state.email);
    if (!emailValidation.isValid) {
      dispatch({ type: 'SET_ERROR', payload: emailValidation.errorMessage || '' });
      return false;
    }

    const passwordValidation = validateRequired(state.password, 'Password');
    if (!passwordValidation.isValid) {
      dispatch({ type: 'SET_ERROR', payload: passwordValidation.errorMessage || '' });
      return false;
    }

    return true;
  }, [state.email, state.password]);

  const handleLogin = useCallback(async () => {
    dispatch({ type: 'SET_ATTEMPTED_SUBMIT', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    if (!validateForm()) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await authService.login(state.email, state.password);
      // Navigation will be handled by auth state observer
    } catch (error: any) {
      let errorMessage = t('auth.errors.loginFailed', { 
        defaultValue: 'Login failed. Please try again.' 
      });

      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = t('auth.errors.invalidEmail', { 
            defaultValue: 'Please enter a valid email address.' 
          });
          break;
        case 'auth/user-not-found':
          errorMessage = t('auth.errors.userNotFound', { 
            defaultValue: 'No account found with this email address.' 
          });
          break;
        case 'auth/wrong-password':
          errorMessage = t('auth.errors.wrongPassword', { 
            defaultValue: 'Incorrect password. Please try again.' 
          });
          break;
        case 'auth/too-many-requests':
          errorMessage = t('auth.errors.tooManyRequests', { 
            defaultValue: 'Too many failed attempts. Please try again later.' 
          });
          break;
        case 'auth/user-disabled':
          errorMessage = t('auth.errors.userDisabled', { 
            defaultValue: 'This account has been disabled.' 
          });
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.email, state.password, validateForm, t]);

  const handleNavigateToSignup = useCallback(() => {
    navigation.navigate('Signup');
  }, [navigation]);

  const handleNavigateToForgotPassword = useCallback(() => {
    navigation.navigate('ForgotPassword');
  }, [navigation]);

  const isFormValid = useMemo(() => {
    return state.email.trim() !== '' && state.password.trim() !== '';
  }, [state.email, state.password]);

  return (
    <SafeAreaView style={containerStyles} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={contentStyles}>
          <View style={styles.header}>
            <Text
              style={titleStyles}
              accessibilityRole="header"
              accessibilityLabel={t('auth.loginScreenTitle', { defaultValue: 'Login Screen' })}
              testID="login-title"
            >
              {t('auth.welcomeBack', { defaultValue: 'Welcome Back' })}
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label={t('auth.email', { defaultValue: 'Email' })}
              placeholder={t('auth.emailPlaceholder', { defaultValue: 'Enter your email' })}
              value={state.email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              isDisabled={state.isLoading}
              accessibilityLabel={t('auth.emailInput', { defaultValue: 'Email input' })}
              testID="login-email-input"
            />

            <Input
              label={t('auth.password', { defaultValue: 'Password' })}
              placeholder={t('auth.passwordPlaceholder', { defaultValue: 'Enter your password' })}
              value={state.password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              isDisabled={state.isLoading}
              accessibilityLabel={t('auth.passwordInput', { defaultValue: 'Password input' })}
              testID="login-password-input"
            />

            <ErrorMessage
              message={state.errorMessage}
              isVisible={Boolean(state.errorMessage)}
              testID="login-error-message"
            />

            <Button
              title={t('auth.loginButton', { defaultValue: 'Login' })}
              onPress={handleLogin}
              isLoading={state.isLoading}
              isDisabled={state.isLoading || !isFormValid}
              accessibilityLabel={t('auth.loginButtonLabel', { defaultValue: 'Login to your account' })}
              testID="login-submit-button"
            />

            <TouchableOpacity
              onPress={handleNavigateToForgotPassword}
              style={styles.forgotPasswordButton}
              accessibilityRole="button"
              accessibilityLabel={t('auth.forgotPasswordLabel', { defaultValue: 'Forgot password' })}
              testID="forgot-password-link"
            >
              <Text style={footerLinkStyles}>
                {t('auth.forgotPassword', { defaultValue: 'Forgot Password?' })}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={footerTextStyles}>
              {t('auth.noAccount', { defaultValue: "Don't have an account?" })}
            </Text>
            <TouchableOpacity
              onPress={handleNavigateToSignup}
              accessibilityRole="button"
              accessibilityLabel={t('auth.goToSignup', { defaultValue: 'Go to sign up' })}
              testID="signup-link"
            >
              <Text style={footerLinkStyles}>
                {t('auth.signUp', { defaultValue: 'Sign Up' })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <LoadingOverlay
        isVisible={state.isLoading}
        message={t('auth.loggingIn', { defaultValue: 'Logging in...' })}
        variant="modal"
        testID="login-loading-overlay"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  darkContainer: {
    backgroundColor: '#000000',
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'center',
  },

  header: {
    marginBottom: 32,
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
  },

  darkTitle: {
    color: '#FFFFFF',
  },

  form: {
    marginBottom: 32,
  },

  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  footerText: {
    fontSize: 16,
    color: '#8E8E93',
  },

  darkFooterText: {
    color: '#8E8E93',
  },

  footerLink: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },

  darkFooterLink: {
    color: '#0A84FF',
  },
});

export { LoginScreen };
