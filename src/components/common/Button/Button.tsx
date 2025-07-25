import React, { useMemo, useCallback } from 'react';
import { useColorScheme, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, darkTheme } from '../../../theme';
import { StyledButton, StyledButtonText, LoadingContainer } from './Button.styles';
import type { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  children,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onPress,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const currentTheme = isDark ? darkTheme : theme;

  const isDisabled = disabled || loading;

  const handlePress = useCallback(() => {
    if (!isDisabled && onPress) {
      onPress();
    }
  }, [isDisabled, onPress]);

  const loadingColor = useMemo(() => {
    if (isDisabled) return currentTheme.colors.textMuted;
    
    switch (variant) {
      case 'secondary':
        return currentTheme.colors.primary;
      case 'danger':
        return currentTheme.colors.textLight;
      default: // primary
        return currentTheme.colors.textLight;
    }
  }, [variant, isDisabled, currentTheme]);

  const buttonContent = useMemo(() => {
    const content = title || children;
    return content;
  }, [title, children]);

  const defaultAccessibilityLabel = useMemo(() => {
    if (accessibilityLabel) return accessibilityLabel;
    
    if (typeof buttonContent === 'string') {
      return buttonContent;
    }
    
    return t('common.button', { defaultValue: 'Button' });
  }, [accessibilityLabel, buttonContent, t]);

  const accessibilityState = useMemo(() => ({
    disabled: isDisabled,
    busy: loading,
  }), [isDisabled, loading]);

  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $disabled={isDisabled}
      $loading={loading}
      $isDark={isDark}
      theme={currentTheme}
      onPress={handlePress}
      style={style}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={defaultAccessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={accessibilityState}
      android_ripple={{
        color: currentTheme.colors.overlayLight,
        borderless: false,
      }}
      {...props}
    >
      {loading ? (
        <LoadingContainer>
          <ActivityIndicator 
            size="small" 
            color={loadingColor}
            testID={`${testID}-loading-indicator`}
          />
          {typeof buttonContent === 'string' && (
            <StyledButtonText
              $variant={variant}
              $size={size}
              $disabled={isDisabled}
              $isDark={isDark}
              theme={currentTheme}
              style={{ marginLeft: 8 }}
            >
              {buttonContent}
            </StyledButtonText>
          )}
        </LoadingContainer>
      ) : (
        <StyledButtonText
          $variant={variant}
          $size={size}
          $disabled={isDisabled}
          $isDark={isDark}
          theme={currentTheme}
        >
          {buttonContent}
        </StyledButtonText>
      )}
    </StyledButton>
  );
};
