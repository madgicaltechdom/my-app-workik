import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { UserProfile } from '../types';
import { authService } from '../services/authService';
import { auth } from '../services/firebaseConfig';
import { userProfileService } from '../services/userProfileService';
import { onAuthStateChanged, User as FirebaseUser, Auth, updateProfile, getAuth } from 'firebase/auth';

// Add type assertion for the auth instance
const authInstance = getAuth();

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateUser: (userData: Partial<UserProfile>) => Promise<UserProfile>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  console.log('[UserContext] Initializing UserProvider');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map Firebase User to our UserProfile type and merge with Firestore data
  const mapFirebaseUser = async (firebaseUser: FirebaseUser | null): Promise<UserProfile | null> => {
    console.log('[UserContext] Mapping Firebase user:', firebaseUser ? firebaseUser.uid : 'null');
    if (!firebaseUser) return null;
    
    // Log each field individually to catch empty strings
    const email = firebaseUser.email || 'user@example.com';
    const displayName = firebaseUser.displayName || 'User';
    const phoneNumber = firebaseUser.phoneNumber || null;
    
    console.log('[UserContext] Mapping Firebase Auth fields:', {
      email: `"${email}"`,
      displayName: `"${displayName}"`,
      phoneNumber: phoneNumber === null ? 'null' : `"${phoneNumber}"`,
      emailOriginal: firebaseUser.email === null ? 'null' : `"${firebaseUser.email}"`,
      displayNameOriginal: firebaseUser.displayName === null ? 'null' : `"${firebaseUser.displayName}"`,
      phoneNumberOriginal: firebaseUser.phoneNumber === null ? 'null' : `"${firebaseUser.phoneNumber}"`
    });
    
    // Base profile from Firebase Auth
    const baseProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: email,
      displayName: displayName,
      phoneNumber: phoneNumber,
      photoURL: firebaseUser.photoURL || null,
      emailVerified: firebaseUser.emailVerified,
    };
    
    try {
      // Fetch custom profile data from Firestore
      console.log('[UserContext] Fetching custom profile data from Firestore for user:', firebaseUser.uid);
      const firestoreResult = await userProfileService.getUserProfile(firebaseUser.uid);
      
      if (firestoreResult.success && firestoreResult.data) {
        console.log('[UserContext] Firestore profile data found:', firestoreResult.data);
        
        // Merge Firebase Auth data with Firestore data
        const mergedProfile: UserProfile = {
          ...baseProfile,
          // Override with Firestore data if available
          phoneNumber: firestoreResult.data.phoneNumber || baseProfile.phoneNumber,
          bio: firestoreResult.data.bio,
          firstName: firestoreResult.data.firstName,
          lastName: firestoreResult.data.lastName,
          dateOfBirth: firestoreResult.data.dateOfBirth,
        };
        
        console.log('[UserContext] Merged profile (Auth + Firestore):', JSON.stringify(mergedProfile, null, 2));
        return mergedProfile;
      } else {
        console.log('[UserContext] No Firestore profile data found, using Firebase Auth data only');
        console.log('[UserContext] Final profile (Auth only):', JSON.stringify(baseProfile, null, 2));
        return baseProfile;
      }
    } catch (error) {
      console.error('[UserContext] Error fetching Firestore profile data:', error);
      console.log('[UserContext] Falling back to Firebase Auth data only');
      return baseProfile;
    }
  };

  // Refresh user data from Firebase Auth and Firestore
  const refreshUser = async (): Promise<void> => {
    console.log('[UserContext] Refreshing user data');
    try {
      setIsLoading(true);
      const firebaseUser = authInstance.currentUser;
      console.log('[UserContext] Current Firebase user:', firebaseUser ? `exists (${firebaseUser.uid})` : 'null');
      
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken(true); // Force token refresh
        console.log('[UserContext] Firebase token retrieved');
        
        const userProfile = await mapFirebaseUser(firebaseUser);
        console.log('[UserContext] Refreshed user profile:', userProfile);
        setUser(userProfile);
      } else {
        console.log('[UserContext] No user is currently signed in');
        setUser(null);
      }
      setError(null);
    } catch (error) {
      console.error('[UserContext] Error refreshing user:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh user data');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    console.log('[UserContext] Setting up auth state listener');
    
    const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
      console.log('[UserContext] Auth state changed, user:', firebaseUser ? `exists (${firebaseUser.uid})` : 'null');
      
      try {
        if (firebaseUser) {
          console.log('[UserContext] Firebase user authenticated:', {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            phoneNumber: firebaseUser.phoneNumber,
          });
          
          const token = await firebaseUser.getIdToken();
          console.log('[UserContext] Firebase token retrieved');
          
          // Use the enhanced mapFirebaseUser function to get merged profile data
          const userProfile = await mapFirebaseUser(firebaseUser);
          
          console.log('[UserContext] Setting user state:', userProfile);
          setUser(userProfile);
        } else {
          console.log('[UserContext] No user signed in');
          setUser(null);
        }
      } catch (error) {
        console.error('[UserContext] Error in auth state change:', error);
        setError(error instanceof Error ? error.message : 'Authentication error');
      } finally {
        setIsLoading(false);
      }
      
      console.log('[UserContext] Auth state update complete');
    });

    // Initial check
    refreshUser().catch(console.error);

    // Cleanup subscription on unmount
    return () => {
      console.log('[UserContext] Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const updateUser = async (userData: Partial<UserProfile>) => {
    console.log('[UserContext] Updating user with data:', userData);
    if (!user) {
      console.error('[UserContext] Cannot update user: No user is currently logged in');
      throw new Error('No user is currently logged in');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Update Firebase Auth profile if displayName or photoURL is being updated
      if (authInstance.currentUser && (userData.displayName !== undefined || userData.photoURL !== undefined)) {
        console.log('[UserContext] Updating Firebase Auth profile');
        await updateProfile(authInstance.currentUser, {
          displayName: userData.displayName ?? user.displayName,
          photoURL: (userData.photoURL ?? user.photoURL) || undefined,
        });
        
        // Update local state with the new data
        const updatedUser = { ...user, ...userData };
        console.log('[UserContext] User updated successfully:', updatedUser);
        setUser(updatedUser);
        
        // Here you would typically update the user in your backend/database
        // await updateUserInDatabase(updatedUser);
        
        return updatedUser;
      }
    } catch (error) {
      console.error('[UserContext] Error updating user:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(() => ({
    user,
    isLoading,
    error,
    updateUser,
    refreshUser,
  }), [user, isLoading, error, updateUser, refreshUser]);

  console.log('[UserContext] Rendering UserProvider with value:', {
    user: user ? 'exists' : 'null',
    isLoading,
    error,
  });

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  console.log('[useUser] Hook called');
  const context = useContext(UserContext);
  if (context === undefined) {
    console.error('[useUser] must be used within a UserProvider');
    throw new Error('useUser must be used within a UserProvider');
  }
  console.log('[useUser] Returning context:', {
    user: context.user ? 'exists' : 'null',
    isLoading: context.isLoading,
    error: context.error,
  });
  return context;
};

export { UserProvider, useUser };

export default UserProvider;
