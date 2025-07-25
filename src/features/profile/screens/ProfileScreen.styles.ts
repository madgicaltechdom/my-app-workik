import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import { Theme } from '../../../theme';

// Create a base theme with default values to prevent undefined errors
const defaultTheme: Theme = {
  colors: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#6200EE',
    textSecondary: '#666666',
    borderLight: '#E0E0E0',
    shadow: '#000000',
    backgroundSecondary: '#F5F5F5',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
  },
  fontFamilies: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  lineHeights: {
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
} as const;

// Helper function to safely get theme values
const getThemeValue = <T extends keyof Theme>(
  theme: Theme | undefined,
  key: T,
  subKey?: keyof Theme[T]
): any => {
  if (!theme) return defaultTheme[key];
  if (!subKey) return theme[key] || defaultTheme[key];
  return (theme[key] as any)?.[subKey] ?? (defaultTheme[key] as any)[subKey];
};

export const Container = styled.View<{ $width: number }>`
  flex: 1;
  background-color: ${({ theme }) => getThemeValue(theme, 'colors', 'background')};
  padding-horizontal: ${({ theme }) => getThemeValue(theme, 'spacing', 'lg')}px;
  padding-vertical: ${({ theme }) => getThemeValue(theme, 'spacing', 'md')}px;
  width: ${({ $width }) => ($width > 500 ? '500px' : `${$width}px`)};
  align-self: center;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => getThemeValue(theme, 'fontFamilies', 'bold')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSizes', '2xl')}px;
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing', 'xl')}px;
  color: ${({ theme }) => getThemeValue(theme, 'colors', 'text')};
  text-align: center;
  line-height: ${({ theme }) => getThemeValue(theme, 'lineHeights', '2xl')}px;
`;

export const ProfileContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 24,
  },
})`
  flex: 1;
`;

export const AvatarContainer = styled.View`
  align-items: center;
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing', 'xl')}px;
  padding-vertical: ${({ theme }) => getThemeValue(theme, 'spacing', 'lg')}px;
`;

export const Avatar = styled.Image`
  width: 140px;
  height: 140px;
  border-radius: 70px;
  border-width: 4px;
  border-color: ${({ theme }) => getThemeValue(theme, 'colors', 'primary')};
  elevation: 8;
  background-color: ${({ theme }) => getThemeValue(theme, 'colors', 'backgroundSecondary')};
`;

export const NameText = styled.Text`
  font-family: ${({ theme }) => getThemeValue(theme, 'fontFamilies', 'bold')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSizes', 'xl')}px;
  color: ${({ theme }) => getThemeValue(theme, 'colors', 'text')};
  margin-top: ${({ theme }) => getThemeValue(theme, 'spacing', 'lg')}px;
  text-align: center;
  line-height: ${({ theme }) => getThemeValue(theme, 'lineHeights', 'xl')}px;
`;

export const EmailText = styled.Text`
  font-family: ${({ theme }) => getThemeValue(theme, 'fontFamilies', 'regular')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSizes', 'md')}px;
  color: ${({ theme }) => getThemeValue(theme, 'colors', 'textSecondary')};
  text-align: center;
  margin-top: ${({ theme }) => getThemeValue(theme, 'spacing', 'xs')}px;
  opacity: 0.8;
  line-height: ${({ theme }) => getThemeValue(theme, 'lineHeights', 'md')}px;
`;

export const InfoContainer = styled.View`
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing', 'xl')}px;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing', 'md')}px;
`;

export const InfoBox = styled.View`
  background-color: ${({ theme }) => getThemeValue(theme, 'colors', 'backgroundSecondary')};
  border-radius: ${({ theme }) => getThemeValue(theme, 'borderRadius', 'md')}px;
  padding-horizontal: ${({ theme }) => getThemeValue(theme, 'spacing', 'lg')}px;
  padding-vertical: ${({ theme }) => getThemeValue(theme, 'spacing', 'md')}px;
  border-width: 1px;
  border-color: ${({ theme }) => getThemeValue(theme, 'colors', 'borderLight')};
  elevation: 2;
  shadow-color: ${({ theme }) => getThemeValue(theme, 'colors', 'shadow')};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

export const InfoTitle = styled.Text`
  font-family: ${({ theme }) => getThemeValue(theme, 'fontFamilies', 'medium')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSizes', 'xs')}px;
  color: ${({ theme }) => getThemeValue(theme, 'colors', 'textSecondary')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing', 'xs')}px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.7;
`;

export const InfoValue = styled.Text`
  font-family: ${({ theme }) => getThemeValue(theme, 'fontFamilies', 'regular')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSizes', 'md')}px;
  color: ${({ theme }) => getThemeValue(theme, 'colors', 'text')};
  line-height: ${({ theme }) => getThemeValue(theme, 'lineHeights', 'md')}px;
`;

export const ButtonContainer = styled.View`
  margin-top: ${({ theme }) => getThemeValue(theme, 'spacing', 'xl')}px;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing', 'md')}px;
  padding-horizontal: ${({ theme }) => getThemeValue(theme, 'spacing', 'sm')}px;
`;

export const styles = (theme?: Theme) => StyleSheet.create({
  button: {
    marginVertical: theme ? getThemeValue(theme, 'spacing', 'xs') : 4,
  },
});
