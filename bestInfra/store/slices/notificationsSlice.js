import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { apiClient } from '../../services/api-client';

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (_, thunkApi) => {
  try {
    const token = thunkApi.getState().auth.token;
    const response = await apiClient.get('/notifications', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || 'Notifications fetch failed');
  }
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
