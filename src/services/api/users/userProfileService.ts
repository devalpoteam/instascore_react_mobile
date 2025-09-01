import apiClient from '../apiClient';

export interface UserProfile {
  userId: string;
  userName: string;
  email: string;
  fullName: string;
  sexo: string;
  edad: string;
  premium: boolean;
  ultimoPago: string;
}

export interface UserUpdateRequest {
  userId: string;
  userName: string;
  email: string;
  fullName: string;
  sexo: string;
  edad: string;
}

export const userProfileService = {
  getProfile: async (userId: string): Promise<UserProfile> => {
    try {
      const response = await apiClient.get<UserProfile>(`/api/Users/Perfil?UserId=${userId}`);
      return response.data;
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al obtener el perfil del usuario');
    }
  },

  updateProfile: async (userData: UserUpdateRequest): Promise<void> => {
    try {
      await apiClient.put('/api/Users/update', userData);
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al actualizar el perfil del usuario');
    }
  }
};