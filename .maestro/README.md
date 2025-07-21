# Maestro Documentation and Setup Guide

## Running the Tests
1. Install Maestro: `curl -Ls "https://get.maestro.mobile.dev" | bash`
2. Run test: `maestro test .maestro/login.positive.yaml`

## Test Configuration
- Default user credentials:
  - Email: test@example.com
  - Password: Password123!

## Test Coverage
The positive login test case checks:
1. App launches successfully
2. Login screen appears with correct title
3. Can input email and password
4. Login button works
5. Navigation to Profile screen succeeds
6. User data appears correctly

## Adding New Tests
1. Create new .yaml files in .maestro directory
2. Follow naming convention: feature.scenario.yaml
3. Use testIDs for reliable element selection
4. Include assertions for important states

## Best Practices
1. Use testIDs over text matching
2. Wait for animations to complete
3. Assert both positive and negative conditions
4. Keep tests focused and atomic
