import React, {memo, useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@/theme/ThemeContext';
import type {Task} from '@/types/task';
import {formatRelativeDate} from '@/utils/date';

interface TaskListItemProps {
  task: Task;
  onPress: (taskId: string) => void;
  onToggle: (taskId: string) => void;
}

const areEqual = (prev: TaskListItemProps, next: TaskListItemProps) =>
  prev.task.id === next.task.id &&
  prev.task.updatedAt === next.task.updatedAt &&
  prev.task.completed === next.task.completed &&
  prev.task.syncStatus === next.task.syncStatus &&
  prev.task.title === next.task.title;

export const TaskListItem = memo(({task, onPress, onToggle}: TaskListItemProps) => {
  const {colors, radius, spacing} = useTheme();

  const handlePress = useCallback(() => onPress(task.id), [onPress, task.id]);
  const handleToggle = useCallback(() => onToggle(task.id), [onToggle, task.id]);

  const syncColor =
    task.syncStatus === 'synced'
      ? colors.success
      : task.syncStatus === 'failed'
        ? colors.error
        : colors.warning;

  return (
    <Pressable
      onPress={handlePress}
      style={({pressed}) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.md,
          marginBottom: spacing.sm,
          opacity: pressed ? 0.9 : 1,
        },
      ]}>
      <View style={styles.row}>
        <Pressable
          onPress={handleToggle}
          style={[
            styles.checkbox,
            {
              borderColor: colors.primary,
              backgroundColor: task.completed ? colors.primary : 'transparent',
            },
          ]}>
          {task.completed ? <Text style={styles.checkmark}>✓</Text> : null}
        </Pressable>
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                textDecorationLine: task.completed ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={1}>
            {task.title}
          </Text>
          <Text style={{color: colors.textSecondary}} numberOfLines={2}>
            {task.description || 'No description'}
          </Text>
          <View style={styles.meta}>
            <Text style={{color: colors.textSecondary, fontSize: 12}}>
              {formatRelativeDate(task.updatedAt)}
            </Text>
            <View style={[styles.syncDot, {backgroundColor: syncColor}]} />
            <Text style={{color: syncColor, fontSize: 11}}>{task.syncStatus}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}, areEqual);

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 8,
  },
});
