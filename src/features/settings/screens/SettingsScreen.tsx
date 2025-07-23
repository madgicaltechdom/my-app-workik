import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch,
  useColorScheme,
  useWindowDimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button, SettingRow } from '../../../components/common';
import { theme, darkTheme, type Theme } from '../../../theme';
import type { SettingsScreenProps } from '../../../types';

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  
  const isDark = colorScheme === 'dark';
  const currentTheme = isDark ? darkTheme : theme;
  const styles = createStyles(currentTheme, width);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  const handleLanguageChange = useCallback(() => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'en' ? 'es' : 'en';
    
    Alert.alert(
      t('settings.language.changeTitle', { defaultValue: 'Change Language' }),
      t('settings.language.changeMessage', { 
        defaultValue: 'Would you like to change the language to {{language}}?',
        language: newLang === 'en' ? 'English' : 'Español'
      }),
      [
        {
          text: t('common.cancel', { defaultValue: 'Cancel' }),
          style: 'cancel',
        },
        {
          text: t('common.confirm', { defaultValue: 'Confirm' }),
          onPress: () => i18n.changeLanguage(newLang),
        },
      ]
    );
  }, [i18n, t]);

  const handleClearCache = useCallback(() => {
    Alert.alert(
      t('settings.cache.clearTitle', { defaultValue: 'Clear Cache' }),
      t('settings.cache.clearMessage', { 
        defaultValue: 'This will clear all cached data. Are you sure?' 
      }),
      [
        {
          text: t('common.cancel', { defaultValue: 'Cancel' }),
          style: 'cancel',
        },
        {
          text: t('common.confirm', { defaultValue: 'Clear' }),
          style: 'destructive',
          onPress: () => {
            // Implement cache clearing logic
            Alert.alert(
              t('settings.cache.clearedTitle', { defaultValue: 'Cache Cleared' }),
              t('settings.cache.clearedMessage', { 
                defaultValue: 'Cache has been successfully cleared.' 
              })
            );
          },
        },
      ]
    );
  }, [t]);

  return (
    <SafeAreaView style={styles.container} testID="settings-screen">
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text 
          style={styles.title}
          testID="settings-title"
          accessibilityRole="header"
          accessibilityLevel={1}
        >
          {t('settings.title', { defaultValue: 'Settings' })}
        </Text>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.notifications.title', { defaultValue: 'Notifications' })}
          </Text>
          
          <SettingRow
            title={t('settings.notifications.push', { defaultValue: 'Push Notifications' })}
            description={t('settings.notifications.pushDescription', { 
              defaultValue: 'Receive notifications about important updates' 
            })}
            type="toggle"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            testID="notifications-toggle"
          />
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.security.title', { defaultValue: 'Security' })}
          </Text>
          
          <SettingRow
            title={t('settings.security.biometric', { defaultValue: 'Biometric Authentication' })}
            description={t('settings.security.biometricDescription', { 
              defaultValue: 'Use fingerprint or face recognition to unlock' 
            })}
            type="toggle"
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            testID="biometric-toggle"
          />
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.privacy.title', { defaultValue: 'Privacy' })}
          </Text>
          
          <SettingRow
            title={t('settings.privacy.analytics', { defaultValue: 'Analytics' })}
            description={t('settings.privacy.analyticsDescription', { 
              defaultValue: 'Help improve the app by sharing usage data' 
            })}
            type="toggle"
            value={analyticsEnabled}
            onValueChange={setAnalyticsEnabled}
            testID="analytics-toggle"
          />
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.app.title', { defaultValue: 'App' })}
          </Text>
          
          <SettingRow
            title={t('settings.app.changeLanguage', { defaultValue: 'Change Language' })}
            type="button"
            onPress={handleLanguageChange}
            testID="language-button"
          />
          
          <SettingRow
            title={t('settings.app.clearCache', { defaultValue: 'Clear Cache' })}
            type="button"
            onPress={handleClearCache}
            testID="clear-cache-button"
          />
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.appVersion}>
            {t('settings.app.version', { defaultValue: 'Version 1.0.0' })}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (currentTheme: Theme, width: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: currentTheme.colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: currentTheme.semanticSpacing.screenPadding,
    maxWidth: width > 768 ? 768 : '100%',
    alignSelf: 'center',
    width: '100%',
    paddingBottom: currentTheme.spacing.xl, // Extra padding at bottom for better scroll experience
  },
  title: {
    ...currentTheme.textStyles.h2,
    color: currentTheme.colors.text,
    textAlign: 'center',
    marginBottom: currentTheme.spacing.xl,
  },
  section: {
    marginBottom: currentTheme.spacing.xl,
  },
  sectionTitle: {
    ...currentTheme.textStyles.h4,
    color: currentTheme.colors.text,
    marginBottom: currentTheme.spacing.md,
  },
  footer: {
    alignItems: 'center',
    marginTop: currentTheme.spacing.xl,
    paddingTop: currentTheme.spacing.xl,
  },
  appVersion: {
    ...currentTheme.textStyles.caption,
    color: currentTheme.colors.textMuted,
  },
});
export default SettingsScreen;