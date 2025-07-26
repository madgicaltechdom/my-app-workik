import React, { ReactNode } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme';

export interface SettingRowProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  type?: 'toggle' | 'button' | 'link';
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  rightComponent?: ReactNode;
  disabled?: boolean;
  testID?: string;
}

export const SettingRow: React.FC<SettingRowProps> = ({
  title,
  description,
  icon,
  type = 'button',
  value = false,
  onValueChange,
  onPress,
  rightComponent,
  disabled = false,
  testID,
}) => {
  const handlePress = () => {
    if (type === 'toggle' && onValueChange) {
      onValueChange(!value);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { opacity: disabled ? 0.5 : 1 },
      ]}
      onPress={handlePress}
      disabled={disabled || (type === 'button' && !onPress)}
      activeOpacity={0.7}
      testID={testID}
    >
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {title}
          </Text>
          {description && (
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              {description}
            </Text>
          )}
        </View>
        
        <View style={styles.rightComponent}>
          {type === 'toggle' ? (
            <Switch
              value={value}
              onValueChange={onValueChange}
              trackColor={{
                false: theme.colors.background,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.light}
              disabled={disabled}
            />
          ) : rightComponent ? (
            rightComponent
          ) : (
            <Text style={[styles.chevron, { color: theme.colors.textSecondary }]}>
              ›
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
  },
  rightComponent: {
    marginLeft: 8,
  },
  chevron: {
    fontSize: 24,
    marginLeft: 4,
  },
});


