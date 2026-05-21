import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '@/types/navigation';
import {useTheme} from '@/theme/ThemeContext';
import {getTransparentHeaderOptions} from './headerOptions';
import {LazyLoginScreen, LazySignUpScreen} from './lazyScreens';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  const {colors, isDark} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getTransparentHeaderOptions(colors, isDark),
        contentStyle: {backgroundColor: colors.background},
        freezeOnBlur: true,
      }}>
      <Stack.Screen
        name="Login"
        component={LazyLoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="SignUp" component={LazySignUpScreen} options={{title: 'Sign Up'}} />
    </Stack.Navigator>
  );
};
