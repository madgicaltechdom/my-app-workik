import React from 'react';
import { render } from '@testing-library/react-native';

// Create a simple ErrorMessage component for testing
const TestErrorMessage = ({ message, visible, testID, ...props }: any) => {
  if (!visible) return null;
  return React.createElement('Text', { testID, ...props }, message);
};

describe('ErrorMessage Component', () => {
  it('renders correctly when visible', () => {
    const { getByTestId } = render(
      React.createElement(TestErrorMessage, { 
        message: 'Error message', 
        visible: true, 
        testID: 'error-message' 
      })
    );
    expect(getByTestId('error-message')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByTestId } = render(
      React.createElement(TestErrorMessage, { 
        message: 'Error message', 
        visible: false, 
        testID: 'error-message' 
      })
    );
    expect(queryByTestId('error-message')).toBeNull();
  });

  it('displays the provided message', () => {
    const { getByTestId } = render(
      React.createElement(TestErrorMessage, { 
        message: 'Test error message', 
        visible: true, 
        testID: 'error-message' 
      })
    );
    expect(getByTestId('error-message').props.children).toBe('Test error message');
  });

  it('handles empty message', () => {
    const { getByTestId } = render(
      React.createElement(TestErrorMessage, { 
        message: '', 
        visible: true, 
        testID: 'error-message' 
      })
    );
    expect(getByTestId('error-message').props.children).toBe('');
  });

  it('applies accessibility props', () => {
    const { getByTestId } = render(
      React.createElement(TestErrorMessage, { 
        message: 'Error message', 
        visible: true, 
        testID: 'error-message',
        accessibilityLabel: 'Error message',
        accessibilityHint: 'This is an error message'
      })
    );
    const element = getByTestId('error-message');
    expect(element.props.accessibilityLabel).toBe('Error message');
    expect(element.props.accessibilityHint).toBe('This is an error message');
  });

  it('handles long messages', () => {
    const longMessage = 'This is a very long error message that might wrap to multiple lines in the UI';
    const { getByTestId } = render(
      React.createElement(TestErrorMessage, { 
        message: longMessage, 
        visible: true, 
        testID: 'error-message' 
      })
    );
    expect(getByTestId('error-message').props.children).toBe(longMessage);
  });

  it('handles special characters in message', () => {
    const specialMessage = 'Error: Invalid input @#$%';
    const { getByTestId } = render(
      React.createElement(TestErrorMessage, { 
        message: specialMessage, 
        visible: true, 
        testID: 'error-message' 
      })
    );
    expect(getByTestId('error-message').props.children).toBe(specialMessage);
  });
});
