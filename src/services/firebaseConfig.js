
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Expo Go compatible Auth initialization with AsyncStorage persistence
const auth =
  typeof window === 'undefined'
    ? initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      })
    : getAuth(app);

export { auth, app };
