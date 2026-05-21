export type SyncStatus = 'pending' | 'synced' | 'failed';

export type SyncActionType = 'create' | 'update' | 'delete';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  reminderDate?: string | null;
  syncStatus: SyncStatus;
}

export interface SyncQueueItem {
  id: string;
  taskId: string;
  userId: string;
  action: SyncActionType;
  payload: string;
  retryCount: number;
  createdAt: string;
  lastAttemptAt?: string | null;
}

export interface TaskFormValues {
  title: string;
  description: string;
  reminderDate?: Date | null;
}
