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
  visible = true,
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
    return t('common.loadingAccessibility', { 
      defaultValue: 'Loading content, please wait' 
    });
  }, [accessibilityLabel, t]);

  const content = (
    <StyledContentContainer
      $variant={variant}
      $isDark={isDark}
      theme={currentTheme}
      style={[
        backgroundColor && { backgroundColor },
        style,
      ]}
    >
      <LoadingIndicatorContainer theme={currentTheme}>
        <ActivityIndicator
          size={indicatorSize}
          color={indicatorColor}
          testID={testID ? `${testID}-indicator` : undefined}
        />
      </LoadingIndicatorContainer>

      <MessageContainer theme={currentTheme}>
        <StyledMessage
          $variant={variant}
          theme={currentTheme}
          testID={testID ? `${testID}-message` : undefined}
        >
          {defaultMessage}
        </StyledMessage>

        {subMessage && (
          <StyledSubMessage
            theme={currentTheme}
            testID={testID ? `${testID}-sub-message` : undefined}
          >
            {subMessage}
          </StyledSubMessage>
        )}
      </MessageContainer>
    </StyledContentContainer>
  );

  if (variant === 'modal') {
    return (
      <StyledModal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onRequestClose}
        testID={testID}
        accessibilityViewIsModal
      >
        <StyledOverlayContainer
          $variant={variant}
          $isDark={isDark}
          theme={currentTheme}
          accessibilityRole="progressbar"
          accessibilityLabel={defaultAccessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityLiveRegion="polite"
        >
          {content}
        </StyledOverlayContainer>
      </StyledModal>
    );
  }

  if (variant === 'overlay') {
    return visible ? (
      <StyledOverlayContainer
        $variant={variant}
        $isDark={isDark}
        theme={currentTheme}
        testID={testID}
        accessibilityRole="progressbar"
        accessibilityLabel={defaultAccessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityLiveRegion="polite"
      >
        {content}
      </StyledOverlayContainer>
    ) : null;
  }

  // inline variant
  return visible ? (
    <StyledOverlayContainer
      $variant={variant}
      $isDark={isDark}
      theme={currentTheme}
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={defaultAccessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityLiveRegion="polite"
      style={style}
    >
      {content}
    </StyledOverlayContainer>
  ) : null;
};
