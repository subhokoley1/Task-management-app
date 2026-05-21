import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {AppScreenProps} from '@/types/navigation';
import type {TaskFormValues} from '@/types/task';
import {taskSchema} from '@/utils/validation';
import {useAppDispatch, useAppSelector} from '@/hooks/useAppDispatch';
import {createTask, fetchTasks, updateTask} from '@/redux/slices/taskSlice';
import {taskRepository} from '@/database/taskRepository';
import {Button} from '@/components/common/Button';
import {Input} from '@/components/common/Input';
import {Screen} from '@/components/common/Screen';
import {useTheme} from '@/theme/ThemeContext';
import Toast from 'react-native-toast-message';
import {getThunkErrorMessage} from '@/utils/thunkError';
import {TaskFormScreenSkeleton} from '@/utils/SkeletonLoader';

type Props = AppScreenProps<'TaskForm'>;

export const TaskFormScreen: React.FC<Props> = ({navigation, route}) => {
  const taskId = route.params?.taskId;
  const isEdit = Boolean(taskId);
  const dispatch = useAppDispatch();
  const userId = useAppSelector(state => state.auth.user?.uid);
  const {colors, spacing} = useTheme();
  const [loadingTask, setLoadingTask] = useState(Boolean(taskId));

  const {control, handleSubmit, reset, formState} = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {title: '', description: '', reminderDate: null},
  });

  useEffect(() => {
    if (!taskId) {
      setLoadingTask(false);
      return;
    }
    setLoadingTask(true);
    taskRepository.getById(taskId).then(task => {
      if (task) {
        reset({
          title: task.title,
          description: task.description,
          reminderDate: task.reminderDate ? new Date(task.reminderDate) : null,
        });
      }
      setLoadingTask(false);
    });
  }, [reset, taskId]);

  const onSubmit = handleSubmit(async values => {
    if (!userId) {
      Toast.show({
        type: 'error',
        text1: 'Not signed in',
        text2: 'Please log in again.',
      });
      return;
    }

    try {
      if (isEdit && taskId) {
        await dispatch(updateTask({taskId, userId, values})).unwrap();
      } else {
        await dispatch(createTask({userId, values})).unwrap();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: isEdit ? 'Update failed' : 'Could not create task',
        text2: getThunkErrorMessage(error, 'Please try again.'),
      });
      return;
    }

    try {
      await dispatch(fetchTasks(userId)).unwrap();
    } catch {
      Toast.show({
        type: 'info',
        text1: 'Task saved',
        text2: 'List refresh failed — pull down to reload.',
      });
    }
    navigation.goBack();
  });

  if (loadingTask) {
    return (
      <Screen scroll withHeader contentContainerStyle={{paddingBottom: spacing.xl}}>
        <TaskFormScreenSkeleton />
      </Screen>
    );
  }

  return (
    <Screen scroll withHeader contentContainerStyle={{paddingBottom: spacing.xl}}>
      <Controller
        control={control}
        name="title"
        render={({field: {onChange, value}}) => (
          <Input
            label="Title"
            value={value}
            onChangeText={onChange}
            placeholder="Task title"
            error={formState.errors.title?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({field: {onChange, value}}) => (
          <Input
            label="Description"
            value={value}
            onChangeText={onChange}
            placeholder="Optional details"
            multiline
            error={formState.errors.description?.message}
          />
        )}
      />

      <Text style={{color: colors.textSecondary, marginBottom: spacing.sm}}>
        Reminder: set ISO date in description for demo, or extend with DateTimePicker.
      </Text>

      <Button title={isEdit ? 'Save Changes' : 'Create Task'} onPress={onSubmit} />
    </Screen>
  );
};
