import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {syncService} from '@/services/sync/syncService';
import {getErrorMessage} from '@/utils/errors';

interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  pendingCount: number;
  failedCount: number;
  error: string | null;
}

const initialState: SyncState = {
  isOnline: true,
  isSyncing: false,
  lastSyncedAt: null,
  pendingCount: 0,
  failedCount: 0,
  error: null,
};

export const runSync = createAsyncThunk(
  'sync/run',
  async (userId: string, {rejectWithValue}) => {
    try {
      return await syncService.syncAll(userId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    setPendingCount: (state, action) => {
      state.pendingCount = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(runSync.pending, state => {
        state.isSyncing = true;
        state.error = null;
      })
      .addCase(runSync.fulfilled, (state, action) => {
        state.isSyncing = false;
        state.lastSyncedAt = new Date().toISOString();
        state.pendingCount = action.payload.pending;
        state.failedCount = action.payload.failed;
      })
      .addCase(runSync.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload as string;
      });
  },
});

export const {setOnlineStatus, setPendingCount} = syncSlice.actions;
export default syncSlice.reducer;
