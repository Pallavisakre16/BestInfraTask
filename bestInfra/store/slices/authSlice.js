import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { apiClient } from '../../services/api-client';
import { loadStoredAuthState, persistAuthState } from '../../services/session-storage';

const storedAuthState = loadStoredAuthState();

function syncStoredAuth(state) {
  persistAuthState({
    user: state.user,
    token: state.token,
  });
}

function getRequestErrorMessage(error, fallbackMessage) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Check backend server and network connection.';
  }

  if (error.message === 'Network Error' || !error.response) {
    return 'Cannot connect to backend. Start backend server and MongoDB, then check your API URL.';
  }

  return fallbackMessage;
}

export const registerUser = createAsyncThunk('auth/registerUser', async (payload, thunkApi) => {
  try {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(getRequestErrorMessage(error, 'Registration failed'));
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (payload, thunkApi) => {
  try {
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(getRequestErrorMessage(error, 'Login failed'));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedAuthState.user,
    token: storedAuthState.token,
    loginLoading: false,
    registerLoading: false,
    loginError: null,
    registerError: null,
    registerSuccess: null,
  },
  reducers: {
    clearAuthFeedback(state) {
      state.loginError = null;
      state.registerError = null;
      state.registerSuccess = null;
    },
    setAuthenticatedUser(state, action) {
      state.user = action.payload;
      syncStoredAuth(state);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.loginError = null;
      state.registerError = null;
      state.registerSuccess = null;
      syncStoredAuth(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
        state.registerSuccess = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.registerSuccess = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        syncStoredAuth(state);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload;
      });
  },
});

export const { clearAuthFeedback, setAuthenticatedUser, logout } = authSlice.actions;
export default authSlice.reducer;
