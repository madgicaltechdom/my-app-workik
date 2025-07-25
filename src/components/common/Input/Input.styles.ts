import styled from 'styled-components/native';
import { TextInput, Text, View, Platform } from 'react-native';
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
  font-family: ${({ theme }) => theme.fontFamilies.regular};
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  line-height: ${({ theme }) => theme.lineHeights.sm}px;
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
  
  /* Ensure proper touch handling */
  position: relative;
  z-index: 1;
`;

export const StyledInput = styled(TextInput)<StyledInputProps>`
  padding: ${({ theme }) => theme.spacing.md}px;
  min-height: ${({ theme }) => theme.semanticSpacing.touchableMinHeight}px;
  font-family: ${({ theme }) => theme.fontFamilies.regular};
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  line-height: ${({ theme }) => theme.lineHeights.md}px;
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  
  color: ${({ $disabled, theme }) => 
    $disabled ? theme.colors.textMuted : theme.colors.text
  };
  
  /* Ensure the input is interactive */
  opacity: 1;
  
  /* Handle text selection color */
  text-align-vertical: center;
  include-font-padding: false;
  
  /* Ensure proper touch handling */
  width: 100%;
  
  /* Remove default web styles */
  outline-width: 0;
  
  /* Platform specific styles */
  ${Platform.select({
    web: {
      cursor: 'text',
      '&:focus': {
        outline: 'none',
      },
    },
    default: {
      /* On mobile, ensure the input is tappable */
      minWidth: '100%',
    },
  })}
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
