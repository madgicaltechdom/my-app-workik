import React, { createContext, useContext, ReactNode } from 'react';
import { UserProfile } from '@/types';

// Pre-define a safe profile with no empty strings
const SAFE_PROFILE: UserProfile = {
  uid: 'default-uid',
  email: 'user@example.com',
  displayName: 'Default User',
  phoneNumber: '+1234567890',
  photoURL: null,
  emailVerified: false,
  createdAt: new Date().toISOString(),
  bio: 'Default bio',
};

// Minimal interface
interface ProfileContextType {
  profile: UserProfile;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  hasUnsavedChanges: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  saveProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
  resetProfile: () => void;
}

// Create minimal context with hardcoded values
const ProfileContext = createContext<ProfileContextType>({
  profile: SAFE_PROFILE,
  isLoading: false,
  hasError: false,
  errorMessage: 'No error',
  hasUnsavedChanges: false,
  updateProfile: () => {},
  saveProfile: async () => {},
  refreshProfile: async () => {},
  clearError: () => {},
  resetProfile: () => {},
});

interface ProfileProviderProps {
  children: React.ReactNode;
}
// Ultra-minimal provider without any TypeScript annotations in the function declaration
export function ProfileProvider(props: ProfileProviderProps) {
  if (!props || !props.children) {
    console.error('[ProfileProvider] props.children is', props);
    return null;
  }
  // Create context value object
  const value = {
    profile: SAFE_PROFILE,
    isLoading: false,
    hasError: false,
    errorMessage: 'No error',
    hasUnsavedChanges: false,
    updateProfile: () => {},
    saveProfile: async () => {},
    refreshProfile: async () => {},
    clearError: () => {},
    resetProfile: () => {},
  };
  
  // Use React.createElement instead of JSX to avoid potential bridge issues
  return React.createElement(
    ProfileContext.Provider,
    { value },
    props.children
  );
}

// Simple hook
export function useProfile(): ProfileContextType {
  return useContext(ProfileContext);
}
