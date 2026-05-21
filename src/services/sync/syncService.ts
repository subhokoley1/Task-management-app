import {SYNC_BATCH_SIZE, SYNC_RETRY_LIMIT} from '@/constants';
import {taskRepository} from '@/database/taskRepository';
import {firestoreService} from '@/services/firebase/firestoreService';
import type {SyncActionType, Task} from '@/types/task';

export interface SyncResult {
  processed: number;
  failed: number;
  pending: number;
}

const resolveConflict = (local: Task, remote: Task): Task => {
  const localTime = new Date(local.updatedAt).getTime();
  const remoteTime = new Date(remote.updatedAt).getTime();
  return remoteTime >= localTime ? remote : local;
};

export const syncService = {
  async pullRemoteChanges(userId: string): Promise<void> {
    const remoteTasks = await firestoreService.fetchRemoteTasks(userId);
    const localTasks = await taskRepository.getAll(userId);
    const localMap = new Map(localTasks.map(task => [task.id, task]));

    for (const remote of remoteTasks) {
      const local = localMap.get(remote.id);
      if (!local) {
        await taskRepository.upsertFromRemote(remote);
        continue;
      }
      if (local.syncStatus === 'pending') {
        continue;
      }
      const winner = resolveConflict(local, remote);
      await taskRepository.upsertFromRemote(winner);
    }
  },

  async processQueue(userId: string): Promise<SyncResult> {
    const queue = await taskRepository.getPendingQueue(userId);
    let processed = 0;
    let failed = 0;

    const batch = queue.slice(0, SYNC_BATCH_SIZE);

    for (const item of batch) {
      if (item.retryCount >= SYNC_RETRY_LIMIT) {
        await taskRepository.markFailed(item.taskId);
        failed += 1;
        continue;
      }

      try {
        const action = item.action as SyncActionType;

        if (action === 'create' || action === 'update') {
          const task = JSON.parse(item.payload) as Task;
          await firestoreService.upsertTask(userId, task);
          await taskRepository.markSynced(task.id, task.updatedAt);
        } else if (action === 'delete') {
          await firestoreService.deleteTask(userId, item.taskId);
        }

        await taskRepository.removeQueueItem(item.id);
        processed += 1;
      } catch {
        await taskRepository.incrementQueueRetry(item.id);
        await taskRepository.markFailed(item.taskId);
        failed += 1;
      }
    }

    const remaining = await taskRepository.getPendingQueue(userId);
    return {
      processed,
      failed,
      pending: remaining.length,
    };
  },

  async syncAll(userId: string): Promise<SyncResult> {
    await this.pullRemoteChanges(userId);
    return this.processQueue(userId);
  },
};
