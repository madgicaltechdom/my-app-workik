import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

// Mock Input component
export const Input = ({ testID, placeholder, value, onChangeText, secureTextEntry, ...props }: any) => (
  <TextInput 
    testID={testID}
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    {...props}
  />
);

// Mock Button component
export const Button = ({ 
  testID, 
  title, 
  onPress, 
  loading, 
  accessibilityLabel, 
  accessibilityState,
  ...props 
}: any) => (
  <TouchableOpacity 
    testID={testID}
    onPress={onPress}
    disabled={loading}
    accessibilityLabel={accessibilityLabel}
    accessibilityState={accessibilityState}
    {...props}
  >
    <Text>{title}</Text>
  </TouchableOpacity>
);

// Mock ErrorMessage component
export const ErrorMessage = ({ message, ...props }: any) => (
  message ? <View testID="error-message" {...props}><Text>{message}</Text></View> : null
);
