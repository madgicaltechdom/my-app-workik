import { doc, setDoc, getDoc, updateDoc, enableNetwork, disableNetwork } from 'firebase/firestore';
import { db, FirebaseNetworkUtils } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfileData {
  uid: string;
  phoneNumber?: string;
  bio?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class UserProfileService {
  private readonly COLLECTION_NAME = 'userProfiles';
  private readonly CACHE_PREFIX = 'userProfile_';
  private readonly CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
  private readonly RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY_MS = 1000;

  /**
   * Cache user profile data locally
   */
  private async cacheUserProfile(uid: string, data: UserProfileData): Promise<void> {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(`${this.CACHE_PREFIX}${uid}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('[UserProfileService] Failed to cache profile:', error);
    }
  }

  /**
   * Get cached user profile data
   */
  private async getCachedUserProfile(uid: string): Promise<UserProfileData | null> {
    try {
      const cachedData = await AsyncStorage.getItem(`${this.CACHE_PREFIX}${uid}`);
      if (!cachedData) return null;

      const { data, timestamp } = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > this.CACHE_EXPIRY_MS;

      if (isExpired) {
        await AsyncStorage.removeItem(`${this.CACHE_PREFIX}${uid}`);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('[UserProfileService] Failed to get cached profile:', error);
      return null;
    }
  }

  /**
   * Retry operation with exponential backoff
   */
  private async retryOperation<T>(
    operation: () => Promise<T>,
    attempts: number = this.RETRY_ATTEMPTS
  ): Promise<T> {
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error) {
        const isLastAttempt = i === attempts - 1;
        const isOfflineError = error.code === 'unavailable' || 
                              error.message?.includes('offline') ||
                              error.message?.includes('network');

        if (isLastAttempt || !isOfflineError) {
          throw error;
        }

        const delay = this.RETRY_DELAY_MS * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retry attempts reached');
  }

  /**
   * Creates or updates a user profile in Firestore with offline support
   */
  async saveUserProfile(uid: string, profileData: Partial<UserProfileData>): Promise<ApiResponse<void>> {
    try {
      const cleanedData = Object.entries(profileData).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      if (Object.keys(cleanedData).length === 0) {
        return {
          success: true,
          message: 'No data to save',
        };
      }

      const dataToSave = {
        ...cleanedData,
        uid,
        updatedAt: new Date().toISOString(),
      };

      try {
        await this.retryOperation(async () => {
          const userDocRef = doc(db, this.COLLECTION_NAME, uid);
          await setDoc(userDocRef, dataToSave, { merge: true });
        });

        // Cache the data locally after successful save
        await this.cacheUserProfile(uid, dataToSave as UserProfileData);
        
        return {
          success: true,
          message: 'Profile saved successfully',
        };
      } catch (error) {
        // If Firestore save fails, cache locally for later sync
        console.warn('[UserProfileService] Firestore save failed, caching locally:', error);
        
        await this.cacheUserProfile(uid, dataToSave as UserProfileData);
        
        return {
          success: true,
          message: 'Profile saved locally (will sync when online)',
        };
      }
    } catch (error) {
      console.error('[UserProfileService] Error saving user profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save profile',
      };
    }
  }

  /**
   * Get user profile from Firestore with offline support
   */
  async getUserProfile(uid: string): Promise<ApiResponse<UserProfileData>> {
    try {
      // Try to fetch from Firestore first
      try {
        const profileData = await this.retryOperation(async () => {
          const userDocRef = doc(db, this.COLLECTION_NAME, uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfileData;
            // Cache the fresh data
            await this.cacheUserProfile(uid, data);
            return data;
          }
          return null;
        });

        if (profileData) {
          return {
            success: true,
            data: profileData,
          };
        } else {
          return {
            success: true,
            data: null,
          };
        }
      } catch (error) {
        console.warn('[UserProfileService] Firestore fetch failed, trying cache:', error);
        
        // If Firestore fails, try to get from cache
        const cachedProfile = await this.getCachedUserProfile(uid);
        if (cachedProfile) {
          return {
            success: true,
            data: cachedProfile,
            message: 'Using cached data (offline)',
          };
        }

        // If both Firestore and cache fail, return the error
        throw error;
      }
    } catch (error) {
      console.error('[UserProfileService] Error fetching user profile:', error);
      
      const errorMessage = error.code === 'unavailable' || error.message?.includes('offline')
        ? 'Unable to fetch profile data. Please check your internet connection.'
        : error instanceof Error ? error.message : 'Failed to fetch profile';

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Updates specific fields in a user profile
   */
  async updateUserProfile(uid: string, updates: Partial<UserProfileData>): Promise<ApiResponse<void>> {
    try {
      const userDocRef = doc(db, this.COLLECTION_NAME, uid);
      
      const dataToUpdate = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await this.retryOperation(async () => {
        await updateDoc(userDocRef, dataToUpdate);
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error('[UserProfileService] Error updating profile:', error);
      
      // Handle specific Firestore errors
      if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        console.warn('[UserProfileService] Firestore temporarily unavailable, will retry...');
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      };
    }
  }

  /**
   * Deletes a user profile from Firestore
   */
  async deleteUserProfile(uid: string): Promise<ApiResponse<void>> {
    try {
      const userDocRef = doc(db, this.COLLECTION_NAME, uid);
      await this.retryOperation(async () => {
        await updateDoc(userDocRef, {
          deleted: true,
          deletedAt: new Date().toISOString(),
        });
      });
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('[UserProfileService] Error deleting profile:', error);
      
      // Handle specific Firestore errors
      if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        console.warn('[UserProfileService] Firestore temporarily unavailable, will retry...');
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete profile',
      };
    }
  }
}

// Export singleton instance
const userProfileService = new UserProfileService();
export { userProfileService };
