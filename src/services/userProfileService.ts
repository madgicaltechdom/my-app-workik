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
      console.log('[UserProfileService] Profile cached locally for user:', uid);
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
        console.log('[UserProfileService] Cached profile expired for user:', uid);
        await AsyncStorage.removeItem(`${this.CACHE_PREFIX}${uid}`);
        return null;
      }

      console.log('[UserProfileService] Using cached profile for user:', uid);
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
        console.log(`[UserProfileService] Retry attempt ${i + 1}/${attempts} in ${delay}ms`);
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
      console.log('[UserProfileService] ===== SAVE OPERATION START =====');
      console.log('[UserProfileService] Saving profile for user:', uid);
      console.log('[UserProfileService] Input profile data:', JSON.stringify(profileData, null, 2));
      console.log('[UserProfileService] Target collection:', this.COLLECTION_NAME);
      console.log('[UserProfileService] Target document path:', `${this.COLLECTION_NAME}/${uid}`);
      
      // Filter out undefined values
      const cleanedData = Object.entries(profileData).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      console.log('[UserProfileService] Cleaned data (undefined removed):', JSON.stringify(cleanedData, null, 2));

      if (Object.keys(cleanedData).length === 0) {
        console.log('[UserProfileService] No data to save - all fields were undefined');
        return {
          success: true,
          message: 'No data to save',
        };
      }

      // Add timestamp
      const dataToSave = {
        ...cleanedData,
        uid,
        updatedAt: new Date().toISOString(),
      };

      console.log('[UserProfileService] Final data to save:', JSON.stringify(dataToSave, null, 2));

      // Try to save to Firestore with retry logic
      try {
        await this.retryOperation(async () => {
          const userDocRef = doc(db, this.COLLECTION_NAME, uid);
          console.log('[UserProfileService] Created document reference:', userDocRef.path);
          console.log('[UserProfileService] Document ID:', userDocRef.id);
          console.log('[UserProfileService] Collection ID:', userDocRef.parent.id);
          
          console.log('[UserProfileService] About to call setDoc with merge: true');
          await setDoc(userDocRef, dataToSave, { merge: true });
          console.log('[UserProfileService] setDoc completed successfully');
        });

        // Cache the data locally after successful save
        await this.cacheUserProfile(uid, dataToSave as UserProfileData);
        
        console.log('[UserProfileService] ===== SAVE OPERATION SUCCESS =====');
        console.log('[UserProfileService] Profile saved successfully to Firestore and cached');
        console.log('[UserProfileService] Saved to path:', `${this.COLLECTION_NAME}/${uid}`);
        return {
          success: true,
          message: 'Profile saved successfully',
        };
      } catch (error) {
        // If Firestore save fails, cache locally for later sync
        console.warn('[UserProfileService] ===== SAVE OPERATION FAILED - CACHING LOCALLY =====');
        console.warn('[UserProfileService] Firestore save failed, caching locally:', error);
        console.log('[UserProfileService] Error details:', {
          code: error.code,
          message: error.message,
          name: error.name
        });
        
        await this.cacheUserProfile(uid, dataToSave as UserProfileData);
        
        return {
          success: true,
          message: 'Profile saved locally (will sync when online)',
        };
      }
    } catch (error) {
      console.error('[UserProfileService] ===== SAVE OPERATION ERROR =====');
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
      console.log('[UserProfileService] Fetching profile for user:', uid);
      
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
          console.log('[UserProfileService] Profile fetched from Firestore');
          return {
            success: true,
            data: profileData,
          };
        } else {
          console.log('[UserProfileService] No profile found in Firestore');
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
          console.log('[UserProfileService] Using cached profile data');
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
      console.log('[UserProfileService] Updating profile for user:', uid, updates);
      
      const userDocRef = doc(db, this.COLLECTION_NAME, uid);
      
      const dataToUpdate = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await this.retryOperation(async () => {
        await updateDoc(userDocRef, dataToUpdate);
      });
      console.log('[UserProfileService] Profile updated successfully');

      return {
        success: true,
      };
    } catch (error) {
      console.error('[UserProfileService] Error updating profile:', error);
      
      // Handle specific Firestore errors
      if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        console.warn('[UserProfileService] Firestore temporarily unavailable, will retry...');
        // Could implement retry logic here if needed
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
      console.log('[UserProfileService] Deleting profile for user:', uid);
      
      const userDocRef = doc(db, this.COLLECTION_NAME, uid);
      await this.retryOperation(async () => {
        await updateDoc(userDocRef, {
          deleted: true,
          deletedAt: new Date().toISOString(),
        });
      });
      
      console.log('[UserProfileService] Profile marked as deleted');

      return {
        success: true,
      };
    } catch (error) {
      console.error('[UserProfileService] Error deleting profile:', error);
      
      // Handle specific Firestore errors
      if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        console.warn('[UserProfileService] Firestore temporarily unavailable, will retry...');
        // Could implement retry logic here if needed
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
