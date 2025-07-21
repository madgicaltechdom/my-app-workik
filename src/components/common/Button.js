import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Button = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false, 
  loading = false, 
  testID, 
  ...rest
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button, 
        style,
        disabled && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;
Button.propTypes = {
  title: PropTypes.any,
  onPress: PropTypes.any,
  style: PropTypes.any,
  textStyle: PropTypes.any,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  testID: PropTypes.string,
};