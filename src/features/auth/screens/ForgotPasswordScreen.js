import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../services/firebaseConfig';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import ErrorMessage from '../../../components/common/ErrorMessage';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    // Clear previous errors
    setError('');
    
    // Basic validation
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    setLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, email);
      
      Alert.alert(
        'Password Reset', 
        'A password reset link has been sent to your email.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      // Handle specific Firebase auth errors
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-not-found':
          setError('No user found with this email');
          break;
        default:
          setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        <Input 
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        {error ? <ErrorMessage message={error} /> : null}
        
        <Button 
          title="Reset Password" 
          onPress={handleResetPassword}
          loading={loading}
          disabled={loading}
        />
        
        <Button 
          title="Back to Login" 
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}
          textStyle={styles.loginButtonText}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    padding: 20,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  loginButtonText: {
    color: '#007bff',
  },
});

export default ForgotPasswordScreen;