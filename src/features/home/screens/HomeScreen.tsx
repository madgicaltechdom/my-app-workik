import React from 'react';
import { 
  View, 
  Text, 
  useWindowDimensions,
  ScrollView,
  RefreshControl,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { theme, darkTheme, type Theme } from '@/theme';
import { StatCard } from '@/components/common';
import type { HomeScreenProps } from '@/types';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { user } = useFirebaseAuth();
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  
  const isDark = colorScheme === 'dark';
  const currentTheme = isDark ? darkTheme : theme;
  const styles = createStyles(currentTheme, width);

  const displayName = user?.displayName || user?.email?.split('@')[0] || t('common.user');

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Add refresh logic here if needed
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.container} testID="home-screen">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[currentTheme.colors.primary]}
            tintColor={currentTheme.colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text 
            style={styles.welcomeText}
            testID="home-welcome"
            accessibilityRole="text"
          >
            {t('home.welcome', { name: displayName })}
          </Text>
          <Text 
            style={styles.subtitle}
            testID="home-subtitle"
            accessibilityRole="text"
          >
            {t('home.subtitle')}
          </Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <StatCard
            value="12"
            label={t('home.stats.projects')}
            color={currentTheme.colors.primary}
            testID="projects-stat"
          />
          <StatCard
            value="24"
            label={t('home.stats.tasks')}
            color={currentTheme.colors.secondary}
            testID="tasks-stat"
          />
          <StatCard
            value="85%"
            label={t('home.stats.completion')}
            color={currentTheme.colors.success}
            testID="completion-stat"
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t('home.recentActivity')}
            </Text>
            <Text 
              style={styles.seeAll}
              onPress={() => navigation.navigate('Activity')}
              accessibilityRole="button"
            >
              {t('common.seeAll')}
            </Text>
          </View>
          
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {t('home.noActivity')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (currentTheme: Theme, width: number) => ({
  container: {
    flex: 1,
    backgroundColor: currentTheme.colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: currentTheme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: currentTheme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: currentTheme.colors.text,
  },
  seeAll: {
    color: currentTheme.colors.primary,
    fontSize: 14,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: currentTheme.colors.surface,
    borderRadius: 8,
  },
  emptyStateText: {
    color: currentTheme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;
