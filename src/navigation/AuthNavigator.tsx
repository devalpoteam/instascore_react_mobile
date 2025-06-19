// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@/features/auth/screens/LoginScreen';
import RegisterScreen from '@/features/auth/screens/RegisterScreen';

// Definir tipos para las rutas de autenticación
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false, // Sin header para pantallas de auth
        animation: 'slide_from_right', // Animación suave
        gestureEnabled: true, // Permitir gestos de navegación
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          title: 'Iniciar Sesión'
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          title: 'Crear Cuenta',
          animation: 'slide_from_bottom' // Animación diferente para registro
        }}
      />
    </Stack.Navigator>
  );
}

// Hook personalizado para navegación tipada
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const useAuthNavigation = () => {
  return useNavigation<AuthNavigationProp>();
};