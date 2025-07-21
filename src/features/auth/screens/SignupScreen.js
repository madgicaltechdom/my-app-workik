import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { authService } from '../../../services/authService';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import ErrorMessage from '../../../components/common/ErrorMessage';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');



  const validateForm = () => {
    // Basic validation
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    if (!password) {
      setError('Password is required');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return false;
    }
    
    // Password strength validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleSignup = async () => {
    // Clear previous errors
    setError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Attempt to create user
      await authService.signup(email, password);
      
      // Optional: Show success message or navigate
      Alert.alert('Success', 'Account created successfully');
      
      // Optionally navigate to login or directly log in
      navigation.replace('Login');
    } catch (err) {
      // Handle specific Firebase auth errors
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Email is already registered');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/weak-password':
          setError('Password is too weak');
          break;
        default:
          setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >

      <View style={styles.innerContainer}>
        <Input 
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input 
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Input 
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        
        {error ? <ErrorMessage message={error} /> : null}
        
        <Button 
          title="Sign Up" 
          onPress={handleSignup}
          loading={loading}
          disabled={loading}
        />
        
        <Button 
          title="Already have an account? Login" 
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

export default SignupScreen;