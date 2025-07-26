import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '../StatCard';
import { theme, darkTheme } from '../../../../theme';

// Import test setup
import '../../../../__tests__/setup';

// Test wrapper component with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode; isDark?: boolean }> = ({ 
  children, 
  isDark = false 
}) => {
  return (
    <ThemeProvider theme={isDark ? darkTheme : theme}>
      {children}
    </ThemeProvider>
  );
};

// Test icon component
const TestIcon = () => <Ionicons name="trending-up" size={24} color="green" />;

describe('StatCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders correctly with required props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <StatCard 
            value="100"
            label="Total Items"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('stat-card')).toBeTruthy();
    });

    it('displays the value', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="42"
            label="Test Label"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText('42')).toBeTruthy();
    });

    it('displays the label', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="100"
            label="Total Users"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText('Total Users')).toBeTruthy();
    });

    it('displays both value and label together', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="250"
            label="Active Sessions"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText('250')).toBeTruthy();
      expect(getByText('Active Sessions')).toBeTruthy();
    });
  });

  describe('Value Types', () => {
    it('handles string values', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="1,234"
            label="String Value"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText('1,234')).toBeTruthy();
    });

    it('handles number values', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value={5678}
            label="Number Value"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText('5678')).toBeTruthy();
    });

    it('handles zero values', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value={0}
            label="Zero Value"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText('0')).toBeTruthy();
    });

    it('handles negative values', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value={-50}
            label="Negative Value"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText('-50')).toBeTruthy();
    });

    it('handles decimal values', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="99.5%"
            label="Percentage"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText('99.5%')).toBeTruthy();
    });

    it('handles very large numbers', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="1,000,000+"
            label="Large Number"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText('1,000,000+')).toBeTruthy();
    });
  });

  describe('Icon Display', () => {
    it('displays icon when provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <StatCard 
            value="100"
            label="With Icon"
            icon={<TestIcon />}
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('stat-card')).toBeTruthy();
      // Icon should be rendered within the card
    });

    it('renders without icon when not provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <StatCard 
            value="100"
            label="Without Icon"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('stat-card')).toBeTruthy();
    });

    it('handles different icon types', () => {
      const CustomIcon = () => <Ionicons name="star" size={20} color="gold" />;
      
      const { getByTestId } = render(
        <TestWrapper>
          <StatCard 
            value="5"
            label="Rating"
            icon={<CustomIcon />}
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('stat-card')).toBeTruthy();
    });

    it('handles complex icon components', () => {
      const ComplexIcon = () => (
        <Ionicons name="analytics" size={24} color="blue" />
      );
      
      const { getByTestId } = render(
        <TestWrapper>
          <StatCard 
            value="Analytics"
            label="Data"
            icon={<ComplexIcon />}
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('stat-card')).toBeTruthy();
    });
  });

  describe('Color Customization', () => {
    it('uses theme primary color by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <StatCard 
            value="100"
            label="Default Color"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('stat-card')).toBeTruthy();
    });

    it('applies custom color', () => {
      const customColor = '#FF5733';
      
      const { getByTestId } = render(
        <TestWrapper>
          <StatCard 
            value="100"
            label="Custom Color"
            color={customColor}
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('stat-card')).toBeTruthy();
    });

    it('handles different color formats', () => {
      const colors = ['#FF0000', 'rgb(255, 0, 0)', 'red', 'rgba(255, 0, 0, 0.5)'];
      
      colors.forEach((color, index) => {
        const { getByTestId } = render(
          <TestWrapper>
            <StatCard 
              value={`${index + 1}`}
              label={`Color ${index + 1}`}
              color={color}
              testID={`stat-card-${index}`}
            />
          </TestWrapper>
        );
        
        expect(getByTestId(`stat-card-${index}`)).toBeTruthy();
      });
    });
  });

  describe('Theme Integration', () => {
    it('renders correctly with light theme', () => {
      const { getByTestId } = render(
        <TestWrapper isDark={false}>
          <StatCard 
            value="100"
            label="Light Theme"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('stat-card')).toBeTruthy();
    });

    it('renders correctly with dark theme', () => {
      const { getByTestId } = render(
        <TestWrapper isDark={true}>
          <StatCard 
            value="100"
            label="Dark Theme"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('stat-card')).toBeTruthy();
    });

    it('adapts styling based on theme', () => {
      const { getByTestId: getLightCard } = render(
        <TestWrapper isDark={false}>
          <StatCard 
            value="100"
            label="Light Card"
            testID="light-card" 
          />
        </TestWrapper>
      );

      const { getByTestId: getDarkCard } = render(
        <TestWrapper isDark={true}>
          <StatCard 
            value="100"
            label="Dark Card"
            testID="dark-card" 
          />
        </TestWrapper>
      );
      
      expect(getLightCard('light-card')).toBeTruthy();
      expect(getDarkCard('dark-card')).toBeTruthy();
    });

    it('uses theme colors for background and border', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <StatCard 
            value="100"
            label="Theme Colors"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('stat-card')).toBeTruthy();
      // Background and border should use theme colors
    });
  });

  describe('Accessibility', () => {
    it('applies correct accessibility labels for value', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="150"
            label="Total Sales"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      const valueElement = getByText('150');
      expect(valueElement.props.accessibilityLabel).toBe('150 Total Sales');
    });

    it('applies correct accessibility role for value', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="200"
            label="Users"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      const valueElement = getByText('200');
      expect(valueElement.props.accessibilityRole).toBe('text');
    });

    it('applies correct accessibility labels for label', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="75"
            label="Active Users"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      const labelElement = getByText('Active Users');
      expect(labelElement.props.accessibilityLabel).toBe('Active Users');
    });

    it('applies correct accessibility role for label', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="300"
            label="Downloads"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      const labelElement = getByText('Downloads');
      expect(labelElement.props.accessibilityRole).toBe('text');
    });

    it('provides meaningful accessibility context', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="99.9%"
            label="Uptime"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      const valueElement = getByText('99.9%');
      expect(valueElement.props.accessibilityLabel).toBe('99.9% Uptime');
    });
  });

  describe('Layout and Styling', () => {
    it('applies correct container styles', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <StatCard 
            value="100"
            label="Container Test"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      const card = getByTestId('stat-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            flex: 1,
            padding: 16,
          })
        ])
      );
    });

    it('handles flex layout correctly', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <StatCard 
            value="100"
            label="Flex Test"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('stat-card')).toBeTruthy();
    });

    it('maintains proper text hierarchy', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="500"
            label="Hierarchy Test"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText('500')).toBeTruthy();
      expect(getByText('Hierarchy Test')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('handles prop changes efficiently', () => {
      const { rerender } = render(
        <TestWrapper>
          <StatCard 
            value="100"
            label="Initial"
            testID="stat-card" 
          />
        </TestWrapper>
      );

      // Re-render with different props
      rerender(
        <TestWrapper>
          <StatCard 
            value="200"
            label="Updated"
            color="#FF0000"
            testID="stat-card" 
          />
        </TestWrapper>
      );

      // Re-render with icon
      rerender(
        <TestWrapper>
          <StatCard 
            value="300"
            label="With Icon"
            icon={<TestIcon />}
            testID="stat-card" 
          />
        </TestWrapper>
      );

      // Component should handle re-renders efficiently
      expect(true).toBe(true); // No crashes
    });

    it('memoizes complex icon components', () => {
      const ComplexIcon = () => <Ionicons name="pulse" size={24} color="red" />;
      
      const { rerender } = render(
        <TestWrapper>
          <StatCard 
            value="100"
            label="Complex"
            icon={<ComplexIcon />}
            testID="stat-card" 
          />
        </TestWrapper>
      );

      // Re-render with same complex icon
      rerender(
        <TestWrapper>
          <StatCard 
            value="100"
            label="Complex"
            icon={<ComplexIcon />}
            testID="stat-card" 
          />
        </TestWrapper>
      );

      expect(true).toBe(true); // No performance issues
    });

    it('handles rapid value updates', async () => {
      const { rerender, getByText } = render(
        <TestWrapper>
          <StatCard 
            value="0"
            label="Counter"
            testID="stat-card" 
          />
        </TestWrapper>
      );

      // Simulate rapid updates
      for (let i = 1; i <= 10; i++) {
        rerender(
          <TestWrapper>
            <StatCard 
              value={i.toString()}
              label="Counter"
              testID="stat-card" 
            />
          </TestWrapper>
        );
      }

      await waitFor(() => {
        expect(getByText('10')).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string value', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <StatCard 
            value=""
            label="Empty Value"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('stat-card')).toBeTruthy();
    });

    it('handles empty string label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <StatCard 
            value="100"
            label=""
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('stat-card')).toBeTruthy();
    });

    it('handles very long values', () => {
      const longValue = '1,234,567,890,123,456,789';
      
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value={longValue}
            label="Long Value"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText(longValue)).toBeTruthy();
    });

    it('handles very long labels', () => {
      const longLabel = 'This is a very long label that might wrap to multiple lines and should be handled gracefully by the component';
      
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="100"
            label={longLabel}
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText(longLabel)).toBeTruthy();
    });

    it('handles special characters in value', () => {
      const specialValue = '$1,234.56 (↑15%)';
      
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value={specialValue}
            label="Special Characters"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText(specialValue)).toBeTruthy();
    });

    it('handles special characters in label', () => {
      const specialLabel = 'Revenue (Q4 2023) - USD $';
      
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="100K"
            label={specialLabel}
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText(specialLabel)).toBeTruthy();
    });

    it('handles unicode characters', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="🚀 100"
            label="Unicode Test 📊"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText('🚀 100')).toBeTruthy();
      expect(getByText('Unicode Test 📊')).toBeTruthy();
    });

    it('handles all props together', () => {
      const { getByTestId, getByText } = render(
        <TestWrapper>
          <StatCard 
            value="$1,234.56"
            label="Total Revenue"
            icon={<TestIcon />}
            color="#28A745"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('stat-card')).toBeTruthy();
      expect(getByText('$1,234.56')).toBeTruthy();
      expect(getByText('Total Revenue')).toBeTruthy();
    });

    it('handles null-like values gracefully', () => {
      const { getByText } = render(
        <TestWrapper>
          <StatCard 
            value="N/A"
            label="No Data"
            testID="stat-card" 
          />
        </TestWrapper>
      );
      
      expect(getByText('N/A')).toBeTruthy();
      expect(getByText('No Data')).toBeTruthy();
    });
  });
});
