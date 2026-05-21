export const STORAGE_KEYS = {
  THEME: '@taskmanager/theme',
  AUTH_PERSIST: '@taskmanager/auth',
} as const;

export const SYNC_RETRY_LIMIT = 5;
export const SYNC_BATCH_SIZE = 20;

export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  TASKS: 'tasks',
} as const;

export const NOTIFICATION_CHANNEL_ID = 'task-reminders';
