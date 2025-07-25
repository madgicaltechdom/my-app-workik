import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '@/theme';

const { width } = Dimensions.get('window');

export const createHomeStyles = (theme: Theme) => 
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.lg,
    },
    header: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    welcomeText: {
      fontFamily: theme.fontFamilies.bold,
      fontSize: theme.fontSizes['2xl'],
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontFamily: theme.fontFamilies.regular,
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: theme.spacing.lg,
      paddingTop: 0,
    },
    section: {
      marginTop: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      fontFamily: theme.fontFamilies.medium,
      fontSize: theme.fontSizes.xl,
      color: theme.colors.text,
    },
    seeAll: {
      fontFamily: theme.fontFamilies.medium,
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
    },
    emptyState: {
      padding: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.borderRadius.md,
    },
    emptyStateText: {
      fontFamily: theme.fontFamilies.regular,
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    // Card styles
    card: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      shadowColor: theme.colors.shadow || '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  });
