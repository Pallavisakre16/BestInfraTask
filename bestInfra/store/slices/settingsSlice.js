import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { apiClient } from '../../services/api-client';

export const fetchSettings = createAsyncThunk('settings/fetchSettings', async (_, thunkApi) => {
  try {
    const token = thunkApi.getState().auth.token;
    const response = await apiClient.get('/settings', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || 'Settings fetch failed');
  }
});

export const updateSettings = createAsyncThunk('settings/updateSettings', async (payload, thunkApi) => {
  try {
    const token = thunkApi.getState().auth.token;
    const response = await apiClient.patch('/settings', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || 'Settings update failed');
  }
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    data: null,
    loading: false,
    updating: false,
    error: null,
  },
  reducers: {
    clearSettings(state) {
      state.data = null;
      state.loading = false;
      state.updating = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSettings.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.updating = false;
        state.data = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const { clearSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
