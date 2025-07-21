import styled from 'styled-components/native';
import { View, Text, Image } from 'react-native';
import Button from '../../../components/common/Button';

export const Container = styled.View<{ $width: number }>`
  flex: 1;
  background-color: #f4f4f4;
`;

export const ProfileContainer = styled.View`
  align-items: center;
  padding: 20px;
  padding-bottom: 40px;
`;

export const Avatar = styled(Image)`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 20px;
`;

export const NameText = styled(Text)`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
`;

export const EmailText = styled(Text)`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;

export const InfoContainer = styled(View)`
  width: 100%;
  margin-bottom: 20px;
`;

export const InfoBox = styled(View)`
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

export const InfoTitle = styled(Text)`
  font-size: 16px;
  color: #333;
  flex: 1;
`;

export const InfoValue = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  flex: 1;
  text-align: right;
  color: #444;
`;

export const LogoutButtonStyled = styled(Button)`
  background-color: #dc3545;
  width: 100%;
  margin-top: 10px;
`;
