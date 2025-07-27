import React, { useState } from 'react';
import { 
  View, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFirebaseAuth } from '../../../hooks/useFirebaseAuth';
import { authService } from '../../../services/authService';
import { Input, Button, ErrorMessage } from '../../../components/common';
import { styles } from './SignupScreen.styles';
import { validateEmail, validatePassword, sanitizeInput } from '../../../utils/validation';

type SignupScreenProps = {
  navigation: StackNavigationProp<any>;
};

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { loading: authLoading } = useFirebaseAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = (): boolean => {
    const cleanEmail = sanitizeInput(email);
    const cleanPassword = sanitizeInput(password);
    const cleanConfirmPassword = sanitizeInput(confirmPassword);
    if (!cleanEmail) {
      setError(t('signup.emailRequired'));
      return false;
    }
    if (!validateEmail(cleanEmail)) {
      setError(t('signup.invalidEmail'));
      return false;
    }
    if (!cleanPassword) {
      setError(t('signup.passwordRequired'));
      return false;
    }
    if (!validatePassword(cleanPassword)) {
      setError(t('signup.weakPassword'));
      return false;
    }
    if (cleanPassword !== cleanConfirmPassword) {
      setError(t('signup.passwordsDoNotMatch'));
      return false;
    }
    return true;
  };

  const handleSignup = async (): Promise<void> => {
    setError('');
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      await authService.signup(sanitizeInput(email), sanitizeInput(password));
      Alert.alert(t('signup.accountCreated'));
      navigation.replace('Login');
    } catch (err: any) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError(t('signup.emailAlreadyInUse'));
          break;
        case 'auth/invalid-email':
          setError(t('signup.invalidEmail'));
          break;
        case 'auth/weak-password':
          setError(t('signup.weakPassword'));
          break;
        default:
          setError(t('signup.signupFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      testID="signup-screen"
    >
      <View style={styles.innerContainer}>
        <Input 
          placeholder={t('signup.emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel={t('signup.emailPlaceholder')}
          testID="email-input"
          style={styles.formControl}
          error={error}
        />
        <Input 
          placeholder={t('signup.passwordPlaceholder')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel={t('signup.passwordPlaceholder')}
          testID="password-input"
          style={styles.formControl}
          error={error}
        />
        <Input 
          placeholder={t('signup.confirmPasswordPlaceholder')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          accessibilityLabel={t('signup.confirmPasswordPlaceholder')}
          testID="confirm-password-input"
          style={styles.formControl}
          error={error}
        />
        
        {error ? <ErrorMessage message={error} testID="error-message" style={styles.formControl} /> : null}
        
        <Button 
          title={t('signup.signupButton')}
          onPress={handleSignup}
          loading={loading || authLoading}
          disabled={loading || authLoading}
          testID="signup-button"
          style={styles.formControl}
          textStyle={{}}
        />
        
        <Button 
          title={t('signup.loginPrompt') + ' ' + t('signup.loginLink')}
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}
          textStyle={styles.loginButtonText}
          testID="login-link"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
