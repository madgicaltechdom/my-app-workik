import type { ViewStyle } from 'react-native';

export interface LoadingOverlayProps {
  variant?: 'modal' | 'inline' | 'overlay';
  visible?: boolean;
  message?: string;
  subMessage?: string;
  size?: 'small' | 'large';
  color?: string;
  backgroundColor?: string;
  onRequestClose?: () => void;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
