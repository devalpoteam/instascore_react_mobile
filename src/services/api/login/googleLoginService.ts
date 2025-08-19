// src/services/api/login/googleLoginService.ts
import { Linking } from 'react-native';
import apiClient from '../apiClient';
import API_CONFIG from '../../../core/config/api.config';

interface LoginResponse {
  message: string;
  token: string;
  expires: string;
}

class GoogleLoginService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.SERVICES.AUTH;
  }

  async startGoogleLogin(): Promise<void> {
    try {
      const googleAuthUrl = `${this.baseUrl}${API_CONFIG.ENDPOINTS.AUTH.GOOGLE_SIGNIN}`;

      const canOpen = await Linking.canOpenURL(googleAuthUrl);
      if (canOpen) {
        await Linking.openURL(googleAuthUrl);
      } else {
        throw new Error('No se puede abrir el navegador');
      }
    } catch (error) {
      console.error('❌ Error al abrir Google Auth:', error);
      throw new Error('Error al conectar con Google');
    }
  }

  async getGoogleCallback(): Promise<LoginResponse> {
    try {
      const response = await apiClient.get<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.GOOGLE_CALLBACK);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en Google callback:', error);
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al completar autenticación con Google');
    }
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }
}

// Exportar instancia única
export const googleLoginService = new GoogleLoginService();