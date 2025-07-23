import { SvgProps } from 'react-native-svg';

export interface SaveIconProps extends SvgProps {
  /**
   * Size of the icon (width and height)
   * @default 24
   */
  size?: number;
  
  /**
   * Color of the icon stroke
   * @default '#000000'
   */
  color?: string;
  
  /**
   * Test ID for testing purposes
   * @default 'save-icon'
   */
  testID?: string;
}
