import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { apiClient } from '../../services/api-client';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (_, thunkApi) => {
  try {
    const token = thunkApi.getState().auth.token;
    const response = await apiClient.get('/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || 'Profile fetch failed');
  }
});

export const updateProfile = createAsyncThunk('profile/updateProfile', async (payload, thunkApi) => {
  try {
    const token = thunkApi.getState().auth.token;
    const response = await apiClient.put('/profile', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || 'Profile update failed');
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    updating: false,
    error: null,
  },
  reducers: {
    setProfileData(state, action) {
      state.data = action.payload;
      state.error = null;
    },
    clearProfile(state) {
      state.data = null;
      state.loading = false;
      state.updating = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.data = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile, setProfileData } = profileSlice.actions;
export default profileSlice.reducer;
