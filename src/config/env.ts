import Config from 'react-native-config';

export const ENV = {
  appEnv: Config.APP_ENV ?? 'development',
  apiUrl: Config.API_URL ?? 'https://dev-api.example.com',
  firebaseEnv: Config.FIREBASE_ENV ?? 'dev',
  isDev: (Config.APP_ENV ?? 'development') === 'development',
  isProd: (Config.APP_ENV ?? 'development') === 'production',
};
