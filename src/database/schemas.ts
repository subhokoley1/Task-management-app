import Realm from 'realm';

export class TaskSchema extends Realm.Object<TaskSchema> {
  id!: string;
  userId!: string;
  title!: string;
  description!: string;
  completed!: boolean;
  createdAt!: string;
  updatedAt!: string;
  reminderDate?: string | null;
  syncStatus!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Task',
    primaryKey: 'id',
    properties: {
      id: 'string',
      userId: {type: 'string', indexed: true},
      title: 'string',
      description: 'string',
      completed: {type: 'bool', default: false},
      createdAt: 'string',
      updatedAt: 'string',
      reminderDate: 'string?',
      syncStatus: {type: 'string', default: 'pending'},
    },
  };
}

export class SyncQueueSchema extends Realm.Object<SyncQueueSchema> {
  id!: string;
  taskId!: string;
  userId!: string;
  action!: string;
  payload!: string;
  retryCount!: number;
  createdAt!: string;
  lastAttemptAt?: string | null;

  static schema: Realm.ObjectSchema = {
    name: 'SyncQueue',
    primaryKey: 'id',
    properties: {
      id: 'string',
      taskId: {type: 'string', indexed: true},
      userId: {type: 'string', indexed: true},
      action: 'string',
      payload: 'string',
      retryCount: {type: 'int', default: 0},
      createdAt: 'string',
      lastAttemptAt: 'string?',
    },
  };
}

export const realmConfig: Realm.Configuration = {
  schema: [TaskSchema, SyncQueueSchema],
  schemaVersion: 1,
};
