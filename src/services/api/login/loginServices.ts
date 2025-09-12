// src/services/api/login/loginServices.ts
import apiClient from '../apiClient';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  expires: string;
  userId: string;
  premium: boolean;
}

interface LogoutRequest {
  email: string;
  password: string;
}

interface LogoutResponse {
  message: string;
  success: boolean;
}

export const loginService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/api/Auth/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response?.data?.message;
        
        // Si es un error 500 o "Internal Server Error", probablemente son credenciales incorrectas
        if (status === 500 || serverMessage === 'Internal Server Error') {
          throw new Error('Usuario o contraseña incorrectos');
        }
        
        switch (status) {
          case 401:
            throw new Error('Usuario o contraseña incorrectos');
          case 404:
            throw new Error('Usuario no encontrado');
          case 400:
            throw new Error('Datos de inicio de sesión inválidos');
          default:
            if (serverMessage && serverMessage !== 'Internal Server Error') {
              throw new Error(serverMessage);
            }
            // Por defecto, asumimos que son credenciales incorrectas
            throw new Error('Usuario o contraseña incorrectos');
        }
      }
      throw new Error('Verifica tu conexión a internet');
    }
  },

  logout: async (credentials: LogoutRequest): Promise<LogoutResponse> => {
    try {
      const response = await apiClient.get<LogoutResponse>('/api/Auth/logout', {
        params: credentials
      });
      return response.data;
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al cerrar sesión');
    }
  }
};