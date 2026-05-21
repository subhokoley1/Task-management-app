import type {Middleware} from '@reduxjs/toolkit';
import {fetchTasks} from '@/redux/slices/taskSlice';
import {runSync, setPendingCount} from '@/redux/slices/syncSlice';
import {taskRepository} from '@/database/taskRepository';

export const syncMiddleware: Middleware = store => next => action => {
  const result = next(action);
  const type = String((action as {type?: string}).type ?? '');

  const shouldSync =
    type.startsWith('tasks/') &&
    !type.startsWith('tasks/fetch') &&
    !type.endsWith('/pending') &&
    !type.endsWith('/rejected');

  if (shouldSync) {
    const state = store.getState() as {
      auth: {user?: {uid: string} | null};
      sync: {isOnline: boolean};
    };
    const userId = state.auth.user?.uid;
    if (userId && state.sync.isOnline) {
      const dispatch = store.dispatch as (a: unknown) => Promise<unknown>;
      void dispatch(runSync(userId)).then(() => {
        void taskRepository.getPendingQueue(userId).then(queue => {
          dispatch(setPendingCount(queue.length));
        });
        dispatch(fetchTasks(userId));
      });
    }
  }

  return result;
};
