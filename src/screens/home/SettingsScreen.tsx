import React, {useCallback, useEffect, useState} from 'react';
import {Share, StyleSheet, Text, View} from 'react-native';
import type {SettingsScreenProps} from '@/types/navigation';
import {useAppDispatch, useAppSelector} from '@/hooks/useAppDispatch';
import {logout} from '@/redux/slices/authSlice';
import {Button} from '@/components/common/Button';
import {Screen} from '@/components/common/Screen';
import {ThemeToggle} from '@/components/common/ThemeToggle';
import {useTheme} from '@/theme/ThemeContext';
import {ENV} from '@/config/env';
import {notificationService} from '@/services/notifications/notificationService';

type Props = SettingsScreenProps;

export const SettingsScreen: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const {colors, spacing} = useTheme();
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const loadFcmToken = useCallback(async () => {
    const token = await notificationService.getFcmToken();
    setFcmToken(token);
    if (token) {
      console.log('[FCM] Device token:', token);
    }
  }, []);

  useEffect(() => {
    loadFcmToken();
  }, [loadFcmToken]);

  const handleTestLocalNotification = async () => {
    await notificationService.displayImmediate(
      'Task Manager',
      'Local notification test — Notifee is working.',
    );
  };

  const handleShareToken = async () => {
    if (fcmToken) {
      await Share.share({message: fcmToken, title: 'FCM device token'});
    }
  };

  return (
    <Screen scroll>
      <Text style={[styles.title, {color: colors.text}]}>Settings</Text>
      <Text style={{color: colors.textSecondary, marginBottom: spacing.md}}>
        {user?.email}
      </Text>

      <Text style={[styles.section, {color: colors.text}]}>Environment</Text>
      <Text style={{color: colors.textSecondary, marginBottom: spacing.lg}}>
        {ENV.appEnv} ({ENV.firebaseEnv}) — {ENV.apiUrl}
      </Text>

      <Text style={[styles.section, {color: colors.text}]}>Appearance</Text>
      <View style={[styles.toggleWrap, {marginBottom: spacing.lg}]}>
        <ThemeToggle />
      </View>

      <Text style={[styles.section, {color: colors.text}]}>Notifications (test)</Text>
      <Text style={{color: colors.textSecondary, marginBottom: spacing.sm}}>
        FCM Sender ID: 857972049398
      </Text>
      <Text
        style={[styles.token, {color: colors.textSecondary, borderColor: colors.border}]}
        selectable>
        {fcmToken ?? 'No FCM token — allow notifications when prompted'}
      </Text>
      <Button
        title="Share FCM token"
        variant="secondary"
        onPress={handleShareToken}
        style={{marginTop: spacing.sm}}
      />
      <Button
        title="Test local notification"
        variant="secondary"
        onPress={handleTestLocalNotification}
        style={{marginTop: spacing.sm}}
      />
      <Button
        title="Refresh FCM token"
        variant="ghost"
        onPress={loadFcmToken}
        style={{marginTop: spacing.sm, marginBottom: spacing.lg}}
      />

      <Button
        title="Sign Out"
        variant="danger"
        onPress={() => dispatch(logout())}
        style={{marginBottom: spacing.xl}}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {fontSize: 26, fontWeight: '700', marginBottom: 8},
  section: {fontSize: 16, fontWeight: '600', marginBottom: 8},
  toggleWrap: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  token: {
    fontSize: 11,
    lineHeight: 16,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
});
