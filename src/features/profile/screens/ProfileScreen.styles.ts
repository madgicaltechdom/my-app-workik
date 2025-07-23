import styled from 'styled-components/native';
import { ScrollView } from 'react-native';

export const Container = styled.View<{ $width: number }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  width: ${({ $width }) => ($width > 500 ? '500px' : `${$width}px`)};
  align-self: center;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes['2xl']}px;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  letter-spacing: -0.5px;
  line-height: 36px;
`;

export const ProfileContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 24,
  },
})`
  flex: 1;
`;

export const AvatarContainer = styled.View`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
  padding-vertical: ${({ theme }) => theme.spacing.lg}px;
`;

export const Avatar = styled.Image`
  width: 140px;
  height: 140px;
  border-radius: 70px;
  border-width: 4px;
  border-color: ${({ theme }) => theme.colors.primary};
  elevation: 8;
`;

export const NameText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xl}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  text-align: center;
  letter-spacing: -0.3px;
  line-height: 32px;
`;

export const EmailText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  opacity: 0.8;
`;

export const InfoContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export const InfoBox = styled.View`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  elevation: 3;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.borderLight};
`;

export const InfoTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xs}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  opacity: 0.7;
`;

export const InfoValue = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  line-height: 22px;
`;

export const ButtonContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing.xl}px;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
`;
