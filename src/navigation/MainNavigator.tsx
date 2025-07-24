// src/navigation/MainNavigator.tsx - CON MÓDULO DE GIMNASTAS INTEGRADO
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/features/auth/store/authSlice';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';

// Screens importadas
import HomeScreen from '@/features/home/screens/HomeScreen';
import CampeonatosScreen from '@/features/campeonatos/screens/CampeonatosScreen';
import CampeonatoDetailScreen from '@/features/campeonatos/screens/CampeonatoDetailScreen';
import ResultadosScreen from '@/features/resultados/screens/ResultadosScreen';
import CategorySelectorScreen from '@/features/resultados/screens/CategorySelectorScreen';
import LiveResultsScreen from '@/features/resultados/screens/LiveResultsScreen';

// ✅ NUEVAS IMPORTACIONES - Módulo de Gimnastas
import GimnastasListScreen from '@/features/gimnastas/screens/GimnastasListScreen';
import GimnastaProfileScreen from '@/features/gimnastas/screens/GimnastaProfileScreen';

// ✅ TIPOS DE NAVEGACIÓN ACTUALIZADOS
export type MainStackParamList = {
  Home: undefined;
  Resultados: undefined;
  Campeonatos: undefined;
  CampeonatoDetail: { campeonatoId: string };
  CategorySelector: { campeonatoId: string };
  LiveResults: { 
    campeonatoId: string; 
    categoriaId: string; 
    categoriaNombre: string;
  };
  // ✅ NUEVAS RUTAS DE GIMNASTAS
  GimnastasList: undefined;
  GimnastaProfile: { gimnastaId: string };
  Ajustes: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

// Pantalla temporal de Ajustes
const AjustesScreen = () => {
  const dispatch = useAppDispatch();
  const responsive = useResponsive();
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    <BaseLayout>
      <Header 
        title="Configuración"
        subtitle="Ajustes y perfil"
        showLogo={false}
      />
      <View style={{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
      }}>
        <Ionicons 
          name="settings" 
          size={64} 
          color={getColor.primary[500]} 
          style={{ marginBottom: 20 }}
        />
        <Text style={{
          fontSize: responsive.fontSize.xl,
          fontWeight: '600',
          color: getColor.primary[500],
          fontFamily: 'Nunito',
          marginBottom: 12,
        }}>
          Configuración
        </Text>
        <Text style={{
          fontSize: responsive.fontSize.base,
          color: getColor.gray[600],
          fontFamily: 'Nunito',
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 30,
        }}>
          Ajustes de perfil y{'\n'}configuración de la app
        </Text>
       
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: getColor.secondary[500],
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: 'center',
            width: '80%',
            shadowColor: getColor.secondary[500],
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}
          activeOpacity={0.8}
        >
          <Text style={{
            color: getColor.background.primary, 
            fontWeight: '600',
            fontSize: responsive.fontSize.base,
            fontFamily: 'Nunito',
          }}>
            CERRAR SESIÓN
          </Text>
        </TouchableOpacity>
      </View>
    </BaseLayout>
  );
};

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
      
      <Stack.Screen 
        name="CategorySelector" 
        component={CategorySelectorScreen}
      />
      
      <Stack.Screen 
        name="LiveResults" 
        component={LiveResultsScreen}
      />
      
      {/* ✅ NUEVAS PANTALLAS DE GIMNASTAS */}
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
      
      {/* ✅ RUTA CORREGIDA - Era "Gimnastas" antes, ahora apunta a la lista */}
      <Stack.Screen 
        name="Ajustes" 
        component={AjustesScreen}
      />
    </Stack.Navigator>
  );
}