import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {MyTasksStackParamList} from '@/types/navigation';
import {useTheme} from '@/theme/ThemeContext';
import {getTransparentHeaderOptions} from './headerOptions';
import {LazyHomeScreen, LazyTaskDetailScreen, LazyTaskFormScreen} from './lazyScreens';

const Stack = createNativeStackNavigator<MyTasksStackParamList>();

export const MyTasksStackNavigator: React.FC = () => {
  const {colors, isDark} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getTransparentHeaderOptions(colors, isDark),
        contentStyle: {backgroundColor: colors.background},
        freezeOnBlur: true,
      }}>
      <Stack.Screen
        name="Home"
        component={LazyHomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TaskDetail"
        component={LazyTaskDetailScreen}
        options={{title: 'Task Details'}}
      />
      <Stack.Screen
        name="TaskForm"
        component={LazyTaskFormScreen}
        options={({route}) => ({
          title: route.params?.taskId ? 'Edit Task' : 'New Task',
        })}
      />
    </Stack.Navigator>
  );
};
