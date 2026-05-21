import React, {memo} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from 'react-native';
import {useTheme} from '@/theme/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button = memo(
  ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
  }: ButtonProps) => {
    const {colors, radius, spacing} = useTheme();

    const backgroundColor =
      variant === 'primary'
        ? colors.primary
        : variant === 'danger'
          ? colors.error
          : variant === 'secondary'
            ? colors.surface
            : 'transparent';

    const textColor =
      variant === 'secondary' || variant === 'ghost'
        ? colors.text
        : '#FFFFFF';

    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({pressed}) => [
          styles.base,
          {
            backgroundColor,
            borderRadius: radius.md,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            borderWidth: variant === 'secondary' ? 1 : 0,
            borderColor: colors.border,
            opacity: pressed || disabled ? 0.7 : 1,
          },
          style,
        ]}>
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text style={[styles.label, {color: textColor}]}>{title}</Text>
        )}
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
