import Realm from 'realm';
import type {SyncActionType, SyncStatus, Task, TaskFormValues} from '@/types/task';
import {generateId} from '@/utils/id';
import {getRealm} from './realm';
import {SyncQueueSchema, TaskSchema} from './schemas';

const buildRealmTask = (
  userId: string,
  values: TaskFormValues,
  id: string,
  now: string,
): Record<string, string | boolean> => {
  const record: Record<string, string | boolean> = {
    id,
    userId,
    title: values.title.trim(),
    description: (values.description ?? '').trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
    syncStatus: 'pending',
  };
  if (values.reminderDate) {
    record.reminderDate = values.reminderDate.toISOString();
  }
  return record;
};

const toTask = (record: TaskSchema): Task => ({
  id: record.id,
  userId: record.userId,
  title: record.title,
  description: record.description,
  completed: record.completed,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  reminderDate: record.reminderDate ?? null,
  syncStatus: record.syncStatus as SyncStatus,
});

export const taskRepository = {
  async getAll(userId: string): Promise<Task[]> {
    const realm = await getRealm();
    const records = realm
      .objects<TaskSchema>('Task')
      .filtered('userId == $0', userId)
      .sorted('updatedAt', true);
    return Array.from(records).map(toTask);
  },

  async getById(taskId: string): Promise<Task | null> {
    const realm = await getRealm();
    const record = realm.objectForPrimaryKey<TaskSchema>('Task', taskId);
    return record ? toTask(record) : null;
  },

  async create(userId: string, values: TaskFormValues): Promise<Task> {
    const realm = await getRealm();
    const now = new Date().toISOString();
    const id = generateId();
    const task: Task = {
      id,
      userId,
      title: values.title.trim(),
      description: (values.description ?? '').trim(),
      completed: false,
      createdAt: now,
      updatedAt: now,
      reminderDate: values.reminderDate?.toISOString() ?? null,
      syncStatus: 'pending',
    };

    realm.write(() => {
      realm.create('Task', buildRealmTask(userId, values, id, now), Realm.UpdateMode.Modified);
      realm.create('SyncQueue', {
        id: generateId(),
        taskId: id,
        userId,
        action: 'create',
        payload: JSON.stringify(task),
        retryCount: 0,
        createdAt: now,
      });
    });

    return task;
  },

  async update(
    taskId: string,
    userId: string,
    values: Partial<TaskFormValues> & {completed?: boolean},
  ): Promise<Task | null> {
    const realm = await getRealm();
    const record = realm.objectForPrimaryKey<TaskSchema>('Task', taskId);
    if (!record || record.userId !== userId) {
      return null;
    }

    const now = new Date().toISOString();
    let updatedTask: Task | null = null;

    realm.write(() => {
      if (values.title !== undefined) {
        record.title = values.title.trim();
      }
      if (values.description !== undefined) {
        record.description = (values.description ?? '').trim();
      }
      if (values.completed !== undefined) {
        record.completed = values.completed;
      }
      if (values.reminderDate !== undefined) {
        record.reminderDate = values.reminderDate?.toISOString() ?? null;
      }
      record.updatedAt = now;
      record.syncStatus = 'pending';
      updatedTask = toTask(record);

      realm.create('SyncQueue', {
        id: generateId(),
        taskId,
        userId,
        action: 'update',
        payload: JSON.stringify(updatedTask),
        retryCount: 0,
        createdAt: now,
      });
    });

    return updatedTask;
  },

  async toggleComplete(taskId: string, userId: string): Promise<Task | null> {
    const existing = await this.getById(taskId);
    if (!existing) {
      return null;
    }
    return this.update(taskId, userId, {completed: !existing.completed});
  },

  async remove(taskId: string, userId: string): Promise<boolean> {
    const realm = await getRealm();
    const record = realm.objectForPrimaryKey<TaskSchema>('Task', taskId);
    if (!record || record.userId !== userId) {
      return false;
    }

    const now = new Date().toISOString();
    realm.write(() => {
      realm.create('SyncQueue', {
        id: generateId(),
        taskId,
        userId,
        action: 'delete',
        payload: JSON.stringify({id: taskId}),
        retryCount: 0,
        createdAt: now,
      });
      realm.delete(record);
    });

    return true;
  },

  async markSynced(taskId: string, remoteUpdatedAt?: string): Promise<void> {
    const realm = await getRealm();
    const record = realm.objectForPrimaryKey<TaskSchema>('Task', taskId);
    if (!record) {
      return;
    }

    realm.write(() => {
      record.syncStatus = 'synced';
      if (remoteUpdatedAt) {
        record.updatedAt = remoteUpdatedAt;
      }
    });
  },

  async markFailed(taskId: string): Promise<void> {
    const realm = await getRealm();
    const record = realm.objectForPrimaryKey<TaskSchema>('Task', taskId);
    if (!record) {
      return;
    }
    realm.write(() => {
      record.syncStatus = 'failed';
    });
  },

  async upsertFromRemote(task: Task): Promise<void> {
    const realm = await getRealm();
    realm.write(() => {
      realm.create(
        'Task',
        {...task, syncStatus: 'synced'},
        Realm.UpdateMode.Modified,
      );
    });
  },

  async getPendingQueue(userId: string) {
    const realm = await getRealm();
    return Array.from(
      realm
        .objects<SyncQueueSchema>('SyncQueue')
        .filtered('userId == $0', userId)
        .sorted('createdAt'),
    ).map(item => ({
      id: item.id,
      taskId: item.taskId,
      userId: item.userId,
      action: item.action as SyncActionType,
      payload: item.payload,
      retryCount: item.retryCount,
      createdAt: item.createdAt,
      lastAttemptAt: item.lastAttemptAt ?? null,
    }));
  },

  async removeQueueItem(queueId: string): Promise<void> {
    const realm = await getRealm();
    const item = realm.objectForPrimaryKey<SyncQueueSchema>('SyncQueue', queueId);
    if (!item) {
      return;
    }
    realm.write(() => realm.delete(item));
  },

  async incrementQueueRetry(queueId: string): Promise<void> {
    const realm = await getRealm();
    const item = realm.objectForPrimaryKey<SyncQueueSchema>('SyncQueue', queueId);
    if (!item) {
      return;
    }
    realm.write(() => {
      item.retryCount += 1;
      item.lastAttemptAt = new Date().toISOString();
    });
  },
};
