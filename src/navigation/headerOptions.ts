import type {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import type {ThemeColors} from '@/theme/colors';

/** Status bar via react-native-screens (requires UIViewControllerBasedStatusBarAppearance=YES). */
export const getStatusBarOptions = (isDark: boolean): NativeStackNavigationOptions => ({
  statusBarTranslucent: true,
  statusBarStyle: isDark ? 'light' : 'dark',
  statusBarBackgroundColor: 'transparent',
});

export const getTransparentHeaderOptions = (
  colors: ThemeColors,
  isDark: boolean,
): NativeStackNavigationOptions => ({
  headerTransparent: true,
  headerStyle: {backgroundColor: 'transparent'},
  headerShadowVisible: false,
  headerBlurEffect: undefined,
  headerTintColor: colors.text,
  headerTitleStyle: {
    color: colors.text,
    fontWeight: '600',
  },
  headerBackVisible: true,
  ...getStatusBarOptions(isDark),
  navigationBarColor: colors.background,
});
