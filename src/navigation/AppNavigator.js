import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { ProfileProvider } from '../features/profile/contexts/ProfileContext';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import LoadingOverlay from '../components/common/LoadingOverlay';

const Stack = createStackNavigator();

const AppNavigator = ({ linking }) => {
  const { user, loading } = useFirebaseAuth();

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <ProfileProvider>
      <NavigationContainer linking={linking}>
        {user ? <TabNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </ProfileProvider>
  );
};

export default AppNavigator;
