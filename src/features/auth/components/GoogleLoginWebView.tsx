// src/features/auth/components/GoogleLoginWebView.tsx
import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '@/store/hooks';
import { loginSuccess, loginFailure } from '../store/authSlice';
import API_CONFIG from '@/core/config/api.config';
import { getColor } from '@/design/colorHelper';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function GoogleLoginWebView({ visible, onClose }: Props) {
  const dispatch = useAppDispatch();

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    
    // Verificar si llegamos al callback con token
    if (url.includes('/api/Auth/callback')) {
      // Extraer token de la URL o hacer request
      handleCallbackSuccess();
    }
  };

  const handleCallbackSuccess = async () => {
    try {
      // Hacer request al callback para obtener el token
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.GOOGLE_CALLBACK}`);
      const data = await response.json();
      
      if (data.token) {
        dispatch(loginSuccess({
          token: data.token,
          user: {
            id: 'google-user',
            email: 'google-user@gmail.com',
            name: 'Usuario Google',
            isPro: false
          }
        }));
        onClose();
      }
    } catch (error) {
      dispatch(loginFailure('Error al completar login con Google'));
      onClose();
    }
  };

  const googleAuthUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.GOOGLE_SIGNIN}`;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={{ flex: 1, backgroundColor: getColor.background.primary }}>
        {/* Header con botón cerrar */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: getColor.gray[200]
        }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: getColor.gray[900] }}>
            Continuar con Google
          </Text>
          <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
            <Ionicons name="close" size={24} color={getColor.gray[600]} />
          </TouchableOpacity>
        </View>

        {/* WebView */}
        <WebView
          source={{ uri: googleAuthUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          style={{ flex: 1 }}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </Modal>
  );
}