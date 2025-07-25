import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { MainStackParamList } from '../types';
import { theme as lightTheme, darkTheme } from '../theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authService } from '../services/authService';

// Import screens with error boundaries
import HomeScreen from '../features/home/screens/HomeScreen';
import SettingsScreen from '../features/settings/screens/SettingsScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';
import UpdateProfileScreen from '../features/profile/screens/UpdateProfileScreen';

console.log('[TabNavigator] Initializing navigation...');

const Tab = createBottomTabNavigator<MainStackParamList>();
const ProfileStack = createNativeStackNavigator<MainStackParamList>();

// Error boundary component
const ErrorFallback = ({ error }: { error: Error }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>Something went wrong:</Text>
    <Text style={styles.errorDetails}>{error.message}</Text>
    <Text style={styles.errorStack}>{error.stack}</Text>
  </View>
);

const ProfileStackScreen = () => {
  console.log('[TabNavigator] Rendering ProfileStackScreen');
  
  try {
    const { user } = useUser();
    console.log('[TabNavigator] User in ProfileStackScreen:', user ? 'exists' : 'null');
    
    return (
      <ProfileStack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyle: { backgroundColor: lightTheme.colors.background }
        }}
      >
        <ProfileStack.Screen 
          name="ProfileMain" 
          component={ProfileScreen}
          initialParams={{ user }}
        />
        <ProfileStack.Screen 
          name="UpdateProfile" 
          component={UpdateProfileScreen}
          options={{
            title: 'Update Profile',
            headerShown: true,
            headerBackTitle: 'Back',
            headerStyle: {
              backgroundColor: lightTheme.colors.background,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: lightTheme.colors.text,
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        />
      </ProfileStack.Navigator>
    );
  } catch (error) {
    console.error('[TabNavigator] Error in ProfileStackScreen:', error);
    return <ErrorFallback error={error as Error} />;
  }
};

// Tab navigator with error boundary
export const TabNavigator: React.FC = () => {
  console.log('[TabNavigator] Rendering TabNavigator');
  
  try {
    const colorScheme = useColorScheme() || 'light';
    const isDark = colorScheme === 'dark';
    const currentTheme = isDark ? darkTheme : lightTheme;
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    const handleLogout = async () => {
      try {
        const result = await authService.logout();
        if (!result.success) {
          console.error('Logout failed:', result.error);
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    const screenOptions = (route: any) => {
      const options: any = {
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerStyle: {
          backgroundColor: currentTheme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.colors.border,
        },
        headerTitleStyle: {
          color: currentTheme.colors.text,
          fontWeight: 'bold',
        },
        headerRight: () => (
          <TouchableOpacity 
            onPress={handleLogout}
            style={styles.logoutButton}
            accessibilityLabel="Logout"
            testID="logout-button"
          >
            <Ionicons 
              name="log-out-outline" 
              size={24} 
              color={currentTheme.colors.text} 
              accessibilityLabel="Logout"
            />
          </TouchableOpacity>
        ),
      };
      return options;
    };

    const tabBarOptions = {
      activeTintColor: currentTheme.colors.primary,
      inactiveTintColor: currentTheme.colors.gray,
      style: {
        backgroundColor: currentTheme.colors.background,
        borderTopWidth: 0,
        paddingBottom: insets.bottom > 0 ? insets.bottom - 8 : 8,
        height: 60 + (insets.bottom > 0 ? insets.bottom - 8 : 8),
        elevation: 0,
        shadowOpacity: 0,
      },
      labelStyle: {
        fontSize: 12,
        margin: 0,
        padding: 0,
      },
      tabStyle: {
        padding: 4,
      },
    };

    return (
      <Tab.Navigator
        screenOptions={({ route }) => screenOptions(route)}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Home',
            tabBarTestID: 'home-tab',
          }}
        />
        <Tab.Screen 
          name="ProfileTab" 
          component={ProfileStackScreen}
          options={{
            title: 'Profile',
            tabBarTestID: 'profile-tab',
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            title: 'Settings',
            tabBarTestID: 'settings-tab',
          }}
        />
      </Tab.Navigator>
    );
  } catch (error) {
    console.error('[TabNavigator] Error in TabNavigator:', error);
    return <ErrorFallback error={error as Error} />;
  }
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: lightTheme.colors.background,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: lightTheme.colors.error,
    marginBottom: 10,
  },
  errorDetails: {
    fontSize: 16,
    color: lightTheme.colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorStack: {
    fontSize: 12,
    color: lightTheme.colors.subText,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  logoutButton: {
    marginRight: 16,
    padding: 8,
  },
});

export default TabNavigator;
