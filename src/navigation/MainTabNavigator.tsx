import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import type {MainTabParamList} from '@/types/navigation';
import {useTheme} from '@/theme/ThemeContext';
import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {MyTasksStackNavigator} from './MyTasksStackNavigator';
import {LazySettingsScreen} from './lazyScreens';
import {getStatusBarOptions} from './headerOptions';

const Tab = createBottomTabNavigator<MainTabParamList>();

const HIDE_TAB_BAR_ROUTES = new Set(['TaskDetail', 'TaskForm']);

export const MainTabNavigator: React.FC = () => {
  const {colors, isDark} = useTheme();

  const defaultTabBarStyle = {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 8,
      },
      android: {elevation: 8},
    }),
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        ...getStatusBarOptions(isDark),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: defaultTabBarStyle,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tab.Screen
        name="MyTasks"
        component={MyTasksStackNavigator}
        options={({route}) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
          return {
            title: 'My Tasks',
            tabBarIcon: ({color, size, focused}) => (
              <TabBarIcon name="tasks" color={color} size={size} focused={focused} />
            ),
            tabBarStyle: HIDE_TAB_BAR_ROUTES.has(routeName)
              ? {display: 'none'}
              : defaultTabBarStyle,
          };
        }}
      />
      <Tab.Screen
        name="Settings"
        component={LazySettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({color, size, focused}) => (
            <TabBarIcon name="settings" color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
