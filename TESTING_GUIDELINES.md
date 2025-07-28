# React Native Testing Guide

This guide provides comprehensive testing strategies, patterns, and best practices for testing React Native components in our application. It includes a powerful test case generation prompt and covers unit, integration, and end-to-end testing approaches.

## Table of Contents

- [Test Case Generation Prompt](#test-case-generation-prompt)
- [Testing Philosophy](#testing-philosophy)
- [Test Structure](#test-structure)
- [Common Testing Patterns](#common-testing-patterns)
- [Mocking Strategies](#mocking-strategies)
- [Testing Best Practices](#testing-best-practices)
- [Test Coverage Guidelines](#test-coverage-guidelines)
- [Troubleshooting](#troubleshooting)

## Test Case Generation Prompt

Use the following prompt to generate comprehensive test cases for any React Native screen:

```markdown
I need to create comprehensive test cases for a React Native screen component. Please generate a detailed test plan following these requirements:

1. **Component Details**:
   - Component Name: [ComponentName]
   - Purpose: [Brief description of what the component does]
   - Key Features: [List main features]
   - Props: [List all props with types]
   - State: [List state variables if any]
   - Side Effects: [Any API calls, subscriptions, etc.]

2. **Test Categories**:
   - Rendering: Verify all UI elements render correctly
   - Props: Test all prop variations and default values
   - State: Test state changes and their effects
   - User Interactions: Test all touch/gesture handlers
   - Navigation: Test all navigation flows
   - Edge Cases: Test error states, empty states, etc.
   - Accessibility: Test screen reader support, dynamic text, etc.
   - Performance: Test rendering performance, memory usage

3. **Testing Requirements**:
   - Use React Testing Library and Jest
   - Follow the Arrange-Act-Assert pattern
   - Include test IDs for all interactive elements
   - Test both success and error scenarios
   - Include accessibility tests
   - Add performance test cases where applicable

4. **Mocking Strategy**:
   - Mock all external dependencies
   - Mock navigation and route props
   - Mock API calls and timers
   - Mock platform-specific code

5. **Output Format**:
   - Organize tests using describe blocks
   - Use clear, descriptive test names
   - Include assertions for each test case
   - Add comments explaining complex test scenarios
   - Include TypeScript types for all test data
```

## Testing Philosophy

Our testing approach follows these core principles:

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Isolate Dependencies**: Mock all external services and dependencies
3. **Prioritize User Flows**: Test complete user journeys, not just individual functions
4. **Maintain Test Data**: Keep test data consistent and maintainable
5. **Test Accessibility**: Ensure components are accessible to all users

## Test Structure

### Basic Test Structure

```typescript
describe('[ComponentName]', () => {
  // Setup mocks and test data
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: jest.fn((event, callback) => {
      if (event === 'focus') callback();
      return jest.fn();
    }),
  };

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all required elements', () => {
      // Test rendering
    });
  });

  describe('Interactions', () => {
    it('handles user interactions correctly', () => {
      // Test interactions
    });
  });
});
```

### Navigation Testing

For components using React Navigation:

```typescript
// Mock the navigation module
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  
  const MockNavigationContainer = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
  };
  
  MockNavigationContainer.router = {
    getStateForAction: jest.fn(),
    getActionForPathAndParams: jest.fn(),
    getPathAndParamsForState: jest.fn(),
    getActionCreators: jest.fn(() => ({})),
  };
  
  MockNavigationContainer.getConstants = () => ({
    linking: {},
    theme: {},
  });
  
  return {
    ...actualNav,
    useNavigation: () => mockNavigation,
    NavigationContainer: MockNavigationContainer,
  };
});
```

## Common Testing Patterns

### Form Testing

```typescript
describe('Form Submission', () => {
  it('validates required fields', async () => {
    const { getByTestId, queryByText } = render(
      <TestWrapper>
        <MyFormComponent />
      </TestWrapper>
    );
    
    fireEvent.press(getByTestId('submit-button'));
    
    expect(queryByText('This field is required')).toBeTruthy();
  });
});
```

### API Call Testing

```typescript
describe('API Integration', () => {
  it('handles successful API response', async () => {
    // Mock successful API response
    mockApi.fetchData.mockResolvedValueOnce({ data: mockData });
    
    const { getByTestId } = render(
      <TestWrapper>
        <MyComponent />
      </TestWrapper>
    );
    
    await act(async () => {
      fireEvent.press(getByTestId('fetch-button'));
    });
    
    expect(mockApi.fetchData).toHaveBeenCalled();
    expect(getByTestId('success-message')).toBeTruthy();
  });
});
```

## Mocking Strategies

### Mocking Context

```typescript
// Mock UserContext
const mockUser = {
  id: '123',
  name: 'Test User',
  email: 'test@example.com',
  updateProfile: jest.fn(),
};

jest.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: mockUser,
    updateProfile: mockUser.updateProfile,
  }),
}));
```

### Mocking Native Modules

```typescript
// Mock a native module
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn(dict => dict.ios),
}));
```

## Testing Best Practices

1. **Test Organization**
   - Group related tests in describe blocks
   - Use clear, descriptive test names
   - Structure tests in the Arrange-Act-Assert pattern

2. **Test Data**
   - Define test data at the top of the test file
   - Use factory functions for complex test data
   - Keep test data consistent across tests

3. **Assertions**
   - Make assertions specific and meaningful
   - Test one thing per test case
   - Include negative test cases

4. **Performance**
   - Use `act()` for state updates
   - Mock expensive operations
   - Test for memory leaks

## Test Coverage Guidelines

We aim for the following test coverage:

- **80%+ Statement Coverage**: All major code paths should be tested
- **90%+ Branch Coverage**: All conditional logic should be tested
- **100% Component Coverage**: All components should have basic rendering tests
- **Critical Paths**: All critical user flows should have E2E tests

## Troubleshooting

### Common Issues

1. **"Warning: An update to X inside a test was not wrapped in act(...)"**
   - Wrap state updates in `act()`
   - Use `waitFor` for async operations

2. **"ReferenceError: You are trying to access a property or method of the Jest environment"**
   - Ensure all mocks are properly set up
   - Check for missing module mocks

3. **"TypeError: Cannot read property 'getConstants' of undefined"**
   - Add proper mocks for React Navigation
   - Ensure all required static methods are mocked

4. **"Jest did not exit one second after the test run completed"**
   - Check for unclosed timers or subscriptions
   - Ensure all mocks are properly cleaned up

### Debugging Tests

```bash
# Run a specific test file with debug output
DEBUG_PRINT_LIMIT=10000 jest src/__tests__/MyComponent.test.tsx --verbose

# Debug with Chrome DevTools
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Additional Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [React Native Testing Guide](https://reactnative.dev/docs/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Maestro E2E Testing](https://maestro.mobile.dev/)

---

This guide is a living document. Please contribute to it as you discover new patterns or best practices for testing React Native applications.
