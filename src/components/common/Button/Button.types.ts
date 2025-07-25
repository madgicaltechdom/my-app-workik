import { PressableProps, TextStyle, ViewStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<PressableProps, 'disabled' | 'onPress' | 'style'> {
  /**
   * The text to display inside the button.
   * Can be used instead of children for simple text buttons.
   */
  title?: string;
  /**
   * The variant of the button.
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * The size of the button.
   * @default 'medium'
   */
  size?: ButtonSize;
  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether to show a loading indicator.
   * @default false
   */
  loading?: boolean;
  /**
   * Function to call when the button is pressed.
   */
  onPress?: () => void;
  /**
   * Additional styles for the button container.
   */
  style?: ViewStyle;
  /**
   * Additional styles for the button text.
   * Only applicable when using the `title` prop.
   */
  textStyle?: TextStyle;
  /**
   * Test ID for testing purposes.
   */
  testID?: string;
  /**
   * Accessibility label for the button.
   * If not provided, will use the button text or 'Button'.
   */
  accessibilityLabel?: string;
  /**
   * Accessibility hint for the button.
   */
  accessibilityHint?: string;
}
