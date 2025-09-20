// src/services/api/login/registerServices.ts
import apiClient from '../apiClient';

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  Sexo: string;
  Edad: string;
}

interface RegisterResponse {
  message: string;
  token: string;
  expires: string;
}

export const registerService = {
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post<RegisterResponse>('/api/Auth/register', userData);
      return response.data;
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error de conexión');
    }
  }
};