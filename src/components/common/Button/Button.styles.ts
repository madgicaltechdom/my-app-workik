import styled from 'styled-components/native';
import { Pressable, Text } from 'react-native';
import { theme, type Theme } from '../../../theme';

interface StyledButtonProps {
  $variant: 'primary' | 'secondary' | 'danger';
  $size: 'small' | 'medium' | 'large';
  $disabled: boolean;
  $loading: boolean;
  $isDark: boolean;
  theme: Theme;
}

interface StyledButtonTextProps {
  $variant: 'primary' | 'secondary' | 'danger';
  $size: 'small' | 'medium' | 'large';
  $disabled: boolean;
  $isDark: boolean;
  theme: Theme;
}

export const StyledButton = styled(Pressable)<StyledButtonProps>`
  /* Base styles */
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  
  /* Size variants */
  ${({ $size, theme }) => {
    switch ($size) {
      case 'small':
        return `
          padding-vertical: ${theme.spacing.sm}px;
          padding-horizontal: ${theme.spacing.md}px;
          min-height: 36px;
        `;
      case 'large':
        return `
          padding-vertical: ${theme.spacing.lg}px;
          padding-horizontal: ${theme.spacing.xl}px;
          min-height: 56px;
        `;
      default: // medium
        return `
          padding-vertical: ${theme.spacing.md}px;
          padding-horizontal: ${theme.spacing.lg}px;
          min-height: 44px;
        `;
    }
  }}
  
  /* Variant styles */
  ${({ $variant, theme, $disabled }) => {
    if ($disabled) {
      return `
        background-color: ${theme.colors.borderLight};
        opacity: 0.6;
      `;
    }
    
    switch ($variant) {
      case 'secondary':
        return `
          background-color: transparent;
          border-width: 1px;
          border-color: ${theme.colors.primary};
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.danger};
        `;
      default: // primary
        return `
          background-color: ${theme.colors.primary};
        `;
    }
  }}
  
  /* Shadow */
  ${({ theme, $disabled }) => !$disabled && `
    shadow-color: ${theme.colors.shadow};
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 2;
  `}
  
  /* Loading state */
  ${({ $loading }) => $loading && `
    opacity: 0.8;
  `}
`;

export const StyledButtonText = styled(Text)<StyledButtonTextProps>`
  font-weight: 600;
  text-align: center;
  
  /* Size variants */
  ${({ $size, theme }) => {
    switch ($size) {
      case 'small':
        return `
          font-size: ${theme.fontSizes.sm}px;
          line-height: ${theme.lineHeights.sm}px;
        `;
      case 'large':
        return `
          font-size: ${theme.fontSizes.lg}px;
          line-height: ${theme.lineHeights.lg}px;
        `;
      default: // medium
        return `
          font-size: ${theme.fontSizes.md}px;
          line-height: ${theme.lineHeights.md}px;
        `;
    }
  }}
  
  /* Variant text colors */
  ${({ $variant, theme, $disabled }) => {
    if ($disabled) {
      return `color: ${theme.colors.textMuted};`;
    }
    
    switch ($variant) {
      case 'secondary':
        return `color: ${theme.colors.primary};`;
      case 'danger':
        return `color: ${theme.colors.textLight};`;
      default: // primary
        return `color: ${theme.colors.textLight};`;
    }
  }}
`;

export const LoadingContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const LoadingText = styled(Text)<{ theme: Theme }>`
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;
