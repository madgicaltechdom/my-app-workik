import styled from 'styled-components/native';
import { View, Text, Modal } from 'react-native';
import { type Theme } from '../../../theme';

interface StyledOverlayContainerProps {
  $variant: 'modal' | 'inline' | 'overlay';
  $isDark: boolean;
  theme: Theme;
}

interface StyledContentContainerProps {
  $variant: 'modal' | 'inline' | 'overlay';
  $isDark: boolean;
  theme: Theme;
}

export const StyledModal = styled(Modal)``;

export const StyledOverlayContainer = styled(View)<StyledOverlayContainerProps>`
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'modal':
        return `
          flex: 1;
          justify-content: center;
          align-items: center;
          background-color: ${theme.colors.overlay};
        `;
      case 'overlay':
        return `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          justify-content: center;
          align-items: center;
          background-color: ${theme.colors.overlay};
          z-index: ${theme.zIndex.overlay};
        `;
      default: // inline
        return `
          justify-content: center;
          align-items: center;
          padding: ${theme.spacing.xl}px;
        `;
    }
  }}
`;

export const StyledContentContainer = styled(View)<StyledContentContainerProps>`
  align-items: center;
  justify-content: center;
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'modal':
      case 'overlay':
        return `
          background-color: ${theme.colors.background};
          border-radius: ${theme.borderRadius.lg}px;
          padding: ${theme.spacing.xl}px;
          margin: ${theme.spacing.lg}px;
          min-width: 200px;
          ${theme.shadows.lg};
        `;
      default: // inline
        return `
          padding: ${theme.spacing.md}px;
        `;
    }
  }}
`;

export const LoadingIndicatorContainer = styled(View)<{ theme: Theme }>`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const MessageContainer = styled(View)<{ theme: Theme }>`
  align-items: center;
`;

export const StyledMessage = styled(Text)<{ $variant: 'modal' | 'inline' | 'overlay'; theme: Theme }>`
  ${({ theme, $variant }) => {
    switch ($variant) {
      case 'modal':
      case 'overlay':
        return theme.textStyles.body;
      default: // inline
        return theme.textStyles.bodySmall;
    }
  }}
  
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export const StyledSubMessage = styled(Text)<{ theme: Theme }>`
  ${({ theme }) => theme.textStyles.caption}
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;
