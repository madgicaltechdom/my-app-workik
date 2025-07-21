import React, { useState, useEffect, useCallback } from 'react';
import { useWindowDimensions, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useProfile } from '../contexts/ProfileContext';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../../localization/i18n';
import { validateEmail, validatePhoneNumber, validateDate, sanitizeInput } from '../../../utils/validation';

import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import {
  Container,
  ProfileContainer,
  Avatar,
  NameText,
  EmailText,
  InfoContainer,
  InfoBox,
  InfoTitle,
  InfoValue,
  LogoutButtonStyled,
  EditButtonStyled,
  EditButtonText
} from './ProfileScreen.styles';

const UpdateProfileScreen: React.FC = () => {
  const { profile: user, setProfile } = useProfile();
  const { width } = useWindowDimensions();
  useTheme();
  const navigation = useNavigation();

  const [profile, setLocalProfile] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: user?.address || {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setLocalProfile({
        displayName: user.displayName || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || {},
      });
    }
  }, [user]);

  const validateAllFields = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!profile.displayName.trim()) {
      newErrors.displayName = i18n.t('profile.errors.displayNameRequired') || 'Display name is required.';
    }
    if (!profile.email.trim() || !validateEmail(profile.email)) {
      newErrors.email = i18n.t('profile.errors.invalidEmail') || 'Please enter a valid email.';
    }
    if (profile.phoneNumber && !validatePhoneNumber(profile.phoneNumber)) {
      newErrors.phoneNumber = i18n.t('profile.errors.invalidPhone') || 'Phone number is invalid.';
    }
    if (profile.dateOfBirth && !validateDate(profile.dateOfBirth)) {
      newErrors.dateOfBirth = i18n.t('profile.errors.invalidDate') || 'Date of birth is invalid.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [profile]);

  const handleChange = (field: string, value: any) => {
    setLocalProfile(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? sanitizeInput(value) : value,
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setLocalProfile(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: sanitizeInput(value),
      },
    }));
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      return;
    }
    try {
      setProfile?.(profile);
      navigation.goBack();
    } catch (error) {
      // Optionally show error
    }
  };

  return (
    <Container $width={width} testID="update-profile-screen">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} accessible accessibilityLabel={i18n.t('profile.editProfile')}>
        <ProfileContainer>
          <Avatar
            source={require('../../../../assets/default-avatar.png')}
            accessibilityLabel={i18n.t('profile.avatar')}
            testID="avatar-image"
          />
          <NameText allowFontScaling accessibilityRole="header" testID="profile-name">
            {profile.displayName || i18n.t('profile.defaultName')}
          </NameText>
          <EmailText allowFontScaling>{profile.email || i18n.t('profile.noEmail')}</EmailText>

          <InfoContainer>
            <InfoBox>
              <InfoTitle allowFontScaling>{i18n.t('profile.name')}</InfoTitle>
              <InfoValue allowFontScaling>
                <Input
                  testID="input-displayName"
                  placeholder={i18n.t('profile.displayName') || 'Display Name'}
                  value={profile.displayName}
                  onChangeText={(text) => handleChange('displayName', text)}
                  accessibilityLabel={i18n.t('profile.displayName') || 'Display Name'}
                  accessible
                  keyboardType="default"
                  autoCapitalize="words"
                  error={errors.displayName}
                  style={{}}
                />
              </InfoValue>
            </InfoBox>
            <InfoBox>
              <InfoTitle allowFontScaling>{i18n.t('profile.email')}</InfoTitle>
              <InfoValue allowFontScaling>
                <Input
                  testID="input-email"
                  placeholder={i18n.t('profile.email') || 'Email'}
                  value={profile.email}
                  onChangeText={(text) => handleChange('email', text)}
                  accessibilityLabel={i18n.t('profile.email') || 'Email'}
                  accessible
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                  editable={false}
                  style={{}}
                />
              </InfoValue>
            </InfoBox>
            <InfoBox>
              <InfoTitle allowFontScaling>{i18n.t('profile.firstName')}</InfoTitle>
              <InfoValue allowFontScaling>
                <Input
                  testID="input-firstName"
                  placeholder={i18n.t('profile.firstName') || 'First Name'}
                  value={profile.firstName}
                  onChangeText={(text) => handleChange('firstName', text)}
                  accessibilityLabel={i18n.t('profile.firstName') || 'First Name'}
                  accessible
                  keyboardType="default"
                  autoCapitalize="words"
                  error={''}
                  style={{}}
                />
              </InfoValue>
            </InfoBox>
            <InfoBox>
              <InfoTitle allowFontScaling>{i18n.t('profile.lastName')}</InfoTitle>
              <InfoValue allowFontScaling>
                <Input
                  testID="input-lastName"
                  placeholder={i18n.t('profile.lastName') || 'Last Name'}
                  value={profile.lastName}
                  onChangeText={(text) => handleChange('lastName', text)}
                  accessibilityLabel={i18n.t('profile.lastName') || 'Last Name'}
                  accessible
                  keyboardType="default"
                  autoCapitalize="words"
                  error={''}
                  style={{}}
                />
              </InfoValue>
            </InfoBox>
            <InfoBox>
              <InfoTitle allowFontScaling>{i18n.t('profile.phoneNumber')}</InfoTitle>
              <InfoValue allowFontScaling>
                <Input
                  testID="input-phoneNumber"
                  placeholder={i18n.t('profile.phoneNumber') || 'Phone Number'}
                  value={profile.phoneNumber}
                  onChangeText={(text) => handleChange('phoneNumber', text)}
                  accessibilityLabel={i18n.t('profile.phoneNumber') || 'Phone Number'}
                  accessible
                  keyboardType="phone-pad"
                  error={errors.phoneNumber}
                  style={{}}
                />
              </InfoValue>
            </InfoBox>
            <InfoBox>
              <InfoTitle allowFontScaling>{i18n.t('profile.dateOfBirth')}</InfoTitle>
              <InfoValue allowFontScaling>
                <Input
                  testID="input-dateOfBirth"
                  placeholder={i18n.t('profile.dateOfBirth') || 'Date of Birth (YYYY-MM-DD)'}
                  value={profile.dateOfBirth}
                  onChangeText={(text) => handleChange('dateOfBirth', text)}
                  accessibilityLabel={i18n.t('profile.dateOfBirth') || 'Date of Birth'}
                  accessible
                  keyboardType="default"
                  autoCapitalize="none"
                  error={errors.dateOfBirth}
                  style={{}}
                />
              </InfoValue>
            </InfoBox>
            <InfoBox>
              <InfoTitle allowFontScaling>{i18n.t('profile.address')}</InfoTitle>
              <InfoValue allowFontScaling>
                <Input
                  testID="input-street"
                  placeholder={i18n.t('profile.street') || 'Street'}
                  value={profile.address?.street || ''}
                  onChangeText={(text) => handleAddressChange('street', text)}
                  accessibilityLabel={i18n.t('profile.street') || 'Street'}
                  accessible
                  keyboardType="default"
                  autoCapitalize="words"
                  error={''}
                  style={{}}
                />
                <Input
                  testID="input-city"
                  placeholder={i18n.t('profile.city') || 'City'}
                  value={profile.address?.city || ''}
                  onChangeText={(text) => handleAddressChange('city', text)}
                  accessibilityLabel={i18n.t('profile.city') || 'City'}
                  accessible
                  keyboardType="default"
                  autoCapitalize="words"
                  error={''}
                  style={{}}
                />
                <Input
                  testID="input-state"
                  placeholder={i18n.t('profile.state') || 'State/Province'}
                  value={profile.address?.state || ''}
                  onChangeText={(text) => handleAddressChange('state', text)}
                  accessibilityLabel={i18n.t('profile.state') || 'State/Province'}
                  accessible
                  keyboardType="default"
                  autoCapitalize="words"
                  error={''}
                  style={{}}
                />
                <Input
                  testID="input-zipCode"
                  placeholder={i18n.t('profile.zipCode') || 'Zip/Postal Code'}
                  value={profile.address?.zipCode || ''}
                  onChangeText={(text) => handleAddressChange('zipCode', text)}
                  accessibilityLabel={i18n.t('profile.zipCode') || 'Zip/Postal Code'}
                  accessible
                  keyboardType="numeric"
                  error={''}
                  style={{}}
                />
                <Input
                  testID="input-country"
                  placeholder={i18n.t('profile.country') || 'Country'}
                  value={profile.address?.country || ''}
                  onChangeText={(text) => handleAddressChange('country', text)}
                  accessibilityLabel={i18n.t('profile.country') || 'Country'}
                  accessible
                  keyboardType="default"
                  autoCapitalize="words"
                  error={''}
                  style={{}}
                />
              </InfoValue>
            </InfoBox>
          </InfoContainer>

          <EditButtonStyled
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel={i18n.t('profile.saveButton') || 'Save Profile'}
            testID="button-save-profile"
            activeOpacity={0.7}
          >
            <EditButtonText allowFontScaling>{i18n.t('profile.saveButton') || 'Save Profile'}</EditButtonText>
          </EditButtonStyled>
        </ProfileContainer>
      </ScrollView>
    </Container>
  );
};

export default UpdateProfileScreen;