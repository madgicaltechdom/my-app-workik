module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Remove the redundant plugins as they're included in babel-preset-expo
      // Keep react-native-reanimated/plugin as it needs to be last
      'react-native-reanimated/plugin',
    ],
    // Add this if you need to support path aliases in Babel
    env: {
      production: {
        plugins: ['transform-remove-console'], // Optional: remove console logs in production
      },
    },
  };
};