import React, {useCallback, useMemo, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {AppScreenProps} from '@/types/navigation';
import {useAppDispatch, useAppSelector} from '@/hooks/useAppDispatch';
import {
  fetchTasks,
  setFilter,
  setSearchQuery,
  selectFilteredTasks,
  toggleTaskComplete,
} from '@/redux/slices/taskSlice';
import {TaskListItem} from '@/components/task/TaskListItem';
import {EmptyState} from '@/components/common/EmptyState';
import {HomeScreenSkeleton} from '@/utils/SkeletonLoader';
import {Screen, useScreenInsets} from '@/components/common/Screen';
import {useTheme} from '@/theme/ThemeContext';
import {ENV} from '@/config/env';

type Props = AppScreenProps<'Home'>;

const FILTERS = ['all', 'active', 'completed'] as const;
/** Approximate row height for getItemLayout (padding + 3 text lines + meta) */
const TASK_ROW_HEIGHT = 108;

export const HomeScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(state => state.auth.user?.uid);
  const tasks = useAppSelector(selectFilteredTasks);
  const {isLoading, isRefreshing, searchQuery, filter} = useAppSelector(
    state => state.tasks,
  );
  const {isOnline, pendingCount, isSyncing} = useAppSelector(state => state.sync);
  const {colors, spacing, radius} = useTheme();
  const insets = useScreenInsets();
  const tabBarHeight = useBottomTabBarHeight();

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        dispatch(fetchTasks(userId));
      }
    }, [dispatch, userId]),
  );

  const onRefresh = useCallback(() => {
    if (userId) {
      dispatch(fetchTasks(userId));
    }
  }, [dispatch, userId]);

  const handleToggle = useCallback(
    (taskId: string) => {
      if (userId) {
        dispatch(toggleTaskComplete({taskId, userId}));
      }
    },
    [dispatch, userId],
  );

  const handleOpen = useCallback(
    (taskId: string) => navigation.navigate('TaskDetail', {taskId}),
    [navigation],
  );

  const listExtraData = useRef({length: 0, filter, searchQuery}).current;
  listExtraData.length = tasks.length;
  listExtraData.filter = filter;
  listExtraData.searchQuery = searchQuery;

  const keyExtractor = useCallback((item: {id: string}) => item.id, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<(typeof tasks)[0]> | null | undefined, index: number) => ({
      length: TASK_ROW_HEIGHT,
      offset: TASK_ROW_HEIGHT * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({item}: {item: (typeof tasks)[0]}) => (
      <TaskListItem task={item} onPress={handleOpen} onToggle={handleToggle} />
    ),
    [handleOpen, handleToggle],
  );

  const listHeader = useMemo(
    () => (
      <View>
        <Text style={[styles.heading, {color: colors.text}]}>My Tasks</Text>
        <Text style={{color: colors.textSecondary, marginBottom: spacing.sm}}>
          {ENV.appEnv} • {isOnline ? 'Online' : 'Offline'}
          {pendingCount > 0 ? ` • ${pendingCount} pending sync` : ''}
          {isSyncing ? ' • Syncing...' : ''}
        </Text>
        <TextInput
          value={searchQuery}
          onChangeText={text => dispatch(setSearchQuery(text))}
          placeholder="Search tasks..."
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.search,
            {
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border,
              borderRadius: radius.md,
              marginBottom: spacing.sm,
            },
          ]}
        />
        <View style={styles.filters}>
          {FILTERS.map(item => (
            <Pressable
              key={item}
              onPress={() => dispatch(setFilter(item))}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filter === item ? colors.primary : colors.surface,
                  borderRadius: radius.full,
                },
              ]}>
              <Text
                style={{
                  color: filter === item ? '#fff' : colors.textSecondary,
                  fontWeight: '600',
                  textTransform: 'capitalize',
                }}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    ),
    [
      colors,
      dispatch,
      filter,
      isOnline,
      isSyncing,
      pendingCount,
      radius,
      searchQuery,
      spacing,
    ],
  );

  const showSkeleton = isLoading || isRefreshing;

  if (showSkeleton) {
    return (
      <Screen padded={false}>
        <HomeScreenSkeleton />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <FlatList
        style={styles.list}
        data={tasks}
        extraData={listExtraData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        ListHeaderComponent={listHeader}
        contentContainerStyle={{padding: spacing.md, flexGrow: 1}}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            tintColor="transparent"
            colors={['transparent']}
            progressBackgroundColor="transparent"
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No tasks yet"
            description="Create your first task. It works offline and syncs when you're back online."
            actionLabel="Add Task"
            onAction={() => navigation.navigate('TaskForm', {})}
          />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={50}
        windowSize={5}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
      />

      <Pressable
        onPress={() => navigation.navigate('TaskForm', {})}
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: spacing.lg + Math.max(insets.bottom, tabBarHeight),
          },
        ]}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </Screen>
  );
};

const styles = StyleSheet.create({
  list: {flex: 1},
  heading: {fontSize: 26, fontWeight: '700', marginBottom: 4},
  search: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '300',
  },
});
