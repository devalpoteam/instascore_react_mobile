// src/features/auth/hooks/useLoginLogic.ts
import { useState } from 'react';
import { Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { AuthStackParamList } from '@/navigation/AuthNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

// USUARIOS MOCK PARA DESARROLLO
const DEV_USERS = {
  "dev-free@instascore.com": {
    id: "dev-1",
    email: "dev-free@instascore.com",
    name: "Usuario Free (Dev)",
    isPro: false,
    role: "user"
  },
  "dev-pro@instascore.com": {
    id: "dev-2", 
    email: "dev-pro@instascore.com",
    name: "Usuario Pro (Dev)",
    isPro: true,
    role: "user"
  },
  "dev-admin@instascore.com": {
    id: "dev-3",
    email: "dev-admin@instascore.com", 
    name: "Usuario Admin (Dev)",
    isPro: true,
    role: "admin"
  }
} as const;

export const useLoginLogic = () => {
  // STATE LOCAL
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // REDUX STATE  
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  // NAVEGACIÓN
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // FUNCIÓN DE LOGIN PRINCIPAL
  const handleLogin = async () => {
    Keyboard.dismiss();
    dispatch(loginStart());

    try {
      // Verificar cuentas de desarrollo
      const devUser = DEV_USERS[email.toLowerCase() as keyof typeof DEV_USERS];
      
      if (devUser && password === "123456") {
        setTimeout(() => {
          dispatch(
            loginSuccess({
              token: `mock-dev-token-${devUser.role}`,
              user: devUser,
            })
          );
        }, 1000);
        return;
      }

      // Login mock normal
      setTimeout(() => {
        const mockUser = {
          id: "1",
          email: email,
          name: "Usuario Demo",
          isPro: false,
          role: "user"
        };

        dispatch(
          loginSuccess({
            token: "mock-jwt-token",
            user: mockUser,
          })
        );
      }, 1500);
    } catch (err: any) {
      dispatch(loginFailure(err.message || "Error de autenticación"));
    }
  };

  // FUNCIÓN GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    Keyboard.dismiss();
    dispatch(loginStart());

    try {
      setTimeout(() => {
        const mockGoogleUser = {
          id: "2",
          email: "usuario@gmail.com",
          name: "Usuario Google",
          isPro: true,
          role: "user"
        };

        dispatch(
          loginSuccess({
            token: "mock-google-jwt-token",
            user: mockGoogleUser,
          })
        );
      }, 2000);
    } catch (err: any) {
      dispatch(loginFailure("Error al iniciar sesión con Google"));
    }
  };

  // NAVEGACIÓN A REGISTRO
  const navigateToRegister = () => {
    Keyboard.dismiss();
    navigation.navigate("Register");
  };

  // MOSTRAR CREDENCIALES DE DESARROLLO
  const showDevCredentials = () => {
    Keyboard.dismiss();
    Alert.alert(
      "🔧 Cuentas de Desarrollo",
      "Usa estas credenciales para probar:\n\n" +
      "👤 FREE: dev-free@instascore.com / 123456\n\n" +
      "⭐ PRO: dev-pro@instascore.com / 123456\n\n" +
      "👑 ADMIN: dev-admin@instascore.com / 123456",
      [{ text: "Cerrar", style: "cancel" }]
    );
  };

  // OCULTAR TECLADO
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return {
    // State
    email,
    password,
    isLoading,
    error,
    
    // Setters
    setEmail,
    setPassword,
    
    // Actions
    handleLogin,
    handleGoogleLogin,
    navigateToRegister,
    showDevCredentials,
    dismissKeyboard,
  };
};