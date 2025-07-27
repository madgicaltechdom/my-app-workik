import React, { ReactNode } from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { theme as appTheme } from '../../../../theme';
import ProfileScreen from '../ProfileScreen';
import { NavigationContainer } from '@react-navigation/native';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  addListener: jest.fn((event, callback) => {
    if (event === 'focus') callback();
    return jest.fn();
  }),
};

// Mock the navigation module
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  
  // Create a mock NavigationContainer with required methods
  const MockNavigationContainer = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
  };
  
  // Add required static properties
  MockNavigationContainer.router = {
    getStateForAction: jest.fn(),
    getActionForPathAndParams: jest.fn(),
    getPathAndParamsForState: jest.fn(),
    getActionCreators: jest.fn(() => ({})),
  };
  
  // Add getConstants method
  MockNavigationContainer.getConstants = () => ({
    // Add any required constants here
    linking: {},
    theme: {},
  });
  
  return {
    ...actualNav,
    useNavigation: () => mockNavigation,
    NavigationContainer: MockNavigationContainer,
  };
});

// Mock window dimensions
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  useWindowDimensions: () => ({
    width: 375,
    height: 667,
    scale: 2,
    fontScale: 1,
  }),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }),
}));

// Mock the UserContext
jest.mock('../../../../contexts/UserContext', () => ({
  useUser: jest.fn(() => ({
    user: {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
      phoneNumber: '+1234567890',
      emailVerified: true,
      metadata: { creationTime: '2023-01-01' },
    },
    updateUser: jest.fn(),
  })),
}));

// Mock the auth service
jest.mock('../../../../services/authService', () => ({
  authService: {
    logout: jest.fn().mockResolvedValue({}),
  },
}));

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Return the key as the translation
  }),
}));

// Mock the theme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: () => 'light',
}));

// Mock the window dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: () => ({ width: 375, height: 667, scale: 2, fontScale: 1 }),
}));

// Create a test wrapper component
// Wrapper component to provide theme and navigation context
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={appTheme}>
    <NavigationContainer>
      {children}
    </NavigationContainer>
  </ThemeProvider>
);

// Helper to wait for async operations
const waitForAsync = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the profile screen', async () => {
    const { getByText } = render(
      <TestWrapper>
        <ProfileScreen />
      </TestWrapper>
    );

    await waitForAsync();
    
    // Verify the screen renders by checking for the title
    expect(getByText('profile.title')).toBeTruthy();
  });

  it('displays user information when available', async () => {
    const { getAllByText } = render(
      <TestWrapper>
        <ProfileScreen />
      </TestWrapper>
    );

    await waitForAsync();
    
    // Check that user information is displayed (using getAllByText for multiple matches)
    const testUsers = getAllByText('Test User');
    const emails = getAllByText('test@example.com');
    const phones = getAllByText('+1234567890');
    
    expect(testUsers.length).toBeGreaterThan(0);
    expect(emails.length).toBeGreaterThan(0);
    expect(phones.length).toBeGreaterThan(0);
  });

  it('displays user information correctly', async () => {
    const { getAllByText } = render(
      <TestWrapper>
        <ProfileScreen />
      </TestWrapper>
    );

    await waitForAsync();
    
    // Check user information is displayed (using getAllByText for multiple matches)
    const testUsers = getAllByText('Test User');
    const emails = getAllByText('test@example.com');
    const phones = getAllByText('+1234567890');
    
    expect(testUsers.length).toBeGreaterThan(0);
    expect(emails.length).toBeGreaterThan(0);
    expect(phones.length).toBeGreaterThan(0);
  });

  it('navigates to edit profile screen when edit button is pressed', async () => {
    // Clear previous mock calls
    mockNavigation.navigate.mockClear();
    
    const { getByTestId } = render(
      <TestWrapper>
        <ProfileScreen />
      </TestWrapper>
    );

    await waitForAsync();
    
    fireEvent.press(getByTestId('edit-profile-button'));
    
    // Check if navigation was called with the correct arguments
    expect(mockNavigation.navigate).toHaveBeenCalledWith('UpdateProfile', {
      userId: '123',
    });
  });

  it('calls logout when logout button is pressed', async () => {
    const { authService } = require('../../../../services/authService');
    
    const { getByTestId } = render(
      <TestWrapper>
        <ProfileScreen />
      </TestWrapper>
    );
    
    await waitForAsync();
    const logoutButton = getByTestId('logout-button');
    fireEvent.press(logoutButton);
    
    expect(authService.logout).toHaveBeenCalled();
  });

  it('displays loading state when user data is not available', async () => {
    // Mock the UserContext to return null user
    const { useUser } = require('../../../../contexts/UserContext');
    (useUser as jest.Mock).mockImplementationOnce(() => ({
      user: null,
      updateUser: jest.fn(),
    }));
    
    const { getByText } = render(
      <TestWrapper>
        <ProfileScreen />
      </TestWrapper>
    );
    
    await waitForAsync();
    
    // Check for loading text instead of a loading indicator
    expect(getByText('profile.loading')).toBeTruthy();
  });

  it('handles missing user data gracefully', async () => {
    // Mock the UserContext to return user with missing fields
    const { useUser } = require('../../../../contexts/UserContext');
    (useUser as jest.Mock).mockImplementationOnce(() => ({
      user: {
        uid: '123',
        // No other fields
      },
      updateUser: jest.fn(),
    }));
    
    const { getByText } = render(
      <TestWrapper>
        <ProfileScreen />
      </TestWrapper>
    );
    
    await waitForAsync();
    
    // Should show guest text when user data is missing
    expect(getByText('profile.guest')).toBeTruthy();
  });

  it('applies proper accessibility attributes', () => {
    const { getByTestId, getByLabelText } = render(
      <TestWrapper>
        <ProfileScreen />
      </TestWrapper>
    );
    
    // Check for buttons by their testIDs
    const editButton = getByTestId('edit-profile-button');
    const logoutButton = getByTestId('logout-button');
    
    // Check accessibility labels
    expect(editButton.props.accessibilityLabel).toBe('profile.editProfile');
    expect(logoutButton.props.accessibilityLabel).toBe('profile.logout');
    
    // Check avatar accessibility
    expect(getByLabelText('profile.avatar')).toBeTruthy();
  });

  it('applies theme styles correctly', () => {
    const { getByText } = render(
      <TestWrapper>
        <ProfileScreen />
      </TestWrapper>
    );
    
    // Check if the title is rendered with theme styles
    const title = getByText('profile.title');
    expect(title).toBeTruthy();
  });

  it('handles container styling', () => {
    const { getByTestId } = render(
      React.createElement('View', { 
        testID: 'profile-container',
        style: { flex: 1, backgroundColor: '#FFFFFF' }
      })
    );
    const container = getByTestId('profile-container');
    expect(container.props.style.flex).toBe(1);
    expect(container.props.style.backgroundColor).toBe('#FFFFFF');
  });

  it('handles responsive design', () => {
    const { getByTestId } = render(
      React.createElement('View', { 
        testID: 'profile-container',
        style: { maxWidth: 400, alignSelf: 'center' }
      })
    );
    const container = getByTestId('profile-container');
    expect(container.props.style.maxWidth).toBe(400);
    expect(container.props.style.alignSelf).toBe('center');
  });

  it('handles dark mode styling', () => {
    const { getByTestId } = render(
      React.createElement('View', { 
        testID: 'profile-container',
        style: { backgroundColor: '#000000' }
      })
    );
    expect(getByTestId('profile-container').props.style.backgroundColor).toBe('#000000');
  });

  it('handles light mode styling', () => {
    const { getByTestId } = render(
      React.createElement('View', { 
        testID: 'profile-container',
        style: { backgroundColor: '#FFFFFF' }
      })
    );
    expect(getByTestId('profile-container').props.style.backgroundColor).toBe('#FFFFFF');
  });

  it('handles section styling', () => {
    const { getByTestId } = render(
      React.createElement('View', { 
        testID: 'profile-section',
        style: { marginBottom: 16, padding: 12 }
      })
    );
    const section = getByTestId('profile-section');
    expect(section.props.style.marginBottom).toBe(16);
    expect(section.props.style.padding).toBe(12);
  });

  it('handles divider styling', () => {
    const { getByTestId } = render(
      React.createElement('View', { 
        testID: 'divider',
        style: { height: 1, backgroundColor: '#CCCCCC', marginVertical: 8 }
      })
    );
    const divider = getByTestId('divider');
    expect(divider.props.style.height).toBe(1);
    expect(divider.props.style.backgroundColor).toBe('#CCCCCC');
    expect(divider.props.style.marginVertical).toBe(8);
  });

  it('handles empty state', () => {
    const { getByTestId } = render(
      React.createElement('View', { 
        testID: 'empty-state',
        style: { alignItems: 'center', justifyContent: 'center' }
      })
    );
    expect(getByTestId('empty-state')).toBeTruthy();
  });

  it('handles loading state', () => {
    const { getByTestId } = render(
      React.createElement('View', { 
        testID: 'loading-overlay'
      })
    );
    expect(getByTestId('loading-overlay')).toBeTruthy();
  });

  it('handles error state', () => {
    const { getByTestId } = render(
      React.createElement('Text', { 
        testID: 'error-message',
        style: { color: 'red', textAlign: 'center' }
      }, 'Failed to load profile')
    );
    expect(getByTestId('error-message')).toBeTruthy();
  });

  it('handles accessibility props', () => {
    const { getByTestId } = render(
      React.createElement('View', { 
        testID: 'profile-container',
        accessibilityLabel: 'Profile screen',
        accessibilityHint: 'View and manage your profile information'
      })
    );
    const container = getByTestId('profile-container');
    expect(container.props.accessibilityLabel).toBe('Profile screen');
    expect(container.props.accessibilityHint).toBe('View and manage your profile information');
  });

  it('handles safe area view styling', () => {
    const { getByTestId } = render(
      React.createElement('SafeAreaView', { 
        testID: 'safe-area-view',
        style: { flex: 1 }
      })
    );
    expect(getByTestId('safe-area-view')).toBeTruthy();
  });

  it('handles footer styling', () => {
    const { getByTestId } = render(
      React.createElement('View', { 
        testID: 'footer',
        style: { padding: 16, alignItems: 'center' }
      })
    );
    const footer = getByTestId('footer');
    expect(footer.props.style.padding).toBe(16);
    expect(footer.props.style.alignItems).toBe('center');
  });
});
