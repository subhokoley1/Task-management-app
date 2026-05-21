import {configureStore} from '@reduxjs/toolkit';
import authReducer from '@/redux/slices/authSlice';
import taskReducer from '@/redux/slices/taskSlice';
import syncReducer from '@/redux/slices/syncSlice';
import {syncMiddleware} from '@/redux/middleware/syncMiddleware';

const rootReducer = {
  auth: authReducer,
  tasks: taskReducer,
  sync: syncReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(syncMiddleware),
});

export type RootState = {
  auth: ReturnType<typeof authReducer>;
  tasks: ReturnType<typeof taskReducer>;
  sync: ReturnType<typeof syncReducer>;
};

export type AppDispatch = typeof store.dispatch;
