import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../../types';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../contexts/UserContext';
import { authService } from '../../../services/authService';
import { Button } from '../components/Button';
import {
  Container,
  Title,
  ProfileContainer,
  AvatarContainer,
  Avatar,
  NameText,
  EmailText,
  InfoContainer,
  InfoBox,
  InfoTitle,
  InfoValue,
  ButtonContainer,
} from './ProfileScreen.styles';

const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { width } = useWindowDimensions();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  
  // Handle success message when returning from update
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // User data will be automatically updated through UserContext
    });

    return unsubscribe;
  }, [navigation]);

  const handleEditProfile = () => {
    if (user?.uid) {
      navigation.navigate('UpdateProfile', {
        userId: user.uid,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const renderInfoBox = (title: string, value?: string) => (
    <InfoBox key={title}>
      <InfoTitle>{title}</InfoTitle>
      <InfoValue>{value || t('profile.notProvided')}</InfoValue>
    </InfoBox>
  );

  if (!user) {
    return (
      <Container $width={width}>
        <Title>{t('profile.loading')}</Title>
      </Container>
    );
  }

  return (
    <Container $width={width}>
      <ProfileContainer>
        <Title>{t('profile.title')}</Title>
        
        <AvatarContainer>
          <Avatar
            source={user.photoURL ? { uri: user.photoURL } : require('../../../../assets/default-avatar.png')}
            accessibilityLabel={t('profile.avatar')}
          />
          <NameText>{user.displayName || t('profile.guest')}</NameText>
          <EmailText testID="user-email">{user.email || 'No email provided'}</EmailText>
        </AvatarContainer>

        <InfoContainer>
          {renderInfoBox(t('profile.name'), user.displayName || undefined)}
          {renderInfoBox(t('profile.email'), user.email || undefined)}
          {renderInfoBox(t('profile.phoneNumber'), user.phoneNumber || undefined)}
          {renderInfoBox(t('profile.bio'), user.bio || undefined)}
          {renderInfoBox(t('profile.dateOfBirth'), user.dateOfBirth)}
        </InfoContainer>

        <ButtonContainer>
          <Button
            title="Edit Profile"
            onPress={handleEditProfile}
            style={{ marginBottom: 16 }}
            variant="primary"
            testID="edit-profile-button"
            accessibilityLabel={t('profile.editProfile')}
          />
          <Button
            title={t('profile.logout')}
            onPress={handleLogout}
            variant="danger"
            style={{ marginTop: 16 }}
            testID="logout-button"
            accessibilityLabel="Logout"
          />
        </ButtonContainer>
      </ProfileContainer>
    </Container>
  );
};

export default ProfileScreen;