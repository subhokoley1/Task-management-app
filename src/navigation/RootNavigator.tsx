import React from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationContainer, DarkTheme, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@/types/navigation';
import {useAppSelector} from '@/hooks/useAppDispatch';
import {AuthNavigator} from './AuthNavigator';
import {AppNavigator} from './AppNavigator';
import {getStatusBarOptions} from './headerOptions';
import {useTheme} from '@/theme/ThemeContext';
import {AuthInitSkeleton} from '@/utils/SkeletonLoader';

const Stack = createNativeStackNavigator<RootStackParamList>();

const BootScreen: React.FC = () => {
  const {colors} = useTheme();
  return (
    <View style={[styles.boot, {backgroundColor: colors.background}]}>
      <AuthInitSkeleton />
    </View>
  );
};

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const isInitialized = useAppSelector(state => state.auth.isInitialized);
  const {isDark, colors} = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{headerShown: false, ...getStatusBarOptions(isDark)}}>
        {!isInitialized ? (
          <Stack.Screen name="Boot" component={BootScreen} />
        ) : isAuthenticated ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    justifyContent: 'center',
  },
});
