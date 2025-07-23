import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Button } from 'react-native';

/**
 * Minimal Test App to isolate "Empty input string" error
 * This component renders a simplified version of the Profile UI
 * without any context providers, navigation, or external dependencies
 */
const MinimalAppTest: React.FC = () => {
  // Hardcoded profile data
  const profile = {
    displayName: 'Test User',
    email: 'test@example.com',
    phoneNumber: '+1234567890',
  };

  // Simple state to toggle between screens
  const [showEditScreen, setShowEditScreen] = React.useState(false);

  if (showEditScreen) {
    // Simple Edit Profile UI
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title} testID="minimal-edit-title">Update Profile</Text>
        </View>
        
        <ScrollView style={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Display Name</Text>
            <View style={styles.input}>
              <Text>{profile.displayName}</Text>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.input}>
              <Text>{profile.email}</Text>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone</Text>
            <View style={styles.input}>
              <Text>{profile.phoneNumber}</Text>
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button 
            title="Cancel" 
            onPress={() => setShowEditScreen(false)} 
            testID="minimal-cancel-button" 
          />
          <Button 
            title="Save" 
            onPress={() => setShowEditScreen(false)} 
            testID="minimal-save-button" 
          />
        </View>
      </SafeAreaView>
    );
  }

  // Simple Profile UI
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} testID="minimal-profile-title">Profile</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName} testID="minimal-display-name">{profile.displayName}</Text>
          <Text style={styles.profileEmail} testID="minimal-email">{profile.email}</Text>
          <Text style={styles.profilePhone} testID="minimal-phone">{profile.phoneNumber}</Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          title="Edit Profile" 
          onPress={() => setShowEditScreen(true)} 
          testID="minimal-edit-button" 
        />
      </View>
    </SafeAreaView>
  );
};

// Simple styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileInfo: {
    alignItems: 'center',
    padding: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 16,
    color: '#666',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#f9f9f9',
  },
});

export default MinimalAppTest;
