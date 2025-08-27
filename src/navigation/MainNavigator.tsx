// src/navigation/MainNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getColor } from '@/design/colorHelper';

// Screens importadas
import HomeScreen from '@/features/home/screens/HomeScreen';
import CampeonatosScreen from '@/features/campeonatos/screens/CampeonatosScreen';
import CampeonatoDetailScreen from '@/features/campeonatos/screens/CampeonatoDetailScreen';
import ResultadosScreen from '@/features/resultados/screens/ResultadosScreen';
import CategorySelectorScreen from '@/features/resultados/screens/CategorySelectorScreen';
import LiveResultsScreen from '@/features/resultados/screens/LiveResultsScreen';
import GimnastasListScreen from '@/features/gimnastas/screens/GimnastasListScreen';
import GimnastaProfileScreen from '@/features/gimnastas/screens/GimnastaProfileScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import ConfiguracionesScreen from '@/features/profile/screens/ConfiguracionesScreen';

// Importar pantallas de notificaciones
import NotificationSettingsScreen from '@/features/settings/screens/NotificationSettingsScreen';
import NotificationHistoryScreen from '@/features/settings/screens/NotificationHistoryScreen';

// Tipos de navegación actualizados
export type MainStackParamList = {
  Home: undefined;
  Resultados: undefined;
  Campeonatos: undefined;
  CampeonatoDetail: { campeonatoId: string };
  
  // Rutas actualizadas para soportar campeonatos finalizados
  CategorySelector: { 
    campeonatoId: string;
    isFinished?: boolean;
  };
  LiveResults: { 
    campeonatoId: string; 
    categoriaId: string; 
    categoriaNombre: string;
    isFinished?: boolean;
  };
  
  // Rutas de gimnastas
  GimnastasList: undefined;
  GimnastaProfile: { gimnastaId: string };
  
  // Rutas de perfil
  Perfil: undefined;
  Configuraciones: undefined;
  ProfileSettings: undefined;
  ProfileFavorites: undefined;
  
  // Rutas de notificaciones
  NotificationSettings: undefined;
  NotificationHistory: undefined;
};

// Tipos auxiliares para mejorar la navegación
export type CampeonatoResultsMode = 'live' | 'finished';

// Helper functions para navegación tipada
export const NavigationHelpers = {
  // Para navegar a selector de categorías
  toCategorySelector: (campeonatoId: string, isFinished: boolean = false) => ({
    screen: 'CategorySelector' as const,
    params: { campeonatoId, isFinished }
  }),
  
  // Para navegar a resultados
  toLiveResults: (
    campeonatoId: string, 
    categoriaId: string, 
    categoriaNombre: string,
    isFinished: boolean = false
  ) => ({
    screen: 'LiveResults' as const,
    params: { campeonatoId, categoriaId, categoriaNombre, isFinished }
  })
};

const Stack = createStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: getColor.background.lighter },
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 250,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 200,
            },
          },
        },
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
      initialRouteName="Home"
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
      />
      
      <Stack.Screen 
        name="Resultados" 
        component={ResultadosScreen}
      />
      
      <Stack.Screen 
        name="Campeonatos" 
        component={CampeonatosScreen}
      />
      
      <Stack.Screen 
        name="CampeonatoDetail" 
        component={CampeonatoDetailScreen}
      />
      
      {/* Pantallas actualizadas - ahora soportan campeonatos finalizados */}
      <Stack.Screen 
        name="CategorySelector" 
        component={CategorySelectorScreen}
      />
      
      <Stack.Screen 
        name="LiveResults" 
        component={LiveResultsScreen}
      />
      
      {/* Pantallas de gimnastas */}
      <Stack.Screen 
        name="GimnastasList" 
        component={GimnastasListScreen}
        options={{
          title: 'Lista de Gimnastas',
        }}
      />
      
      <Stack.Screen 
        name="GimnastaProfile" 
        component={GimnastaProfileScreen}
        options={{
          title: 'Perfil del Gimnasta',
        }}
      />
      
      {/* Pantallas de perfil */}
      <Stack.Screen 
        name="Perfil" 
        component={ProfileScreen}
        options={{
          title: 'Mi Perfil',
        }}
      />
      
      {/* Nueva pantalla de configuraciones */}
      <Stack.Screen 
        name="Configuraciones" 
        component={ConfiguracionesScreen}
        options={{
          title: 'Configuraciones',
        }}
      />
      
      {/* Pantallas de notificaciones */}
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettingsScreen}
        options={{
          title: 'Configuración de Notificaciones',
        }}
      />
      
      <Stack.Screen 
        name="NotificationHistory" 
        component={NotificationHistoryScreen}
        options={{
          title: 'Historial de Notificaciones',
        }}
      />
    </Stack.Navigator>
  );
}