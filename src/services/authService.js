import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export const authService = {
  signup: async (email, password) => {
    try {
      console.log('Attempting signup with:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signup successful:', userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Signup error:', error.code, error.message);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      console.log('Attempting login with:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      console.log('Attempting logout');
      await signOut(auth);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error.code, error.message);
      throw error;
    }
  }
};
