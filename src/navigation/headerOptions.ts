import type {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import type {ThemeColors} from '@/theme/colors';

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
  statusBarTranslucent: true,
  statusBarStyle: isDark ? 'light' : 'dark',
  statusBarBackgroundColor: 'transparent',
  navigationBarColor: colors.background,
});
