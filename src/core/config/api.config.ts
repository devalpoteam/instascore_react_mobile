// src/core/config/api.config.ts
const API_CONFIG = {
  SERVICES: {
    AUTH: 'https://agymobileinstascore-develop.up.railway.app',
  },
  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/Auth/login',
      REGISTER: '/api/Auth/register',
      GOOGLE_SIGNIN: '/api/Auth/signin',
      GOOGLE_CALLBACK: '/api/Auth/callback'
    },
    HOME: {
      CAMPEONATOS: '/api/campeonatos'
    },
    LIVE: {
      CAMPEONATOS_ACTIVOS: '/api/campeonatos/activos',
      CAMPEONATO_BY_ID: '/api/campeonatos',
      CATEGORIAS_AGRUPADAS: '/api/campeonatos/categorias-agrupadas'
    },
    RESULTADOS: {
      INDIVIDUALES: '/api/PremiacionesResultados/individuales',
      EQUIPOS: '/api/PremiacionesResultados/equipos'
    }
  },
  
  TIMEOUT: 10000,
  
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

export default API_CONFIG;