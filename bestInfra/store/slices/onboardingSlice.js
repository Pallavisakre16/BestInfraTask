import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { apiClient } from '../../services/api-client';

const ONBOARDING_RETRY_DELAYS_MS = [0, 4000, 8000];
const ONBOARDING_TIMEOUT_MS = 25000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetryOnboarding(error) {
  if (error.code === 'ECONNABORTED') {
    return true;
  }

  if (error.message === 'Network Error' || !error.response) {
    return true;
  }

  return typeof error.response?.status === 'number' && error.response.status >= 500;
}

function getOnboardingErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !error.response) {
    return 'Server is waking up. Please retry in a few seconds.';
  }

  return 'Onboarding fetch failed';
}

export const fetchOnboarding = createAsyncThunk('onboarding/fetchOnboarding', async (_, thunkApi) => {
  let lastError;

  for (const delayMs of ONBOARDING_RETRY_DELAYS_MS) {
    if (delayMs > 0) {
      await sleep(delayMs);
    }

    try {
      const response = await apiClient.get('/onboarding', {
        timeout: ONBOARDING_TIMEOUT_MS,
      });
      return response.data.slides;
    } catch (error) {
      lastError = error;

      if (!shouldRetryOnboarding(error)) {
        break;
      }
    }
  }

  return thunkApi.rejectWithValue(getOnboardingErrorMessage(lastError));
});

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    slides: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.slides = action.payload;
      })
      .addCase(fetchOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default onboardingSlice.reducer;
