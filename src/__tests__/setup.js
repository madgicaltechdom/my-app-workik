// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => ({ name: '[DEFAULT]' })),
  apps: [],
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 'MOCK_TIMESTAMP'),
}));

// Mock React Native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios || obj.default),
  },
  useColorScheme: jest.fn(() => 'light'),
  useWindowDimensions: jest.fn(() => ({ width: 375, height: 812 })),
  ActivityIndicator: 'ActivityIndicator',
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  Pressable: 'Pressable',
  TouchableOpacity: 'TouchableOpacity',
  Switch: 'Switch',
  Text: 'Text',
  View: 'View',
  Image: 'Image',
  StyleSheet: {
    create: jest.fn((styles) => styles),
    flatten: jest.fn((style) => style || {}),
  },
  Alert: {
    alert: jest.fn(),
  },
}));

// Mock styled-components
jest.mock('styled-components/native', () => {
  const React = require('react');
  
  // Simple mock component that renders the base component
  const MockStyledComponent = React.forwardRef((props, ref) => {
    // Filter out styled-component specific props (starting with $)
    const filteredProps = {};
    Object.keys(props).forEach(key => {
      if (!key.startsWith('$')) {
        filteredProps[key] = props[key];
      }
    });
    
    // Handle disabled state for TouchableOpacity and similar components
    const { onPress, disabled, children, __componentType, ...otherProps } = filteredProps;
    
    // Return the base component type (like 'Pressable', 'Text', etc.)
    const ComponentType = __componentType || 'View';
    
    // For TouchableOpacity, we need to properly handle disabled state
    if (ComponentType === 'TouchableOpacity' && disabled) {
      // When disabled, don't pass onPress and add a custom handler that prevents events
      return React.createElement(
        ComponentType,
        {
          ...otherProps,
          disabled: true,
          onPress: undefined, // Explicitly remove onPress when disabled
          ref,
          // Add a data attribute to help with testing
          'data-disabled': 'true'
        },
        children
      );
    }
    
    return React.createElement(
      ComponentType,
      {
        ...otherProps,
        onPress,
        disabled,
        ref
      },
      children
    );
  });

  // Create a styled function that works with both styled.Component and styled(Component)
  const createStyled = (componentType) => {
    const styledFunction = (strings, ...interpolations) => {
      const StyledComp = React.forwardRef((props, ref) => {
        return React.createElement(MockStyledComponent, {
          ...props,
          __componentType: componentType,
          ref
        });
      });
      StyledComp.displayName = `Styled(${componentType})`;
      return StyledComp;
    };
    
    // Add attrs method to the styled function itself
    styledFunction.attrs = (attrsFunction) => {
      // Return a function that can be called with template literals
      const attrsStyledFunction = (strings, ...interpolations) => {
        const StyledComp = React.forwardRef((props, ref) => {
          const attrsProps = typeof attrsFunction === 'function' ? attrsFunction(props) : attrsFunction || {};
          const mergedProps = { ...attrsProps, ...props };
          
          return React.createElement(MockStyledComponent, {
            ...mergedProps,
            __componentType: componentType,
            ref
          });
        });
        StyledComp.displayName = `Styled(${componentType}).attrs`;
        return StyledComp;
      };
      
      // Also add attrs method to the returned function for chaining
      attrsStyledFunction.attrs = (nextAttrsFunction) => {
        return styledFunction.attrs((props) => {
          const firstAttrs = typeof attrsFunction === 'function' ? attrsFunction(props) : attrsFunction || {};
          const secondAttrs = typeof nextAttrsFunction === 'function' ? nextAttrsFunction(props) : nextAttrsFunction || {};
          return { ...firstAttrs, ...secondAttrs };
        });
      };
      
      return attrsStyledFunction;
    };
    
    return styledFunction;
  };

  // Main styled function
  const styled = (Component) => createStyled(Component);

  // Add common React Native components as properties
  styled.View = createStyled('View');
  styled.Text = createStyled('Text');
  styled.KeyboardAvoidingView = createStyled('KeyboardAvoidingView');
  styled.Image = createStyled('Image');
  styled.Pressable = createStyled('Pressable');
  styled.TouchableOpacity = createStyled('TouchableOpacity');
  styled.Switch = createStyled('Switch');
  styled.ScrollView = createStyled('ScrollView');

  const mockModule = {
    __esModule: true,
    default: styled,
    styled: styled,
    ThemeProvider: ({ children }) => children,
    useTheme: jest.fn(() => ({
      colors: {
        primary: '#007AFF',
        secondary: '#34C759',
        danger: '#FF3B30',
        textLight: '#FFFFFF',
        textMuted: '#8E8E93',
        backgroundSecondary: '#F2F2F7',
        textSecondary: '#8E8E93',
        overlayLight: 'rgba(0,0,0,0.1)',
        surface: '#FFFFFF',
        subText: '#8E8E93',
        border: '#E5E5EA',
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
      },
      fontSizes: {
        sm: 14,
        md: 16,
        lg: 18,
      },
    })),
    css: jest.fn(),
  };

  return mockModule;
});

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    NavigationContainer: ({ children }) => children,
  };
});

// Mock Safe Area Context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

// Mock Gesture Handler
jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    Swipeable: ({ children }) => children,
    DrawerLayout: ({ children }) => children,
    GestureHandlerRootView: ({ children }) => children,
    PanGestureHandler: ({ children }) => children,
    TapGestureHandler: ({ children }) => children,
    FlingGestureHandler: ({ children }) => children,
    LongPressGestureHandler: ({ children }) => children,
    PinchGestureHandler: ({ children }) => children,
    RotationGestureHandler: ({ children }) => children,
    State: {},
    Directions: {},
    gestureHandlerRootHOC: (component) => component,
  };
});

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  // Mock Svg component
  const Svg = ({ children, ...props }) => {
    return React.createElement('Svg', props, children);
  };
  
  // Mock Path component
  const Path = (props) => React.createElement('Path', props);
  
  // Mock Circle component
  const Circle = (props) => React.createElement('Circle', props);
  
  // Mock Rect component
  const Rect = (props) => React.createElement('Rect', props);
  
  // Mock G component
  const G = (props) => React.createElement('G', props);
  
  // Return all mocks
  return {
    Svg,
    Path,
    Circle,
    Rect,
    G,
    // Add other SVG components as needed
  };
});

// Mock Expo modules
jest.mock('expo-localization', () => ({
  locale: 'en-US',
  locales: ['en-US'],
  timezone: 'America/New_York',
  isRTL: false,
}));

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  })),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
}));

// Mock authService
jest.mock('@/services/authService', () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    resetPassword: jest.fn(),
    getCurrentUser: jest.fn(),
    updateUserProfile: jest.fn(),
  },
}));

// Mock validation utilities
jest.mock('@/utils/validation', () => ({
  validateEmail: jest.fn((email) => ({
    isValid: email && email.includes('@'),
    errorMessage: email && email.includes('@') ? null : 'Please enter a valid email address',
  })),
  validateRequired: jest.fn((value, fieldName) => ({
    isValid: Boolean(value && value.trim()),
    errorMessage: Boolean(value && value.trim()) ? null : `${fieldName} is required`,
  })),
  sanitizeInput: jest.fn((input) => input ? input.trim() : ''),
}));

// Mock console methods globally
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

global.console = {
  ...console,
  error: (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('testID') ||
        args[0].includes('accessibility') ||
        args[0].includes('styled-components'))
    ) {
      return;
    }
    originalConsoleError(...args);
  },
  warn: (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('testID') ||
        args[0].includes('accessibility') ||
        args[0].includes('styled-components'))
    ) {
      return;
    }
    originalConsoleWarn(...args);
  },
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Clean up after each test
afterEach(() => {
  jest.clearAllTimers();
});

// Global test utilities

// Custom matchers
expect.extend({
  toBeDisabled(received) {
    const isDisabled = received.props.accessibilityState?.disabled === true;
    return {
      message: () => `expected element to be ${isDisabled ? '' : 'not '}disabled`,
      pass: isDisabled,
    };
  },
  toHaveStyle(received, style) {
    const receivedStyle = received.props.style || {};
    const expectedStyle = style;
    
    for (const [key, value] of Object.entries(expectedStyle)) {
      if (receivedStyle[key] !== value) {
        return {
          message: () => `expected style ${key} to be ${value}, but got ${receivedStyle[key]}`,
          pass: false,
        };
      }
    }
    
    return {
      message: () => 'expected styles to match',
      pass: true,
    };
  },
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

// Cleanup after each test
afterEach(() => {
  jest.clearAllTimers();
});
