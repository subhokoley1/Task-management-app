import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  TriggerType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {NOTIFICATION_CHANNEL_ID} from '@/constants';
import type {Task} from '@/types/task';

async function ensureRegisteredForRemoteMessages(): Promise<void> {
  if (Platform.OS !== 'ios') {
    return;
  }
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages();
  }
}

export const notificationService = {
  async initialize(): Promise<void> {
    await notifee.requestPermission();
    await notifee.createChannel({
      id: NOTIFICATION_CHANNEL_ID,
      name: 'Task Reminders',
      importance: AndroidImportance.HIGH,
    });
    await messaging().requestPermission();
    await ensureRegisteredForRemoteMessages();
  },

  async scheduleTaskReminder(task: Task): Promise<void> {
    if (!task.reminderDate) {
      return;
    }

    const triggerDate = new Date(task.reminderDate).getTime();
    if (triggerDate <= Date.now()) {
      return;
    }

    await notifee.cancelNotification(task.id);

    await notifee.createTriggerNotification(
      {
        id: task.id,
        title: 'Task Reminder',
        body: task.title,
        data: {taskId: task.id},
        android: {
          channelId: NOTIFICATION_CHANNEL_ID,
          pressAction: {id: 'default'},
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerDate,
      },
    );
  },

  async cancelTaskReminder(taskId: string): Promise<void> {
    await notifee.cancelNotification(taskId);
  },

  async displayImmediate(title: string, body: string): Promise<void> {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: NOTIFICATION_CHANNEL_ID,
        pressAction: {id: 'default'},
      },
    });
  },

  onForegroundMessage(handler: (title: string, body: string) => void): () => void {
    return messaging().onMessage(async remoteMessage => {
      const title = remoteMessage.notification?.title ?? 'Task Manager';
      const body = remoteMessage.notification?.body ?? 'You have a new notification';
      handler(title, body);
      await this.displayImmediate(title, body);
    });
  },

  async getFcmToken(): Promise<string | null> {
    try {
      const status = await messaging().hasPermission();
      if (
        status === AuthorizationStatus.DENIED ||
        status === AuthorizationStatus.NOT_DETERMINED
      ) {
        return null;
      }
      await ensureRegisteredForRemoteMessages();
      return await messaging().getToken();
    } catch (error) {
      console.warn('[FCM] Unable to get device token:', error);
      return null;
    }
  },
};
