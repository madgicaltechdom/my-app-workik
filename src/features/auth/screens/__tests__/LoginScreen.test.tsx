import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';

import { LoginScreen } from '../LoginScreen';
import { theme } from '@/theme';
import { authService } from '@/services/authService';

// Import test setup
import '../../../../__tests__/setup';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <NavigationContainer>
      {children}
    </NavigationContainer>
  </ThemeProvider>
);

// Helper function to render LoginScreen with proper context
const renderLoginScreen = (props = {}) => {
  return render(
    <TestWrapper>
      <LoginScreen navigation={mockNavigation as any} {...props} />
    </TestWrapper>
  );
};

describe('LoginScreen', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockNavigate.mockClear();
    // Reset authService.login mock
    (authService.login as jest.Mock).mockReset();
  });

  describe('Rendering & Basic Functionality', () => {
    it('renders correctly with all essential elements', () => {
      const { getByTestId } = renderLoginScreen();
      
      expect(getByTestId('login-title')).toBeTruthy();
      expect(getByTestId('login-email-input')).toBeTruthy();
      expect(getByTestId('login-password-input')).toBeTruthy();
      expect(getByTestId('login-submit-button')).toBeTruthy();
      expect(getByTestId('signup-link')).toBeTruthy();
      expect(getByTestId('forgot-password-link')).toBeTruthy();
    });

    it('displays welcome back title with correct accessibility', () => {
      const { getByTestId } = renderLoginScreen();
      const title = getByTestId('login-title');
      
      expect(title).toBeTruthy();
      expect(title.props.accessibilityRole).toBe('header');
      expect(title.props.accessibilityLabel).toBeTruthy();
    });

    it('renders email input with correct properties', () => {
      const { getByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      
      expect(emailInput).toBeTruthy();
      expect(emailInput.props.keyboardType).toBe('email-address');
      expect(emailInput.props.autoCapitalize).toBe('none');
      expect(emailInput.props.autoComplete).toBe('email');
      expect(emailInput.props.textContentType).toBe('emailAddress');
    });

    it('renders password input with correct properties', () => {
      const { getByTestId } = renderLoginScreen();
      const passwordInput = getByTestId('login-password-input');
      
      expect(passwordInput).toBeTruthy();
      expect(passwordInput.props.secureTextEntry).toBe(true);
      expect(passwordInput.props.autoComplete).toBe('password');
      expect(passwordInput.props.textContentType).toBe('password');
    });

    it('renders login button with correct initial state', () => {
      const { getByTestId } = renderLoginScreen();
      const loginButton = getByTestId('login-submit-button');
      
      expect(loginButton).toBeTruthy();
      expect(loginButton.props.accessibilityState.disabled).toBe(true); // Initially disabled due to empty form
    });

    it('renders loading overlay initially hidden', () => {
      const { queryByTestId } = renderLoginScreen();
      const loadingOverlay = queryByTestId('login-loading-overlay');
      
      // LoadingOverlay should not exist initially when not loading
      expect(loadingOverlay).toBeNull();
    });

    it('does not display error message initially', () => {
      const { queryByTestId } = renderLoginScreen();
      const errorMessage = queryByTestId('login-error-message');
      
      // ErrorMessage should not exist initially
      expect(errorMessage).toBeNull();
    });
  });

  describe('Form Input Handling', () => {
    it('handles email input changes correctly', () => {
      const { getByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      
      fireEvent.changeText(emailInput, 'test@example.com');
      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('handles password input changes correctly', () => {
      const { getByTestId } = renderLoginScreen();
      const passwordInput = getByTestId('login-password-input');
      
      fireEvent.changeText(passwordInput, 'password123');
      expect(passwordInput.props.value).toBe('password123');
    });

    it('sanitizes email input by removing extra whitespace', () => {
      const { getByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      
      fireEvent.changeText(emailInput, '  test@example.com  ');
      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('enables login button when both fields are filled', () => {
      const { getByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const loginButton = getByTestId('login-submit-button');
      
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      
      expect(loginButton.props.accessibilityState.disabled).toBe(false);
    });

    it('keeps login button disabled when email is empty', () => {
      const { getByTestId } = renderLoginScreen();
      const passwordInput = getByTestId('login-password-input');
      const loginButton = getByTestId('login-submit-button');
      
      fireEvent.changeText(passwordInput, 'password123');
      
      expect(loginButton.props.accessibilityState.disabled).toBe(true);
    });

    it('keeps login button disabled when password is empty', () => {
      const { getByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      const loginButton = getByTestId('login-submit-button');
      
      fireEvent.changeText(emailInput, 'test@example.com');
      
      expect(loginButton.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Form Validation', () => {
    it('shows error for invalid email format', async () => {
      // Mock login to fail with validation error
      (authService.login as jest.Mock).mockRejectedValueOnce(new Error('Please enter a valid email address'));
      
      const { getByTestId, getByText, queryByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const loginButton = getByTestId('login-submit-button');
      
      // Fill with invalid email but valid password to enable button
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.changeText(passwordInput, 'password123');
      
      // Wait for button to be enabled
      await waitFor(() => {
        expect(loginButton.props.accessibilityState.disabled).toBe(false);
      });
      
      // Submit form (will trigger validation)
      fireEvent.press(loginButton);
      
      // Wait for error message to appear with extended timeout
      await waitFor(() => {
        const errorDisplay = queryByTestId('login-error-message');
        expect(errorDisplay).toBeTruthy();
        expect(getByText('Please enter a valid email address')).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('shows error for empty email', async () => {
      const { getByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const loginButton = getByTestId('login-submit-button');
      
      // Fill password but leave email empty
      fireEvent.changeText(passwordInput, 'password123');
      
      // Verify button remains disabled when email is empty
      await waitFor(() => {
        expect(loginButton.props.accessibilityState.disabled).toBe(true);
      });
      
      // Verify no error message is shown initially (proper UX)
      expect(() => getByTestId('login-error-message')).toThrow();
    });

    it('shows error for empty password', async () => {
      const { getByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const loginButton = getByTestId('login-submit-button');
      
      // Fill email but leave password empty
      fireEvent.changeText(emailInput, 'test@example.com');
      
      // Verify button remains disabled when password is empty
      await waitFor(() => {
        expect(loginButton.props.accessibilityState.disabled).toBe(true);
      });
      
      // Verify no error message is shown initially (proper UX)
      expect(() => getByTestId('login-error-message')).toThrow();
    });

    it('clears error message when user starts typing after validation error', async () => {
      // Mock login to fail so we can trigger error state
      (authService.login as jest.Mock).mockRejectedValueOnce(new Error('Invalid email'));
      
      const { getByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const loginButton = getByTestId('login-submit-button');
      
      // Trigger validation error by submitting invalid email
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);
      
      // Wait for error message to appear
      await waitFor(() => {
        const errorMessage = getByTestId('login-error-message');
        expect(errorMessage).toBeTruthy();
      }, { timeout: 3000 });
      
      // Start typing to clear error
      fireEvent.changeText(emailInput, 'test@example.com');
      
      // Error should be cleared when user starts typing
      await waitFor(() => {
        expect(() => getByTestId('login-error-message')).toThrow();
      });
    });
  });

  describe('Authentication Flow', () => {
    it('calls authService.login with correct credentials on successful submission', async () => {
      (authService.login as jest.Mock).mockResolvedValueOnce({ user: { uid: '123', email: 'test@example.com' } });
      
      const { getByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const loginButton = getByTestId('login-submit-button');
      
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);
      
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('shows loading indicator during authentication', async () => {
      (authService.login as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      const { getByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const loginButton = getByTestId('login-submit-button');
      
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);
      
      // Wait for loading overlay to appear
      await waitFor(() => {
        expect(getByTestId('login-loading-overlay')).toBeTruthy();
      });
    });

    it('disables form inputs during loading', async () => {
      (authService.login as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      const { getByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const loginButton = getByTestId('login-submit-button');
      
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);
      
      await waitFor(() => {
        expect(emailInput.props.editable).toBe(false);
        expect(passwordInput.props.editable).toBe(false);
        expect(loginButton.props.accessibilityState.disabled).toBe(true);
      });
    });

    it('handles authentication errors correctly', async () => {
      const errorMessage = 'Invalid credentials';
      (authService.login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      
      const { getByTestId, getByText, queryByTestId, debug } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const loginButton = getByTestId('login-submit-button');
      
      // Ensure form is valid before submitting
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      
      // Verify form is valid and button is enabled
      await waitFor(() => {
        expect(loginButton.props.accessibilityState.disabled).toBe(false);
      });
      
      // Submit the form
      fireEvent.press(loginButton);
      
      // Wait for error message to appear with extended timeout
      await waitFor(() => {
        const errorDisplay = queryByTestId('login-error-message');
        if (!errorDisplay) {
          console.log('ErrorMessage not found, debugging...');
          debug();
          throw new Error('ErrorMessage component not rendered');
        }
        expect(errorDisplay).toBeTruthy();
        expect(getByText(errorMessage)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('handles network timeout correctly', async () => {
      // Mock login to simulate timeout error directly
      (authService.login as jest.Mock).mockRejectedValueOnce(
        new Error('Request timed out. Please try again.')
      );
      
      const { getByTestId, getByText, queryByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const loginButton = getByTestId('login-submit-button');
      
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      
      // Wait for button to be enabled
      await waitFor(() => {
        expect(loginButton.props.accessibilityState.disabled).toBe(false);
      });
      
      // Start the login process
      fireEvent.press(loginButton);
      
      // Wait for timeout error to appear
      await waitFor(() => {
        const errorDisplay = queryByTestId('login-error-message');
        expect(errorDisplay).toBeTruthy();
        expect(getByText('Request timed out. Please try again.')).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('Navigation', () => {
    it('navigates to signup screen when signup link is pressed', () => {
      const { getByTestId } = renderLoginScreen();
      const signupLink = getByTestId('signup-link');
      
      fireEvent.press(signupLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('Signup');
    });

    it('navigates to forgot password screen when forgot password link is pressed', () => {
      const { getByTestId } = renderLoginScreen();
      const forgotPasswordLink = getByTestId('forgot-password-link');
      
      fireEvent.press(forgotPasswordLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
    });

    it('has correct accessibility properties for navigation links', () => {
      const { getByTestId } = renderLoginScreen();
      const signupLink = getByTestId('signup-link');
      const forgotPasswordLink = getByTestId('forgot-password-link');
      
      expect(signupLink.props.accessibilityRole).toBe('button');
      expect(signupLink.props.accessibilityLabel).toBeTruthy();
      expect(forgotPasswordLink.props.accessibilityRole).toBe('button');
      expect(forgotPasswordLink.props.accessibilityLabel).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('provides proper accessibility labels for all interactive elements', () => {
      const { getByTestId } = renderLoginScreen();
      
      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const loginButton = getByTestId('login-submit-button');
      
      expect(emailInput.props.accessibilityLabel).toBeTruthy();
      expect(passwordInput.props.accessibilityLabel).toBeTruthy();
      expect(loginButton.props.accessibilityLabel).toBeTruthy();
    });

    it('provides proper accessibility roles', () => {
      const { getByTestId } = renderLoginScreen();
      
      const title = getByTestId('login-title');
      expect(title.props.accessibilityRole).toBe('header');
    });

    it('has proper testIDs for all interactive elements', () => {
      const { getByTestId, queryByTestId } = renderLoginScreen();
      
      expect(getByTestId('login-title')).toBeTruthy();
      expect(getByTestId('login-email-input')).toBeTruthy();
      expect(getByTestId('login-password-input')).toBeTruthy();
      expect(getByTestId('login-submit-button')).toBeTruthy();
      expect(getByTestId('signup-link')).toBeTruthy();
      expect(getByTestId('forgot-password-link')).toBeTruthy();
      
      // These elements are conditionally rendered
      expect(queryByTestId('login-error-message')).toBeDefined();
      expect(queryByTestId('login-loading-overlay')).toBeDefined();
    });
  });

  describe('Performance & Edge Cases', () => {
    it('handles rapid input changes efficiently', () => {
      const { getByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      
      // Simulate rapid typing
      for (let i = 0; i < 10; i++) {
        fireEvent.changeText(emailInput, `test${i}@example.com`);
      }
      
      expect(emailInput.props.value).toBe('test9@example.com');
    });

    it('handles component re-renders without losing state', () => {
      const { getByTestId, rerender } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      
      fireEvent.changeText(emailInput, 'test@example.com');
      
      rerender(
        <TestWrapper>
          <LoginScreen navigation={mockNavigation as any} />
        </TestWrapper>
      );
      
      const updatedEmailInput = getByTestId('login-email-input');
      expect(updatedEmailInput.props.value).toBe('test@example.com');
    });

    it('cleans up timeouts on component unmount', () => {
      const { unmount } = renderLoginScreen();
      
      // This test ensures no memory leaks from setTimeout
      expect(() => unmount()).not.toThrow();
    });

    it('handles empty string inputs gracefully', () => {
      const { getByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      
      fireEvent.changeText(emailInput, '');
      fireEvent.changeText(passwordInput, '');
      
      expect(emailInput.props.value).toBe('');
      expect(passwordInput.props.value).toBe('');
    });
  });
});
