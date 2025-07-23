// Common UI Types
export interface BaseComponentProps {
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: object;
}

export interface LoadingState {
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

// Navigation Types
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  ProfileTab: {
    user?: UserProfile | null;
    profileUpdated?: boolean;
    updatedAt?: string;
  };
  Settings: undefined;
  UpdateProfile: {
    userId?: string;
    initialValues?: Partial<UserProfile>;
    onSuccess?: () => void;
  };
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// User and Profile Types
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  photoURL: string | null;
  phoneNumber: string | null;
  firstName?: string;
  lastName?: string;
  bio?: string;
  dateOfBirth?: string;
  address?: UserAddress;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Form Types
export interface FormFieldState {
  value: string;
  hasError: boolean;
  errorMessage?: string;
  isTouched: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ThemeTypography {
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

// Component Variant Types
export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';
export type InputVariant = 'default' | 'outlined' | 'filled';
export type MessageSeverity = 'error' | 'warning' | 'info' | 'success';
export type LoadingVariant = 'overlay' | 'inline' | 'modal';

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> & 
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface ValidationError extends AppError {
  field: string;
  value: any;
}

// Storage Types
export interface StorageItem<T = any> {
  key: string;
  value: T;
  expiresAt?: number;
}

// Event Types
export interface AppEvent<T = any> {
  type: string;
  payload: T;
  timestamp: number;
}

// Localization Types
export interface LocaleConfig {
  code: string;
  name: string;
  isRTL: boolean;
}

export type TranslationKey = string;
export type TranslationParams = Record<string, string | number>;

// Permission Types
export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionResult {
  status: PermissionStatus;
  canAskAgain: boolean;
  expires: 'never' | number;
}

// Device Types
export interface DeviceInfo {
  platform: 'ios' | 'android' | 'web';
  version: string;
  model?: string;
  brand?: string;
  isDevice: boolean;
}

// Network Types
export interface NetworkState {
  isConnected: boolean;
  type: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  isInternetReachable: boolean;
}

export default {};
