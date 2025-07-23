import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonContainerProps {
  variant: ButtonVariant;
  disabled?: boolean;
  fullWidth?: boolean;
}

interface ButtonTextProps {
  variant: ButtonVariant;
}

export const ButtonContainer = styled(TouchableOpacity).attrs<ButtonContainerProps>(({ disabled }) => ({
  activeOpacity: disabled ? 1 : 0.8,
}))<ButtonContainerProps>`
  background-color: ${({ theme, variant, disabled }) => {
    if (disabled) return theme.colors.disabled;
    switch (variant) {
      case 'secondary':
        return theme.colors.surface;
      case 'danger':
        return theme.colors.error;
      case 'primary':
      default:
        return theme.colors.primary;
    }
  }};
  padding: 16px 24px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  border: ${({ variant, theme }) => 
    variant === 'secondary' ? `1px solid ${theme.colors.border}` : 'none'};
`;

export const ButtonText = styled.Text<ButtonTextProps>`
  color: ${({ theme, variant }) => {
    switch (variant) {
      case 'secondary':
        return theme.colors.primary;
      case 'danger':
      case 'primary':
      default:
        return theme.colors.background;
    }
  }};
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;
