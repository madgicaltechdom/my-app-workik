import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { useFirebaseAuth } from '../../../hooks/useFirebaseAuth';
import Button from '../../../components/common/Button';

const HomeScreen = ({ navigation }) => {
  const { user } = useFirebaseAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Home</Text>
          {user && (
            <Text style={styles.subtitle}>
              Hello, {user.email || 'User'}
            </Text>
          )}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>
            This is your home dashboard. 
            You can customize this screen with your app's main features.
          </Text>

          <Button 
            title="View Profile" 
            onPress={() => navigation.navigate('Profile')}
            style={styles.buttonStyle}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonStyle: {
    marginTop: 10,
  },
});

export default HomeScreen;