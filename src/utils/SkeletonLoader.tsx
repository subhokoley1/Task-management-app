import React, {memo, useEffect, useRef} from 'react';
import {Animated, StyleSheet, View, type ViewStyle} from 'react-native';
import {useTheme} from '@/theme/ThemeContext';
import {radius, spacing} from '@/theme/spacing';

interface SkeletonBoxProps {
  width?: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonBox = memo(({width = '100%', height, borderRadius = 8, style}: SkeletonBoxProps) => {
  const {isDark} = useTheme();
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {toValue: 1, duration: 700, useNativeDriver: true}),
        Animated.timing(opacity, {toValue: 0.35, duration: 700, useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          opacity,
          backgroundColor: isDark ? '#334155' : '#E5E7EB',
        },
        style,
      ]}
    />
  );
});

/** App bootstrap / auth session check */
export const AuthInitSkeleton = memo(() => {
  const {colors} = useTheme();
  return (
  <View style={[styles.authRoot, {backgroundColor: colors.background}]}>
    <SkeletonBox width={200} height={32} borderRadius={radius.md} />
    <SkeletonBox width={260} height={16} style={{marginTop: spacing.md}} />
    <SkeletonBox width={220} height={48} borderRadius={radius.md} style={{marginTop: spacing.xl}} />
    <SkeletonBox width={180} height={14} style={{marginTop: spacing.lg}} />
  </View>
  );
});

/** Home — task list loading */
export const HomeScreenSkeleton = memo(() => {
  const {spacing: sp} = useTheme();
  return (
    <View style={{padding: sp.md}}>
      <View style={styles.homeHeader}>
        <SkeletonBox width={140} height={28} />
        <SkeletonBox width={72} height={18} />
      </View>
      <SkeletonBox height={14} width="55%" style={{marginTop: sp.sm, marginBottom: sp.md}} />
      <SkeletonBox height={44} borderRadius={radius.md} style={{marginBottom: sp.md}} />
      <View style={styles.filterRow}>
        <SkeletonBox width={56} height={34} borderRadius={radius.full} />
        <SkeletonBox width={72} height={34} borderRadius={radius.full} />
        <SkeletonBox width={88} height={34} borderRadius={radius.full} />
      </View>
      {Array.from({length: 6}).map((_, i) => (
        <TaskListItemSkeleton key={i} />
      ))}
    </View>
  );
});

const TaskListItemSkeleton = memo(() => {
  const {spacing: sp} = useTheme();
  return (
    <View style={[styles.taskCard, {marginBottom: sp.sm}]}>
      <SkeletonBox width={24} height={24} borderRadius={6} />
      <View style={styles.taskCardBody}>
        <SkeletonBox width="70%" height={18} />
        <SkeletonBox width="90%" height={14} style={{marginTop: sp.sm}} />
        <SkeletonBox width="40%" height={12} style={{marginTop: sp.sm}} />
      </View>
    </View>
  );
});

/** Task detail — loading task from DB */
export const TaskDetailScreenSkeleton = memo(() => {
  const {spacing: sp} = useTheme();
  return (
    <View>
      <View style={styles.detailCard}>
        <SkeletonBox width="75%" height={26} />
        <SkeletonBox width="100%" height={14} style={{marginTop: sp.md}} />
        <SkeletonBox width="85%" height={14} style={{marginTop: sp.sm}} />
        <SkeletonBox width="60%" height={14} style={{marginTop: sp.lg}} />
        <SkeletonBox width="50%" height={14} style={{marginTop: sp.sm}} />
        <SkeletonBox width="55%" height={14} style={{marginTop: sp.sm}} />
        <SkeletonBox width="65%" height={14} style={{marginTop: sp.sm}} />
      </View>
      <SkeletonBox height={48} borderRadius={radius.md} style={{marginTop: sp.lg}} />
      <SkeletonBox height={48} borderRadius={radius.md} style={{marginTop: sp.sm}} />
    </View>
  );
});

/** Task form — loading task for edit */
export const TaskFormScreenSkeleton = memo(() => {
  const {spacing: sp} = useTheme();
  return (
    <View>
      <SkeletonBox width={80} height={14} style={{marginBottom: sp.sm}} />
      <SkeletonBox height={48} borderRadius={radius.md} style={{marginBottom: sp.md}} />
      <SkeletonBox width={100} height={14} style={{marginBottom: sp.sm}} />
      <SkeletonBox height={100} borderRadius={radius.md} style={{marginBottom: sp.md}} />
      <SkeletonBox width="90%" height={12} style={{marginBottom: sp.lg}} />
      <SkeletonBox height={48} borderRadius={radius.md} />
    </View>
  );
});

/** Settings — optional initial load */
export const SettingsScreenSkeleton = memo(() => {
  const {spacing: sp} = useTheme();
  return (
    <View>
      <SkeletonBox width={120} height={28} style={{marginBottom: sp.md}} />
      <SkeletonBox width={200} height={16} style={{marginBottom: sp.lg}} />
      <SkeletonBox width={100} height={18} style={{marginBottom: sp.sm}} />
      <SkeletonBox width="100%" height={14} style={{marginBottom: sp.lg}} />
      <SkeletonBox width={100} height={18} style={{marginBottom: sp.sm}} />
      <SkeletonBox height={48} borderRadius={radius.md} style={{marginBottom: sp.sm}} />
      <SkeletonBox height={48} borderRadius={radius.md} style={{marginBottom: sp.sm}} />
      <SkeletonBox height={48} borderRadius={radius.md} style={{marginBottom: sp.lg}} />
      <SkeletonBox height={48} borderRadius={radius.md} />
    </View>
  );
});

/** Login / SignUp — full screen placeholder (e.g. session restore) */
export const AuthScreenSkeleton = memo(() => (
  <View style={styles.authForm}>
    <SkeletonBox width={180} height={28} style={{marginBottom: spacing.lg}} />
    <SkeletonBox width="100%" height={14} style={{marginBottom: spacing.sm}} />
    <SkeletonBox height={48} borderRadius={radius.md} style={{marginBottom: spacing.md}} />
    <SkeletonBox width="100%" height={14} style={{marginBottom: spacing.sm}} />
    <SkeletonBox height={48} borderRadius={radius.md} style={{marginBottom: spacing.lg}} />
    <SkeletonBox height={48} borderRadius={radius.md} />
  </View>
));

const styles = StyleSheet.create({
  authRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  authForm: {
    flex: 1,
    justifyContent: 'center',
  },
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'transparent',
  },
  taskCardBody: {
    flex: 1,
    marginLeft: spacing.md,
  },
  detailCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
});
