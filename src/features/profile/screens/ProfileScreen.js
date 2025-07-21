import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  ScrollView 
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

  // Assuming these standard fields are stored as custom claims or user metadata
  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const phoneNumber = user?.phoneNumber || '';
  const dateOfBirth = user?.dateOfBirth || '';
  const address = user?.address || {};  // { street, city, state, zipCode, country }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.profileContainer}>
        <Image 
          source={require('../../../../assets/default-avatar.png')} 
          style={styles.avatar}
        />
        
        <Text style={styles.nameText}>
          {user?.displayName || `${firstName} ${lastName}` || 'User Profile'}
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

          {(firstName || lastName) && (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Name</Text>
              <Text style={styles.infoValue}>{`${firstName} ${lastName}`}</Text>
            </View>
          )}

          {phoneNumber ? (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Phone Number</Text>
              <Text style={styles.infoValue}>{phoneNumber}</Text>
            </View>
          ) : null}

          {dateOfBirth ? (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Date of Birth</Text>
              <Text style={styles.infoValue}>{dateOfBirth}</Text>
            </View>
          ) : null}

          {(address.street || address.city || address.state || address.zipCode || address.country) && (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Address</Text>
              <Text style={styles.infoValue}>
                {[address.street, address.city, address.state, address.zipCode, address.country]
                  .filter(Boolean)
                  .join(', ')}
              </Text>
            </View>
          )}
        </View>

        <Button 
          title="Logout" 
          onPress={handleLogout}
          style={styles.logoutButton}
          testID="logout-button"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
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
    color: '#333',
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
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
    color: '#444',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    width: '100%',
    marginTop: 10,
  },
});

export default ProfileScreen;