import React, { useEffect } from 'react';
import { useWindowDimensions, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { MainStackParamList } from '../../../types';
import { useUser } from '../../../contexts/UserContext';
import { authService } from '../../../services/authService';
import { Button } from '../../../components/common/Button';
import { lightTheme, darkTheme } from '../../../theme';
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
  styles as profileStyles,
} from './ProfileScreen.styles';

// Create a wrapper component to ensure theme is properly provided
const ThemedProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = profileStyles(theme);
  
  return <ProfileScreenContent t={t} user={user} width={width} styles={styles} />;
};

type ProfileScreenContentProps = {
  t: (key: string) => string;
  user: any; // Replace with proper User type
  width: number;
  styles: ReturnType<typeof profileStyles>;
};

const ProfileScreenContent: React.FC<ProfileScreenContentProps> = ({
  t,
  user,
  width,
  styles,
}) => {
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
            title={t('profile.editProfile')}
            onPress={handleEditProfile}
            variant="primary"
            testID="edit-profile-button"
            accessibilityLabel={t('profile.editProfile')}
            style={styles.button}
          />
          <Button
            title={t('profile.logout')}
            onPress={handleLogout}
            variant="danger"
            testID="logout-button"
            accessibilityLabel={t('profile.logout')}
            style={styles.button}
          />
        </ButtonContainer>
      </ProfileContainer>
    </Container>
  );
};

export default ThemedProfileScreen;