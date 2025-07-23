// Base spacing unit (4px)
const BASE_UNIT = 4;

// Spacing scale
export const spacing = {
  none: 0,
  xs: BASE_UNIT,        // 4px
  sm: BASE_UNIT * 2,    // 8px
  md: BASE_UNIT * 4,    // 16px
  lg: BASE_UNIT * 6,    // 24px
  xl: BASE_UNIT * 8,    // 32px
  '2xl': BASE_UNIT * 12, // 48px
  '3xl': BASE_UNIT * 16, // 64px
  '4xl': BASE_UNIT * 20, // 80px
  '5xl': BASE_UNIT * 24, // 96px
} as const;

// Semantic spacing for specific use cases
export const semanticSpacing = {
  // Component internal spacing
  componentPadding: spacing.md,
  componentMargin: spacing.sm,
  
  // Screen-level spacing
  screenPadding: spacing.lg,
  screenMargin: spacing.md,
  
  // Form elements
  formFieldSpacing: spacing.sm,
  formSectionSpacing: spacing.lg,
  
  // Lists and cards
  listItemSpacing: spacing.sm,
  cardPadding: spacing.md,
  cardMargin: spacing.sm,
  
  // Navigation
  tabBarHeight: 60,
  headerHeight: 56,
  
  // Interactive elements
  buttonPadding: spacing.md,
  buttonMargin: spacing.sm,
  touchableMinHeight: 44, // iOS HIG minimum
  
  // Layout
  sectionSpacing: spacing.xl,
  contentSpacing: spacing.lg,
} as const;

// Border radius scale
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999, // For circular elements
} as const;

// Shadow and elevation
export const shadows = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.23,
    shadowRadius: 4.62,
    elevation: 8,
  },
  xl: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.27,
    shadowRadius: 7.49,
    elevation: 12,
  },
  '2xl': {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 13.16,
    elevation: 20,
  },
} as const;

// Z-index scale for layering
export const zIndex = {
  hide: -1,
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
  toast: 700,
  max: 999,
} as const;

export type Spacing = keyof typeof spacing;
export type SemanticSpacing = keyof typeof semanticSpacing;
export type BorderRadius = keyof typeof borderRadius;
export type Shadow = keyof typeof shadows;
export type ZIndex = keyof typeof zIndex;
