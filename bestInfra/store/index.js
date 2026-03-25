import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import notificationsReducer from './slices/notificationsSlice';
import onboardingReducer from './slices/onboardingSlice';
import profileReducer from './slices/profileSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    onboarding: onboardingReducer,
    dashboard: dashboardReducer,
    profile: profileReducer,
    settings: settingsReducer,
    notifications: notificationsReducer,
  },
});
