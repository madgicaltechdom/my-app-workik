import type { TextInputProps, ViewStyle } from 'react-native';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  isDisabled?: boolean; // Added for compatibility with existing code
  maxLength?: number;
  showCharacterCount?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
