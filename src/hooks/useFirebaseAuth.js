import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Store user info in AsyncStorage for offline access
        await AsyncStorage.setItem('user', JSON.stringify(currentUser));
        setUser(currentUser);
      } else {
        await AsyncStorage.removeItem('user');
        setUser(null);
      }
      setLoading(false);
    });

    // Check for cached user on initial load
    const checkCachedUser = async () => {
      const cachedUser = await AsyncStorage.getItem('user');
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      }
    };

    checkCachedUser();

    return () => unsubscribe();
  }, []);

  return { user, loading };
};
