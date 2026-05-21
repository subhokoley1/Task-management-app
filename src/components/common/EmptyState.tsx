import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@/theme/ThemeContext';
import {Button} from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = memo(
  ({title, description, actionLabel, onAction}: EmptyStateProps) => {
    const {colors, spacing} = useTheme();

    return (
      <View style={[styles.container, {padding: spacing.xl}]}>
        <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
        <Text style={[styles.description, {color: colors.textSecondary}]}>
          {description}
        </Text>
        {actionLabel && onAction ? (
          <Button title={actionLabel} onPress={onAction} style={{marginTop: spacing.lg}} />
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
