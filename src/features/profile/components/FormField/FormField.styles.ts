import styled from 'styled-components/native';
import { TextInput } from 'react-native';

export const FieldContainer = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.subText};
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Input = styled(TextInput)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.primary};
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.error};
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
`;
