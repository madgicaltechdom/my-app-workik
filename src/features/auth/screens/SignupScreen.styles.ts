import { StyleSheet } from 'react-native';
import { theme } from '../../../theme/index';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  innerContainer: {
    padding: theme.spacing.lg,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginTop: theme.spacing.md,
  },
  loginButtonText: {
    color: theme.colors.primary,
  },
  formControl: {
    marginBottom: theme.spacing.md,
  },
});
