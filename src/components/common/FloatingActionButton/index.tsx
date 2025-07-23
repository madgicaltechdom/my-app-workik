import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Container, IconContainer } from './FloatingActionButton.styles';

export interface FloatingActionButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  icon: React.ReactNode;
  bottom?: number;
  right?: number;
  left?: number;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  disabled = false,
  loading = false,
  testID,
  accessibilityLabel,
  icon,
  bottom = 16,
  right = 16,
  left,
  size = 56,
  color,
  style,
}) => {
  const theme = useTheme();
  const buttonColor = color || theme.colors.primary;

  return (
    <Container
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      bottom={bottom}
      right={right}
      left={left}
      size={size}
      color={buttonColor}
      style={[
        styles.shadow,
        disabled && { opacity: 0.6 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <IconContainer>{icon}</IconContainer>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default FloatingActionButton;
