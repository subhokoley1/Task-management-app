import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import type {AppScreenProps} from '@/types/navigation';
import {useAppDispatch, useAppSelector} from '@/hooks/useAppDispatch';
import {deleteTask, fetchTasks} from '@/redux/slices/taskSlice';
import {taskRepository} from '@/database/taskRepository';
import type {Task} from '@/types/task';
import {Button} from '@/components/common/Button';
import {Screen} from '@/components/common/Screen';
import {useTheme} from '@/theme/ThemeContext';
import {formatTaskDate} from '@/utils/date';
import {TaskDetailScreenSkeleton} from '@/utils/SkeletonLoader';

type Props = AppScreenProps<'TaskDetail'>;

export const TaskDetailScreen: React.FC<Props> = ({navigation, route}) => {
  const {taskId} = route.params;
  const dispatch = useAppDispatch();
  const userId = useAppSelector(state => state.auth.user?.uid);
  const cached = useAppSelector(state => state.tasks.entities[taskId]);
  const [task, setTask] = useState<Task | null>(cached ?? null);
  const [loading, setLoading] = useState(!cached);
  const {colors, spacing, radius} = useTheme();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    taskRepository.getById(taskId).then(result => {
      if (mounted) {
        setTask(result);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [taskId]);

  const handleDelete = () => {
    Alert.alert('Delete task', 'This action cannot be undone.', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (userId) {
            dispatch(deleteTask({taskId, userId})).then(() => {
              dispatch(fetchTasks(userId));
              navigation.goBack();
            });
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <Screen scroll withHeader contentContainerStyle={{paddingBottom: spacing.xl}}>
        <TaskDetailScreenSkeleton />
      </Screen>
    );
  }

  if (!task) {
    return (
      <Screen withHeader>
        <Text style={{color: colors.text}}>Task not found</Text>
      </Screen>
    );
  }

  return (
    <Screen scroll withHeader contentContainerStyle={{paddingBottom: spacing.xl}}>
      <View
        style={[
          styles.card,
          {backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg},
        ]}>
        <Text style={[styles.title, {color: colors.text}]}>{task.title}</Text>
        <Text style={{color: colors.textSecondary, marginTop: spacing.sm}}>
          {task.description || 'No description'}
        </Text>

        <View style={styles.metaBlock}>
          <Text style={{color: colors.textSecondary}}>
            Status: {task.completed ? 'Completed' : 'Active'}
          </Text>
          <Text style={{color: colors.textSecondary}}>Sync: {task.syncStatus}</Text>
          <Text style={{color: colors.textSecondary}}>
            Created: {formatTaskDate(task.createdAt)}
          </Text>
          <Text style={{color: colors.textSecondary}}>
            Updated: {formatTaskDate(task.updatedAt)}
          </Text>
          {task.reminderDate ? (
            <Text style={{color: colors.textSecondary}}>
              Reminder: {formatTaskDate(task.reminderDate)}
            </Text>
          ) : null}
        </View>
      </View>

      <Button
        title="Edit Task"
        onPress={() => navigation.navigate('TaskForm', {taskId})}
        style={{marginTop: spacing.lg}}
      />
      <Button
        title="Delete Task"
        variant="danger"
        onPress={handleDelete}
        style={{marginTop: spacing.sm}}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
  },
  title: {fontSize: 24, fontWeight: '700'},
  metaBlock: {marginTop: 20, gap: 8},
});
