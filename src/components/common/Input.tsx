import React, { memo, useCallback, useMemo } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  useColorScheme,
  TextInputProps,
  KeyboardTypeOptions,
} from 'react-native';
import { useTranslation } from 'react-i18next';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  errorMessage?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  style?: object;
  inputStyle?: object;
}

function Input({
  label,
  placeholder,
  value,
  onChangeText,
  errorMessage,
  isRequired = false,
  isDisabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  maxLength,
  multiline = false,
  numberOfLines = 1,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  inputStyle,
  ...rest
}: InputProps) {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const isDark = colorScheme === 'dark';

  const hasError = Boolean(errorMessage);

  const containerStyles = useMemo(() => [
    styles.container,
    style,
  ], [style]);

  const inputStyles = useMemo(() => [
    styles.input,
    multiline && styles.multilineInput,
    hasError && styles.errorInput,
    isDisabled && styles.disabledInput,
    isDark && styles.darkModeInput,
    inputStyle,
  ], [multiline, hasError, isDisabled, isDark, inputStyle]);

  const labelStyles = useMemo(() => [
    styles.label,
    isRequired && styles.requiredLabel,
    isDark && styles.darkModeLabel,
  ], [isRequired, isDark]);

  const errorStyles = useMemo(() => [
    styles.errorText,
    isDark && styles.darkModeErrorText,
  ], [isDark]);

  const handleTextChange = useCallback((text: string) => {
    if (!isDisabled) {
      onChangeText(text);
    }
  }, [isDisabled, onChangeText]);

  const getPlaceholderTextColor = () => {
    if (isDark) return '#8E8E93';
    return '#C7C7CC';
  };

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={labelStyles}>
          {label}
          {isRequired && <Text style={styles.asterisk}> *</Text>}
        </Text>
      )}
      
      <TextInput
        style={inputStyles}
        placeholder={placeholder}
        placeholderTextColor={getPlaceholderTextColor()}
        value={value}
        onChangeText={handleTextChange}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        editable={!isDisabled}
        selectTextOnFocus={!isDisabled}
        accessibilityLabel={accessibilityLabel || label || placeholder}
        accessibilityHint={accessibilityHint}
        accessibilityState={{
          disabled: isDisabled,
        }}
        testID={testID}
        {...rest}
      />
      
      {hasError && (
        <Text 
          style={errorStyles}
          accessibilityRole="alert"
          testID={`${testID}-error`}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#1C1C1E',
  },
  
  requiredLabel: {
    // Additional styling for required fields if needed
  },
  
  asterisk: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    minHeight: 44,
    color: '#1C1C1E',
  },
  
  multilineInput: {
    minHeight: 88,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  
  errorInput: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  
  disabledInput: {
    backgroundColor: '#F2F2F7',
    opacity: 0.6,
    color: '#8E8E93',
  },
  
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 4,
    marginLeft: 4,
  },
  
  // Dark mode styles
  darkModeLabel: {
    color: '#FFFFFF',
  },
  
  darkModeInput: {
    backgroundColor: '#1C1C1E',
    borderColor: '#38383A',
    color: '#FFFFFF',
  },
  
  darkModeErrorText: {
    color: '#FF453A',
  },
});

export { Input };
