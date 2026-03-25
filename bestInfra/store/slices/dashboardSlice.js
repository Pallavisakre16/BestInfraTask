import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { apiClient } from '../../services/api-client';

export const fetchDashboardData = createAsyncThunk('dashboard/fetchDashboardData', async (_, thunkApi) => {
  try {
    const token = thunkApi.getState().auth.token;
    const response = await apiClient.get('/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || 'Dashboard fetch failed');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    setDashboardData(state, action) {
      state.data = action.payload;
      state.error = null;
    },
    syncDashboardIdentity(state, action) {
      if (!state.data) {
        return;
      }

      const { name, customerId } = action.payload;

      if (name && state.data.menu) {
        state.data.menu.userName = name;
      }

      if (customerId && state.data.menu) {
        state.data.menu.userId = `ID: ${customerId}`;
      }

      if (name && state.data.overview) {
        const firstName = name.trim().split(/\s+/)[0] || 'User';
        state.data.overview.greeting = `Hi, ${firstName}`;
      }
    },
    clearDashboard(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboard, setDashboardData, syncDashboardIdentity } = dashboardSlice.actions;
export default dashboardSlice.reducer;
