import styled from 'styled-components/native';
import { ScrollView, TextInput, TouchableOpacity, View, ActivityIndicator, ViewStyle } from 'react-native';
import { Theme } from '../../../../theme/types';

// Default theme fallback values
const defaultTheme: Theme = {
  colors: {
    primary: '#007AFF',
    primaryDark: '#0056b3',
    primaryLight: '#66b0ff',
    secondary: '#6c757d',
    secondaryDark: '#545b62',
    secondaryLight: '#8a93a2',
    success: '#28a745',
    successDark: '#1e7e34',
    successLight: '#51cf66',
    danger: '#dc3545',
    dangerDark: '#bd2130',
    dangerLight: '#e4606d',
    warning: '#ffc107',
    warningDark: '#d39e00',
    warningLight: '#ffd351',
    info: '#17a2b8',
    infoDark: '#117a8b',
    infoLight: '#3dd5f3',
    light: '#f8f9fa',
    dark: '#343a40',
    text: '#212529',
    textSecondary: '#6c757d',
    textLight: '#f8f9fa',
    textMuted: '#6c757d',
    background: '#ffffff',
    backgroundSecondary: '#f8f9fa',
    backgroundDark: '#343a40',
    border: '#dee2e6',
    borderLight: '#e9ecef',
    borderDark: '#adb5bd',
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowLight: 'rgba(0, 0, 0, 0.05)',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 48,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
  },
  // Add other theme properties as needed
};

// Helper function to safely access theme properties
const getThemeValue = <T extends keyof Theme>(
  theme: Partial<Theme> | undefined,
  key: T,
  defaultValue: Theme[T]
): Theme[T] => {
  return theme?.[key] || defaultValue;
};

// Common container styles
const commonContainerStyles = {
  flex: 1,
  backgroundColor: (p: { theme: Theme }) => getThemeValue(p.theme, 'colors', defaultTheme.colors).backgroundSecondary,
};

// Common shadow styles
const commonShadowStyles = {
  shadowColor: (p: { theme: Theme }) => getThemeValue(p.theme, 'colors', defaultTheme.colors).shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 2,
};

type StyledProps = { theme?: Partial<Theme> };
type ContainerProps = StyledProps & { $width?: number };
type InputProps = StyledProps & { multiline?: boolean; theme: Theme };
type ButtonProps = StyledProps & { disabled?: boolean };

export const Container = styled(View)<ContainerProps>`
  flex: 1;
  background-color: ${({ theme }) => getThemeValue(theme, 'colors', defaultTheme.colors).background};
  padding-horizontal: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing).lg}px;
  ${({ $width }) => $width && `max-width: ${$width}px;`}
  width: 100%;
  align-self: center;
`;

export const Title = styled.Text<StyledProps>`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSizes', defaultTheme.fontSizes)['4xl']}px;
  font-weight: 800;
  color: ${({ theme }) => getThemeValue(theme, 'colors', defaultTheme.colors).text};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing).sm}px;
  margin-top: 0;
  text-align: center;
  letter-spacing: -0.8px;
  line-height: 40px;
`;

export const ScrollViewContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  showsVerticalScrollIndicator: false,
})<StyledProps>`
  ${commonContainerStyles}
`;

export const FormContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 24,
  },
})<StyledProps>`
  ${commonContainerStyles}
`;

export const ButtonContainer = styled(View)<StyledProps>`
  margin-top: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing).xl}px;
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing)['2xl']}px;
  width: 100%;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing).md}px;
`;

export const FormField = styled(View)<StyledProps>`
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing).xl}px;
  position: relative;
  background-color: ${({ theme }) => getThemeValue(theme, 'colors', defaultTheme.colors).background};
  border-radius: 16px;
  padding-horizontal: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing).md}px;
  padding-vertical: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing).md}px;
  border-width: 1px;
  border-color: ${({ theme }) => getThemeValue(theme, 'colors', defaultTheme.colors).borderLight};
  ${commonShadowStyles}
`;

export const Label = styled.Text<StyledProps>`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSizes', defaultTheme.fontSizes).xs}px;
  color: ${({ theme }) => getThemeValue(theme, 'colors', defaultTheme.colors).textSecondary};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing).xs}px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  opacity: 0.8;
`;

export const Input = styled(TextInput).attrs<InputProps>(({ theme, multiline }) => ({
  placeholderTextColor: theme?.colors?.textMuted || defaultTheme.colors.textMuted,
  selectionColor: theme?.colors?.primary || defaultTheme.colors.primary,
  multiline,
  textAlignVertical: multiline ? 'top' : 'center',
}))<InputProps>`
  background-color: transparent;
  border-radius: 0;
  padding-horizontal: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing).md}px;
  padding-vertical: ${({ theme, multiline }) => 
    getThemeValue(theme, 'spacing', defaultTheme.spacing)[multiline ? 'md' : 'sm']}px;
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSizes', defaultTheme.fontSizes).lg}px;
  color: ${({ theme }) => getThemeValue(theme, 'colors', defaultTheme.colors).text};
  border-width: 0;
  font-weight: 500;
  line-height: 24px;
  min-height: ${({ multiline }) => (multiline ? '100px' : 'auto')};
`;

export const ErrorText = styled.Text<StyledProps>`
  color: ${({ theme }) => getThemeValue(theme, 'colors', defaultTheme.colors).danger};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSizes', defaultTheme.fontSizes).xs}px;
  margin-top: 4px;
  margin-left: 4px;
`;

export const Button = styled(TouchableOpacity).attrs({
  activeOpacity: 0.8,
})<ButtonProps>`
  background-color: ${({ theme, disabled }) => 
    disabled 
      ? getThemeValue(theme, 'colors', defaultTheme.colors).secondary
      : getThemeValue(theme, 'colors', defaultTheme.colors).primary};
  padding-vertical: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing).lg}px;
  padding-horizontal: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing).xl}px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing)['2xl']}px;
  min-height: 60px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transform: ${({ disabled }) => (disabled ? 'scale(0.98)' : 'scale(1)')};
  
  ${({ disabled, theme }) => !disabled && ({
    shadowColor: getThemeValue(theme, 'colors', defaultTheme.colors).primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6
  })}
`;

export const ButtonText = styled.Text<StyledProps>`
  color: ${({ theme }) => getThemeValue(theme, 'colors', defaultTheme.colors).textLight};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSizes', defaultTheme.fontSizes).md}px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

export const Subtitle = styled.Text<StyledProps>`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSizes', defaultTheme.fontSizes).md}px;
  color: ${({ theme }) => getThemeValue(theme, 'colors', defaultTheme.colors).textSecondary};
  text-align: center;
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing)['2xl']}px;
  line-height: 22px;
  opacity: 0.7;
  font-weight: 400;
  padding-horizontal: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing).lg}px;
`;

export const LoadingOverlay = styled(View)<StyledProps>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => getThemeValue(theme, 'colors', defaultTheme.colors).overlay};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const LoadingIndicator = styled(ActivityIndicator).attrs<StyledProps>(({ theme }) => ({
  color: theme?.colors?.primary || defaultTheme.colors.primary,
  size: 'large',
}))`
  margin-top: 16px;
`;

export const CancelButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})<StyledProps>`
  background-color: ${({ theme }) => getThemeValue(theme, 'colors', defaultTheme.colors).backgroundSecondary};
  padding-vertical: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing).md}px;
  padding-horizontal: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing).xl}px;
  border-radius: 8px;
  align-items: center;
  margin-top: ${({ theme }) => getThemeValue(theme, 'spacing', defaultTheme.spacing).sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => getThemeValue(theme, 'colors', defaultTheme.colors).border};
`;

export const CancelButtonText = styled.Text<StyledProps>`
  color: ${({ theme }) => getThemeValue(theme, 'colors', defaultTheme.colors).text};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSizes', defaultTheme.fontSizes).md}px;
  font-weight: 600;
`;
