import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  Alert, 
  ScrollView, 
  useWindowDimensions,
  StyleSheet
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../../types';
import { useUser } from '../../../contexts/UserContext';
import { useTranslation } from 'react-i18next';

// Import styled components
import {
  Container,
  Title,
  FormContainer,
  FormField,
  Label,
  Input,
  ErrorText,
  ButtonContainer,
  Button,
  ButtonText,
  CancelButton,
  CancelButtonText,
  LoadingOverlay,
} from './UpdateProfileScreen.styles';

// Main form component
const UpdateProfileForm = () => {
  console.log('[UpdateProfileScreen] Rendering form component');
  
  const { t } = useTranslation();
  console.log('[UpdateProfileScreen] useTranslation hook initialized');
  
  // Add a safe default for the user object
  const defaultUser = {
    uid: '',
    email: '',
    displayName: '',
    phoneNumber: '',
    photoURL: null,
    emailVerified: false,
  };
  
  const { user = defaultUser, updateUser, isLoading: isUserLoading, error: userError } = useUser();
  
  // Log user state changes
  useEffect(() => {
    console.log('[UpdateProfileScreen] User state updated:', {
      hasUser: !!user,
      user: user ? { ...user, email: user.email || 'no-email' } : 'null',
      isUserLoading,
      userError: userError || 'none'
    });
  }, [user, isUserLoading, userError]);
  
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    bio: '',
  });
  
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  
  // Constants
  const MAX_BIO_LENGTH = 200;
  const MAX_NAME_LENGTH = 50;

  // Initialize form with user data
  useEffect(() => {
    console.log('[UpdateProfileScreen] Initializing form with user data');
    if (user) {
      console.log('[UpdateProfileScreen] Setting form data from user:', {
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        bio: user.bio || '',
      });
      
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        bio: user.bio || '',
      });
      setIsReady(true);
    } else {
      console.log('[UpdateProfileScreen] No user data available for form initialization');
      setIsReady(false);
    }
  }, [user]);

  // Safe translation function with fallback
  const safeT = useCallback((key: string, defaultValue: string = ''): string => {
    if (!key) return defaultValue;
    try {
      const result = t(key, { defaultValue });
      return typeof result === 'string' ? result : defaultValue;
    } catch (error) {
      console.warn(`[UpdateProfileScreen] Translation error for key "${key}":`, error);
      return defaultValue;
    }
  }, [t]);

  // Validate form fields
  const validateForm = useCallback((): boolean => {
    console.log('[UpdateProfileScreen] Validating form data:', formData);
    const newErrors: Record<string, string> = {};
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = safeT('profile.validation.displayName.required', 'Display name is required');
    } else if (formData.displayName.length > MAX_NAME_LENGTH) {
      newErrors.displayName = safeT('profile.validation.displayName.tooLong', `Display name must be less than ${MAX_NAME_LENGTH} characters`);
    }

    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = safeT('profile.validation.phone.invalid', 'Please enter a valid phone number');
    }

    if (formData.bio && formData.bio.length > MAX_BIO_LENGTH) {
      newErrors.bio = safeT('profile.validation.bio.tooLong', `Bio must be less than ${MAX_BIO_LENGTH} characters`);
    }

    setErrors(newErrors);
    console.log('[UpdateProfileScreen] Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, safeT]);

  const handleInputChange = (field: string, value: string) => {
    console.log(`[UpdateProfileScreen] Input changed - ${field}:`, value);
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    console.log('[UpdateProfileScreen] Form submitted');
    
    if (!user) {
      Alert.alert(
        safeT('common.error', 'Error'),
        safeT('profile.errors.userNotAvailable', 'User not available')
      );
      return;
    }

    if (!validateForm()) {
      console.log('[UpdateProfileScreen] Form validation failed');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('[UpdateProfileScreen] Updating user profile...');
      
      await updateUser({
        ...user,
        displayName: formData.displayName.trim(),
        phoneNumber: formData.phone.trim(),
        bio: formData.bio.trim(),
      });
      
      console.log('[UpdateProfileScreen] Profile updated successfully');
      Alert.alert(
        safeT('common.success', 'Success'),
        safeT('profile.updateSuccess', 'Profile updated successfully'),
        [
          {
            text: safeT('common.ok', 'OK'),
            onPress: () => navigation.goBack(),
          },
        ]
      );
      
    } catch (error) {
      console.error('[UpdateProfileScreen] Error updating profile:', error);
      Alert.alert(
        safeT('common.error', 'Error'),
        error instanceof Error ? error.message : safeT('common.unknownError', 'An unknown error occurred')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Container $width={Math.min(width - 48, 400)}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Title>{safeT('updateProfile.title', 'Update Profile')}</Title>
        
        <FormContainer>
          <FormField>
            <Label>{safeT('common.displayName', 'Display Name')}</Label>
            <Input
              value={formData.displayName}
              onChangeText={(text) => handleInputChange('displayName', text)}
              placeholder={safeT('common.enterDisplayName', 'Enter your display name')}
              placeholderTextColor="#999"
              testID="input-displayName"
            />
            {errors.displayName && <ErrorText>{errors.displayName}</ErrorText>}
          </FormField>
          
          <FormField>
            <Label>{safeT('common.email', 'Email')}</Label>
            <Input
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder={safeT('common.enterEmail', 'Enter your email')}
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false}
              selectTextOnFocus={false}
              testID="input-email"
            />
          </FormField>
          
          <FormField>
            <Label>{safeT('common.phone', 'Phone')}</Label>
            <Input
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              placeholder={safeT('common.enterPhone', 'Enter your phone number')}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              testID="input-phone"
            />
            {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
          </FormField>
          
          <FormField>
            <Label>{safeT('common.bio', 'Bio')}</Label>
            <Input
              value={formData.bio}
              onChangeText={(text) => handleInputChange('bio', text)}
              placeholder={safeT('common.enterBio', 'Enter your bio')}
              placeholderTextColor="#999"
              multiline
              testID="input-bio"
            />
            {errors.bio && <ErrorText>{errors.bio}</ErrorText>}
          </FormField>
          
          <ButtonContainer>
            <Button 
              onPress={handleSubmit} 
              disabled={isSubmitting}
              testID="save-button"
            >
              <ButtonText>
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  safeT('common.save', 'Save Changes')
                )}
              </ButtonText>
            </Button>
            
            <CancelButton 
              onPress={() => navigation.goBack()}
              disabled={isSubmitting}
              testID="cancel-button"
            >
              <CancelButtonText>
                {safeT('common.cancel', 'Cancel')}
              </CancelButtonText>
            </CancelButton>
          </ButtonContainer>
        </FormContainer>
      </ScrollView>
      
      {isSubmitting && (
        <LoadingOverlay testID="loading-overlay">
          <ActivityIndicator size="large" color="#ffffff" />
        </LoadingOverlay>
      )}
    </Container>
  );
};

// Main component
export default function UpdateProfileScreen() {
  return (
    <ErrorBoundary fallback={<Text>Something went wrong</Text>}>
      <UpdateProfileForm />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff3b30',
    marginBottom: 8,
  },
  errorDetails: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});