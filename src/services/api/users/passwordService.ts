// src/services/api/users/passwordService.ts
import apiClient from '../apiClient';

interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

export const passwordService = {
  resetPassword: async (request: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    try {
      const response = await apiClient.post<ResetPasswordResponse>('/api/Users/reset-password', request);
      return response.data;
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al cambiar la contraseña. Intenta de nuevo.');
    }
  }
};