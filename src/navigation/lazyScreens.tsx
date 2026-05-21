import React, {lazy, Suspense, type ComponentType} from 'react';
import {
  AuthInitSkeleton,
  HomeScreenSkeleton,
  TaskDetailScreenSkeleton,
  TaskFormScreenSkeleton,
} from '@/utils/SkeletonLoader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyScreen(
  loader: () => Promise<{default: ComponentType<any>}>,
  Fallback: ComponentType,
): React.ComponentType<any> {
  const LazyComponent = lazy(loader);

  return function LazyScreenWrapper(props: object) {
    return (
      <Suspense fallback={<Fallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

export const LazyLoginScreen = lazyScreen(
  () => import('@/screens/auth/LoginScreen').then(m => ({default: m.LoginScreen})),
  AuthInitSkeleton,
);

export const LazySignUpScreen = lazyScreen(
  () => import('@/screens/auth/SignUpScreen').then(m => ({default: m.SignUpScreen})),
  AuthInitSkeleton,
);

export const LazyHomeScreen = lazyScreen(
  () => import('@/screens/home/HomeScreen').then(m => ({default: m.HomeScreen})),
  HomeScreenSkeleton,
);

export const LazySettingsScreen = lazyScreen(
  () => import('@/screens/home/SettingsScreen').then(m => ({default: m.SettingsScreen})),
  AuthInitSkeleton,
);

export const LazyTaskDetailScreen = lazyScreen(
  () => import('@/screens/task/TaskDetailScreen').then(m => ({default: m.TaskDetailScreen})),
  TaskDetailScreenSkeleton,
);

export const LazyTaskFormScreen = lazyScreen(
  () => import('@/screens/task/TaskFormScreen').then(m => ({default: m.TaskFormScreen})),
  TaskFormScreenSkeleton,
);
