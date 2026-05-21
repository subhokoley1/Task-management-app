import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import Toast from 'react-native-toast-message';
import {store} from '@/redux/store';
import {ThemeProvider, useTheme} from '@/theme/ThemeContext';
import {RootNavigator} from '@/navigation/RootNavigator';
import {useAppDispatch} from '@/hooks/useAppDispatch';
import {initializeAuth} from '@/redux/slices/authSlice';
import {useNetworkSync} from '@/hooks/useNetworkSync';
import {notificationService} from '@/services/notifications/notificationService';
import {getRealm} from '@/database/realm';

const AppBootstrap: React.FC = () => {
  const dispatch = useAppDispatch();
  useNetworkSync();

  useEffect(() => {
    getRealm();
    notificationService.initialize();

    const unsubscribeFcm = notificationService.onForegroundMessage(() => {
      // Foreground FCM: Notifee displays the notification (no toast)
    });

    dispatch(initializeAuth());

    return () => {
      unsubscribeFcm();
    };
  }, [dispatch]);

  return (
    <>
      <RootNavigator />
      <Toast />
    </>
  );
};

const ThemedRoot: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {colors} = useTheme();
  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: colors.background}}>
      {children}
    </GestureHandlerRootView>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedRoot>
          <AppBootstrap />
        </ThemedRoot>
      </ThemeProvider>
    </SafeAreaProvider>
  </Provider>
);

export default App;
