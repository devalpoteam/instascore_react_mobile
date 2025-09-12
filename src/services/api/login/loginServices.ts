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
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error de conexión');
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