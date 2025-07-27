import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

// Import test setup
import '../../../../__tests__/setup';

// Import the actual component
import UpdateProfileScreen from '../UpdateProfileScreen';
import { theme } from '@/theme';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  reset: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn().mockImplementation((event, callback) => {
    // Call the callback immediately to simulate focus event
    if (event === 'focus') {
      callback();
    }
    return jest.fn(); // Return a cleanup function
  }),
};

// Mock NavigationContainer
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => mockNavigation,
    useRoute: () => ({}),
    // Mock the NavigationContainer with a simple View
    NavigationContainer: ({ children }: { children: React.ReactNode }) => {
      const MockNavigationContainer = require('react-native').View;
      return <MockNavigationContainer>{children}</MockNavigationContainer>;
    },
  };
});

// Mock UserContext
const mockUser = {
  id: '123',
  displayName: 'John Doe',
  email: 'john@example.com',
  phoneNumber: '+1234567890',
  bio: 'Test bio',
  dateOfBirth: '1990-01-01',
};

const mockSetUser = jest.fn();

jest.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: mockUser,
    setUser: mockSetUser,
  }),
}));

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

// Helper function to render UpdateProfileScreen with proper context
const renderUpdateProfileScreen = () => {
  return render(
    <TestWrapper>
      <UpdateProfileScreen />
    </TestWrapper>
  );
};

describe('UpdateProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockGoBack.mockClear();
  });

  describe('Rendering', () => {
    it('renders all form fields', () => {
      const { getByTestId } = renderUpdateProfileScreen();
      
      expect(getByTestId('input-displayName')).toBeTruthy();
      expect(getByTestId('input-email')).toBeTruthy();
      expect(getByTestId('input-phone')).toBeTruthy();
      expect(getByTestId('input-bio')).toBeTruthy();
      expect(getByTestId('input-dateOfBirth')).toBeTruthy();
      expect(getByTestId('save-button')).toBeTruthy();
      expect(getByTestId('cancel-button')).toBeTruthy();
    });

    it('pre-fills form fields with user data', () => {
      const { getByTestId } = renderUpdateProfileScreen();
      
      expect(getByTestId('input-displayName')).toHaveProp('value', 'John Doe');
      expect(getByTestId('input-email')).toHaveProp('value', 'john@example.com');
      expect(getByTestId('input-phone')).toHaveProp('value', '+1234567890');
      expect(getByTestId('input-bio')).toHaveProp('value', 'Test bio');
      expect(getByTestId('input-dateOfBirth')).toHaveProp('value', '1990-01-01');
    });

    it('renders email field as read-only', () => {
      const { getByTestId } = renderUpdateProfileScreen();
      
      expect(getByTestId('input-email')).toHaveProp('editable', false);
    });
  });

  describe('Form Interactions', () => {
    it('updates form fields when user types', () => {
      const { getByTestId } = renderUpdateProfileScreen();
      
      fireEvent.changeText(getByTestId('input-displayName'), 'Updated Name');
      fireEvent.changeText(getByTestId('input-phone'), '+1987654321');
      fireEvent.changeText(getByTestId('input-bio'), 'Updated Bio');
      
      expect(getByTestId('input-displayName')).toHaveProp('value', 'Updated Name');
      expect(getByTestId('input-phone')).toHaveProp('value', '+1987654321');
      expect(getByTestId('input-bio')).toHaveProp('value', 'Updated Bio');
    });
  });

  describe('Form Submission', () => {
    it('submits form with updated data', async () => {
      const { authService } = require('@/services/authService');
      (authService.updateUserProfile as jest.Mock).mockResolvedValue({ success: true });
      
      const { getByTestId } = renderUpdateProfileScreen();
      
      fireEvent.changeText(getByTestId('input-displayName'), 'Updated Name');
      fireEvent.changeText(getByTestId('input-phone'), '+1987654321');
      fireEvent.changeText(getByTestId('input-bio'), 'Updated Bio');
      
      fireEvent.press(getByTestId('save-button'));
      
      await waitFor(() => {
        expect(authService.updateUserProfile).toHaveBeenCalledWith({
          displayName: 'Updated Name',
          phoneNumber: '+1987654321',
          bio: 'Updated Bio',
          dateOfBirth: '1990-01-01',
        });
      });
    });

    it('shows loading state during submission', async () => {
      const { authService } = require('@/services/authService');
      
      let resolveUpdate: (value: any) => void;
      const updatePromise = new Promise((resolve) => {
        resolveUpdate = resolve;
      });
      
      (authService.updateUserProfile as jest.Mock).mockImplementation(() => updatePromise);
      
      const { getByTestId, queryByTestId } = renderUpdateProfileScreen();
      
      fireEvent.press(getByTestId('save-button'));
      
      expect(queryByTestId('loading-overlay')).toBeTruthy();
      
      await act(async () => {
        resolveUpdate({ success: true });
      });
      
      expect(queryByTestId('loading-overlay')).toBeNull();
    });

    it('handles update errors gracefully', async () => {
      const { authService } = require('@/services/authService');
      
      (authService.updateUserProfile as jest.Mock).mockRejectedValue(new Error('Update failed'));
      
      const { getByTestId } = renderUpdateProfileScreen();
      
      fireEvent.press(getByTestId('save-button'));
      
      await waitFor(() => {
        // Alert should be called on error
        expect(require('react-native').Alert.alert).toHaveBeenCalled();
      });
    });

    it('disables save button during loading', async () => {
      const { authService } = require('@/services/authService');
      
      let resolveUpdate: (value: any) => void;
      const updatePromise = new Promise((resolve) => {
        resolveUpdate = resolve;
      });
      
      (authService.updateUserProfile as jest.Mock).mockImplementation(() => updatePromise);
      
      const { getByTestId } = renderUpdateProfileScreen();
      
      const saveButton = getByTestId('save-button');
      
      fireEvent.press(saveButton);
      
      // Check for disabled prop instead of toBeDisabled()
      expect(saveButton).toHaveProp('disabled', true);
      
      await act(async () => {
        resolveUpdate({ success: true });
      });
      
      expect(saveButton).toHaveProp('disabled', false);
    });
  });

  describe('Navigation', () => {
    it('navigates back when cancel is pressed', () => {
      const { getByTestId } = renderUpdateProfileScreen();
      
      const cancelButton = getByTestId('cancel-button');
      fireEvent.press(cancelButton);
      
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty form fields by allowing submission', async () => {
      const { authService } = require('@/services/authService');
      (authService.updateUserProfile as jest.Mock).mockResolvedValueOnce({ success: true });
      
      const { getByTestId, queryByText } = renderUpdateProfileScreen();
      
      // First, ensure the display name has a value to pass validation
      fireEvent.changeText(getByTestId('input-displayName'), 'Test User');
      
      // Update other fields to empty values
      fireEvent.changeText(getByTestId('input-bio'), '');
      
      // Update phone field to ensure we have valid data
      fireEvent.changeText(getByTestId('input-phone'), '+9876543210');
      
      // Update date of birth to ensure we have valid data
      fireEvent.changeText(getByTestId('input-dateOfBirth'), '1990-01-01');
      
      // Wait for any async operations to complete
      await act(async () => {
        fireEvent.press(getByTestId('save-button'));
      });
      
      // The component should handle empty values gracefully
      await waitFor(() => {
        expect(authService.updateUserProfile).toHaveBeenCalledWith({
          displayName: 'Test User',
          phoneNumber: '+9876543210',
          bio: '',
          dateOfBirth: '1990-01-01',
        });
      });
      
      // Verify no validation errors are shown
      expect(queryByText(/display name is required/i)).toBeNull();
    });

    it('handles special characters in bio', async () => {
      const { authService } = require('@/services/authService');
      (authService.updateUserProfile as jest.Mock).mockResolvedValue({ success: true });
      
      const { getByTestId } = renderUpdateProfileScreen();
      
      const specialBio = 'Bio with @#$%^&*()_+ special chars!';
      fireEvent.changeText(getByTestId('input-bio'), specialBio);
      
      fireEvent.press(getByTestId('save-button'));
      
      await waitFor(() => {
        expect(authService.updateUserProfile).toHaveBeenCalledWith({
          displayName: 'John Doe',
          phoneNumber: '+1234567890',
          bio: specialBio,
          dateOfBirth: '1990-01-01',
        });
      });
    });
  });
});
