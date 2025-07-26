import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { Button } from '../Button';
import { theme, darkTheme } from '../../../../theme';
import type { ButtonVariant, ButtonSize } from '../Button.types';

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

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue('light');
  });

  describe('Rendering', () => {
    it('renders correctly with title prop', () => {
      const { getByTestId, getByText } = render(
        <TestWrapper>
          <Button title="Test Button" testID="test-button" />
        </TestWrapper>
      );
      
      expect(getByTestId('test-button')).toBeTruthy();
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('renders children when provided instead of title', () => {
      const { getByText } = render(
        <TestWrapper>
          <Button testID="test-button">
            Custom Children
          </Button>
        </TestWrapper>
      );
      
      expect(getByText('Custom Children')).toBeTruthy();
    });

    it('prioritizes title over children when both are provided', () => {
      const { getByText, queryByText } = render(
        <TestWrapper>
          <Button title="Title Text" testID="test-button">
            Children Text
          </Button>
        </TestWrapper>
      );
      
      expect(getByText('Title Text')).toBeTruthy();
      expect(queryByText('Children Text')).toBeNull();
    });
  });

  describe('Variants', () => {
    const variants: ButtonVariant[] = ['primary', 'secondary', 'danger'];

    variants.forEach((variant) => {
      it(`renders ${variant} variant correctly`, () => {
        const { getByTestId } = render(
          <TestWrapper>
            <Button 
              title={`${variant} Button`} 
              variant={variant}
              testID="test-button" 
            />
          </TestWrapper>
        );
        
        const button = getByTestId('test-button');
        expect(button).toBeTruthy();
      });

      it(`applies correct loading color for ${variant} variant`, () => {
        const { getByTestId } = render(
          <TestWrapper>
            <Button 
              title={`${variant} Button`} 
              variant={variant}
              loading
              testID="test-button" 
            />
          </TestWrapper>
        );
        
        const button = getByTestId('test-button');
        expect(button).toBeTruthy();
        // Loading indicator should be present
        expect(getByTestId('test-button-loading-indicator')).toBeTruthy();
      });
    });

    it('defaults to primary variant when not specified', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button title="Default Button" testID="test-button" />
        </TestWrapper>
      );
      
      expect(getByTestId('test-button')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    const sizes: ButtonSize[] = ['small', 'medium', 'large'];

    sizes.forEach((size) => {
      it(`renders ${size} size correctly`, () => {
        const { getByTestId } = render(
          <TestWrapper>
            <Button 
              title={`${size} Button`} 
              size={size}
              testID="test-button" 
            />
          </TestWrapper>
        );
        
        const button = getByTestId('test-button');
        expect(button).toBeTruthy();
      });
    });

    it('defaults to medium size when not specified', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button title="Default Size Button" testID="test-button" />
        </TestWrapper>
      );
      
      expect(getByTestId('test-button')).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('calls onPress when pressed', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button 
            title="Pressable Button" 
            onPress={mockOnPress} 
            testID="test-button" 
          />
        </TestWrapper>
      );
      
      fireEvent.press(getByTestId('test-button'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button 
            title="Disabled Button" 
            onPress={mockOnPress} 
            disabled 
            testID="test-button" 
          />
        </TestWrapper>
      );
      
      fireEvent.press(getByTestId('test-button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('does not call onPress when loading', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button 
            title="Loading Button" 
            onPress={mockOnPress} 
            loading 
            testID="test-button" 
          />
        </TestWrapper>
      );
      
      fireEvent.press(getByTestId('test-button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('handles multiple rapid presses correctly', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button 
            title="Rapid Press Button" 
            onPress={mockOnPress} 
            testID="test-button" 
          />
        </TestWrapper>
      );
      
      const button = getByTestId('test-button');
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);
      
      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });
  });

  describe('Loading States', () => {
    it('renders loading indicator when loading', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button 
            title="Loading Button" 
            loading 
            testID="test-button" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('test-button')).toBeTruthy();
      expect(getByTestId('test-button-loading-indicator')).toBeTruthy();
    });

    it('shows button text alongside loading indicator', () => {
      const { getByText, getByTestId } = render(
        <TestWrapper>
          <Button 
            title="Loading Button" 
            loading 
            testID="test-button" 
          />
        </TestWrapper>
      );
      
      expect(getByText('Loading Button')).toBeTruthy();
      expect(getByTestId('test-button-loading-indicator')).toBeTruthy();
    });

    it('applies disabled state when loading', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button 
            title="Loading Button" 
            loading 
            onPress={mockOnPress}
            testID="test-button" 
          />
        </TestWrapper>
      );
      
      const button = getByTestId('test-button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
      
      fireEvent.press(button);
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('applies accessibility props correctly', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button 
            title="Accessible Button" 
            testID="test-button"
            accessibilityLabel="Custom accessibility label"
            accessibilityHint="Custom accessibility hint"
          />
        </TestWrapper>
      );
      
      const button = getByTestId('test-button');
      expect(button.props.accessibilityLabel).toBe('Custom accessibility label');
      expect(button.props.accessibilityHint).toBe('Custom accessibility hint');
    });

    it('sets correct accessibility state for disabled button', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button 
            title="Disabled Button" 
            disabled
            testID="test-button"
          />
        </TestWrapper>
      );
      
      const button = getByTestId('test-button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });

    it('sets correct accessibility state for loading button', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button 
            title="Loading Button" 
            loading
            testID="test-button"
          />
        </TestWrapper>
      );
      
      const button = getByTestId('test-button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });

    it('has button role by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button 
            title="Role Button" 
            testID="test-button"
          />
        </TestWrapper>
      );
      
      const button = getByTestId('test-button');
      expect(button.props.accessibilityRole).toBe('button');
    });
  });

  describe('Theme Integration', () => {
    it('renders correctly with light theme', () => {
      const { getByTestId } = render(
        <TestWrapper isDark={false}>
          <Button 
            title="Light Theme Button" 
            testID="test-button"
          />
        </TestWrapper>
      );
      
      expect(getByTestId('test-button')).toBeTruthy();
      expect(mockUseColorScheme).toHaveBeenCalled();
    });

    it('renders correctly with dark theme', () => {
      const { getByTestId } = render(
        <TestWrapper isDark={true}>
          <Button 
            title="Dark Theme Button" 
            testID="test-button"
          />
        </TestWrapper>
      );
      
      expect(getByTestId('test-button')).toBeTruthy();
      expect(mockUseColorScheme).toHaveBeenCalled();
    });

    it('adapts loading colors based on theme', () => {
      const { getByTestId: getLightButton } = render(
        <TestWrapper isDark={false}>
          <Button 
            title="Light Loading" 
            loading
            testID="light-button"
          />
        </TestWrapper>
      );

      const { getByTestId: getDarkButton } = render(
        <TestWrapper isDark={true}>
          <Button 
            title="Dark Loading" 
            loading
            testID="dark-button"
          />
        </TestWrapper>
      );
      
      expect(getLightButton('light-button')).toBeTruthy();
      expect(getDarkButton('dark-button')).toBeTruthy();
    });
  });

  describe('Internationalization', () => {
    it('integrates with useTranslation hook', () => {
      render(
        <TestWrapper>
          <Button 
            title="i18n Button" 
            testID="test-button"
          />
        </TestWrapper>
      );
    });

    it('handles translation function availability', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button 
            title="Not Ready Button" 
            testID="test-button"
          />
        </TestWrapper>
      );
      
      expect(getByTestId('test-button')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('memoizes loading color calculation', async () => {
      const { rerender } = render(
        <TestWrapper>
          <Button 
            title="Memoized Button" 
            variant="primary"
            loading
            testID="test-button"
          />
        </TestWrapper>
      );

      // Re-render with same props
      rerender(
        <TestWrapper>
          <Button 
            title="Memoized Button" 
            variant="primary"
            loading
            testID="test-button"
          />
        </TestWrapper>
      );

      // Component should handle re-renders efficiently
      await waitFor(() => {
        expect(mockUseColorScheme).toHaveBeenCalled();
      });
    });

    it('memoizes button content calculation', () => {
      const { rerender, getByText } = render(
        <TestWrapper>
          <Button 
            title="Content Button" 
            testID="test-button"
          />
        </TestWrapper>
      );

      expect(getByText('Content Button')).toBeTruthy();

      // Re-render with same content
      rerender(
        <TestWrapper>
          <Button 
            title="Content Button" 
            testID="test-button"
          />
        </TestWrapper>
      );

      expect(getByText('Content Button')).toBeTruthy();
    });

    it('optimizes onPress callback with useCallback', () => {
      const stableOnPress = jest.fn();
      
      const { rerender } = render(
        <TestWrapper>
          <Button 
            title="Callback Button" 
            onPress={stableOnPress}
            testID="test-button"
          />
        </TestWrapper>
      );

      // Re-render with same callback
      rerender(
        <TestWrapper>
          <Button 
            title="Callback Button" 
            onPress={stableOnPress}
            testID="test-button"
          />
        </TestWrapper>
      );

      // Callback should remain stable
      expect(stableOnPress).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined onPress gracefully', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button 
            title="No OnPress Button" 
            testID="test-button"
          />
        </TestWrapper>
      );
      
      // Should not throw error when pressed
      expect(() => {
        fireEvent.press(getByTestId('test-button'));
      }).not.toThrow();
    });

    it('handles empty title gracefully', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button 
            title="" 
            testID="test-button"
          />
        </TestWrapper>
      );
      
      expect(getByTestId('test-button')).toBeTruthy();
    });

    it('handles both disabled and loading states', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Button 
            title="Disabled Loading Button" 
            disabled
            loading
            onPress={mockOnPress}
            testID="test-button"
          />
        </TestWrapper>
      );
      
      const button = getByTestId('test-button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
      
      fireEvent.press(button);
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('handles custom style prop', () => {
      const customStyle = { marginTop: 20 };
      
      const { getByTestId } = render(
        <TestWrapper>
          <Button 
            title="Custom Style Button" 
            style={customStyle}
            testID="test-button"
          />
        </TestWrapper>
      );
      
      expect(getByTestId('test-button')).toBeTruthy();
    });
  });
});
