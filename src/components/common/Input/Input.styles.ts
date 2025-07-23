import styled from 'styled-components/native';
import { TextInput, Text, View } from 'react-native';
import { type Theme } from '../../../theme';

interface StyledInputContainerProps {
  $hasError: boolean;
  $isFocused: boolean;
  $disabled: boolean;
  $isDark: boolean;
  theme: Theme;
}

interface StyledInputProps {
  $hasError: boolean;
  $disabled: boolean;
  $isDark: boolean;
  theme: Theme;
}

interface StyledLabelProps {
  $required: boolean;
  $hasError: boolean;
  $disabled: boolean;
  $isDark: boolean;
  theme: Theme;
}

export const InputContainer = styled(View)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const LabelContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

export const StyledLabel = styled(Text)<StyledLabelProps>`
  ${({ theme }) => ({
    ...theme.textStyles.inputLabel,
  })}
  
  color: ${({ $hasError, $disabled, theme }) => {
    if ($hasError) return theme.colors.danger;
    if ($disabled) return theme.colors.textMuted;
    return theme.colors.text;
  }};
`;

export const RequiredIndicator = styled(Text)<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.danger};
  margin-left: ${({ theme }) => theme.spacing.xs}px;
  ${({ theme }) => ({
    ...theme.textStyles.inputLabel,
  })}
`;

export const StyledInputContainer = styled(View)<StyledInputContainerProps>`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ theme, $disabled }) => 
    $disabled ? theme.colors.backgroundSecondary : theme.colors.background
  };
  
  border-color: ${({ $hasError, $isFocused, $disabled, theme }) => {
    if ($hasError) return theme.colors.danger;
    if ($isFocused) return theme.colors.primary;
    if ($disabled) return theme.colors.borderLight;
    return theme.colors.border;
  }};
  
  ${({ $isFocused, theme }) => $isFocused && `
    shadow-color: ${theme.colors.primary};
    shadow-offset: 0px 0px;
    shadow-opacity: 0.2;
    shadow-radius: 4px;
    elevation: 2;
  `}
  
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};
`;

export const StyledInput = styled(TextInput)<StyledInputProps>`
  padding: ${({ theme }) => theme.spacing.md}px;
  min-height: ${({ theme }) => theme.semanticSpacing.touchableMinHeight}px;
  
  ${({ theme }) => ({
    ...theme.textStyles.input,
  })}
  
  color: ${({ $disabled, theme }) => 
    $disabled ? theme.colors.textMuted : theme.colors.text
  };
  
  /* Placeholder color is handled via placeholderTextColor prop */
`;

export const HelperTextContainer = styled(View)`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  flex-direction: row;
  align-items: center;
`;

export const HelperText = styled(Text)<{ $isError: boolean; theme: Theme }>`
  ${({ theme }) => ({
    ...theme.textStyles.caption,
  })}
  
  color: ${({ $isError, theme }) => 
    $isError ? theme.colors.danger : theme.colors.textSecondary
  };
  
  flex: 1;
`;

export const CharacterCount = styled(Text)<{ theme: Theme }>`
  ${({ theme }) => ({
    ...theme.textStyles.caption,
  })}
  
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;
