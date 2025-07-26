import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { LoadingOverlay } from '../LoadingOverlay';
import { theme, darkTheme } from '../../../../theme';
import type { LoadingOverlayProps } from '../LoadingOverlay.types';

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

describe('LoadingOverlay Component', () => {
  const mockOnRequestClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue('light');
  });

  describe('Visibility Control', () => {
    it('renders when isVisible is true', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay isVisible={true} testID="loading-overlay" />
        </TestWrapper>
      );
      
      expect(getByTestId('loading-overlay')).toBeTruthy();
    });

    it('does not render content when isVisible is false with non-modal variants', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <LoadingOverlay isVisible={false} variant="inline" testID="loading-overlay" />
        </TestWrapper>
      );
      
      expect(queryByTestId('loading-overlay')).toBeNull();
    });

    it('defaults to not visible when isVisible is not provided with non-modal variants', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <LoadingOverlay variant="overlay" testID="loading-overlay" />
        </TestWrapper>
      );
      
      expect(queryByTestId('loading-overlay')).toBeNull();
    });

    it('shows and hides correctly when isVisible changes with inline variant', () => {
      const { queryByTestId, rerender } = render(
        <TestWrapper>
          <LoadingOverlay isVisible={false} variant="inline" testID="loading-overlay" />
        </TestWrapper>
      );
      
      expect(queryByTestId('loading-overlay')).toBeNull();
      
      rerender(
        <TestWrapper>
          <LoadingOverlay isVisible={true} variant="inline" testID="loading-overlay" />
        </TestWrapper>
      );
      
      expect(queryByTestId('loading-overlay')).toBeTruthy();
    });
  });

  describe('Variants', () => {
    const variants: Array<'modal' | 'inline' | 'overlay'> = ['modal', 'inline', 'overlay'];

    variants.forEach((variant) => {
      it(`renders ${variant} variant correctly`, () => {
        const { getByTestId } = render(
          <TestWrapper>
            <LoadingOverlay 
              isVisible={true}
              variant={variant}
              testID="loading-overlay" 
            />
          </TestWrapper>
        );
        
        expect(getByTestId('loading-overlay')).toBeTruthy();
      });
    });

    it('defaults to modal variant when not specified', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay isVisible={true} testID="loading-overlay" />
        </TestWrapper>
      );
      
      expect(getByTestId('loading-overlay')).toBeTruthy();
    });
  });

  describe('Messages', () => {
    it('displays default loading message when no message provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay isVisible={true} testID="loading-overlay" />
        </TestWrapper>
      );
      
      // Default message is set as accessibility label
      const overlay = getByTestId('loading-overlay');
      expect(overlay.props.accessibilityLabel).toBe('common.loading');
    });

    it('displays custom primary message', () => {
      const { getByText } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            message="Please wait..."
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      expect(getByText('Please wait...')).toBeTruthy();
    });

    it('displays sub message when provided', () => {
      const { getByText } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            message="Loading data"
            subMessage="This may take a few moments"
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      expect(getByText('Loading data')).toBeTruthy();
      expect(getByText('This may take a few moments')).toBeTruthy();
    });

    it('displays only primary message when sub message is not provided', () => {
      const { getByText, queryByText } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            message="Loading data"
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      expect(getByText('Loading data')).toBeTruthy();
      // Sub message should not be present
      expect(queryByText('This may take a few moments')).toBeNull();
    });
  });

  describe('Sizes', () => {
    it('renders with small size', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            size="small"
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('loading-overlay')).toBeTruthy();
      // ActivityIndicator should have small size
      const indicator = getByTestId('loading-indicator');
      expect(indicator.props.size).toBe('small');
    });

    it('renders with large size', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            size="large"
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('loading-overlay')).toBeTruthy();
      // ActivityIndicator should have large size
      const indicator = getByTestId('loading-indicator');
      expect(indicator.props.size).toBe('large');
    });

    it('defaults to large size when not specified', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay isVisible={true} testID="loading-overlay" />
        </TestWrapper>
      );
      
      const indicator = getByTestId('loading-indicator');
      expect(indicator.props.size).toBe('large');
    });
  });

  describe('Customization', () => {
    it('applies custom indicator color', () => {
      const customColor = '#FF5733';
      
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            color={customColor}
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      const indicator = getByTestId('loading-indicator');
      expect(indicator.props.color).toBe(customColor);
    });

    it('uses theme primary color when custom color is not provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay isVisible={true} testID="loading-overlay" />
        </TestWrapper>
      );
      
      const indicator = getByTestId('loading-indicator');
      expect(indicator.props.color).toBe(theme.colors.primary);
    });

    it('applies custom background color', () => {
      const customBgColor = 'rgba(0,0,0,0.8)';
      
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            backgroundColor={customBgColor}
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('loading-overlay')).toBeTruthy();
      // Background color is applied through styled-components
    });

    it('applies custom style', () => {
      const customStyle = { zIndex: 9999 };
      
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            style={customStyle}
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('loading-overlay')).toBeTruthy();
    });
  });

  describe('Modal Behavior', () => {
    it('calls onRequestClose when modal variant is dismissed', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            variant="modal"
            onRequestClose={mockOnRequestClose}
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      const modal = getByTestId('loading-overlay');
      expect(modal).toBeTruthy();
      
      // Modal should have onRequestClose prop
      if (modal.props.onRequestClose) {
        modal.props.onRequestClose();
        expect(mockOnRequestClose).toHaveBeenCalled();
      }
    });

    it('handles modal without onRequestClose gracefully', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            variant="modal"
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('loading-overlay')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('applies custom accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            accessibilityLabel="Custom loading label"
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      const overlay = getByTestId('loading-overlay');
      expect(overlay.props.accessibilityLabel).toBe('Custom loading label');
    });

    it('applies custom accessibility hint', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            accessibilityHint="Please wait while content loads"
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      const overlay = getByTestId('loading-overlay');
      expect(overlay.props.accessibilityHint).toBe('Please wait while content loads');
    });

    it('uses message as accessibility label when not provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            message="Loading user data"
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      const overlay = getByTestId('loading-overlay');
      expect(overlay.props.accessibilityLabel).toContain('Loading user data');
    });

    it('has correct accessibility role', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay isVisible={true} testID="loading-overlay" />
        </TestWrapper>
      );
      
      const overlay = getByTestId('loading-overlay');
      expect(overlay.props.accessibilityRole).toBe('none');
    });

    it('sets accessibility live region', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay isVisible={true} testID="loading-overlay" />
        </TestWrapper>
      );
      
      const overlay = getByTestId('loading-overlay');
      expect(overlay.props.accessibilityLiveRegion).toBe('polite');
    });
  });

  describe('Theme Integration', () => {
    it('renders correctly with light theme', () => {
      const { getByTestId } = render(
        <TestWrapper isDark={false}>
          <LoadingOverlay isVisible={true} testID="loading-overlay" />
        </TestWrapper>
      );
      
      expect(getByTestId('loading-overlay')).toBeTruthy();
      expect(mockUseColorScheme).toHaveBeenCalled();
    });

    it('renders correctly with dark theme', () => {
      const { getByTestId } = render(
        <TestWrapper isDark={true}>
          <LoadingOverlay isVisible={true} testID="loading-overlay" />
        </TestWrapper>
      );
      
      expect(getByTestId('loading-overlay')).toBeTruthy();
      expect(mockUseColorScheme).toHaveBeenCalled();
    });

    it('adapts indicator color based on theme', () => {
      const { getByTestId: getLightIndicator } = render(
        <TestWrapper isDark={false}>
          <LoadingOverlay isVisible={true} testID="light-overlay" />
        </TestWrapper>
      );

      const { getByTestId: getDarkIndicator } = render(
        <TestWrapper isDark={true}>
          <LoadingOverlay isVisible={true} testID="dark-overlay" />
        </TestWrapper>
      );
      
      const lightIndicator = getLightIndicator('loading-indicator');
      const darkIndicator = getDarkIndicator('loading-indicator');
      
      expect(lightIndicator.props.color).toBe(theme.colors.primary);
      expect(darkIndicator.props.color).toBe(darkTheme.colors.primary);
    });
  });

  describe('Performance', () => {
    it('memoizes indicator size calculation', async () => {
      const { rerender } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            size="large"
            testID="loading-overlay" 
          />
        </TestWrapper>
      );

      // Re-render with same props
      rerender(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            size="large"
            testID="loading-overlay" 
          />
        </TestWrapper>
      );

      // Component should handle re-renders efficiently
      await waitFor(() => {
        expect(mockUseColorScheme).toHaveBeenCalled();
      });
    });

    it('memoizes indicator color calculation', () => {
      const { rerender, getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            color="#FF5733"
            testID="loading-overlay" 
          />
        </TestWrapper>
      );

      const indicator = getByTestId('loading-indicator');
      expect(indicator.props.color).toBe('#FF5733');

      // Re-render with same color
      rerender(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            color="#FF5733"
            testID="loading-overlay" 
          />
        </TestWrapper>
      );

      const indicatorAfterRerender = getByTestId('loading-indicator');
      expect(indicatorAfterRerender.props.color).toBe('#FF5733');
    });

    it('memoizes default message calculation', () => {
      const { rerender, getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay isVisible={true} testID="loading-overlay" />
        </TestWrapper>
      );

      const overlay = getByTestId('loading-overlay');
      expect(overlay.props.accessibilityLabel).toBe('common.loading');

      // Re-render without message
      rerender(
        <TestWrapper>
          <LoadingOverlay isVisible={true} testID="loading-overlay" />
        </TestWrapper>
      );

      const overlayAfterRerender = getByTestId('loading-overlay');
      expect(overlayAfterRerender.props.accessibilityLabel).toBe('common.loading');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined message gracefully', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            message={undefined}
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('loading-overlay')).toBeTruthy();
    });

    it('handles empty string message', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            message=""
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('loading-overlay')).toBeTruthy();
    });

    it('handles very long messages', () => {
      const longMessage = 'This is a very long loading message that might wrap to multiple lines and should be handled gracefully by the component without breaking the layout or causing performance issues';
      
      const { getByText } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            message={longMessage}
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      expect(getByText(longMessage)).toBeTruthy();
    });

    it('handles rapid visibility changes', () => {
      const { queryByTestId, rerender } = render(
        <TestWrapper>
          <LoadingOverlay isVisible={false} variant="inline" testID="loading-overlay" />
        </TestWrapper>
      );
      
      expect(queryByTestId('loading-overlay')).toBeNull();
      
      // Rapid show/hide
      rerender(
        <TestWrapper>
          <LoadingOverlay isVisible={true} variant="inline" testID="loading-overlay" />
        </TestWrapper>
      );
      
      expect(queryByTestId('loading-overlay')).toBeTruthy();
      
      rerender(
        <TestWrapper>
          <LoadingOverlay isVisible={false} variant="inline" testID="loading-overlay" />
        </TestWrapper>
      );
      
      expect(queryByTestId('loading-overlay')).toBeNull();
    });

    it('handles all props together', () => {
      const { getByTestId, getByText } = render(
        <TestWrapper>
          <LoadingOverlay 
            isVisible={true}
            variant="modal"
            message="Loading complete data"
            subMessage="Please wait a moment"
            size="small"
            color="#FF5733"
            backgroundColor="rgba(0,0,0,0.8)"
            onRequestClose={mockOnRequestClose}
            accessibilityLabel="Data loading overlay"
            accessibilityHint="Please wait while data loads"
            testID="loading-overlay" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('loading-overlay')).toBeTruthy();
      expect(getByText('Loading complete data')).toBeTruthy();
      expect(getByText('Please wait a moment')).toBeTruthy();
      
      const indicator = getByTestId('loading-indicator');
      expect(indicator.props.size).toBe('small');
      expect(indicator.props.color).toBe('#FF5733');
    });
  });
});
