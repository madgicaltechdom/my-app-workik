import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  color?: string;
  testID?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  color,
  testID,
}) => {
  const theme = useTheme();
  const cardColor = color || theme.colors.primary;

  return (
    <View 
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      testID={testID}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <View style={styles.textContainer}>
        <Text 
          style={[styles.value, { color: cardColor }]}
          accessibilityLabel={`${value} ${label}`}
          accessibilityRole="text"
        >
          {value}
        </Text>
        <Text 
          style={[styles.label, { color: theme.colors.subText }]}
          accessibilityLabel={label}
          accessibilityRole="text"
        >
          {label}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    minWidth: 100,
  },
  iconContainer: {
    marginBottom: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default StatCard;
