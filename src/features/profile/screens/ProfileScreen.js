import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Image 
} from 'react-native';
import { useFirebaseAuth } from '../../../hooks/useFirebaseAuth';
import Button from '../../../components/common/Button';
import { authService } from '../../../services/authService';

const ProfileScreen = () => {
  const { user } = useFirebaseAuth();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image 
          source={require('../../../../assets/default-avatar.png')} 
          style={styles.avatar}
        />
        
        <Text style={styles.nameText}>
          {user?.displayName || 'User Profile'}
        </Text>
        
        <Text style={styles.emailText}>
          {user?.email || 'No email'}
        </Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Email Verified</Text>
            <Text style={styles.infoValue}>
              {user?.emailVerified ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>

        <Button 
          title="Logout" 
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    width: '100%',
  },
});

export default ProfileScreen;