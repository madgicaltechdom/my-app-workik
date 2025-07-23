import React, { useReducer, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import type { StackNavigationProp } from '@react-navigation/stack';

import { auth } from '../../../services/firebaseConfig';
import { Input, Button, ErrorMessage } from '../../../components/common';
import { validateEmail, sanitizeInput } from '../../../utils/validation';

interface ForgotPasswordState {
  email: string;
  isLoading: boolean;
  errorMessage: string;
}

type ForgotPasswordAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET_ERROR' };

function forgotPasswordReducer(
  state: ForgotPasswordState,
  action: ForgotPasswordAction
): ForgotPasswordState {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload, errorMessage: '' };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, errorMessage: action.payload, isLoading: false };
    case 'RESET_ERROR':
      return { ...state, errorMessage: '' };
    default:
      return state;
  }
}

type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Signup: undefined;
};

interface ForgotPasswordScreenProps {
  navigation: StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
}

function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [state, dispatch] = useReducer(forgotPasswordReducer, {
    email: '',
    isLoading: false,
    errorMessage: '',
  });

  const containerStyles = useMemo(() => [
    styles.container,
    isDark && styles.darkContainer,
  ], [isDark]);

  const handleEmailChange = useCallback((email: string) => {
    const sanitizedEmail = sanitizeInput(email);
    dispatch({ type: 'SET_EMAIL', payload: sanitizedEmail });
  }, []);

  const handleResetPassword = useCallback(async () => {
    dispatch({ type: 'RESET_ERROR' });

    if (!state.email.trim()) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: t('auth.errors.emailRequired', { defaultValue: 'Please enter your email' })
      });
      return;
    }

    if (!validateEmail(state.email)) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: t('auth.errors.invalidEmail', { defaultValue: 'Invalid email address' })
      });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await sendPasswordResetEmail(auth, state.email);
      
      Alert.alert(
        t('auth.passwordReset.title', { defaultValue: 'Password Reset' }),
        t('auth.passwordReset.message', { 
          defaultValue: 'A password reset link has been sent to your email.' 
        }),
        [
          {
            text: t('common.ok', { defaultValue: 'OK' }),
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      let errorMessage = t('auth.errors.generic', { 
        defaultValue: 'An error occurred. Please try again.' 
      });

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = t('auth.errors.userNotFound', { 
            defaultValue: 'No account found with this email address.' 
          });
          break;
        case 'auth/invalid-email':
          errorMessage = t('auth.errors.invalidEmail', { 
            defaultValue: 'Invalid email address.' 
          });
          break;
        case 'auth/too-many-requests':
          errorMessage = t('auth.errors.tooManyRequests', { 
            defaultValue: 'Too many requests. Please try again later.' 
          });
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.email, navigation, t]);

  const handleBackToLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  return (
    <SafeAreaView style={containerStyles} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Button
              title={t('common.back', { defaultValue: 'Back' })}
              onPress={handleBackToLogin}
              variant="secondary"
              size="small"
              style={styles.backButton}
              accessibilityLabel={t('auth.backToLogin', { defaultValue: 'Back to login' })}
            />
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
              errorMessage={state.errorMessage}
              accessibilityLabel={t('auth.emailInput', { defaultValue: 'Email input' })}
              testID="forgot-password-email-input"
            />

            <ErrorMessage
              message={state.errorMessage}
              isVisible={Boolean(state.errorMessage)}
              testID="forgot-password-error"
            />

            <Button
              title={t('auth.sendResetLink', { defaultValue: 'Send Reset Link' })}
              onPress={handleResetPassword}
              isLoading={state.isLoading}
              isDisabled={state.isLoading || !state.email.trim()}
              accessibilityLabel={t('auth.sendResetLinkButton', { 
                defaultValue: 'Send password reset link' 
              })}
              testID="forgot-password-submit-button"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
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
  },
  
  header: {
    marginBottom: 32,
  },
  
  backButton: {
    alignSelf: 'flex-start',
    marginVertical: 0,
  },
  
  form: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
});

export { ForgotPasswordScreen };
