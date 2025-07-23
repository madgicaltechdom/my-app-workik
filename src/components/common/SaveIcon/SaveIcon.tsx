import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { SaveIconProps } from './SaveIcon.types';

export const SaveIcon: React.FC<SaveIconProps> = ({
  size = 24,
  color = '#000000',
  testID = 'save-icon',
  ...props
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    testID={testID}
    {...props}
  >
    <Path
      d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 21v-8H7v8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 3v5h8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SaveIcon;
