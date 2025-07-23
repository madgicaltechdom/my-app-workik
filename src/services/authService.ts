import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  User,
  UserCredential,
  AuthError,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { auth } from './firebaseConfig';
import { userProfileService } from './userProfileService';
import { UserProfile, ApiResponse } from '@/types';
import { validateEmail, validatePassword, sanitizeInput } from '@/utils/validation';

interface AuthServiceError {
  code: string;
  message: string;
  originalError?: AuthError;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials extends LoginCredentials {
  displayName?: string;
  firstName?: string;
  lastName?: string;
}

interface UpdateProfileData {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  bio?: string;
}

class AuthService {
  private readonly AUTH_STORAGE_KEY = '@auth_state';
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  /**
   * Sanitizes and validates authentication credentials
   */
  private validateCredentials(credentials: LoginCredentials): void {
    const emailValidation = validateEmail(credentials.email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.errorMessage || 'Invalid email');
    }

    const passwordValidation = validatePassword(credentials.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errorMessage || 'Invalid password');
    }
  }

  /**
   * Handles Firebase Auth errors and converts them to user-friendly messages
   */
  private handleAuthError(error: AuthError): AuthServiceError {
    const authError: AuthServiceError = {
      code: error.code,
      message: this.getErrorMessage(error.code),
      originalError: error,
    };

    // Log error for debugging (remove in production or use proper logging service)
    console.error('Auth Service Error:', {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });

    return authError;
  }

  /**
   * Maps Firebase error codes to user-friendly messages
   */
  private getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
      'auth/requires-recent-login': 'Please log in again to perform this action.',
      'auth/invalid-credential': 'Invalid credentials provided.',
      'auth/credential-already-in-use': 'This credential is already associated with another account.',
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  }

  /**
   * Retry mechanism for network-related failures
   */
  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxAttempts: number = this.MAX_RETRY_ATTEMPTS
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry for non-network errors
        if (error instanceof Error && !error.message.includes('network')) {
          throw error;
        }

        if (attempt === maxAttempts) {
          throw lastError;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt));
      }
    }

    throw lastError!;
  }

  /**
   * Caches authentication state for offline access
   */
  private async cacheAuthState(user: User | null): Promise<void> {
    try {
      if (user) {
        const authState = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          lastSignInTime: user.metadata.lastSignInTime,
          creationTime: user.metadata.creationTime,
        };
        await AsyncStorage.setItem(this.AUTH_STORAGE_KEY, JSON.stringify(authState));
      } else {
        await AsyncStorage.removeItem(this.AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error caching auth state:', error);
    }
  }

  /**
   * Signs up a new user with email and password
   */
  async signup(credentials: SignupCredentials): Promise<ApiResponse<UserProfile>> {
    try {
      // Sanitize inputs
      const sanitizedCredentials = {
        email: sanitizeInput(credentials.email),
        password: credentials.password, // Don't sanitize password as it might remove valid characters
        displayName: credentials.displayName ? sanitizeInput(credentials.displayName) : undefined,
        firstName: credentials.firstName ? sanitizeInput(credentials.firstName) : undefined,
        lastName: credentials.lastName ? sanitizeInput(credentials.lastName) : undefined,
      };

      // Validate credentials
      this.validateCredentials(sanitizedCredentials);

      const result = await this.retryOperation(async () => {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(
          auth,
          sanitizedCredentials.email,
          sanitizedCredentials.password
        );

        // Update profile if display name provided
        if (sanitizedCredentials.displayName) {
          await updateProfile(userCredential.user, {
            displayName: sanitizedCredentials.displayName,
          });
        }

        return userCredential;
      });

      // Cache auth state
      await this.cacheAuthState(result.user);

      const userProfile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        emailVerified: result.user.emailVerified,
        photoURL: result.user.photoURL,
        phoneNumber: result.user.phoneNumber,
        firstName: sanitizedCredentials.firstName,
        lastName: sanitizedCredentials.lastName,
        createdAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: userProfile,
        message: 'Account created successfully',
      };
    } catch (error) {
      const authError = this.handleAuthError(error as AuthError);
      return {
        success: false,
        error: authError.message,
      };
    }
  }

  /**
   * Signs in a user with email and password
   */
  async login(email: string, password: string): Promise<ApiResponse<UserProfile>> {
    try {
      const credentials = {
        email: sanitizeInput(email),
        password, // Don't sanitize password
      };

      // Validate credentials
      this.validateCredentials(credentials);

      const result = await this.retryOperation(async () => {
        return await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      });

      // Cache auth state
      await this.cacheAuthState(result.user);

      const userProfile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        emailVerified: result.user.emailVerified,
        photoURL: result.user.photoURL,
        phoneNumber: result.user.phoneNumber,
      };

      return {
        success: true,
        data: userProfile,
        message: 'Login successful',
      };
    } catch (error) {
      const authError = this.handleAuthError(error as AuthError);
      return {
        success: false,
        error: authError.message,
      };
    }
  }

  /**
   * Signs out the current user
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      await this.retryOperation(async () => {
        await signOut(auth);
      });

      // Clear cached auth state
      await this.cacheAuthState(null);

      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      const authError = this.handleAuthError(error as AuthError);
      return {
        success: false,
        error: authError.message,
      };
    }
  }

  /**
   * Sends a password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<ApiResponse<void>> {
    try {
      const sanitizedEmail = sanitizeInput(email);
      const emailValidation = validateEmail(sanitizedEmail);
      
      if (!emailValidation.isValid) {
        return {
          success: false,
          error: emailValidation.errorMessage || 'Invalid email',
        };
      }

      await this.retryOperation(async () => {
        await sendPasswordResetEmail(auth, sanitizedEmail);
      });

      return {
        success: true,
        message: 'Password reset email sent successfully',
      };
    } catch (error) {
      const authError = this.handleAuthError(error as AuthError);
      return {
        success: false,
        error: authError.message,
      };
    }
  }

  /**
   * Updates the current user's profile
   */
  async updateUserProfile(profileData: UpdateProfileData): Promise<ApiResponse<void>> {
    try {
      console.log('[authService] ===== UPDATE PROFILE START =====');
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('[authService] No user is currently signed in');
        return {
          success: false,
          error: 'No user is currently signed in',
        };
      }

      console.log('[authService] Current user UID:', currentUser.uid);
      console.log('[authService] Input profile data:', JSON.stringify(profileData, null, 2));

      const sanitizedData = {
        displayName: profileData.displayName ? sanitizeInput(profileData.displayName) : undefined,
        firstName: profileData.firstName ? sanitizeInput(profileData.firstName) : undefined,
        lastName: profileData.lastName ? sanitizeInput(profileData.lastName) : undefined,
        phoneNumber: profileData.phoneNumber ? sanitizeInput(profileData.phoneNumber) : undefined,
        dateOfBirth: profileData.dateOfBirth ? sanitizeInput(profileData.dateOfBirth) : undefined,
        bio: profileData.bio ? sanitizeInput(profileData.bio) : undefined,
      };
      
      console.log('[authService] Sanitized data:', JSON.stringify(sanitizedData, null, 2));

      await this.retryOperation(async () => {
        // Update Firebase Auth profile (displayName only)
        const updateData: any = {};
        
        if (sanitizedData.displayName) {
          updateData.displayName = sanitizedData.displayName;
        }
        
        console.log('[authService] Firebase Auth update data:', JSON.stringify(updateData, null, 2));
        
        // Update Firebase Auth with supported fields
        if (Object.keys(updateData).length > 0) {
          console.log('[authService] Updating Firebase Auth profile...');
          await updateProfile(currentUser, updateData);
          console.log('[authService] Firebase Auth profile updated successfully');
        } else {
          console.log('[authService] No Firebase Auth fields to update');
        }
        
        // Save custom fields to Firestore
        const customFields = {
          phoneNumber: sanitizedData.phoneNumber,
          bio: sanitizedData.bio,
          firstName: sanitizedData.firstName,
          lastName: sanitizedData.lastName,
          dateOfBirth: sanitizedData.dateOfBirth,
        };

        console.log('[authService] Custom fields for Firestore:', JSON.stringify(customFields, null, 2));

        // Only save to Firestore if there are custom fields to save
        const hasCustomFields = Object.values(customFields).some(value => value !== undefined);
        
        console.log('[authService] Has custom fields to save:', hasCustomFields);
        
        if (hasCustomFields) {
          console.log('[authService] Calling userProfileService.saveUserProfile...');
          console.log('[authService] UID:', currentUser.uid);
          console.log('[authService] Custom fields:', JSON.stringify(customFields, null, 2));
          
          const firestoreResult = await userProfileService.saveUserProfile(currentUser.uid, customFields);
          
          console.log('[authService] Firestore save result:', JSON.stringify(firestoreResult, null, 2));
          
          if (!firestoreResult.success) {
            console.error('[authService] Firestore save failed:', firestoreResult.error);
            throw new Error(`Failed to save profile to Firestore: ${firestoreResult.error}`);
          }
          
          console.log('[authService] Custom fields saved to Firestore successfully');
        } else {
          console.log('[authService] No custom fields to save to Firestore');
        }
      });

      // Update cached auth state
      await this.cacheAuthState(currentUser);

      console.log('[authService] ===== UPDATE PROFILE SUCCESS =====');
      return {
        success: true,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      console.error('[authService] ===== UPDATE PROFILE ERROR =====');
      console.error('[authService] Error updating profile:', error);
      const authError = this.handleAuthError(error as AuthError);
      return {
        success: false,
        error: authError.message,
      };
    }
  }

  /**
   * Updates the current user's email
   */
  async updateUserEmail(newEmail: string): Promise<ApiResponse<void>> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return {
          success: false,
          error: 'No user is currently signed in',
        };
      }

      const sanitizedEmail = sanitizeInput(newEmail);
      const emailValidation = validateEmail(sanitizedEmail);
      
      if (!emailValidation.isValid) {
        return {
          success: false,
          error: emailValidation.errorMessage || 'Invalid email',
        };
      }

      await this.retryOperation(async () => {
        await updateEmail(currentUser, sanitizedEmail);
      });

      // Update cached auth state
      await this.cacheAuthState(currentUser);

      return {
        success: true,
        message: 'Email updated successfully',
      };
    } catch (error) {
      const authError = this.handleAuthError(error as AuthError);
      return {
        success: false,
        error: authError.message,
      };
    }
  }

  /**
   * Updates the current user's password
   */
  async updateUserPassword(newPassword: string): Promise<ApiResponse<void>> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return {
          success: false,
          error: 'No user is currently signed in',
        };
      }

      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: passwordValidation.errorMessage || 'Invalid password',
        };
      }

      await this.retryOperation(async () => {
        await updatePassword(currentUser, newPassword);
      });

      return {
        success: true,
        message: 'Password updated successfully',
      };
    } catch (error) {
      const authError = this.handleAuthError(error as AuthError);
      return {
        success: false,
        error: authError.message,
      };
    }
  }

  /**
   * Deletes the current user's account
   */
  async deleteUserAccount(): Promise<ApiResponse<void>> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return {
          success: false,
          error: 'No user is currently signed in',
        };
      }

      await this.retryOperation(async () => {
        await deleteUser(currentUser);
      });

      // Clear cached auth state
      await this.cacheAuthState(null);

      return {
        success: true,
        message: 'Account deleted successfully',
      };
    } catch (error) {
      const authError = this.handleAuthError(error as AuthError);
      return {
        success: false,
        error: authError.message,
      };
    }
  }

  /**
   * Gets the current user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Checks if a user is currently authenticated
   */
  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }
}

// Export singleton instance
const authService = new AuthService();
export { authService };
export type { LoginCredentials, SignupCredentials, UpdateProfileData, AuthServiceError };
