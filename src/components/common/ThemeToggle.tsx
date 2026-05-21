import React, {memo, useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@/theme/ThemeContext';

const TRACK_WIDTH = 280;
const TRACK_HEIGHT = 56;
const THUMB_SIZE = 48;
const THUMB_PADDING = 4;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_PADDING * 2;

const SPRING = {
  friction: 9,
  tension: 65,
  useNativeDriver: true,
};

export const ThemeToggle = memo(() => {
  const {isDark, toggleTheme} = useTheme();
  const progress = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: isDark ? 1 : 0,
      ...SPRING,
    }).start();
  }, [isDark, progress]);

  const thumbTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_PADDING, THUMB_PADDING + THUMB_TRAVEL],
  });

  const lightTrackOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const darkTrackOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const lightLabelOpacity = progress.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [1, 0, 0],
  });

  const darkLabelOpacity = progress.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [0, 0, 1],
  });

  const sunOpacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const moonOpacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const thumbScale = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.92, 1],
  });

  return (
    <Pressable
      onPress={toggleTheme}
      style={({pressed}) => [styles.pressable, pressed && styles.pressed]}
      accessibilityRole="switch"
      accessibilityState={{checked: isDark}}
      accessibilityLabel={isDark ? 'Dark mode on' : 'Light mode on'}>
      <View style={styles.trackClip}>
        <Animated.View
          style={[
            styles.trackLayer,
            styles.lightTrack,
            {opacity: lightTrackOpacity},
          ]}
        />
        <Animated.View
          style={[
            styles.trackLayer,
            styles.darkTrack,
            {opacity: darkTrackOpacity},
          ]}
        />

        <Animated.View
          style={[styles.labelLayer, styles.labelRight, {opacity: lightLabelOpacity}]}>
          <Text style={[styles.label, styles.lightLabelText]}>LIGHT MODE</Text>
        </Animated.View>
        <Animated.View
          style={[styles.labelLayer, styles.labelLeft, {opacity: darkLabelOpacity}]}>
          <Text style={[styles.label, styles.darkLabelText]}>DARK MODE</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{translateX: thumbTranslateX}, {scale: thumbScale}],
            },
          ]}>
          <Animated.View style={[styles.thumbLight, styles.thumbFill, {opacity: lightTrackOpacity}]} />
          <Animated.View style={[styles.thumbDark, styles.thumbFill, {opacity: darkTrackOpacity}]} />
          <Animated.Text style={[styles.icon, {opacity: sunOpacity}]}>☀️</Animated.Text>
          <Animated.Text style={[styles.iconMoon, {opacity: moonOpacity}]}>🌙</Animated.Text>
          <Animated.Text style={[styles.star, {opacity: moonOpacity}]}>✦</Animated.Text>
        </Animated.View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'center',
  },
  pressed: {
    opacity: 0.95,
    transform: [{scale: 0.98}],
  },
  trackClip: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    overflow: 'hidden',
  },
  trackLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: TRACK_HEIGHT / 2,
  },
  lightTrack: {
    backgroundColor: '#E4E9F0',
    shadowColor: '#B8BEC7',
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  darkTrack: {
    backgroundColor: '#1E2A3A',
    shadowColor: '#0F172A',
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 6,
  },
  thumb: {
    position: 'absolute',
    top: THUMB_PADDING,
    left: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: -2, height: -2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  thumbFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: THUMB_SIZE / 2,
  },
  thumbLight: {
    backgroundColor: '#EEF1F6',
  },
  thumbDark: {
    backgroundColor: '#2D3A4F',
  },
  icon: {
    fontSize: 22,
    position: 'absolute',
  },
  iconMoon: {
    fontSize: 22,
    position: 'absolute',
  },
  star: {
    position: 'absolute',
    top: 10,
    right: 12,
    fontSize: 8,
    color: '#94A3B8',
  },
  labelLayer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  labelRight: {
    right: 12,
    left: THUMB_SIZE + 12,
    alignItems: 'flex-end',
  },
  labelLeft: {
    left: 12,
    right: THUMB_SIZE + 12,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  lightLabelText: {
    color: '#6B7280',
  },
  darkLabelText: {
    color: '#94A3B8',
  },
});
