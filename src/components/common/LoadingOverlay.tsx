import React, { memo, useMemo } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  useColorScheme,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

interface LoadingOverlayProps {
  isVisible?: boolean;
  message?: string;
  variant?: 'overlay' | 'inline' | 'modal';
  size?: 'small' | 'large';
  accessibilityLabel?: string;
  testID?: string;
  style?: object;
}

function LoadingOverlay({
  isVisible = true,
  message,
  variant = 'overlay',
  size = 'large',
  accessibilityLabel,
  testID = 'loading-overlay',
  style,
}: LoadingOverlayProps) {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';

  const defaultMessage = t('common.loading', { defaultValue: 'Loading...' });
  const displayMessage = message || defaultMessage;

  const overlayStyles = useMemo(() => [
    styles.overlay,
    variant === 'overlay' && styles.fullScreenOverlay,
    variant === 'inline' && styles.inlineOverlay,
    isDark && styles.darkModeOverlay,
    style,
  ], [variant, isDark, style]);

  const containerStyles = useMemo(() => [
    styles.container,
    styles[variant],
    isDark && styles.darkModeContainer,
    variant === 'modal' && {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
  ], [variant, isDark, insets]);

  const textStyles = useMemo(() => [
    styles.message,
    isDark && styles.darkModeText,
  ], [isDark]);

  const getIndicatorColor = () => {
    if (isDark) return '#FFFFFF';
    return '#007AFF';
  };

  if (!isVisible) return null;

  const LoadingContent = (
    <View
      style={overlayStyles}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel || displayMessage}
      accessibilityLiveRegion="polite"
      testID={testID}
    >
      <View style={containerStyles}>
        <ActivityIndicator 
          size={size} 
          color={getIndicatorColor()}
          accessibilityHidden
        />
        
        {displayMessage && (
          <Text 
            style={textStyles}
            accessibilityRole="text"
            testID={`${testID}-message`}
          >
            {displayMessage}
          </Text>
        )}
      </View>
    </View>
  );

  if (variant === 'modal') {
    return (
      <Modal
        transparent
        visible={isVisible}
        animationType="fade"
        statusBarTranslucent
        accessibilityViewIsModal
      >
        {LoadingContent}
      </Modal>
    );
  }

  return LoadingContent;
}

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  fullScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  
  inlineOverlay: {
    backgroundColor: 'transparent',
    paddingVertical: 20,
  },
  
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  
  overlay: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    minWidth: 120,
    maxWidth: 280,
  },
  
  inline: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  modal: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 24,
    minWidth: 160,
    maxWidth: 320,
  },
  
  message: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#1C1C1E',
    lineHeight: 22,
  },
  
  // Dark mode styles
  darkModeOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  
  darkModeContainer: {
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#38383A',
  },
  
  darkModeText: {
    color: '#FFFFFF',
  },
});

export { LoadingOverlay };
