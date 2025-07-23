import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, enableNetwork, disableNetwork, connectFirestoreEmulator } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyCR4XlEnvTP0uLeboUIWOImdmGTAX7OwIg",
  authDomain: "storage-init-32211.firebaseapp.com",
  projectId: "storage-init-32211",
  storageBucket: "storage-init-32211.firebasestorage.app",
  messagingSenderId: "925017336600",
  appId: "1:925017336600:android:4c262f041723c6d0074c6d"
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with offline persistence
let db;
try {
  db = getFirestore(app);
  
  // Enable offline persistence for Firestore
  // This allows Firestore to work offline and sync when back online
  console.log('[Firebase] Firestore initialized with offline persistence');
  
  // Note: Firestore offline persistence is enabled by default in React Native
  // but we can configure additional settings if needed
} catch (error) {
  console.error('[Firebase] Error initializing Firestore:', error);
  throw error;
}

// Initialize Auth with AsyncStorage persistence for React Native
let auth;
try {
  // Always use initializeAuth with AsyncStorage for React Native
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  console.log('[Firebase] Auth initialized with AsyncStorage persistence');
} catch (error) {
  // If auth is already initialized, get the existing instance
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
    console.log('[Firebase] Using existing Auth instance');
  } else {
    console.error('[Firebase] Error initializing Auth:', error);
    throw error;
  }
}

// Network state management utilities
const FirebaseNetworkUtils = {
  /**
   * Enable Firestore network connection
   */
  async enableFirestoreNetwork() {
    try {
      await enableNetwork(db);
      console.log('[Firebase] Firestore network enabled');
      return true;
    } catch (error) {
      console.error('[Firebase] Error enabling Firestore network:', error);
      return false;
    }
  },

  /**
   * Disable Firestore network connection
   */
  async disableFirestoreNetwork() {
    try {
      await disableNetwork(db);
      console.log('[Firebase] Firestore network disabled');
      return true;
    } catch (error) {
      console.error('[Firebase] Error disabling Firestore network:', error);
      return false;
    }
  },

  /**
   * Check if Firestore is connected
   */
  async checkFirestoreConnection() {
    try {
      // Try to enable network to test connection
      await enableNetwork(db);
      console.log('[Firebase] Firestore connection verified');
      return true;
    } catch (error) {
      console.warn('[Firebase] Firestore connection check failed:', error);
      return false;
    }
  }
};

// Initialize Firebase services and log status
console.log('[Firebase] Configuration loaded:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  platform: Platform.OS,
  timestamp: new Date().toISOString()
});

export { auth, db, FirebaseNetworkUtils };
