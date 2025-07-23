import { colors, darkColors, type Colors } from './colors';
import { 
  fontFamilies, 
  fontSizes, 
  fontWeights, 
  lineHeights, 
  textStyles,
  type FontFamily,
  type FontSize,
  type FontWeight,
  type LineHeight,
  type TextStyle,
} from './typography';
import { 
  spacing, 
  semanticSpacing, 
  borderRadius, 
  shadows, 
  zIndex,
  type Spacing,
  type SemanticSpacing,
  type BorderRadius,
  type Shadow,
  type ZIndex,
} from './spacing';

// Main theme interface
export interface Theme {
  colors: Colors;
  fontFamilies: typeof fontFamilies;
  fontSizes: typeof fontSizes;
  fontWeights: typeof fontWeights;
  lineHeights: typeof lineHeights;
  textStyles: typeof textStyles;
  spacing: typeof spacing;
  semanticSpacing: typeof semanticSpacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  zIndex: typeof zIndex;
}

// Light theme (default)
export const theme: Theme = {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  textStyles,
  spacing,
  semanticSpacing,
  borderRadius,
  shadows,
  zIndex,
};

// Dark theme
export const darkTheme: Theme = {
  ...theme,
  colors: darkColors,
};

// Theme utility functions
export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : theme;
};

// Re-export types for convenience
export type {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  LineHeight,
  TextStyle,
  Spacing,
  SemanticSpacing,
  BorderRadius,
  Shadow,
  ZIndex,
};

// Re-export individual modules
export {
  colors,
  darkColors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  textStyles,
  spacing,
  semanticSpacing,
  borderRadius,
  shadows,
  zIndex,
};
