import React, { memo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  AccessibilityRole,
} from 'react-native';
import { useTranslation } from 'react-i18next';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  isDisabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  style?: object;
  textStyle?: object;
}

function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  isDisabled = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  textStyle,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const isDark = colorScheme === 'dark';

  const getButtonStyles = () => {
    const baseStyle = [
      styles.button,
      styles[size],
      styles[variant],
      isDark && styles.darkMode,
      isDisabled && styles.disabled,
      style,
    ];
    return baseStyle;
  };

  const getTextStyles = () => {
    const baseTextStyle = [
      styles.buttonText,
      styles[`${size}Text`],
      styles[`${variant}Text`],
      isDark && styles.darkModeText,
      isDisabled && styles.disabledText,
      textStyle,
    ];
    return baseTextStyle;
  };

  const handlePress = () => {
    if (!isDisabled && !isLoading) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={handlePress}
      disabled={isDisabled || isLoading}
      accessibilityRole="button" as AccessibilityRole
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: isDisabled || isLoading,
        busy: isLoading,
      }}
      testID={testID}
    >
      {isLoading ? (
        <ActivityIndicator 
          size={size === 'small' ? 'small' : 'small'} 
          color={variant === 'primary' ? '#fff' : '#007AFF'} 
        />
      ) : (
        <Text style={getTextStyles()}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Size variants
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 32,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 56,
  },

  // Color variants
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#C7C7CC',
  },
  danger: {
    backgroundColor: '#FF3B30',
  },

  // Text styles
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#007AFF',
  },
  dangerText: {
    color: '#FFFFFF',
  },

  // State styles
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    opacity: 0.6,
  },

  // Dark mode styles
  darkMode: {
    shadowColor: '#FFFFFF',
  },
  darkModeText: {
    // Text colors remain the same for better contrast
  },
});

export { Button };
