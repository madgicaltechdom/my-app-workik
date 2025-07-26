// Mock React Native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj: { ios: any; default: any }) => obj.ios || obj.default),
  },
  useColorScheme: jest.fn(() => 'light'),
  ActivityIndicator: 'ActivityIndicator',
  Pressable: 'Pressable',
  Text: 'Text',
  View: 'View',
  StyleSheet: {
    create: jest.fn((styles) => styles),
    flatten: jest.fn((style) => style || {}),
  },
}));

// Mock styled-components
jest.mock('styled-components/native', () => {
  return {
    ThemeProvider: ({ children }) => children,
    styled: (component) => {
      return () => component;
    },
    useTheme: jest.fn(() => ({
      colors: {
        primary: '#007AFF',
        secondary: '#34C759',
        danger: '#FF3B30',
        textLight: '#FFFFFF',
        textMuted: '#8E8E93',
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
      },
    })),
    css: jest.fn(),
  };
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
