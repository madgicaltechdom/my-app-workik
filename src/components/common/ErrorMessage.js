import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ErrorMessage = ({ message, style, testID }) => {
  if (!message) return null;

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
});

import PropTypes from 'prop-types';

ErrorMessage.propTypes = {
  message: PropTypes.any,
  style: PropTypes.any,
  testID: PropTypes.string,
};

export default ErrorMessage;