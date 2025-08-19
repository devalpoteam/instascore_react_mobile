// src/features/auth/components/GoogleLoginWebView.tsx
import React from 'react';
import { Alert, Linking } from 'react-native';
import { useAppDispatch } from '@/store/hooks';
import { loginSuccess, loginFailure } from '../store/authSlice';
import API_CONFIG from '@/core/config/api.config';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function GoogleLoginWebView({ visible, onClose }: Props) {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (visible) {
      handleGoogleLogin();
    }
  }, [visible]);

  const handleGoogleLogin = async () => {
    try {
      const googleAuthUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.GOOGLE_SIGNIN}`;
      
      Alert.alert(
        'Login con Google',
        'Serás redirigido al navegador para completar el login con Google.',
        [
          { text: 'Cancelar', onPress: onClose },
          { 
            text: 'Continuar', 
            onPress: () => {
              Linking.openURL(googleAuthUrl);
              onClose();
            }
          }
        ]
      );
    } catch (error) {
      dispatch(loginFailure('Error al iniciar login con Google'));
      onClose();
    }
  };

  return null;
}