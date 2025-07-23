import styled from 'styled-components/native';
import { View, Text } from 'react-native';
import { type Theme } from '../../../theme';

interface StyledErrorContainerProps {
  $variant: 'inline' | 'banner' | 'toast';
  $severity: 'error' | 'warning' | 'info';
  $isDark: boolean;
  theme: Theme;
}

interface StyledErrorTextProps {
  $variant: 'inline' | 'banner' | 'toast';
  $severity: 'error' | 'warning' | 'info';
  $isDark: boolean;
  theme: Theme;
}

export const StyledErrorContainer = styled(View)<StyledErrorContainerProps>`
  /* Base styles */
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  
  /* Variant styles */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'banner':
        return `
          padding: ${theme.spacing.lg}px;
          margin-bottom: ${theme.spacing.md}px;
          border-left-width: 4px;
        `;
      case 'toast':
        return `
          padding: ${theme.spacing.md}px;
          margin: ${theme.spacing.sm}px;
          ${theme.shadows.md};
          position: absolute;
          top: 50px;
          left: ${theme.spacing.md}px;
          right: ${theme.spacing.md}px;
          z-index: ${theme.zIndex.toast};
        `;
      default: // inline
        return `
          padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
        `;
    }
  }}
  
  /* Severity colors */
  ${({ $severity, theme, $variant }) => {
    const getColors = () => {
      switch ($severity) {
        case 'warning':
          return {
            bg: theme.colors.warning + '15', // 15% opacity
            border: theme.colors.warning,
            text: theme.colors.warningDark,
          };
        case 'info':
          return {
            bg: theme.colors.info + '15',
            border: theme.colors.info,
            text: theme.colors.infoDark,
          };
        default: // error
          return {
            bg: theme.colors.danger + '15',
            border: theme.colors.danger,
            text: theme.colors.dangerDark,
          };
      }
    };
    
    const colors = getColors();
    
    return `
      background-color: ${colors.bg};
      border-color: ${colors.border};
      ${$variant === 'banner' ? `border-left-color: ${colors.border};` : ''}
      ${$variant !== 'inline' ? `border-width: 1px;` : ''}
    `;
  }}
`;

export const StyledErrorText = styled(Text)<StyledErrorTextProps>`
  /* Base text styles */
  ${({ theme, $variant }) => {
    switch ($variant) {
      case 'banner':
        return theme.textStyles.body;
      case 'toast':
        return theme.textStyles.body;
      default: // inline
        return theme.textStyles.caption;
    }
  }}
  
  /* Severity text colors */
  color: ${({ $severity, theme }) => {
    switch ($severity) {
      case 'warning':
        return theme.colors.warningDark;
      case 'info':
        return theme.colors.infoDark;
      default: // error
        return theme.colors.dangerDark;
    }
  }};
  
  /* Text alignment */
  text-align: ${({ $variant }) => $variant === 'toast' ? 'center' : 'left'};
`;

export const IconContainer = styled(View)<{ theme: Theme }>`
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
  justify-content: center;
`;

export const ContentContainer = styled(View)`
  flex-direction: row;
  align-items: flex-start;
`;

export const TextContainer = styled(View)`
  flex: 1;
`;
