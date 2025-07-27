import React, { useState, useEffect } from 'react';
import { Alert, useWindowDimensions, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { useUser } from '../../../contexts/UserContext';
import { authService } from '../../../services/authService';
import { lightTheme, darkTheme } from '../../../theme';
import {
  ScrollViewContainer,
  Title,
  Subtitle,
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
  LoadingIndicator,
} from './UpdateProfileScreen.styles';

// Type for the translation function
type UpdateProfileScreenTranslation = (key: string) => string;

// Create a wrapper component to ensure theme is properly provided
const ThemedUpdateProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  
  return (
    <UpdateProfileScreenContent 
      t={t as UpdateProfileScreenTranslation}
      user={user} 
      width={width} 
      theme={theme} 
    />
  );
};

type UpdateProfileScreenProps = {
  t: UpdateProfileScreenTranslation;
  user: any; // Replace with proper User type
  width: number;
  theme: any; // Replace with proper Theme type
};

const UpdateProfileScreenContent: React.FC<UpdateProfileScreenProps> = ({
  t,
  user,
  width,
  theme,
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    bio: '',
    dateOfBirth: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with user data when available
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        bio: user.bio || '',
        dateOfBirth: user.dateOfBirth || '',
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.displayName?.trim()) {
      newErrors.displayName = t('profile.errors.displayNameRequired');
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = t('profile.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('profile.errors.invalidEmail');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await authService.updateUserProfile({
        displayName: formData.displayName,
        phoneNumber: formData.phone,
        bio: formData.bio,
        dateOfBirth: formData.dateOfBirth,
      });
      
      if (result.success) {
        Alert.alert(
          t('profile.updateSuccess.title'),
          t('profile.updateSuccess.message'),
          [{ text: t('common.ok') }]
        );
        navigation.goBack();
      } else {
        Alert.alert(
          t('profile.updateError.title'),
          result.error || t('profile.updateError.message'),
          [{ text: t('common.ok') }]
        );
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert(
        t('profile.updateError.title'),
        t('profile.updateError.message'),
        [{ text: t('common.ok') }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ScrollViewContainer>
      <Title>{t('profile.updateTitle')}</Title>
      <Subtitle>{t('profile.updateSubtitle')}</Subtitle>
      
      <FormContainer>
        {/* Display Name */}
        <FormField>
          <Label>{t('profile.displayName')}</Label>
          <Input
            value={formData.displayName}
            onChangeText={(text: string) => handleInputChange('displayName', text)}
            placeholder={t('profile.displayNamePlaceholder')}
            testID="input-displayName"
          />
          {errors.displayName && <ErrorText>{errors.displayName}</ErrorText>}
        </FormField>

        {/* Email */}
        <FormField>
          <Label>{t('profile.email')}</Label>
          <Input
            value={formData.email}
            onChangeText={(text: string) => handleInputChange('email', text)}
            placeholder={t('profile.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="input-email"
            editable={false}
            selectTextOnFocus={false}
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
        </FormField>

        {/* Phone */}
        <FormField>
          <Label>{t('profile.phoneNumber')}</Label>
          <Input
            value={formData.phone}
            onChangeText={(text: string) => handleInputChange('phone', text)}
            placeholder={t('profile.phonePlaceholder')}
            keyboardType="phone-pad"
            testID="input-phone"
          />
        </FormField>

        {/* Bio */}
        <FormField>
          <Label>{t('profile.bio')}</Label>
          <Input
            value={formData.bio}
            onChangeText={(text: string) => handleInputChange('bio', text)}
            placeholder={t('profile.bioPlaceholder')}
            multiline
            numberOfLines={4}
            testID="input-bio"
          />
        </FormField>

        {/* Date of Birth */}
        <FormField>
          <Label>{t('profile.dateOfBirth')}</Label>
          <Input
            value={formData.dateOfBirth}
            onChangeText={(text: string) => handleInputChange('dateOfBirth', text)}
            placeholder={t('profile.dateOfBirthPlaceholder')}
            keyboardType="numeric"
            testID="input-dateOfBirth"
          />
        </FormField>

        <ButtonContainer>
          <Button 
            onPress={handleSave} 
            disabled={isLoading}
            testID="save-button"
          >
            <ButtonText>
              {isLoading ? t('common.saving') : t('common.saveChanges')}
            </ButtonText>
          </Button>
          
          <CancelButton 
            onPress={handleCancel}
            disabled={isLoading}
            testID="cancel-button"
          >
            <CancelButtonText>{t('common.cancel')}</CancelButtonText>
          </CancelButton>
        </ButtonContainer>
      </FormContainer>

      {isLoading && (
        <LoadingOverlay testID="loading-overlay">
          <LoadingIndicator />
        </LoadingOverlay>
      )}
    </ScrollViewContainer>
  );
};

export default ThemedUpdateProfileScreen;