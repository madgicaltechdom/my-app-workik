import styled from 'styled-components/native';
import { ScrollView, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';

export const Container = styled(View)<{ $width: number }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding-horizontal: ${({ theme }) => theme.spacing.lg};
  max-width: ${({ $width }) => $width};
  width: 100%;
  align-self: center;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  margin-top: 0;
  text-align: center;
  letter-spacing: -0.8px;
  line-height: 40px;
`;

export const ScrollViewContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`;

export const FormContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 24,
  },
})`
  flex: 1;
`;

export const ButtonContainer = styled(View)`
  margin-top: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  width: 100%;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const FormField = styled(View)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  padding-horizontal: ${({ theme }) => theme.spacing.md};
  padding-vertical: ${({ theme }) => theme.spacing.md};
  shadow-color: ${({ theme }) => theme.colors.text};
  shadow-offset-x: 0px;
  shadow-offset-y: 2px;
  shadow-opacity: 0.04;
  shadow-radius: 12px;
  elevation: 2;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.borderLight};
`;

export const Label = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  opacity: 0.8;
`;

export const Input = styled(TextInput)<{ theme: any; multiline?: boolean }>`
  background-color: transparent;
  border-radius: 0;
  padding-horizontal: ${({ theme }) => theme.spacing.md};
  padding-vertical: ${({ theme, multiline }) => multiline ? theme.spacing.md : theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
  border-width: 0;
  font-weight: 500;
  line-height: 24px;
  min-height: ${({ multiline }) => multiline ? 100 : 0};
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 12;
  margin-top: 4;
  margin-left: 4;
`;

export const Button = styled(TouchableOpacity)<{ disabled?: boolean }>`
  background-color: ${({ theme, disabled }) => 
    disabled ? theme.colors.secondary : theme.colors.primary};
  padding-vertical: ${({ theme }) => theme.spacing.lg};
  padding-horizontal: ${({ theme }) => theme.spacing.xl};
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  min-height: 60px;
  shadow-color: ${({ theme }) => theme.colors.primary};
  shadow-offset-x: 0px;
  shadow-offset-y: 6px;
  shadow-opacity: 0.25;
  shadow-radius: 16px;
  elevation: 6;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transform: ${({ disabled }) => disabled ? 'scale(0.98)' : 'scale(1)'};
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  letter-spacing: 0.5px;
`;

export const Subtitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  line-height: 22px;
  opacity: 0.7;
  font-weight: 400;
  padding-horizontal: ${({ theme }) => theme.spacing.lg};
`;

export const LoadingOverlay = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.overlay};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const LoadingIndicator = styled(ActivityIndicator)`
  margin-top: 16px;
`;

export const CancelButton = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  padding-vertical: 16px;
  padding-horizontal: 24px;
  border-radius: 8px;
  align-items: center;
  margin-top: 8px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const CancelButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16;
  font-weight: 600;
`;
