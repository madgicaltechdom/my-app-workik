export const colors = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4DA2FF',
  
  // Secondary colors
  secondary: '#6C757D',
  secondaryDark: '#545B62',
  secondaryLight: '#8A9198',
  
  // Status colors
  success: '#28A745',
  successDark: '#1E7E34',
  successLight: '#71DD8A',
  
  danger: '#DC3545',
  dangerDark: '#C82333',
  dangerLight: '#F1959B',
  
  warning: '#FFC107',
  warningDark: '#E0A800',
  warningLight: '#FFD93D',
  
  info: '#17A2B8',
  infoDark: '#138496',
  infoLight: '#5DADE2',
  
  // Neutral colors
  light: '#F8F9FA',
  dark: '#343A40',
  
  // Text colors
  text: '#212529',
  textSecondary: '#6C757D',
  textLight: '#FFFFFF',
  textMuted: '#ADB5BD',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundDark: '#343A40',
  
  // Border colors
  border: '#DEE2E6',
  borderLight: '#E9ECEF',
  borderDark: '#ADB5BD',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Shadow colors
  shadow: '#000000',
  shadowLight: 'rgba(0, 0, 0, 0.1)',
} as const;

// Dark mode colors
export const darkColors = {
  ...colors,
  
  // Override specific colors for dark mode
  primary: '#0A84FF',
  
  // Text colors for dark mode
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textMuted: '#636366',
  
  // Background colors for dark mode
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  backgroundDark: '#2C2C2E',
  
  // Border colors for dark mode
  border: '#38383A',
  borderLight: '#48484A',
  borderDark: '#636366',
  
  // Overlay colors for dark mode
  overlay: 'rgba(255, 255, 255, 0.1)',
  overlayLight: 'rgba(255, 255, 255, 0.05)',
} as const;

export type Colors = typeof colors;
export type ColorKey = keyof Colors;
