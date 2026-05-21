import React from 'react';
import {NavigationContainer, DarkTheme, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@/types/navigation';
import {useAppSelector} from '@/hooks/useAppDispatch';
import {AuthNavigator} from './AuthNavigator';
import {AppNavigator} from './AppNavigator';
import {useTheme} from '@/theme/ThemeContext';
import {View, StyleSheet} from 'react-native';
import {AuthInitSkeleton} from '@/utils/SkeletonLoader';

const Stack = createNativeStackNavigator<RootStackParamList>();

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

  if (!isInitialized) {
    return (
      <View style={[styles.boot, {backgroundColor: colors.background}]}>
        <AuthInitSkeleton />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
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
