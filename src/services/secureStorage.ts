import EncryptedStorage from 'react-native-encrypted-storage';

export async function saveSensitiveData(key: string, value: string) {
  try {
    await EncryptedStorage.setItem(key, value);
  } catch (error) {
    console.error('Error saving sensitive data:', error);
  }
}

export async function getSensitiveData(key: string): Promise<string | null> {
  try {
    return await EncryptedStorage.getItem(key);
  } catch (error) {
    console.error('Error getting sensitive data:', error);
    return null;
  }
}

export async function removeSensitiveData(key: string) {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing sensitive data:', error);
  }
}
