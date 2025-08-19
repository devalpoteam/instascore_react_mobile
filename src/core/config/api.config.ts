// src/core/config/api.config.ts
const API_CONFIG = {
  SERVICES: {
    AUTH: 'https://agymobileinstascore-develop.up.railway.app',
  },
  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/Auth/login',           // POST - Login normal
      GOOGLE_SIGNIN: '/api/Auth/signin',  // GET - Inicia flujo Google  
      GOOGLE_CALLBACK: '/api/Auth/callback' // GET - Callback Google
    }
  },
  
  TIMEOUT: 10000,
  
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

export default API_CONFIG;