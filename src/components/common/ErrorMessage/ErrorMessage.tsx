import React, { useEffect, useMemo, useCallback } from 'react';
import { useColorScheme, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { theme, darkTheme } from '../../../theme';
import {
  StyledErrorContainer,
  StyledErrorText,
  IconContainer,
  ContentContainer,
  TextContainer,
} from './ErrorMessage.styles';
import type { ErrorMessageProps } from './ErrorMessage.types';

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  variant = 'inline',
  severity = 'error',
  showIcon = true,
  onDismiss,
  dismissible = false,
  autoHide = false,
  autoHideDelay = 5000,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const currentTheme = isDark ? darkTheme : theme;

  // Auto-hide functionality
  useEffect(() => {
    if (autoHide && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, onDismiss]);

  const iconName = useMemo(() => {
    switch (severity) {
      case 'warning':
        return 'warning-outline';
      case 'info':
        return 'information-circle-outline';
      default: // error
        return 'alert-circle-outline';
    }
  }, [severity]);

  const iconColor = useMemo(() => {
    switch (severity) {
      case 'warning':
        return currentTheme.colors.warningDark;
      case 'info':
        return currentTheme.colors.infoDark;
      default: // error
        return currentTheme.colors.dangerDark;
    }
  }, [severity, currentTheme]);

  const defaultAccessibilityLabel = useMemo(() => {
    if (accessibilityLabel) return accessibilityLabel;
    
    const severityLabel = t(`common.${severity}`, { 
      defaultValue: severity.charAt(0).toUpperCase() + severity.slice(1) 
    });
    
    return `${severityLabel}: ${message}`;
  }, [accessibilityLabel, severity, message, t]);

  const accessibilityRole = useMemo(() => {
    return severity === 'error' ? 'alert' : 'text';
  }, [severity]);

  const accessibilityLiveRegion = useMemo(() => {
    return severity === 'error' ? 'assertive' : 'polite';
  }, [severity]);

  const handleDismiss = useCallback(() => {
    if (dismissible && onDismiss) {
      onDismiss();
    }
  }, [dismissible, onDismiss]);

  const content = (
    <ContentContainer>
      {showIcon && (
        <IconContainer theme={currentTheme}>
          <Ionicons 
            name={iconName as any} 
            size={variant === 'banner' ? 24 : 20} 
            color={iconColor}
            testID={testID ? `${testID}-icon` : undefined}
          />
        </IconContainer>
      )}
      
      <TextContainer>
        <StyledErrorText
          $variant={variant}
          $severity={severity}
          $isDark={isDark}
          theme={currentTheme}
          testID={testID ? `${testID}-text` : undefined}
        >
          {message}
        </StyledErrorText>
      </TextContainer>
      
      {dismissible && (
        <Pressable
          onPress={handleDismiss}
          style={{ marginLeft: currentTheme.spacing.sm }}
          testID={testID ? `${testID}-dismiss` : undefined}
          accessibilityRole="button"
          accessibilityLabel={t('common.dismiss', { defaultValue: 'Dismiss' })}
          accessibilityHint={t('common.dismissHint', { 
            defaultValue: 'Tap to dismiss this message' 
          })}
        >
          <Ionicons 
            name="close-outline" 
            size={20} 
            color={iconColor}
          />
        </Pressable>
      )}
    </ContentContainer>
  );

  return (
    <StyledErrorContainer
      $variant={variant}
      $severity={severity}
      $isDark={isDark}
      theme={currentTheme}
      style={style}
      testID={testID}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={defaultAccessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityLiveRegion={accessibilityLiveRegion}
    >
      {content}
    </StyledErrorContainer>
  );
};
