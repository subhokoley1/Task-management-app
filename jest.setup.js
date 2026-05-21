jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {GestureHandlerRootView: View};
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-toast-message', () => {
  const React = require('react');
  return () => null;
});

jest.mock('react-native-config', () => ({
  APP_ENV: 'development',
  API_URL: 'https://dev-api.example.com',
  FIREBASE_ENV: 'dev',
}));
