import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';

interface ErrorMessageProps {
  message?: string | null;
  variant?: 'inline' | 'banner' | 'toast';
  severity?: 'error' | 'warning' | 'info';
  isVisible?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  style?: object;
  textStyle?: object;
}

function ErrorMessage({
  message,
  variant = 'banner',
  severity = 'error',
  isVisible = true,
  accessibilityLabel,
  testID,
  style,
  textStyle,
}: ErrorMessageProps) {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const isDark = colorScheme === 'dark';

  const hasMessage = Boolean(message);

  const containerStyles = useMemo(() => [
    styles.container,
    styles[variant],
    styles[severity],
    isDark && styles.darkMode,
    style,
  ], [variant, severity, isDark, style]);

  const messageTextStyles = useMemo(() => [
    styles.messageText,
    styles[`${variant}Text`],
    styles[`${severity}Text`],
    isDark && styles.darkModeText,
    textStyle,
  ], [variant, severity, isDark, textStyle]);

  // Early return if no message or not visible
  if (!hasMessage || !isVisible) return null;

  const getSeverityIcon = () => {
    switch (severity) {
      case 'error':
        return '⚠️';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '⚠️';
    }
  };

  const getAccessibilityRole = () => {
    switch (severity) {
      case 'error':
        return 'alert';
      case 'warning':
        return 'alert';
      case 'info':
        return 'text';
      default:
        return 'alert';
    }
  };

  return (
    <View
      style={containerStyles}
      accessibilityRole={getAccessibilityRole()}
      accessibilityLabel={accessibilityLabel || `${severity}: ${message}`}
      accessibilityLiveRegion="polite"
      testID={testID}
    >
      {variant !== 'inline' && (
        <Text style={styles.icon} accessibilityHidden>
          {getSeverityIcon()}
        </Text>
      )}
      
      <Text style={messageTextStyles} numberOfLines={variant === 'toast' ? 2 : undefined}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // Variant styles
  inline: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginVertical: 4,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  banner: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: '90%',
    alignSelf: 'center',
  },

  // Severity styles
  error: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  
  warning: {
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  
  info: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },

  // Icon styles
  icon: {
    fontSize: 16,
    marginRight: 8,
  },

  // Text styles
  messageText: {
    fontSize: 14,
    fontWeight: '400',
    flex: 1,
    lineHeight: 20,
  },
  
  inlineText: {
    fontSize: 12,
    fontWeight: '400',
  },
  
  bannerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  toastText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },

  errorText: {
    color: '#D32F2F',
  },
  
  warningText: {
    color: '#F57C00',
  },
  
  infoText: {
    color: '#1976D2',
  },

  // Dark mode styles
  darkMode: {
    shadowColor: '#FFFFFF',
  },
  
  darkModeText: {
    // Colors adjusted for dark mode
  },
});

export { ErrorMessage };
