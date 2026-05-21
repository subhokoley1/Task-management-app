import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@/theme/ThemeContext';

type Edge = 'top' | 'right' | 'bottom' | 'left';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  /** Reserve space under transparent native stack header */
  withHeader?: boolean;
  edges?: Edge[];
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scroll = false,
  withHeader = false,
  edges,
  padded = true,
  style,
  contentContainerStyle,
}) => {
  const {colors, spacing} = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const safeEdges: Edge[] =
    edges ??
    (withHeader ? ['left', 'right', 'bottom'] : ['top', 'left', 'right', 'bottom']);

  const topInset = withHeader
    ? Math.max(headerHeight, insets.top + 56) + spacing.sm
    : 0;

  const contentStyle: ViewStyle = {
    flexGrow: 1,
    paddingTop: topInset,
    paddingHorizontal: padded ? spacing.lg : 0,
  };

  const body = scroll ? (
    <ScrollView
      style={[styles.flex, {backgroundColor: colors.background}]}
      contentContainerStyle={[contentStyle, contentContainerStyle]}
      contentInsetAdjustmentBehavior="never"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView
      style={[styles.flex, {backgroundColor: colors.background}, style]}
      edges={safeEdges}>
      {body}
    </SafeAreaView>
  );
};

export const useScreenInsets = () => useSafeAreaInsets();

const styles = StyleSheet.create({
  flex: {flex: 1},
});
