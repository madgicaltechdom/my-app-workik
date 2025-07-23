import { useState, useEffect, useCallback, useMemo } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../services/firebaseConfig';

interface FirebaseAuthState {
  user: User | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

interface UseFirebaseAuthReturn {
  user: User | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
}

const USER_STORAGE_KEY = '@auth_user';

function useFirebaseAuth(): UseFirebaseAuthReturn {
  const [state, setState] = useState<FirebaseAuthState>({
    user: null,
    isLoading: true,
    hasError: false,
    errorMessage: undefined,
  });

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasError: false,
      errorMessage: undefined,
    }));
  }, []);

  const updateUserState = useCallback(async (currentUser: User | null) => {
    try {
      if (currentUser) {
        // Sanitize user data to prevent empty string errors
        const userData = {
          uid: currentUser.uid || 'unknown-uid',
          email: currentUser.email || 'no-email@example.com',
          displayName: currentUser.displayName || 'Anonymous User',
          emailVerified: currentUser.emailVerified || false,
          photoURL: currentUser.photoURL || null,
          phoneNumber: currentUser.phoneNumber || 'No Phone Number',
        };
        
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        
        setState(prev => ({
          ...prev,
          user: {
            ...currentUser,
            // Ensure these fields are never empty strings for React Native bridge
            email: currentUser.email || 'no-email@example.com',
            displayName: currentUser.displayName || 'Anonymous User',
            phoneNumber: currentUser.phoneNumber || 'No Phone Number',
          } as User,
          isLoading: false,
          hasError: false,
          errorMessage: undefined,
        }));
      } else {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
        
        setState(prev => ({
          ...prev,
          user: null,
          isLoading: false,
          hasError: false,
          errorMessage: undefined,
        }));
      }
    } catch (error) {
      console.error('Error updating user state:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        hasError: true,
        errorMessage: 'Failed to update authentication state',
      }));
    }
  }, []);

  const checkCachedUser = useCallback(async () => {
    try {
      const cachedUserData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (cachedUserData) {
        const userData = JSON.parse(cachedUserData);
        // Note: This is cached data, not a full User object
        // The real auth state will be updated when onAuthStateChanged fires
        setState(prev => ({
          ...prev,
          user: userData as User,
          isLoading: true, // Keep loading true until real auth state is confirmed
        }));
      }
    } catch (error) {
      console.error('Error checking cached user:', error);
      setState(prev => ({
        ...prev,
        hasError: true,
        errorMessage: 'Failed to load cached authentication data',
      }));
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, hasError: false }));
    
    try {
      // Force refresh the current user
      if (auth.currentUser) {
        await auth.currentUser.reload();
        await updateUserState(auth.currentUser);
      } else {
        await updateUserState(null);
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        hasError: true,
        errorMessage: 'Failed to refresh authentication',
      }));
    }
  }, [updateUserState]);

  useEffect(() => {
    let isMounted = true;

    // Check for cached user on initial load
    checkCachedUser();

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (isMounted) {
          await updateUserState(currentUser);
        }
      },
      (error) => {
        console.error('Auth state change error:', error);
        if (isMounted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            hasError: true,
            errorMessage: 'Authentication error occurred',
          }));
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [updateUserState, checkCachedUser]);

  return {
    user: state.user,
    isLoading: state.isLoading,
    hasError: state.hasError,
    errorMessage: state.errorMessage,
    refreshAuth,
    clearError,
  };
}

export { useFirebaseAuth };
export type { UseFirebaseAuthReturn, FirebaseAuthState };
