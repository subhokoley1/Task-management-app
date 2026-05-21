import firestore from '@react-native-firebase/firestore';
import {FIRESTORE_COLLECTIONS} from '@/constants';
import type {Task} from '@/types/task';

const tasksCollection = (userId: string) =>
  firestore()
    .collection(FIRESTORE_COLLECTIONS.USERS)
    .doc(userId)
    .collection(FIRESTORE_COLLECTIONS.TASKS);

export const firestoreService = {
  async upsertTask(userId: string, task: Task): Promise<void> {
    await tasksCollection(userId)
      .doc(task.id)
      .set(
        {
          id: task.id,
          title: task.title,
          description: task.description,
          completed: task.completed,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          reminderDate: task.reminderDate ?? null,
        },
        {merge: true},
      );
  },

  async deleteTask(userId: string, taskId: string): Promise<void> {
    await tasksCollection(userId).doc(taskId).delete();
  },

  async fetchRemoteTasks(userId: string): Promise<Task[]> {
    const snapshot = await tasksCollection(userId).orderBy('updatedAt', 'desc').get();

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id as string,
        userId,
        title: data.title as string,
        description: (data.description as string) ?? '',
        completed: Boolean(data.completed),
        createdAt: data.createdAt as string,
        updatedAt: data.updatedAt as string,
        reminderDate: (data.reminderDate as string | null) ?? null,
        syncStatus: 'synced' as const,
      };
    });
  },

  async getRemoteTask(userId: string, taskId: string): Promise<Task | null> {
    const doc = await tasksCollection(userId).doc(taskId).get();
    if (!doc.exists) {
      return null;
    }
    const data = doc.data()!;
    return {
      id: data.id as string,
      userId,
      title: data.title as string,
      description: (data.description as string) ?? '',
      completed: Boolean(data.completed),
      createdAt: data.createdAt as string,
      updatedAt: data.updatedAt as string,
      reminderDate: (data.reminderDate as string | null) ?? null,
      syncStatus: 'synced',
    };
  },
};
