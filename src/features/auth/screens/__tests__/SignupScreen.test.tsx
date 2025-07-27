import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';
import SignupScreen from '../SignupScreen';
import { theme } from '@/theme';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
};

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/hooks/useFirebaseAuth', () => ({
  useFirebaseAuth: () => ({ loading: false }),
}));

// Mock services - use jest.fn() for all mocks
jest.mock('@/services/authService', () => ({
  authService: {
    signup: jest.fn(),
  },
}));

jest.mock('@/utils/validation', () => ({
  validateEmail: jest.fn(),
  validatePassword: jest.fn(),
  sanitizeInput: jest.fn((input: string) => input),
}));

// Mock common components
jest.mock('@/components/common', () => {
  const React = require('react');
  const { View, TextInput, Pressable, Text } = require('react-native');
  
  return {
    Input: ({ testID, value, onChangeText, ...props }: any) => (
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    ),
    Button: ({ testID, title, onPress, loading, disabled, ...props }: any) => (
      <Pressable
        testID={testID}
        onPress={onPress}
        disabled={disabled || loading}
        accessibilityState={{ disabled: disabled || loading }}
        {...props}
      >
        <Text>{title}</Text>
      </Pressable>
    ),
    ErrorMessage: ({ testID, message }: any) => (
      message ? (
        <View testID={testID}>
          <Text>{message}</Text>
        </View>
      ) : null
    ),
  };
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <NavigationContainer>
      {children}
    </NavigationContainer>
  </ThemeProvider>
);

describe('SignupScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mocks
    require('@/utils/validation').validateEmail.mockReturnValue({ isValid: true });
    require('@/utils/validation').validatePassword.mockReturnValue({ isValid: true });
    require('@/services/authService').authService.signup.mockResolvedValue(undefined);
  });

  describe('Rendering & Basic Functionality', () => {
    it('renders correctly', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SignupScreen navigation={mockNavigation as any} />
        </TestWrapper>
      );

      expect(getByTestId('email-input')).toBeTruthy();
      expect(getByTestId('password-input')).toBeTruthy();
      expect(getByTestId('confirm-password-input')).toBeTruthy();
      expect(getByTestId('signup-button')).toBeTruthy();
      expect(getByTestId('login-link')).toBeTruthy();
    });

    it('updates email field on input', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SignupScreen navigation={mockNavigation as any} />
        </TestWrapper>
      );

      const emailInput = getByTestId('email-input');
      fireEvent.changeText(emailInput, 'test@example.com');
      
      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('updates password field on input', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SignupScreen navigation={mockNavigation as any} />
        </TestWrapper>
      );

      const passwordInput = getByTestId('password-input');
      fireEvent.changeText(passwordInput, 'password123');
      
      expect(passwordInput.props.value).toBe('password123');
    });

    it('updates confirm password field on input', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SignupScreen navigation={mockNavigation as any} />
        </TestWrapper>
      );

      const confirmPasswordInput = getByTestId('confirm-password-input');
      fireEvent.changeText(confirmPasswordInput, 'password123');
      
      expect(confirmPasswordInput.props.value).toBe('password123');
    });
  });

  describe('Form Validation', () => {
    it('validates email format', async () => {
      require('@/utils/validation').validateEmail.mockReturnValue({ isValid: false, message: 'Invalid email' });
      
      const { getByTestId } = render(
        <TestWrapper>
          <SignupScreen navigation={mockNavigation as any} />
        </TestWrapper>
      );

      const emailInput = getByTestId('email-input');
      fireEvent.changeText(emailInput, 'invalid-email');

      const signupButton = getByTestId('signup-button');
      fireEvent.press(signupButton);

      // Verify validation was called
      await waitFor(() => {
        expect(require('@/utils/validation').validateEmail).toHaveBeenCalledWith('invalid-email');
      });
    });

    it('validates password strength', async () => {
      require('@/utils/validation').validatePassword.mockReturnValue({ isValid: false, message: 'Weak password' });
      
      const { getByTestId } = render(
        <TestWrapper>
          <SignupScreen navigation={mockNavigation as any} />
        </TestWrapper>
      );

      const emailInput = getByTestId('email-input');
      fireEvent.changeText(emailInput, 'test@example.com');

      const passwordInput = getByTestId('password-input');
      fireEvent.changeText(passwordInput, '123');

      const signupButton = getByTestId('signup-button');
      fireEvent.press(signupButton);

      // Verify validation was called
      await waitFor(() => {
        expect(require('@/utils/validation').validatePassword).toHaveBeenCalledWith('123');
      });
    });

    it('shows error for password mismatch', async () => {
      const { getByTestId, queryAllByText } = render(
        <TestWrapper>
          <SignupScreen navigation={mockNavigation as any} />
        </TestWrapper>
      );

      const emailInput = getByTestId('email-input');
      fireEvent.changeText(emailInput, 'test@example.com');

      const passwordInput = getByTestId('password-input');
      fireEvent.changeText(passwordInput, 'password123');

      const confirmPasswordInput = getByTestId('confirm-password-input');
      fireEvent.changeText(confirmPasswordInput, 'different123');

      const signupButton = getByTestId('signup-button');
      fireEvent.press(signupButton);

      await waitFor(() => {
        expect(queryAllByText('signup.passwordsDoNotMatch').length).toBeGreaterThan(0);
      });
    });
  });

  describe('Authentication Flow', () => {
    it('handles successful signup', async () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SignupScreen navigation={mockNavigation as any} />
        </TestWrapper>
      );

      const emailInput = getByTestId('email-input');
      fireEvent.changeText(emailInput, 'test@example.com');

      const passwordInput = getByTestId('password-input');
      fireEvent.changeText(passwordInput, 'password123');

      const confirmPasswordInput = getByTestId('confirm-password-input');
      fireEvent.changeText(confirmPasswordInput, 'password123');

      const signupButton = getByTestId('signup-button');
      fireEvent.press(signupButton);

      await waitFor(() => {
        expect(require('@/services/authService').authService.signup).toHaveBeenCalledWith(
          'test@example.com',
          'password123'
        );
      });
    });

    it('handles signup failure', async () => {
      require('@/services/authService').authService.signup.mockRejectedValue(new Error('Signup failed'));

      const { getByTestId, queryAllByText } = render(
        <TestWrapper>
          <SignupScreen navigation={mockNavigation as any} />
        </TestWrapper>
      );

      const emailInput = getByTestId('email-input');
      fireEvent.changeText(emailInput, 'test@example.com');

      const passwordInput = getByTestId('password-input');
      fireEvent.changeText(passwordInput, 'password123');

      const confirmPasswordInput = getByTestId('confirm-password-input');
      fireEvent.changeText(confirmPasswordInput, 'password123');

      const signupButton = getByTestId('signup-button');
      fireEvent.press(signupButton);

      await waitFor(() => {
        expect(queryAllByText('signup.signupFailed').length).toBeGreaterThan(0);
      });
    });
  });

  describe('Navigation', () => {
    it('navigates to login screen', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SignupScreen navigation={mockNavigation as any} />
        </TestWrapper>
      );

      const loginLink = getByTestId('login-link');
      fireEvent.press(loginLink);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility labels', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <SignupScreen navigation={mockNavigation as any} />
        </TestWrapper>
      );

      expect(getByLabelText('signup.emailPlaceholder')).toBeTruthy();
      expect(getByLabelText('signup.passwordPlaceholder')).toBeTruthy();
      expect(getByLabelText('signup.confirmPasswordPlaceholder')).toBeTruthy();
    });
  });
});
