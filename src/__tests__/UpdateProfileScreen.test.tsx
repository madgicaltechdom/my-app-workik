import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { lightTheme } from '../theme';
import { UpdateProfileScreen } from '../features/profile/screens/UpdateProfileScreen';
import { UserProvider } from '../contexts/UserContext';
import { authService } from '../services/authService';

// Mock the authService
jest.mock('../services/authService');

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigation: any = {
  goBack: mockGoBack,
};

// Mock user data
const mockUser = {
  uid: 'test-uid',
  displayName: 'Test User',
  email: 'test@example.com',
  phoneNumber: '1234567890',
  bio: 'Test bio',
  dateOfBirth: '1990-01-01',
};

describe('UpdateProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <ThemeProvider theme={lightTheme}>
        <UserProvider>
          <UpdateProfileScreen navigation={mockNavigation} />
        </UserProvider>
      </ThemeProvider>
    );
  };

  it('renders correctly with user data', () => {
    const { getByDisplayValue, getByText } = renderComponent();
    
    // Check if input fields contain user data
    expect(getByDisplayValue(mockUser.displayName)).toBeTruthy();
    expect(getByDisplayValue(mockUser.email)).toBeTruthy();
    expect(getByDisplayValue(mockUser.phoneNumber)).toBeTruthy();
    expect(getByDisplayValue(mockUser.bio)).toBeTruthy();
    expect(getByDisplayValue(mockUser.dateOfBirth)).toBeTruthy();
    
    // Check if buttons are rendered
    expect(getByText('Save Changes')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('validates form fields', async () => {
    const { getByText, getByTestId } = renderComponent();
    
    // Clear the display name field
    const displayNameInput = getByTestId('input-displayName');
    fireEvent.changeText(displayNameInput, '');
    
    // Submit the form
    fireEvent.press(getByText('Save Changes'));
    
    // Check for validation error
    await waitFor(() => {
      expect(getByText('Display name is required')).toBeTruthy();
    });
  });

  it('submits the form with updated data', async () => {
    const updatedData = {
      displayName: 'Updated Name',
      phone: '0987654321',
      bio: 'Updated bio',
      dateOfBirth: '1995-01-01',
    };
    
    // Mock successful update
    (authService.updateUserProfile as jest.Mock).mockResolvedValueOnce({ success: true });
    
    const { getByText, getByTestId } = renderComponent();
    
    // Update form fields
    fireEvent.changeText(getByTestId('input-displayName'), updatedData.displayName);
    fireEvent.changeText(getByTestId('input-phone'), updatedData.phone);
    fireEvent.changeText(getByTestId('input-bio'), updatedData.bio);
    fireEvent.changeText(getByTestId('input-dateOfBirth'), updatedData.dateOfBirth);
    
    // Submit the form
    fireEvent.press(getByText('Save Changes'));
    
    // Check if update was called with correct data
    await waitFor(() => {
      expect(authService.updateUserProfile).toHaveBeenCalledWith({
        displayName: updatedData.displayName,
        phoneNumber: updatedData.phone,
        bio: updatedData.bio,
        dateOfBirth: updatedData.dateOfBirth,
      });
    });
    
    // Check if navigation.goBack was called after successful update
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('handles update error', async () => {
    const errorMessage = 'Update failed';
    
    // Mock failed update
    (authService.updateUserProfile as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: errorMessage,
    });
    
    const { getByText } = renderComponent();
    
    // Submit the form
    fireEvent.press(getByText('Save Changes'));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(getByText(errorMessage)).toBeTruthy();
    });
  });

  it('cancels the update', () => {
    const { getByText } = renderComponent();
    
    // Click cancel button
    fireEvent.press(getByText('Cancel'));
    
    // Check if navigation.goBack was called
    expect(mockGoBack).toHaveBeenCalled();
  });
});
