import axios from 'axios';

const DEFAULT_PRODUCTION_API_URL = 'https://bestinfratask.onrender.com/api';

function getApiBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  return DEFAULT_PRODUCTION_API_URL;
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 20000,
});
