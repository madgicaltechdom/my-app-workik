import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export const Container = styled.View<{ $width: number }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  width: ${({ $width }) => $width}px;
`;

export const ProfileContainer = styled.View`
  flex: 1;
  padding: 20px;
  align-items: center;
`;

export const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 20px;
`;

export const NameText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 5px;
`;

export const EmailText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.subText};
  margin-bottom: 20px;
`;

export const InfoContainer = styled.View`
  width: 100%;
  margin-bottom: 20px;
`;

export const InfoBox = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 10px;
  padding: 15px;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;

export const InfoTitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

export const InfoValue = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  text-align: right;
`;

export const LogoutButtonStyled = styled.Button`
  margin-top: 20px;
`;

export const EditButtonStyled = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 10px 20px;
  border-radius: 20px;
  margin-bottom: 20px;
`;

export const EditButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;
