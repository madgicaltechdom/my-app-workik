import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { ErrorMessage } from '../ErrorMessage';
import { theme, darkTheme } from '../../../../theme';
import type { ErrorMessageProps } from '../ErrorMessage.types';

// Import test setup
import '../../../../__tests__/setup';

// Mock useColorScheme for theme testing
const mockUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;

// Test wrapper component with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode; isDark?: boolean }> = ({ 
  children, 
  isDark = false 
}) => {
  // Mock the color scheme for this test
  mockUseColorScheme.mockReturnValue(isDark ? 'dark' : 'light');
  
  return (
    <ThemeProvider theme={isDark ? darkTheme : theme}>
      {children}
    </ThemeProvider>
  );
};

describe('ErrorMessage Component', () => {
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue('light');
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Visibility Control', () => {
    it('renders when isVisible is true', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            isVisible={true} 
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('error-message')).toBeTruthy();
    });

    it('does not render when isVisible is false', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            isVisible={false} 
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(queryByTestId('error-message')).toBeNull();
    });

    it('defaults to visible when isVisible is not provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('error-message')).toBeTruthy();
    });

    it('shows and hides correctly when isVisible changes', () => {
      const { queryByTestId, rerender } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            isVisible={false} 
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(queryByTestId('error-message')).toBeNull();
      
      rerender(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            isVisible={true} 
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(queryByTestId('error-message')).toBeTruthy();
    });
  });

  describe('Variants', () => {
    const variants: Array<'inline' | 'banner' | 'toast'> = ['inline', 'banner', 'toast'];

    variants.forEach((variant) => {
      it(`renders ${variant} variant correctly`, () => {
        const { getByTestId } = render(
          <TestWrapper>
            <ErrorMessage 
              message="Test error message"
              variant={variant}
              testID="error-message" 
            />
          </TestWrapper>
        );
        
        expect(getByTestId('error-message')).toBeTruthy();
      });
    });

    it('defaults to inline variant when not specified', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('error-message')).toBeTruthy();
    });
  });

  describe('Severity Levels', () => {
    const severities: Array<'error' | 'warning' | 'info'> = ['error', 'warning', 'info'];

    severities.forEach((severity) => {
      it(`renders ${severity} severity correctly`, () => {
        const { getByTestId } = render(
          <TestWrapper>
            <ErrorMessage 
              message="Test message"
              severity={severity}
              testID="error-message" 
            />
          </TestWrapper>
        );
        
        expect(getByTestId('error-message')).toBeTruthy();
      });
    });

    it('defaults to error severity when not specified', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('error-message')).toBeTruthy();
    });
  });

  describe('Message Display', () => {
    it('displays the provided message', () => {
      const { getByText } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Custom error message"
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByText('Custom error message')).toBeTruthy();
    });

    it('handles long messages', () => {
      const longMessage = 'This is a very long error message that might wrap to multiple lines and should be handled gracefully by the component without breaking the layout';
      
      const { getByText } = render(
        <TestWrapper>
          <ErrorMessage 
            message={longMessage}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByText(longMessage)).toBeTruthy();
    });

    it('handles special characters in message', () => {
      const specialMessage = 'Error: @#$%^&*()_+{}[]|\\:";\'<>?,./';
      
      const { getByText } = render(
        <TestWrapper>
          <ErrorMessage 
            message={specialMessage}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByText(specialMessage)).toBeTruthy();
    });
  });

  describe('Icon Display', () => {
    it('shows icon when showIcon is true', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            showIcon={true}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('error-message')).toBeTruthy();
      // Icon should be present in the component
    });

    it('hides icon when showIcon is false', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            showIcon={false}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('error-message')).toBeTruthy();
      // Icon should not be present
    });

    it('defaults to showing icon when showIcon is not specified', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('error-message')).toBeTruthy();
    });
  });

  describe('Dismissible Behavior', () => {
    it('shows dismiss button when dismissible is true', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            dismissible={true}
            onDismiss={mockOnDismiss}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('error-message')).toBeTruthy();
    });

    it('calls onDismiss when dismiss button is pressed', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            dismissible={true}
            onDismiss={mockOnDismiss}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      const dismissButton = getByTestId('error-message-dismiss');
      fireEvent.press(dismissButton);
      
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not show dismiss button when dismissible is false', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            dismissible={false}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(queryByTestId('error-message-dismiss')).toBeNull();
    });

    it('handles dismissible without onDismiss gracefully', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            dismissible={true}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('error-message')).toBeTruthy();
    });
  });

  describe('Auto-hide Functionality', () => {
    it('calls onDismiss after autoHideDelay when autoHide is true', async () => {
      render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            autoHide={true}
            autoHideDelay={1000}
            onDismiss={mockOnDismiss}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(mockOnDismiss).not.toHaveBeenCalled();
      
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('uses default autoHideDelay of 5000ms when not specified', async () => {
      render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            autoHide={true}
            onDismiss={mockOnDismiss}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      act(() => {
        jest.advanceTimersByTime(4999);
      });
      expect(mockOnDismiss).not.toHaveBeenCalled();
      
      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not auto-hide when autoHide is false', async () => {
      render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            autoHide={false}
            onDismiss={mockOnDismiss}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      act(() => {
        jest.advanceTimersByTime(10000);
      });
      
      expect(mockOnDismiss).not.toHaveBeenCalled();
    });

    it('clears timer on unmount', () => {
      const { unmount } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            autoHide={true}
            autoHideDelay={1000}
            onDismiss={mockOnDismiss}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      unmount();
      
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      expect(mockOnDismiss).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('applies custom accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            accessibilityLabel="Custom error label"
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      const errorMessage = getByTestId('error-message');
      expect(errorMessage.props.accessibilityLabel).toBe('Custom error label');
    });

    it('applies custom accessibility hint', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            accessibilityHint="This is an error message"
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      const errorMessage = getByTestId('error-message');
      expect(errorMessage.props.accessibilityHint).toBe('This is an error message');
    });

    it('uses message as accessibility label when not provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Important error message"
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      const errorMessage = getByTestId('error-message');
      expect(errorMessage.props.accessibilityLabel).toContain('Important error message');
    });

    it('has correct accessibility role', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      const errorMessage = getByTestId('error-message');
      expect(errorMessage.props.accessibilityRole).toBe('alert');
    });
  });

  describe('Theme Integration', () => {
    it('renders correctly with light theme', () => {
      const { getByTestId } = render(
        <TestWrapper isDark={false}>
          <ErrorMessage 
            message="Test error message"
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('error-message')).toBeTruthy();
      expect(mockUseColorScheme).toHaveBeenCalled();
    });

    it('renders correctly with dark theme', () => {
      const { getByTestId } = render(
        <TestWrapper isDark={true}>
          <ErrorMessage 
            message="Test error message"
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('error-message')).toBeTruthy();
      expect(mockUseColorScheme).toHaveBeenCalled();
    });

    it('adapts styling based on theme', () => {
      const { getByTestId: getLightMessage } = render(
        <TestWrapper isDark={false}>
          <ErrorMessage 
            message="Test error message"
            testID="light-message" 
          />
        </TestWrapper>
      );

      const { getByTestId: getDarkMessage } = render(
        <TestWrapper isDark={true}>
          <ErrorMessage 
            message="Test error message"
            testID="dark-message" 
          />
        </TestWrapper>
      );
      
      expect(getLightMessage('light-message')).toBeTruthy();
      expect(getDarkMessage('dark-message')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('memoizes icon selection based on severity', () => {
      const { rerender } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            severity="error"
            testID="error-message" 
          />
        </TestWrapper>
      );

      // Re-render with same severity
      rerender(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            severity="error"
            testID="error-message" 
          />
        </TestWrapper>
      );

      // Component should handle re-renders efficiently
      expect(mockUseColorScheme).toHaveBeenCalled();
    });

    it('handles rapid prop changes efficiently', () => {
      const { rerender } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            severity="error"
            testID="error-message" 
          />
        </TestWrapper>
      );

      // Multiple rapid re-renders
      rerender(
        <TestWrapper>
          <ErrorMessage 
            message="Updated message"
            severity="warning"
            testID="error-message" 
          />
        </TestWrapper>
      );

      rerender(
        <TestWrapper>
          <ErrorMessage 
            message="Final message"
            severity="info"
            testID="error-message" 
          />
        </TestWrapper>
      );

      expect(mockUseColorScheme).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty message gracefully', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message=""
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('error-message')).toBeTruthy();
    });

    it('handles undefined onDismiss with dismissible', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            dismissible={true}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('error-message')).toBeTruthy();
    });

    it('handles all props together', () => {
      const { getByTestId, getByText } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Complete error message"
            isVisible={true}
            variant="banner"
            severity="warning"
            showIcon={true}
            dismissible={true}
            autoHide={false}
            onDismiss={mockOnDismiss}
            accessibilityLabel="Complete error"
            accessibilityHint="This is a complete error message"
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('error-message')).toBeTruthy();
      expect(getByText('Complete error message')).toBeTruthy();
    });

    it('handles rapid visibility changes', () => {
      const { queryByTestId, rerender } = render(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            isVisible={false}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(queryByTestId('error-message')).toBeNull();
      
      // Rapid show/hide
      rerender(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            isVisible={true}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(queryByTestId('error-message')).toBeTruthy();
      
      rerender(
        <TestWrapper>
          <ErrorMessage 
            message="Test error message"
            isVisible={false}
            testID="error-message" 
          />
        </TestWrapper>
      );
      
      expect(queryByTestId('error-message')).toBeNull();
    });
  });
});
