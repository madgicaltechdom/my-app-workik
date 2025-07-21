import React from 'react';
import { useWindowDimensions, ScrollView, TouchableOpacity, AccessibilityRole } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useProfile } from '../contexts/ProfileContext';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../../localization/i18n';
import { authService } from '../../../services/authService';
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

const ProfileScreen: React.FC = () => {
  const { profile: user } = useProfile();
  const { width } = useWindowDimensions();
  useTheme();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('UpdateProfileScreen');
  };

  // Sanitize and fallback for user fields
  const firstName = (user?.firstName || '').trim();
  const lastName = (user?.lastName || '').trim();
  const phoneNumber = (user?.phoneNumber || '').trim();
  const dateOfBirth = (user?.dateOfBirth || '').trim();
  const address = user?.address || {};

  return (
    <Container $width={width} testID="profile-screen">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} accessible accessibilityLabel={i18n.t('profile.screenTitle')}>
        <ProfileContainer testID="profile-header">
          <Avatar
            source={require('../../../../assets/default-avatar.png')}
            accessibilityLabel={i18n.t('profile.avatar')}
            testID="avatar-image"
          />
          <NameText allowFontScaling accessibilityRole="header" testID="profile-name">
            {user?.displayName || `${firstName} ${lastName}` || i18n.t('profile.defaultName')}
          </NameText>
          <EmailText allowFontScaling>{user?.email || i18n.t('profile.noEmail')}</EmailText>

          <EditButtonStyled
            onPress={handleEditProfile}
            accessibilityRole="button"
            accessibilityLabel={i18n.t('profile.editProfile')}
            testID="edit-profile-button"
            activeOpacity={0.7}
          >
            <EditButtonText allowFontScaling>{i18n.t('profile.edit')}</EditButtonText>
          </EditButtonStyled>

          <InfoContainer>
            <InfoBox>
              <InfoTitle allowFontScaling>{i18n.t('profile.emailVerified')}</InfoTitle>
              <InfoValue allowFontScaling>
                {user?.emailVerified ? i18n.t('profile.yes') : i18n.t('profile.no')}
              </InfoValue>
            </InfoBox>
            {Boolean(firstName || lastName) && (
              <InfoBox>
                <InfoTitle allowFontScaling>{i18n.t('profile.name')}</InfoTitle>
                <InfoValue allowFontScaling>{`${firstName} ${lastName}`}</InfoValue>
              </InfoBox>
            )}
            {phoneNumber ? (
              <InfoBox>
                <InfoTitle allowFontScaling>{i18n.t('profile.phoneNumber')}</InfoTitle>
                <InfoValue allowFontScaling>{phoneNumber}</InfoValue>
              </InfoBox>
            ) : null}
            {dateOfBirth ? (
              <InfoBox>
                <InfoTitle allowFontScaling>{i18n.t('profile.dateOfBirth')}</InfoTitle>
                <InfoValue allowFontScaling>{dateOfBirth}</InfoValue>
              </InfoBox>
            ) : null}
            {Boolean(address.street || address.city || address.state || address.zipCode || address.country) && (
              <InfoBox>
                <InfoTitle allowFontScaling>{i18n.t('profile.address')}</InfoTitle>
                <InfoValue allowFontScaling>
                  {[address.street, address.city, address.state, address.zipCode, address.country]
                    .filter(Boolean)
                    .join(', ')}
                </InfoValue>
              </InfoBox>
            )}
          </InfoContainer>

          <LogoutButtonStyled
            title={i18n.t('profile.logout')}
            onPress={handleLogout}
            testID="logout-button"
          />
        </ProfileContainer>
      </ScrollView>
    </Container>
  );
};

export default ProfileScreen;