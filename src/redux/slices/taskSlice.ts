import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {taskRepository} from '@/database/taskRepository';
import {notificationService} from '@/services/notifications/notificationService';
import type {Task, TaskFormValues} from '@/types/task';
import {getErrorMessage} from '@/utils/errors';

const tasksAdapter = createEntityAdapter<Task>({
  sortComparer: (a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
});

type TaskFilter = 'all' | 'active' | 'completed';

type TaskState = ReturnType<typeof tasksAdapter.getInitialState> & {
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  searchQuery: string;
  filter: TaskFilter;
};

const initialState: TaskState = tasksAdapter.getInitialState({
  isLoading: false,
  isRefreshing: false,
  error: null,
  searchQuery: '',
  filter: 'all',
});

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (userId: string, {rejectWithValue}) => {
    try {
      return await taskRepository.getAll(userId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (
    {userId, values}: {userId: string; values: TaskFormValues},
    {rejectWithValue},
  ) => {
    try {
      const task = await taskRepository.create(userId, values);
      try {
        await notificationService.scheduleTaskReminder(task);
      } catch {
        // Reminder scheduling must not block task creation
      }
      return task;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async (
    {
      taskId,
      userId,
      values,
    }: {taskId: string; userId: string; values: Partial<TaskFormValues>},
    {rejectWithValue},
  ) => {
    try {
      const task = await taskRepository.update(taskId, userId, values);
      if (task) {
        await notificationService.scheduleTaskReminder(task);
      }
      return task;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const toggleTaskComplete = createAsyncThunk(
  'tasks/toggle',
  async (
    {taskId, userId}: {taskId: string; userId: string},
    {rejectWithValue},
  ) => {
    try {
      return await taskRepository.toggleComplete(taskId, userId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (
    {taskId, userId}: {taskId: string; userId: string},
    {rejectWithValue},
  ) => {
    try {
      const success = await taskRepository.remove(taskId, userId);
      if (success) {
        await notificationService.cancelTaskReminder(taskId);
      }
      return taskId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilter: (state, action: PayloadAction<TaskFilter>) => {
      state.filter = action.payload;
    },
    clearTaskError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        if (action.meta.arg) {
          state.isRefreshing = state.ids.length > 0;
          state.isLoading = state.ids.length === 0;
        }
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        tasksAdapter.setAll(state, action.payload);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.error = (action.payload as string) ?? 'Failed to load tasks';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        if (action.payload) {
          tasksAdapter.addOne(state, action.payload);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = (action.payload as string) ?? 'Failed to create task';
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        if (action.payload) {
          tasksAdapter.upsertOne(state, action.payload);
        }
      })
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        if (action.payload) {
          tasksAdapter.upsertOne(state, action.payload);
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        tasksAdapter.removeOne(state, action.payload);
      });
  },
});

export const {setSearchQuery, setFilter, clearTaskError} = taskSlice.actions;

export const tasksSelectors = tasksAdapter.getSelectors(
  (state: {tasks: TaskState}) => state.tasks,
);

export const selectFilteredTasks = (state: {
  tasks: TaskState;
}): Task[] => {
  const all = tasksSelectors.selectAll(state);
  const query = state.tasks.searchQuery.trim().toLowerCase();
  const {filter} = state.tasks;

  return all.filter(task => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !task.completed) ||
      (filter === 'completed' && task.completed);

    const matchesSearch =
      !query ||
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });
};

export default taskSlice.reducer;
