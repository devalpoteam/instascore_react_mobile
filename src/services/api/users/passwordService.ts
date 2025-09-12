// src/services/api/users/passwordService.ts
import apiClient from '../apiClient';

interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  token: string;
}

interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

interface ChangePasswordResponse {
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
  },
  
  changePassword: async (request: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    try {
      const response = await apiClient.post<ChangePasswordResponse>('/api/Users/change-password', request);
      return response.data;
    } catch (error: any) {
      console.error('Change password error:', error.response?.data || error.message);
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al cambiar la contraseña. Intenta de nuevo.');
    }
  }
};