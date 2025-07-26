import React from 'react';
import { Text } from 'react-native';

// Mock icon component that renders the icon name as text
const MockIcon = ({ name, size, color, style, testID, ...props }) => {
  return React.createElement(Text, {
    testID: testID || `icon-${name}`,
    style: [
      {
        fontSize: size || 24,
        color: color || '#000',
      },
      style,
    ],
    ...props,
  }, name || 'icon');
};

// Export all the icon sets as the same mock component
export const Ionicons = MockIcon;
export const MaterialIcons = MockIcon;
export const MaterialCommunityIcons = MockIcon;
export const FontAwesome = MockIcon;
export const FontAwesome5 = MockIcon;
export const AntDesign = MockIcon;
export const Entypo = MockIcon;
export const EvilIcons = MockIcon;
export const Feather = MockIcon;
export const Foundation = MockIcon;
export const Octicons = MockIcon;
export const SimpleLineIcons = MockIcon;
export const Zocial = MockIcon;

// Default export
export default {
  Ionicons: MockIcon,
  MaterialIcons: MockIcon,
  MaterialCommunityIcons: MockIcon,
  FontAwesome: MockIcon,
  FontAwesome5: MockIcon,
  AntDesign: MockIcon,
  Entypo: MockIcon,
  EvilIcons: MockIcon,
  Feather: MockIcon,
  Foundation: MockIcon,
  Octicons: MockIcon,
  SimpleLineIcons: MockIcon,
  Zocial: MockIcon,
};
