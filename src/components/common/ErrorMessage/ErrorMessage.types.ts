import type { ViewStyle } from 'react-native';

export interface ErrorMessageProps {
  message: string;
  variant?: 'inline' | 'banner' | 'toast';
  severity?: 'error' | 'warning' | 'info';
  showIcon?: boolean;
  onDismiss?: () => void;
  dismissible?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
