import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { ButtonContainer, ButtonText } from './Button.styles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: any;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}) => {
  const theme = useTheme();
  
  return (
    <ButtonContainer
      onPress={onPress}
      disabled={disabled || loading}
      variant={variant}
      fullWidth={fullWidth}
      style={style}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={
            variant === 'primary' || variant === 'danger' 
              ? theme.colors.background 
              : theme.colors.primary
          } 
          size="small"
        />
      ) : (
        <ButtonText variant={variant}>{title}</ButtonText>
      )}
    </ButtonContainer>
  );
};

export default Button;
