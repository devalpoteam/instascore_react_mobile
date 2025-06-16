// src/core/constants/index.ts
export const APP_CONFIG = {
  NAME: 'InstaScore',
  VERSION: '1.0.0',
  API_TIMEOUT: 10000,
};

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#F2F2F7',
};

export const ENDPOINTS = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api' 
    : 'https://api.instascore.com',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  CAMPEONATOS: {
    LIST: '/campeonatos',
    DETAIL: (id: string) => `/campeonatos/${id}`,
  },
};