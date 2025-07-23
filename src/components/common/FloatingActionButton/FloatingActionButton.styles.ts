import styled from 'styled-components/native';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { Theme } from '../../../../theme/types';

interface ContainerProps {
  bottom: number;
  right?: number;
  left?: number;
  size: number;
  color: string;
}

export const Container = styled(TouchableOpacity).attrs<ContainerProps>(({ bottom, right, left, size, color }) => {
  const style: ViewStyle = {
    position: 'absolute',
    bottom,
    right,
    left,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  };
  
  return { style };
})<ContainerProps>``;

export const IconContainer = styled(View)({
  justifyContent: 'center',
  alignItems: 'center',
});
