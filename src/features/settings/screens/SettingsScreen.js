import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Switch 
} from 'react-native';
import Button from '../../../components/common/Button';
import { auth } from '../../../services/firebaseConfig';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const toggleNotifications = () => {
    setNotificationsEnabled(previousState => !previousState);
  };

  const toggleDarkMode = () => {
    setDarkModeEnabled(previousState => !previousState);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.settingsContainer}>
        <Text style={styles.screenTitle}>Settings</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleNotifications}
            value={notificationsEnabled}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={darkModeEnabled ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleDarkMode}
            value={darkModeEnabled}
          />
        </View>

        <Button 
          title="About App" 
          style={styles.buttonStyle}
        />
        
        <Button 
          title="Privacy Policy" 
          style={styles.buttonStyle}
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
  settingsContainer: {
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingText: {
    fontSize: 16,
  },
  buttonStyle: {
    marginTop: 10,
  },
});

export default SettingsScreen;