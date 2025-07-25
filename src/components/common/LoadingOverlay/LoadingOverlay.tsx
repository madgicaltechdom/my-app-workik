import React, { useMemo } from 'react';
import { useColorScheme, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, darkTheme } from '../../../theme';
import {
  StyledModal,
  StyledOverlayContainer,
  StyledContentContainer,
  LoadingIndicatorContainer,
  MessageContainer,
  StyledMessage,
  StyledSubMessage,
} from './LoadingOverlay.styles';
import type { LoadingOverlayProps } from './LoadingOverlay.types';

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  variant = 'modal',
  isVisible = false,
  message,
  subMessage,
  size = 'large',
  color,
  backgroundColor,
  onRequestClose,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const currentTheme = isDark ? darkTheme : theme;

  const indicatorSize = useMemo(() => {
    return size === 'small' ? 'small' : 'large';
  }, [size]);

  const indicatorColor = useMemo(() => {
    if (color) return color;
    return currentTheme.colors.primary;
  }, [color, currentTheme]);

  const defaultMessage = useMemo(() => {
    if (message) return message;
    return t('common.loading', { defaultValue: 'Loading...' });
  }, [message, t]);

  const defaultAccessibilityLabel = useMemo(() => {
    if (accessibilityLabel) return accessibilityLabel;
    return defaultMessage;
  }, [accessibilityLabel, defaultMessage]);

  const content = useMemo(() => (
    <StyledContentContainer
      $variant={variant}
      $isDark={isDark}
      style={style}
      testID={testID}
      accessibilityLabel={defaultAccessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="none"
      accessibilityLiveRegion="polite"
    >
      <LoadingIndicatorContainer $variant={variant}>
        <ActivityIndicator
          size={indicatorSize}
          color={indicatorColor}
          testID="loading-indicator"
        />
      </LoadingIndicatorContainer>
      {(message || subMessage) && (
        <MessageContainer $variant={variant}>
          {message && (
            <StyledMessage $variant={variant} $isDark={isDark}>
              {message}
            </StyledMessage>
          )}
          {subMessage && (
            <StyledSubMessage $variant={variant} $isDark={isDark}>
              {subMessage}
            </StyledSubMessage>
          )}
        </MessageContainer>
      )}
    </StyledContentContainer>
  ), [
    variant,
    isDark,
    style,
    testID,
    defaultAccessibilityLabel,
    accessibilityHint,
    indicatorSize,
    indicatorColor,
    message,
    subMessage,
  ]);

  if (variant === 'modal') {
    return (
      <StyledModal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={onRequestClose}
        statusBarTranslucent
      >
        <StyledOverlayContainer
          $variant={variant}
          $isDark={isDark}
          $backgroundColor={backgroundColor}
          onStartShouldSetResponder={() => true}
        >
          {content}
        </StyledOverlayContainer>
      </StyledModal>
    );
  }

  if (variant === 'overlay') {
    return isVisible ? (
      <StyledOverlayContainer
        $variant={variant}
        $isDark={isDark}
        $backgroundColor={backgroundColor}
        style={style}
      >
        {content}
      </StyledOverlayContainer>
    ) : null;
  }

  // inline variant
  return isVisible ? (
    <StyledOverlayContainer
      $variant={variant}
      $isDark={isDark}
      $backgroundColor={backgroundColor}
      style={style}
    >
      {content}
    </StyledOverlayContainer>
  ) : null;
};
