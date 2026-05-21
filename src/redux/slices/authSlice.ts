import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authService} from '@/services/firebase/authService';
import type {AuthUser, LoginFormValues, SignUpFormValues} from '@/types/auth';
import {getErrorMessage} from '@/utils/errors';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  return new Promise<AuthUser | null>(resolve => {
    const unsubscribe = authService.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    });
  });
});

export const login = createAsyncThunk(
  'auth/login',
  async (values: LoginFormValues, {rejectWithValue}) => {
    try {
      return await authService.signIn(values.email, values.password);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (values: SignUpFormValues, {rejectWithValue}) => {
    try {
      return await authService.signUp(values.email, values.password);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async (_, {rejectWithValue}) => {
  try {
    await authService.signOut();
    return null;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: state => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
  },
  extraReducers: builder => {
    const pending = (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    };
    const rejected = (state: AuthState, action: {payload: unknown}) => {
      state.isLoading = false;
      state.error = (action.payload as string) ?? 'Authentication failed';
    };

    builder
      .addCase(initializeAuth.pending, pending)
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = action.payload;
        state.isAuthenticated = Boolean(action.payload);
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = action.payload as string;
      })
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, rejected)
      .addCase(signUp.pending, pending)
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, rejected)
      .addCase(logout.pending, pending)
      .addCase(logout.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, rejected);
  },
});

export const {clearAuthError, setUser} = authSlice.actions;
export default authSlice.reducer;
