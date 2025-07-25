import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { LoadingOverlay } from '../components/common/LoadingOverlay';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  linking?: LinkingOptions<RootStackParamList>;
}

export const AppNavigator: React.FC<AppNavigatorProps> = (props) => {
  // Safely wrap the hook call to avoid the bridge error
  let user = null;
  let isLoading = true;
  
  try {
    // Try to use the hook, but with a safety fallback
    const authState = useFirebaseAuth();
    user = authState?.user || null;
    isLoading = authState?.isLoading || false;
  } catch (error) {
    console.error('Error using Firebase Auth:', error);
    // Fallback values for safety
    user = null;
    isLoading = false;
  }
  
  const linking = props?.linking || undefined;

  if (isLoading) {
    console.log('[AppNavigator] Showing LoadingOverlay');
 
    return (
      <LoadingOverlay 
        variant="modal"
        message="Loading..."
        testID="app-loading-overlay"
      />
    );
  }
  console.log('[AppNavigator] Showing NavigationContainer');

  // Removed duplicate ProfileProvider (already in App.tsx)
  return (
    <NavigationContainer
      {...(linking ? { linking } : {})}
    >
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
