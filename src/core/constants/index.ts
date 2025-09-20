// src/core/constants/index.ts
export const APP_CONFIG = {
  NAME: 'InstaScore',
  VERSION: '1.1.3',
  API_TIMEOUT: 10000,
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
