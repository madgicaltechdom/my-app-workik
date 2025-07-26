import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { SettingRow } from '../SettingRow';
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
const TestIcon = () => <Ionicons name="settings" size={24} color="gray" />;

describe('SettingRow Component', () => {
  const mockOnPress = jest.fn();
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders correctly with required props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Test Setting"
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('setting-row')).toBeTruthy();
    });

    it('displays the title', () => {
      const { getByText } = render(
        <TestWrapper>
          <SettingRow 
            title="Test Setting Title"
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByText('Test Setting Title')).toBeTruthy();
    });

    it('displays the description when provided', () => {
      const { getByText } = render(
        <TestWrapper>
          <SettingRow 
            title="Test Setting"
            description="This is a test description"
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByText('This is a test description')).toBeTruthy();
    });

    it('does not display description when not provided', () => {
      const { queryByText } = render(
        <TestWrapper>
          <SettingRow 
            title="Test Setting"
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(queryByText('This is a test description')).toBeNull();
    });
  });

  describe('Setting Types', () => {
    describe('Button Type', () => {
      it('renders button type correctly', () => {
        const { getByTestId } = render(
          <TestWrapper>
            <SettingRow 
              title="Button Setting"
              type="button"
              onPress={mockOnPress}
              testID="setting-row" 
            />
          </TestWrapper>
        );
        
        expect(getByTestId('setting-row')).toBeTruthy();
      });

      it('calls onPress when button type is pressed', () => {
        const { getByTestId } = render(
          <TestWrapper>
            <SettingRow 
              title="Button Setting"
              type="button"
              onPress={mockOnPress}
              testID="setting-row" 
            />
          </TestWrapper>
        );
        
        fireEvent.press(getByTestId('setting-row'));
        expect(mockOnPress).toHaveBeenCalledTimes(1);
      });

      it('defaults to button type when not specified', () => {
        const { getByTestId } = render(
          <TestWrapper>
            <SettingRow 
              title="Default Setting"
              onPress={mockOnPress}
              testID="setting-row" 
            />
          </TestWrapper>
        );
        
        fireEvent.press(getByTestId('setting-row'));
        expect(mockOnPress).toHaveBeenCalledTimes(1);
      });
    });

    describe('Toggle Type', () => {
      it('renders toggle type correctly', () => {
        const { getByTestId } = render(
          <TestWrapper>
            <SettingRow 
              title="Toggle Setting"
              type="toggle"
              value={false}
              onValueChange={mockOnValueChange}
              testID="setting-row" 
            />
          </TestWrapper>
        );
        
        expect(getByTestId('setting-row')).toBeTruthy();
      });

      it('calls onValueChange when toggle is pressed', () => {
        const { getByTestId } = render(
          <TestWrapper>
            <SettingRow 
              title="Toggle Setting"
              type="toggle"
              value={false}
              onValueChange={mockOnValueChange}
              testID="setting-row" 
            />
          </TestWrapper>
        );
        
        fireEvent.press(getByTestId('setting-row'));
        expect(mockOnValueChange).toHaveBeenCalledWith(true);
      });

      it('toggles value correctly when pressed', () => {
        const { getByTestId, rerender } = render(
          <TestWrapper>
            <SettingRow 
              title="Toggle Setting"
              type="toggle"
              value={false}
              onValueChange={mockOnValueChange}
              testID="setting-row" 
            />
          </TestWrapper>
        );
        
        fireEvent.press(getByTestId('setting-row'));
        expect(mockOnValueChange).toHaveBeenCalledWith(true);
        
        // Re-render with true value
        rerender(
          <TestWrapper>
            <SettingRow 
              title="Toggle Setting"
              type="toggle"
              value={true}
              onValueChange={mockOnValueChange}
              testID="setting-row" 
            />
          </TestWrapper>
        );
        
        fireEvent.press(getByTestId('setting-row'));
        expect(mockOnValueChange).toHaveBeenCalledWith(false);
      });

      it('defaults to false value when not specified', () => {
        const { getByTestId } = render(
          <TestWrapper>
            <SettingRow 
              title="Toggle Setting"
              type="toggle"
              onValueChange={mockOnValueChange}
              testID="setting-row" 
            />
          </TestWrapper>
        );
        
        fireEvent.press(getByTestId('setting-row'));
        expect(mockOnValueChange).toHaveBeenCalledWith(true);
      });
    });

    describe('Link Type', () => {
      it('renders link type correctly', () => {
        const { getByTestId } = render(
          <TestWrapper>
            <SettingRow 
              title="Link Setting"
              type="link"
              onPress={mockOnPress}
              testID="setting-row" 
            />
          </TestWrapper>
        );
        
        expect(getByTestId('setting-row')).toBeTruthy();
      });

      it('calls onPress when link type is pressed', () => {
        const { getByTestId } = render(
          <TestWrapper>
            <SettingRow 
              title="Link Setting"
              type="link"
              onPress={mockOnPress}
              testID="setting-row" 
            />
          </TestWrapper>
        );
        
        fireEvent.press(getByTestId('setting-row'));
        expect(mockOnPress).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Icon Display', () => {
    it('displays icon when provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Setting with Icon"
            icon={<TestIcon />}
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('setting-row')).toBeTruthy();
      // Icon should be rendered within the row
    });

    it('renders without icon when not provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Setting without Icon"
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('setting-row')).toBeTruthy();
    });

    it('handles different icon types', () => {
      const CustomIcon = () => <Ionicons name="heart" size={20} color="red" />;
      
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Custom Icon Setting"
            icon={<CustomIcon />}
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('setting-row')).toBeTruthy();
    });
  });

  describe('Right Component', () => {
    it('displays right component when provided', () => {
      const RightComponent = () => <Ionicons name="chevron-forward" size={20} color="gray" />;
      
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Setting with Right Component"
            rightComponent={<RightComponent />}
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('setting-row')).toBeTruthy();
    });

    it('renders without right component when not provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Setting without Right Component"
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('setting-row')).toBeTruthy();
    });

    it('handles complex right components', () => {
      const ComplexRightComponent = () => (
        <Ionicons name="information-circle" size={24} color="blue" />
      );
      
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Complex Right Component"
            rightComponent={<ComplexRightComponent />}
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('setting-row')).toBeTruthy();
    });
  });

  describe('Disabled State', () => {
    it('does not call onPress when disabled', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Disabled Setting"
            onPress={mockOnPress}
            disabled={true}
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      fireEvent.press(getByTestId('setting-row'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('does not call onValueChange when disabled and toggle type', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Disabled Toggle"
            type="toggle"
            value={false}
            onValueChange={mockOnValueChange}
            disabled={true}
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      fireEvent.press(getByTestId('setting-row'));
      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('applies disabled styling', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Disabled Setting"
            disabled={true}
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      const settingRow = getByTestId('setting-row');
      expect(settingRow.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ opacity: 0.5 })
        ])
      );
    });

    it('defaults to enabled when disabled is not specified', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Enabled Setting"
            onPress={mockOnPress}
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      fireEvent.press(getByTestId('setting-row'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Theme Integration', () => {
    it('renders correctly with light theme', () => {
      const { getByTestId } = render(
        <TestWrapper isDark={false}>
          <SettingRow 
            title="Light Theme Setting"
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('setting-row')).toBeTruthy();
    });

    it('renders correctly with dark theme', () => {
      const { getByTestId } = render(
        <TestWrapper isDark={true}>
          <SettingRow 
            title="Dark Theme Setting"
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('setting-row')).toBeTruthy();
    });

    it('adapts styling based on theme', () => {
      const { getByTestId: getLightSetting } = render(
        <TestWrapper isDark={false}>
          <SettingRow 
            title="Light Setting"
            testID="light-setting" 
          />
        </TestWrapper>
      );

      const { getByTestId: getDarkSetting } = render(
        <TestWrapper isDark={true}>
          <SettingRow 
            title="Dark Setting"
            testID="dark-setting" 
          />
        </TestWrapper>
      );
      
      expect(getLightSetting('light-setting')).toBeTruthy();
      expect(getDarkSetting('dark-setting')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility role for button type', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Button Setting"
            type="button"
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      const settingRow = getByTestId('setting-row');
      expect(settingRow.props.accessibilityRole).toBe('button');
    });

    it('provides accessibility state for disabled', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Disabled Setting"
            disabled={true}
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      const settingRow = getByTestId('setting-row');
      expect(settingRow.props.disabled).toBe(true);
    });

    it('uses title as accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Accessible Setting"
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      const settingRow = getByTestId('setting-row');
      expect(settingRow.props.accessibilityLabel).toContain('Accessible Setting');
    });
  });

  describe('Performance', () => {
    it('handles rapid press events', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Rapid Press Setting"
            onPress={mockOnPress}
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      const settingRow = getByTestId('setting-row');
      
      // Rapid presses
      fireEvent.press(settingRow);
      fireEvent.press(settingRow);
      fireEvent.press(settingRow);
      
      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });

    it('handles prop changes efficiently', () => {
      const { rerender } = render(
        <TestWrapper>
          <SettingRow 
            title="Dynamic Setting"
            onPress={mockOnPress}
            testID="setting-row" 
          />
        </TestWrapper>
      );

      // Re-render with different props
      rerender(
        <TestWrapper>
          <SettingRow 
            title="Updated Setting"
            onPress={mockOnPress}
            disabled={true}
            testID="setting-row" 
          />
        </TestWrapper>
      );

      // Re-render with toggle type
      rerender(
        <TestWrapper>
          <SettingRow 
            title="Toggle Setting"
            type="toggle"
            value={true}
            onValueChange={mockOnValueChange}
            testID="setting-row" 
          />
        </TestWrapper>
      );

      // Component should handle re-renders efficiently
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('memoizes complex components', () => {
      const ComplexIcon = () => <Ionicons name="star" size={24} color="gold" />;
      const ComplexRightComponent = () => <Ionicons name="arrow-forward" size={20} color="blue" />;
      
      const { rerender } = render(
        <TestWrapper>
          <SettingRow 
            title="Complex Setting"
            icon={<ComplexIcon />}
            rightComponent={<ComplexRightComponent />}
            testID="setting-row" 
          />
        </TestWrapper>
      );

      // Re-render with same complex components
      rerender(
        <TestWrapper>
          <SettingRow 
            title="Complex Setting"
            icon={<ComplexIcon />}
            rightComponent={<ComplexRightComponent />}
            testID="setting-row" 
          />
        </TestWrapper>
      );

      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty title gracefully', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title=""
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('setting-row')).toBeTruthy();
    });

    it('handles very long titles', () => {
      const longTitle = 'This is a very long setting title that might wrap to multiple lines and should be handled gracefully by the component without breaking the layout';
      
      const { getByText } = render(
        <TestWrapper>
          <SettingRow 
            title={longTitle}
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByText(longTitle)).toBeTruthy();
    });

    it('handles very long descriptions', () => {
      const longDescription = 'This is a very long description that explains the setting in great detail and might wrap to multiple lines in the UI';
      
      const { getByText } = render(
        <TestWrapper>
          <SettingRow 
            title="Setting"
            description={longDescription}
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByText(longDescription)).toBeTruthy();
    });

    it('handles toggle without onValueChange', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Toggle without Handler"
            type="toggle"
            value={false}
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      fireEvent.press(getByTestId('setting-row'));
      // Should not crash
      expect(getByTestId('setting-row')).toBeTruthy();
    });

    it('handles button without onPress', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SettingRow 
            title="Button without Handler"
            type="button"
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      fireEvent.press(getByTestId('setting-row'));
      // Should not crash
      expect(getByTestId('setting-row')).toBeTruthy();
    });

    it('handles all props together', () => {
      const { getByTestId, getByText } = render(
        <TestWrapper>
          <SettingRow 
            title="Complete Setting"
            description="Complete description"
            icon={<TestIcon />}
            type="toggle"
            value={true}
            onValueChange={mockOnValueChange}
            rightComponent={<Ionicons name="information-circle" size={20} />}
            disabled={false}
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('setting-row')).toBeTruthy();
      expect(getByText('Complete Setting')).toBeTruthy();
      expect(getByText('Complete description')).toBeTruthy();
      
      fireEvent.press(getByTestId('setting-row'));
      expect(mockOnValueChange).toHaveBeenCalledWith(false);
    });

    it('handles special characters in title and description', () => {
      const specialTitle = 'Setting @#$%^&*()';
      const specialDescription = 'Description with special chars: <>?{}[]|\\';
      
      const { getByText } = render(
        <TestWrapper>
          <SettingRow 
            title={specialTitle}
            description={specialDescription}
            testID="setting-row" 
          />
        </TestWrapper>
      );
      
      expect(getByText(specialTitle)).toBeTruthy();
      expect(getByText(specialDescription)).toBeTruthy();
    });
  });
});
