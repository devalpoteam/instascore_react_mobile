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

// ✅ IMPORTAR PANTALLAS DE NOTIFICACIONES
import NotificationSettingsScreen from '@/features/settings/screens/NotificationSettingsScreen';
import NotificationHistoryScreen from '@/features/settings/screens/NotificationHistoryScreen';

// ✅ TIPOS DE NAVEGACIÓN ACTUALIZADOS PARA SOPORTAR CAMPEONATOS FINALIZADOS
export type MainStackParamList = {
  Home: undefined;
  Resultados: undefined;
  Campeonatos: undefined;
  CampeonatoDetail: { campeonatoId: string };
  
  // ✅ RUTAS ACTUALIZADAS PARA SOPORTAR CAMPEONATOS FINALIZADOS
  CategorySelector: { 
    campeonatoId: string;
    isFinished?: boolean; // ✅ NUEVO: indica si es campeonato finalizado
  };
  LiveResults: { 
    campeonatoId: string; 
    categoriaId: string; 
    categoriaNombre: string;
    isFinished?: boolean; // ✅ NUEVO: indica si es campeonato finalizado
  };
  
  // Rutas de gimnastas
  GimnastasList: undefined;
  GimnastaProfile: { gimnastaId: string };
  
  // Rutas de perfil
  Perfil: undefined;
  ProfileSettings: undefined;
  ProfileFavorites: undefined;
  
  // ✅ RUTAS DE NOTIFICACIONES
  NotificationSettings: undefined;
  NotificationHistory: undefined;
};

// ✅ TIPOS AUXILIARES PARA MEJORAR LA NAVEGACIÓN
export type CampeonatoResultsMode = 'live' | 'finished';

// ✅ HELPER FUNCTIONS PARA NAVEGACIÓN TIPADA
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
      
      {/* ✅ PANTALLAS ACTUALIZADAS - AHORA SOPORTAN CAMPEONATOS FINALIZADOS */}
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
      
      {/* ✅ PANTALLAS DE NOTIFICACIONES */}
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
      
      {/* TODO: Implementar estas pantallas cuando sean necesarias */}
      {/* 
      <Stack.Screen 
        name="ProfileSettings" 
        component={ProfileSettingsScreen}
        options={{
          title: 'Configuración de Perfil',
        }}
      />
      
      <Stack.Screen 
        name="ProfileFavorites" 
        component={ProfileFavoritesScreen}
        options={{
          title: 'Mis Favoritos',
        }}
      />
      */}
    </Stack.Navigator>
  );
}