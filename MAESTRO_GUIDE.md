# Maestro End-to-End Testing Guide

This guide provides comprehensive instructions for writing, running, and maintaining end-to-end (E2E) tests using Maestro for the StorageApp. We'll use the login flow as our primary example.

## Table of Contents
- [Getting Started](#getting-started)
- [Test Structure](#test-structure)
- [Login Test Example](#login-test-example)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [Running Tests](#running-tests)
- [Debugging](#debugging)
- [CI/CD Integration](#cicd-integration)

## Getting Started

### Prerequisites
- Install Maestro CLI:
  ```bash
  curl -Ls "https://get.maestro.mobile.dev" | bash
  ```
- Verify installation:
  ```bash
  maestro --version
  ```

## Test Structure

Maestro tests are organized in the `.maestro` directory with the following structure:

```
.maestro/
├── elements/            # Reusable element selectors
│   └── auth.js         # Authentication elements
└── tests/              # Test flows
    └── auth/           
        └── login_positive_test.yaml  # Login test example
```

## Login Test Example

Here's a complete example of a login test:

```yaml
# tests/auth/login_positive_test.yaml

# Test metadata
description: "Positive login flow with valid credentials"
appId: com.madgicaltechdom.storageapp

# Environment variables for test data
env:
  VALID_EMAIL: "testuser@example.com"
  VALID_PASSWORD: "Test@1234"

# Test steps
- launchApp

# 1. Verify login screen elements
- assertVisible: "Welcome Back!"
- assertVisible: "Email"
- assertVisible: "Password"

# 2. Enter credentials
- tapOn: "Email"
- inputText: "${VALID_EMAIL}"
- tapOn: "Password"
- inputPassword: "${VALID_PASSWORD}"  # Secure input for passwords

# 3. Submit the form
- tapOn: "Sign In"

# 4. Verify successful login
- assertVisible: "Home"
- takeScreenshot: "login_success"
```

## Writing Tests

### Basic Commands

| Command | Description | Example |
|---------|-------------|---------|
| `launchApp` | Launch the application | `launchApp` |
| `tapOn` | Tap on an element | `tapOn: "Button Text"` |
| `inputText` | Input text into a field | `inputText: "user@example.com"` |
| `assertVisible` | Verify element is visible | `assertVisible: "Welcome"` |
| `assertNotVisible` | Verify element is not visible | `assertNotVisible: "Error"` |
| `takeScreenshot` | Capture a screenshot | `takeScreenshot: "screenshot_name"` |

### Using Variables

```yaml
# Define variables
env:
  USER_EMAIL: "test@example.com"
  USER_PASSWORD: "password123"

# Use variables
- inputText: "${USER_EMAIL}"
```

## Best Practices

1. **Test Organization**
   - Group related tests in directories (e.g., `auth/`, `profile/`)
   - Use descriptive test names (e.g., `login_positive_test.yaml`)
   - Keep tests focused on a single flow

2. **Element Selection**
   - Prefer text over IDs when possible (more readable)
   - Use unique, stable selectors
   - Add comments for complex selectors

3. **Test Data**
   - Use environment variables for test data
   - Never commit sensitive data
   - Consider using a test data factory

4. **Assertions**
   - Add meaningful assertions
   - Verify both positive and negative cases
   - Use screenshots for visual verification

## Running Tests

### Run a Single Test
```bash
maestro test .maestro/tests/auth/login_positive_test.yaml
```

### Run All Tests
```bash
maestro test .maestro/tests/
```

### Run on Specific Device
```bash
# List available devices
maestro device list

# Run on specific device
maestro --device <device_id> test .maestro/tests/
```

## Debugging

### View Test Execution
```bash
maestro studio
```

### Debug Commands
- `--format junit` - Generate JUnit XML reports
- `--format html` - Generate HTML reports
- `--no-ansi` - Disable colored output

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Maestro E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: macos-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Maestro
        run: |
          curl -Ls "https://get.maestro.mobile.dev" | bash
          echo "$HOME/.maestro/bin" >> $GITHUB_PATH
          
      - name: Run Maestro Tests
        run: |
          maestro --version
          maestro test .maestro/tests/ --format junit > test-results.xml
          
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results.xml
```

## Next Steps

1. Add more test scenarios (negative cases, edge cases)
2. Implement test data management
3. Set up test reporting
4. Integrate with your CI/CD pipeline

## Resources
- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro CLI Reference](https://maestro.mobile.dev/cli)
- [Example Test Flows](https://github.com/mobile-dev-inc/maestro/tree/main/maestro/test/project)
