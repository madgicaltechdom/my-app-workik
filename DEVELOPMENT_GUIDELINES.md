# 🚀 React Native Development Guidelines & Best Practices

*Based on our Profile UI Modernization and Firebase Integration Project*

---

## 📋 **Table of Contents**

1. [Project Architecture](#project-architecture)
2. [React Native Styling Best Practices](#react-native-styling-best-practices)
3. [Firebase Integration Guidelines](#firebase-integration-guidelines)
4. [TypeScript Migration Strategy](#typescript-migration-strategy)
5. [Testing & Quality Assurance](#testing--quality-assurance)
6. [Internationalization (i18n)](#internationalization-i18n)
7. [Error Handling & Debugging](#error-handling--debugging)
8. [Performance & User Experience](#performance--user-experience)
9. [Code Organization & Maintenance](#code-organization--maintenance)
10. [Team Workflow & Standards](#team-workflow--standards)

---

## 🏗️ **Project Architecture**

### **Folder Structure Standards**
```
src/
├── components/
│   └── common/
│       └── Button/
│           ├── Button.tsx
│           ├── Button.styles.ts
│           ├── Button.types.ts
│           └── index.ts
├── contexts/
├── features/
│   └── profile/
│       └── screens/
├── services/
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts
├── localization/
└── navigation/
```

### **Key Principles**
- **Separation of Concerns**: Separate styles, types, and logic into different files
- **Modular Components**: Each component in its own folder with clean exports
- **Feature-Based Organization**: Group related screens and components by feature
- **Centralized Services**: Keep API calls and business logic in dedicated service files

---

## 🎨 **React Native Styling Best Practices**

### **Critical Rules for styled-components**

#### ❌ **Common Mistakes That Cause Runtime Errors**
```typescript
// WRONG - These cause "Failed to parse declaration" errors
const StyledView = styled.View`
  padding: 16px;           // ❌ px units not supported
  margin: 0 auto;          // ❌ CSS shorthand not supported
  border: 1px solid red;   // ❌ Border shorthand not supported
  shadow-offset: 0px 2px;  // ❌ Shadow shorthand not supported
`;
```

#### ✅ **Correct React Native Styling**
```typescript
// CORRECT - Use specific properties and numbers
const StyledView = styled.View`
  padding-horizontal: 16;
  padding-vertical: 16;
  align-self: center;
  border-width: 1;
  border-color: red;
  shadow-offset-x: 0;
  shadow-offset-y: 2;
`;
```

### **Theme Integration Best Practices**
```typescript
// ✅ Always verify theme properties exist
const Button = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary}; // ✅ Valid
  font-size: ${({ theme }) => theme.fontSizes.md};          // ✅ Valid
  margin-bottom: ${({ theme }) => theme.spacing.lg};       // ✅ Valid
`;

// ❌ These cause "Empty input string" errors
const BadButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.surface}; // ❌ Doesn't exist
  font-size: ${({ theme }) => theme.fontSizes.xxl};        // ❌ Doesn't exist
`;
```

### **Valid Theme Properties Reference**
```typescript
// Colors
theme.colors: {
  primary, secondary, success, danger, warning, info,
  text, textSecondary, textLight, textMuted,
  background, backgroundSecondary, border, overlay
}

// Font Sizes (use bracket notation for numeric keys)
theme.fontSizes: {
  xs, sm, md, lg, xl, '2xl', '3xl', '4xl', '5xl', '6xl'
}
// Usage: theme.fontSizes['2xl']

// Spacing
theme.spacing: {
  xs, sm, md, lg, xl, '2xl', '3xl'
}
```

---

## 🔥 **Firebase Integration Guidelines**

### **Initialization Order (Critical)**
```typescript
// App.tsx - MUST import Firebase config FIRST
import './src/services/firebaseConfig'; // ✅ Import BEFORE other components
import { UserProvider } from './src/contexts/UserContext';
import { AppNavigator } from './src/navigation/AppNavigator';
```

**Why:** React Native bridge errors like "Empty input string" occur when Firebase is used before proper initialization.

### **Service Layer Architecture**
```typescript
// authService.ts
class AuthService {
  async updateUserProfile(profileData: UpdateProfileData) {
    // 1. Sanitize input data
    const sanitizedData = this.sanitizeProfileData(profileData);
    
    // 2. Update Firebase Auth
    await updateProfile(currentUser, { displayName: sanitizedData.displayName });
    
    // 3. Save custom fields to Firestore
    await userProfileService.saveUserProfile(currentUser.uid, sanitizedData);
    
    // 4. Return consistent API response
    return { success: true, message: 'Profile updated successfully' };
  }
}
```

### **Offline Support & Caching**
```typescript
// userProfileService.ts
export class UserProfileService {
  async getUserProfile(uid: string) {
    try {
      // Try Firestore first
      const firestoreData = await this.fetchFromFirestore(uid);
      await this.cacheData(uid, firestoreData);
      return { success: true, data: firestoreData };
    } catch (error) {
      // Fallback to cached data
      const cachedData = await this.getCachedData(uid);
      return { success: true, data: cachedData, fromCache: true };
    }
  }
}
```

### **Data Merging Strategy**
```typescript
// UserContext.tsx
const mapFirebaseUser = async (firebaseUser: FirebaseUser | null) => {
  if (!firebaseUser) return null;
  
  // Base profile from Firebase Auth
  const baseProfile = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || 'user@example.com',
    displayName: firebaseUser.displayName || 'User',
    phoneNumber: firebaseUser.phoneNumber || null,
  };
  
  // Merge with Firestore custom fields
  const firestoreResult = await userProfileService.getUserProfile(firebaseUser.uid);
  if (firestoreResult.success && firestoreResult.data) {
    return {
      ...baseProfile,
      phoneNumber: firestoreResult.data.phoneNumber || baseProfile.phoneNumber,
      bio: firestoreResult.data.bio,
      dateOfBirth: firestoreResult.data.dateOfBirth,
    };
  }
  
  return baseProfile;
};
```

---

## 📝 **TypeScript Migration Strategy**

### **Component Migration Pattern**
```typescript
// 1. Create folder structure
components/common/Button/
├── Button.tsx          // Main component
├── Button.styles.ts    // Styled components
├── Button.types.ts     // TypeScript interfaces
└── index.ts           // Clean exports

// 2. Define interfaces first
// Button.types.ts
export interface ButtonProps {
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  testID?: string;
}

// 3. Implement component with proper typing
// Button.tsx
export const Button: React.FC<ButtonProps> = ({ 
  onPress, 
  disabled = false, 
  variant = 'primary',
  children,
  testID 
}) => {
  return (
    <StyledButton 
      onPress={onPress} 
      disabled={disabled}
      testID={testID}
    >
      <ButtonText>{children}</ButtonText>
    </StyledButton>
  );
};
```

### **Theme System Migration**
```typescript
// theme/index.ts - Centralized theme with TypeScript
export interface Theme {
  colors: typeof colors;
  fontSizes: typeof fontSizes;
  spacing: typeof spacing;
}

export const theme: Theme = {
  colors,
  fontSizes,
  spacing,
};

// Utility functions
export const getColor = (colorKey: keyof Theme['colors']) => theme.colors[colorKey];
export const getFontSize = (sizeKey: keyof Theme['fontSizes']) => theme.fontSizes[sizeKey];
```

---

## 🧪 **Testing & Quality Assurance**

### **Maestro Test Structure**
```yaml
# .maestro/tests/profile/edit_profile.yaml
appId: com.madgicaltechdom.storageapp

env:
  VALID_EMAIL: 'user@example.com'
  UPDATED_DISPLAY_NAME: "Updated Name"
  UPDATED_BIO: "Updated bio text"

---
# Test Flow Structure
# 1. Setup & Login
# 2. Navigate to feature
# 3. Test core functionality
# 4. Test edge cases & validation
# 5. Test accessibility
# 6. Cleanup & logout
```

### **TestID Naming Convention**
```typescript
// Consistent testID patterns
<Input testID="input-displayName" />      // input-{fieldName}
<Button testID="save-button" />           // {action}-button
<Text testID="error-message" />           // {purpose}-{component}
<View testID="profile-container" />       // {feature}-{component}
```

### **Accessibility Best Practices**
```typescript
<Button
  testID="save-button"
  accessibilityLabel="Save profile changes"
  accessibilityRole="button"
  accessibilityHint="Saves your profile information"
>
  Save Changes
</Button>
```

---

## 🌐 **Internationalization (i18n)**

### **Translation File Structure**
```typescript
// localization/en.ts
export const en = {
  profile: {
    displayName: 'Display Name',
    displayNamePlaceholder: 'Enter your display name',
    bio: 'Bio',
    bioPlaceholder: 'Tell us about yourself...',
    dateOfBirth: 'Date of Birth',
    dateOfBirthPlaceholder: 'YYYY-MM-DD',
    updateSuccess: {
      title: 'Profile Updated',
      message: 'Your profile has been updated successfully.',
    },
  },
  common: {
    ok: 'OK',
    cancel: 'Cancel',
    loading: 'Loading...',
  },
};
```

### **Usage in Components**
```typescript
// UpdateProfileScreen.tsx
const { t } = useTranslation();

return (
  <Input
    placeholder={t('profile.displayNamePlaceholder')} // ✅ Use i18n
    // placeholder="Enter your display name"          // ❌ Never hardcode
  />
);
```

### **Key Rules**
- ✅ **Always use translation keys** for user-facing text
- ✅ **Group related translations** by feature/screen
- ✅ **Provide meaningful placeholders** with proper formatting hints
- ❌ **Never hardcode user-facing strings**

---

## 🐛 **Error Handling & Debugging**

### **Comprehensive Logging Strategy**
```typescript
// Service layer logging
export class AuthService {
  async updateUserProfile(profileData: UpdateProfileData) {
    console.log('[AuthService] updateUserProfile called with:', {
      displayName: profileData.displayName,
      hasPhoneNumber: !!profileData.phoneNumber,
      hasBio: !!profileData.bio,
    });

    try {
      const result = await this.performUpdate(profileData);
      console.log('[AuthService] Profile update successful');
      return result;
    } catch (error) {
      console.error('[AuthService] Profile update failed:', error);
      throw error;
    }
  }
}
```

### **Error Boundary Implementation**
```typescript
// ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    // Log to crash reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallbackComponent />;
    }
    return this.props.children;
  }
}
```

### **Common Error Patterns & Solutions**

| Error | Cause | Solution |
|-------|-------|----------|
| "Empty input string" | Firebase used before initialization | Import firebaseConfig first |
| "Failed to parse declaration" | CSS units in RN styled-components | Use numbers, not px strings |
| "Cannot read property of undefined" | Invalid theme property | Verify theme keys exist |
| Translation keys showing raw | Missing i18n keys | Add keys to translation files |

---

## ⚡ **Performance & User Experience**

### **Loading States & Feedback**
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSave = async () => {
  setIsLoading(true);
  try {
    await authService.updateUserProfile(formData);
    Alert.alert('Success', 'Profile updated successfully');
  } catch (error) {
    Alert.alert('Error', 'Failed to update profile');
  } finally {
    setIsLoading(false);
  }
};

return (
  <Button disabled={isLoading}>
    <ButtonText>
      {isLoading ? t('profile.updating') : t('profile.saveChanges')}
    </ButtonText>
  </Button>
);
```

### **Scrollable Screens**
```typescript
// Always make long forms scrollable
const ScrollViewContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
`;
```

### **Offline Support**
```typescript
// Implement caching for critical data
export class UserProfileService {
  async saveUserProfile(uid: string, profileData: any) {
    try {
      // Save to Firestore
      await this.saveToFirestore(uid, profileData);
      // Cache locally for offline access
      await AsyncStorage.setItem(`profile_${uid}`, JSON.stringify(profileData));
    } catch (error) {
      // Queue for retry when online
      await this.queueForRetry(uid, profileData);
      throw error;
    }
  }
}
```

---

## 🗂️ **Code Organization & Maintenance**

### **File Naming Conventions**
```
PascalCase: Components, Screens, Services
camelCase: Functions, variables, file contents
kebab-case: Test files, configuration files
UPPER_CASE: Constants, environment variables
```

### **Import Organization**
```typescript
// 1. React & React Native imports
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';

// 2. Third-party libraries
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

// 3. Internal imports (contexts, services, components)
import { useUser } from '../../../contexts/UserContext';
import { authService } from '../../../services/authService';
import { Button } from '../../../components/common/Button';

// 4. Local imports (styles, types)
import * as S from './UpdateProfileScreen.styles';
import { UpdateProfileData } from './UpdateProfileScreen.types';
```

### **Component Structure Template**
```typescript
// ComponentName.tsx
import React from 'react';
import { ComponentProps } from './ComponentName.types';
import * as S from './ComponentName.styles';

export const ComponentName: React.FC<ComponentProps> = ({ 
  prop1, 
  prop2 = defaultValue 
}) => {
  // 1. Hooks
  const [state, setState] = useState();
  
  // 2. Event handlers
  const handleAction = () => {
    // Implementation
  };
  
  // 3. Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // 4. Render
  return (
    <S.Container>
      {/* JSX */}
    </S.Container>
  );
};

export default ComponentName;
```

---

## 👥 **Team Workflow & Standards**

### **Code Review Checklist**
- [ ] **TypeScript**: Proper interfaces and type safety
- [ ] **Styling**: No hardcoded values, uses theme system
- [ ] **i18n**: All user-facing text uses translation keys
- [ ] **Testing**: Proper testIDs and accessibility labels
- [ ] **Error Handling**: Try-catch blocks and user feedback
- [ ] **Performance**: Loading states and optimizations
- [ ] **Documentation**: Clear comments for complex logic

### **Git Commit Standards**
```
feat: add bio field to profile update screen
fix: resolve Firebase initialization order issue
style: update button styling to use theme colors
test: add Maestro test for profile editing flow
docs: update README with setup instructions
refactor: migrate Button component to TypeScript
```

### **Branch Naming Convention**
```
feature/profile-bio-field
fix/firebase-initialization-error
style/button-theme-integration
test/profile-maestro-tests
docs/setup-instructions
refactor/typescript-migration
```

### **Definition of Done**
- [ ] Feature implemented and tested locally
- [ ] TypeScript compilation passes without errors
- [ ] All existing tests pass
- [ ] New functionality has test coverage
- [ ] Code follows style guidelines
- [ ] Documentation updated if needed
- [ ] Code reviewed and approved
- [ ] No console errors or warnings

---

## 🎯 **Key Takeaways**

### **Critical Success Factors**
1. **Firebase Initialization Order** - Always import config first
2. **React Native Styling** - Use specific properties, not CSS shorthands
3. **Theme Validation** - Verify all theme properties exist
4. **Comprehensive Testing** - Include accessibility and error scenarios
5. **Proper i18n** - Never hardcode user-facing strings
6. **Error Handling** - Provide clear user feedback and logging
7. **TypeScript Migration** - Follow consistent patterns and folder structure

### **Common Pitfalls to Avoid**
- ❌ Using CSS shorthand properties in React Native
- ❌ Hardcoding strings instead of using i18n
- ❌ Missing testIDs and accessibility labels
- ❌ Improper Firebase initialization order
- ❌ Not handling offline scenarios
- ❌ Inconsistent error handling patterns

### **Team Excellence Principles**
- **Consistency**: Follow established patterns across the codebase
- **Documentation**: Keep guidelines updated with new learnings
- **Testing**: Comprehensive coverage including edge cases
- **User Experience**: Always consider loading states and error scenarios
- **Maintainability**: Write code that future team members can understand
- **Performance**: Consider offline scenarios and caching strategies

---

*This guideline is a living document. Update it as we learn new patterns and best practices from our React Native development journey.*

**Last Updated**: July 23, 2025  
**Project**: Profile UI Modernization & Firebase Integration  
**Team**: Madgical
