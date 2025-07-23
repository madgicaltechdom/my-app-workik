import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../contexts/UserContext';
import { authService } from '../../../services/authService';
// Import the ORIGINAL styled components to test if they cause the error
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
} from './UpdateProfileScreen.styles';

const UpdateProfileScreen: React.FC = () => {
  console.log('[UpdateProfileScreen] Rendering screen with I18N INTEGRATION');
  
  const { t } = useTranslation();
  const { user } = useUser();
  
  // Debug logging for i18n translations
  console.log('[UpdateProfileScreen] Testing i18n translations:', {
    title: `"${t('profile.updateProfile')}"`,
    displayName: `"${t('profile.displayName')}"`,
    email: `"${t('profile.email')}"`,
    phone: `"${t('profile.phone')}"`,
    titleLength: t('profile.updateProfile').length,
    displayNameLength: t('profile.displayName').length,
    emailLength: t('profile.email').length,
    phoneLength: t('profile.phone').length,
  });
  
  // Add form state that integrates with user data
  const [formData, setFormData] = useState({
    displayName: 'Default User',
    email: 'user@example.com',
    phone: '', // Allow empty for phone since it's optional
    bio: '', // Allow empty for bio since it's optional
    dateOfBirth: '', // Add date of birth field
  });

  // Debug logging for user data
  console.log('[UpdateProfileScreen] User from context:', {
    user: user ? {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      bio: user.bio,
      dateOfBirth: user.dateOfBirth,
    } : 'null',
    userExists: !!user,
  });

  // Initialize form with user data when available
  useEffect(() => {
    if (user) {
      console.log('[UpdateProfileScreen] Setting form data from user');
      setFormData({
        displayName: user.displayName || 'Default User',
        email: user.email || 'user@example.com', 
        phone: user.phoneNumber || '', // Allow empty for phone
        bio: user.bio || '', // Initialize bio from user context
        dateOfBirth: user.dateOfBirth || '', // Initialize date of birth from user context
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    console.log(`[UpdateProfileScreen] Input change - ${field}: "${value}" (length: ${value.length})`);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    console.log('[UpdateProfileScreen] Save button pressed');
    console.log('[UpdateProfileScreen] Form data:', formData);
    
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
        console.log('[UpdateProfileScreen] Profile updated successfully');
      } else {
        Alert.alert(
          t('profile.updateError.title'),
          result.error || t('profile.updateError.message'),
          [{ text: t('common.ok') }]
        );
        console.error('[UpdateProfileScreen] Profile update failed:', result.error);
      }
    } catch (error) {
      console.error('[UpdateProfileScreen] Profile update error:', error);
      Alert.alert(
        t('profile.updateError.title'),
        t('profile.updateError.message'),
        [{ text: t('common.ok') }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ScrollViewContainer>
      <Title>{t('profile.updateTitle')}</Title>
      <Subtitle>{t('profile.updateSubtitle')}</Subtitle>
      
      {/* Display Name Input */}
      <FormField>
        <Label>{t('profile.displayName')}</Label>
        <Input
          value={formData.displayName}
          onChangeText={(text: string) => handleInputChange('displayName', text)}
          placeholder={t('profile.displayNamePlaceholder')}
          testID="input-displayName"
        />
      </FormField>

      {/* Email Input */}
      <FormField>
        <Label>{t('profile.email')}</Label>
        <Input
          value={formData.email}
          onChangeText={(text: string) => handleInputChange('email', text)}
          placeholder={t('profile.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          testID="input-email"
        />
      </FormField>

      {/* Phone Input */}
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

      {/* Bio Input */}
      <FormField>
        <Label>{t('profile.bio')}</Label>
        <Input
          value={formData.bio}
          onChangeText={(text: string) => handleInputChange('bio', text)}
          placeholder={t('profile.bioPlaceholder')}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          testID="input-bio"
        />
      </FormField>

      {/* Date of Birth Input */}
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

      {/* Save Button */}
      <ButtonContainer>
        <Button onPress={handleSave} disabled={isLoading} testID="save-button">
          <ButtonText>{isLoading ? t('profile.updating') : t('profile.saveChanges')}</ButtonText>
        </Button>
      </ButtonContainer>
    </ScrollViewContainer>
  );
};

export default UpdateProfileScreen;